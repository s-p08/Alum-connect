const { execSync } = require('child_process');

// Prepare environment variables
const env = { ...process.env };

// Automatically map Render's external URL to Vite's expected environment variable
if (env.RENDER_EXTERNAL_URL) {
  env.VITE_backend_URL = env.RENDER_EXTERNAL_URL;
  console.log(`[Build Script] Mapping RENDER_EXTERNAL_URL (${env.RENDER_EXTERNAL_URL}) to VITE_backend_URL`);
}

try {
  console.log('[Build Script] Installing dependencies for server and client...');
  execSync('npm install --prefix server && npm install --prefix client', { stdio: 'inherit' });

  console.log('[Build Script] Compiling client for production...');
  execSync('npm run build --prefix client', { stdio: 'inherit', env });

  console.log('[Build Script] Build completed successfully.');
} catch (error) {
  console.error('[Build Script] Build failed:', error);
  process.exit(1);
}
