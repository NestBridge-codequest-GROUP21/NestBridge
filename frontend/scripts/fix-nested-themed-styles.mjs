/**
 * Nested helpers lost module-level `styles` after theming migration.
 * Inject useThemedStyles / useTheme into every function that still references them.
 *
 * Run: node scripts/fix-nested-themed-styles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../src');

const FILES = [
  'components/BootLoader.tsx',
  'components/ExploreSectionCarousel.tsx',
  'components/MonthCalendarGrid.tsx',
  'components/ProfileIncompleteBanner.tsx',
  'components/ProviderBookingCard.tsx',
  'components/SkeletonLoader.tsx',
  'screens/auth/SplashScreen.tsx',
  'screens/auth/WelcomeScreen.tsx',
  'screens/guide/GuideAvailabilityScreen.tsx',
  'screens/guide/SessionReviewScreen.tsx',
  'screens/guide/TourTypesSetupScreen.tsx',
  'screens/host/HostListingsScreen.tsx',
  'screens/host/MatchRequestReviewScreen.tsx',
  'screens/onboarding/DestinationSetupScreen.tsx',
  'screens/onboarding/QuizPage.tsx',
  'screens/shared/AccountSetupScreen.tsx',
  'screens/shared/DevTestingScreen.tsx',
  'screens/shared/SessionBookingScreen.tsx',
  'screens/shared/StaffUserDetailScreen.tsx',
  'screens/student/BookingScreen.tsx',
  'screens/student/LocalTipsScreen.tsx',
  'screens/student/MatchResultsScreen.tsx',
  'screens/student/PrepChecklistScreen.tsx',
  'screens/student/StudentEventsScreen.tsx',
  'screens/student/TransportGuideScreen.tsx',
  'screens/tourist/ExploreStaysScreen.tsx',
];

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

function ensureThemeImport(source) {
  let next = source;
  if (!/from\s+['"][^'"]*theme['"]/.test(next)) {
    const rel = next.includes('/screens/')
      ? '../../theme'
      : next.includes('/navigation/')
        ? '../theme'
        : '../theme';
    next = `import { useTheme, useThemedStyles, type AppTheme } from '${rel}';\n` + next;
    return next;
  }
  if (!/\buseTheme\b/.test(next) || !/\buseThemedStyles\b/.test(next)) {
    next = next.replace(
      /import\s*\{([^}]+)\}\s*from\s*(['"][^'"]*\/theme['"])/,
      (full, body, quote) => {
        const parts = body
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const set = new Set(parts);
        if (!/[,{]\s*useTheme\b/.test(`,` + body)) set.add('useTheme');
        if (!/\buseThemedStyles\b/.test(body)) set.add('useThemedStyles');
        if (!/\bAppTheme\b/.test(body)) set.add('type AppTheme');
        return `import { ${[...set].join(', ')} } from ${quote}`;
      },
    );
  }
  return next;
}

function injectIntoFunctionBodies(source) {
  // Find function / const Foo = ( declarations with `{` body
  const re =
    /(?:export\s+)?(?:default\s+)?function\s+(\w+)\s*\(|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(/g;
  const inserts = [];
  let match;
  while ((match = re.exec(source))) {
    const name = match[1] || match[2];
    if (!name || name === 'createStyles') continue;

    const parenOpen = source.indexOf('(', match.index);
    const parenClose = findMatching(source, parenOpen, '(', ')');
    if (parenClose === -1) continue;

    const after = source.slice(parenClose + 1);
    // Skip arrow without block: ) => expr
    const trimmed = after.trimStart();
    if (trimmed.startsWith('=>')) {
      const afterArrow = trimmed.slice(2).trimStart();
      if (!afterArrow.startsWith('{')) continue;
    }

    const bodyRel = after.search(/\{/);
    if (bodyRel === -1) continue;
    // Ensure this `{` is the function body (not type `{` in return type before =>)
    // For `function Foo(): { a: number } {` — rare; skip if too far
    if (bodyRel > 80 && !after.slice(0, bodyRel).includes('=>')) {
      // might be return type object — look for next {
      const maybe = after.indexOf('{', bodyRel + 1);
      // keep first for normal functions
    }

    const bodyOpen = parenClose + 1 + bodyRel;
    const bodyClose = findMatching(source, bodyOpen, '{', '}');
    if (bodyClose === -1) continue;
    const body = source.slice(bodyOpen, bodyClose + 1);

    const needsStyles =
      /\bstyles\./.test(body) && !/\buseThemedStyles\s*\(/.test(body);
    const tokenNames = ['colors', 'tints', 'gradients', 'shadows', 'overlays'].filter(
      (t) =>
        new RegExp(`\\b${t}\\.`).test(body) &&
        !new RegExp(`\\bconst\\s*\\{[^}]*\\b${t}\\b`).test(body) &&
        !new RegExp(`\\b${t}\\s*[,}]`).test(
          source.slice(parenOpen, parenClose + 1),
        ),
    );

    if (!needsStyles && tokenNames.length === 0) continue;

    let injection = '\n';
    if (needsStyles) {
      injection += '  const styles = useThemedStyles(createStyles);\n';
    }
    if (tokenNames.length > 0) {
      injection += `  const { ${tokenNames.join(', ')} } = useTheme();\n`;
    }

    // Avoid double-inject if we already planned one at same spot
    inserts.push({ at: bodyOpen + 1, text: injection, name });
  }

  // Apply from end so indices stay valid
  inserts.sort((a, b) => b.at - a.at);
  let next = source;
  for (const ins of inserts) {
    // Don't inject into createStyles (already skipped by name)
    // Skip if already injected at this position in a previous pass
    const window = next.slice(ins.at, ins.at + 80);
    if (window.includes('useThemedStyles(createStyles)')) continue;
    next = next.slice(0, ins.at) + ins.text + next.slice(ins.at);
  }
  return { next, count: inserts.length };
}

let fixed = 0;
for (const rel of FILES) {
  const file = path.join(SRC, rel);
  let src = fs.readFileSync(file, 'utf8');
  src = ensureThemeImport(src);
  const { next, count } = injectIntoFunctionBodies(src);
  if (next !== src || count > 0) {
    fs.writeFileSync(file, next);
    console.log('fixed', rel, 'injections~', count);
    fixed++;
  } else {
    console.log('noop', rel);
  }
}
console.log('done files=', fixed);
