/**
 * Repair migrate-themed-styles.mjs bug: hook injected into props `{` instead of body `{`.
 * Also ensures JSX color token usage gets `useTheme()` destructuring.
 *
 * Run from frontend/: node scripts/repair-themed-styles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'theme' || entry.name === 'node_modules') continue;
      walk(full, out);
    } else if (/\.tsx$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function findMatching(src, openIdx, openCh, closeCh) {
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
    if (ch === openCh) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const HOOK =
  /^\s*const styles = useThemedStyles\(createStyles\);\s*\n/;

function repair(source) {
  let next = source;
  let changed = false;

  // Pattern: export default function Name({\n  const styles = ...
  const bad = /export default function (\w+)\(\{\s*\n(\s*)const styles = useThemedStyles\(createStyles\);\s*\n/;
  const m = bad.exec(next);
  if (m) {
    // Remove misplaced hook
    next = next.replace(
      /export default function (\w+)\(\{\s*\n\s*const styles = useThemedStyles\(createStyles\);\s*\n/,
      'export default function $1({\n',
    );

    // Find params close and body open
    const fn = /export default function (\w+)\(/.exec(next);
    if (!fn) return null;
    const parenOpen = next.indexOf('(', fn.index);
    const parenClose = findMatching(next, parenOpen, '(', ')');
    if (parenClose === -1) return null;
    const afterParams = next.slice(parenClose + 1);
    const bodyRel = afterParams.search(/\{/);
    if (bodyRel === -1) return null;
    const bodyOpen = parenClose + 1 + bodyRel;
    next =
      next.slice(0, bodyOpen + 1) +
      '\n  const styles = useThemedStyles(createStyles);\n' +
      next.slice(bodyOpen + 1);
    changed = true;
  }

  // Ensure useTheme import + destructure for JSX token usage outside createStyles
  const factoryIdx = next.indexOf('function createStyles');
  const bodySrc = factoryIdx === -1 ? next : next.slice(0, factoryIdx);
  const tokenNames = ['colors', 'tints', 'gradients', 'shadows', 'overlays'].filter(
    (name) => new RegExp(`\\b${name}\\.`).test(bodySrc),
  );

  if (tokenNames.length > 0) {
    // Update import to include useTheme if missing
    if (!/import\s*\{[^}]*\buseTheme\b/.test(next)) {
      next = next.replace(
        /import\s*\{\s*useThemedStyles,\s*type\s+AppTheme\s*\}\s*from\s*(['"][^'"]+['"])/,
        "import { useTheme, useThemedStyles, type AppTheme } from $1",
      );
      // Also handle multiline / reordered imports
      if (!/import\s*\{[^}]*\buseTheme\b/.test(next)) {
        next = next.replace(
          /import\s*\{([^}]+)\}\s*from\s*(['"][^'"]*\/theme['"])/,
          (full, body, quote) => {
            if (/\buseTheme\b/.test(body)) return full;
            return `import { useTheme, ${body.trim()} } from ${quote}`;
          },
        );
      }
    }

    if (!/\bconst\s*\{[^}]*\bcolors\b[^}]*\}\s*=\s*useTheme\(\)/.test(next) &&
        !tokenNames.every((n) =>
          new RegExp(`\\bconst\\s*\\{[^}]*\\b${n}\\b`).test(next),
        )) {
      // Insert after styles hook
      const hookLine = 'const styles = useThemedStyles(createStyles);';
      const hIdx = next.indexOf(hookLine);
      if (hIdx !== -1) {
        const insertAt = hIdx + hookLine.length;
        const destructure = `  const { ${tokenNames.join(', ')} } = useTheme();\n`;
        // Avoid duplicate
        if (!next.slice(insertAt, insertAt + 120).includes('= useTheme()')) {
          next =
            next.slice(0, insertAt) +
            '\n' +
            destructure +
            next.slice(insertAt);
          changed = true;
        }
      }
    }
  }

  return changed || next !== source ? next : null;
}

const files = walk(SRC);
let count = 0;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('useThemedStyles(createStyles)')) continue;
  try {
    const out = repair(src);
    if (!out) continue;
    fs.writeFileSync(file, out);
    count++;
    console.log('repaired', path.relative(SRC, file));
  } catch (e) {
    console.warn('fail', path.relative(SRC, file), e.message);
  }
}
console.log(`done repaired=${count}`);
