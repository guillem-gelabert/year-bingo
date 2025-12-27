// Build-time diagnostics for Railway/Nixpacks.
// Safe-by-default: do not print secrets; only whitelisted env/config keys.

const phase = process.argv[2] || 'unknown';

function pickEnv(keys) {
  const out = {};
  for (const k of keys) out[k] = process.env[k] ?? null;
  return out;
}

const env = pickEnv([
  'NODE_VERSION',
  'NIXPACKS_NODE_VERSION',
  'RAILWAY_ENVIRONMENT',
  'RAILWAY_PROJECT_ID',
  'RAILWAY_SERVICE_ID',
  'NPM_CONFIG_PRODUCTION',
  'NPM_CONFIG_OMIT',
  'NPM_CONFIG_OPTIONAL',
  'npm_config_production',
  'npm_config_omit',
  'npm_config_optional',
  'npm_config_engine_strict',
  'NPM_CONFIG_ENGINE_STRICT',
  'npm_config_arch',
  'npm_config_platform',
  'npm_config_user_agent',
]);

console.log('=== railway-build-debug ===');
console.log(JSON.stringify({
  phase,
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  env,
}, null, 2));

