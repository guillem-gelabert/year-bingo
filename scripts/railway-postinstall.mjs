import { spawnSync } from 'node:child_process';

console.log('=== railway-postinstall:begin ===');

// Emit build diagnostics right before Nuxt prepare (where the failure happens).
try {
  // eslint-disable-next-line no-undef
  await import('./railway-build-debug.mjs'); // prints diagnostics
} catch (e) {
  console.log('railway-postinstall: debug import failed:', String(e?.message || e));
}

// Try to load oxc-parser binding to get a clearer error in logs.
try {
  // This import triggers native binding resolution; on failure it should explain why.
  await import('oxc-parser');
  console.log('railway-postinstall: oxc-parser import OK');
} catch (e) {
  console.log('railway-postinstall: oxc-parser import FAILED:', String(e?.message || e));
}

// Now run the original postinstall behavior.
const nuxtBin = process.platform === 'win32'
  ? 'node_modules/.bin/nuxt.cmd'
  : 'node_modules/.bin/nuxt';

const r = spawnSync(nuxtBin, ['prepare'], { stdio: 'inherit' });
process.exit(r.status ?? 1);

