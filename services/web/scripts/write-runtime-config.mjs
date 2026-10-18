import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceDirectory = resolve(scriptDirectory, '../../..');
const envPath = resolve(workspaceDirectory, '.env');
const outputDirectory = resolve(workspaceDirectory, 'tmp');
const outputPath = resolve(outputDirectory, 'runtime-config.json');
const proxyPath = resolve(outputDirectory, 'proxy.conf.json');

let apiBaseUrl = 'http://localhost:5000/api';
try {
  const envFile = readFileSync(envPath, 'utf8');
  const configuredUrl = envFile.match(/^\s*API_BASE_URL\s*=\s*(.*?)\s*$/m)?.[1];
  if (configuredUrl) apiBaseUrl = configuredUrl.replace(/^['"]|['"]$/g, '');
} catch {
  // The local default is used when no .env file exists.
}

mkdirSync(outputDirectory, { recursive: true });
const backend = new URL(apiBaseUrl);
const apiPath = backend.pathname.replace(/\/$/, '') || '/api';
const isProductionBuild = process.argv.includes('--production');

writeFileSync(outputPath, JSON.stringify({ apiBaseUrl: isProductionBuild ? apiBaseUrl : apiPath }));
writeFileSync(proxyPath, JSON.stringify({
  [apiPath]: {
    target: backend.origin,
    secure: false,
    changeOrigin: true,
  },
}));