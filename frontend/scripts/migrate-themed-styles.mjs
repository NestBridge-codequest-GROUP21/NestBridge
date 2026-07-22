/**
 * Codemod: module-level `const styles = StyleSheet.create(...)` that references
 * colors/tints/gradients/shadows/overlays → useThemedStyles(createStyles).
 *
 * Run from frontend/: node scripts/migrate-themed-styles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');

const SKIP_DIRS = new Set([
  'theme',
  'data',
  'services',
  'hooks',
  'types',
  'config',
  'constants',
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (/\.tsx$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function findMatchingParen(src, openIdx) {
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function themeImportPath(filePath) {
  const rel = path.relative(path.dirname(filePath), path.join(SRC, 'theme'));
  const normalized = rel.split(path.sep).join('/');
  return normalized.startsWith('.') ? normalized : `./${normalized}`;
}

function transform(filePath, source) {
  if (source.includes('useThemedStyles')) return null;
  if (!source.includes('StyleSheet.create')) return null;
  if (!/\b(colors|tints|gradients|shadows|overlays)\./.test(source)) return null;

  const marker = 'const styles = StyleSheet.create(';
  const idx = source.lastIndexOf(marker);
  if (idx === -1) return null;

  const lineStart = source.lastIndexOf('\n', idx) + 1;
  const indent = source.slice(lineStart, idx);
  if (/[^\s]/.test(indent)) return null; // not module-level

  const openParen = idx + marker.length - 1;
  const closeParen = findMatchingParen(source, openParen);
  if (closeParen === -1) return null;

  let end = closeParen + 1;
  if (source[end] === ';') end++;

  const objectLiteral = source.slice(openParen + 1, closeParen);
  if (!/\b(colors|tints|gradients|shadows|overlays)\./.test(objectLiteral)) {
    return null;
  }

  const defaultFn = /export default function (\w+)\s*\(/.exec(source);
  if (!defaultFn) return null;

  // Find function body `{` AFTER the parameter list (not props destructuring `{`).
  const parenOpen = source.indexOf('(', defaultFn.index);
  const parenClose = findMatchingParen(source, parenOpen);
  if (parenClose === -1) return null;
  const afterParams = source.slice(parenClose + 1);
  const bodyRel = afterParams.search(/\{/);
  if (bodyRel === -1) return null;
  const braceOpen = parenClose + 1 + bodyRel;

  const uses = ['colors', 'tints', 'gradients', 'shadows', 'overlays'].filter(
    (name) => new RegExp(`\\b${name}\\.`).test(objectLiteral),
  );
  const destructure = uses.join(', ');

  const factory = `function createStyles({ ${destructure} }: AppTheme) {\n  return StyleSheet.create(${objectLiteral});\n}\n`;

  let next = source;

  // 1) Inject hook at start of default component body
  const hookLine = `\n  const styles = useThemedStyles(createStyles);\n`;
  next = next.slice(0, braceOpen + 1) + hookLine + next.slice(braceOpen + 1);

  // 2) Replace StyleSheet block (indices shifted by hookLine)
  const idx2 = next.lastIndexOf(marker);
  const open2 = idx2 + marker.length - 1;
  const close2 = findMatchingParen(next, open2);
  let end2 = close2 + 1;
  if (next[end2] === ';') end2++;
  next = next.slice(0, idx2) + factory + next.slice(end2);

  // 3) Add theme import
  const imp = `import { useThemedStyles, type AppTheme } from '${themeImportPath(filePath)}';\n`;
  const firstImport = next.indexOf('import ');
  if (firstImport !== -1) {
    next = next.slice(0, firstImport) + imp + next.slice(firstImport);
  }

  // 4) Strip theme-dependent names from constants/theme import (keep layout tokens)
  next = next.replace(
    /import\s*\{([^}]+)\}\s*from\s*(['"])([^'"]*constants\/theme)\2;?/g,
    (full, body, quote, mod) => {
      const parts = body
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const keep = parts.filter((p) => {
        const name = p
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
          .trim();
        return !uses.includes(name);
      });
      if (keep.length === 0) return '';
      return `import {\n  ${keep.join(',\n  ')},\n} from ${quote}${mod}${quote};`;
    },
  );

  next = next.replace(/\n{3,}/g, '\n\n');
  return next;
}

const files = walk(SRC);
let changed = 0;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  try {
    const out = transform(file, src);
    if (!out) continue;
    fs.writeFileSync(file, out);
    changed++;
    console.log('migrated', path.relative(SRC, file));
  } catch (error) {
    console.warn('fail', path.relative(SRC, file), error.message);
  }
}
console.log(`done changed=${changed}`);
