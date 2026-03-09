import { bundle } from '@adminjs/bundler';
import { ComponentLoader } from 'adminjs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { mkdir, cp } from 'fs/promises';
import { existsSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

async function main() {
  const publicDir = join(rootDir, 'public');
  const publicAssetsDir = join(publicDir, 'public');
  const distPublicDir = join(rootDir, 'dist', 'public');

  await mkdir(publicDir, { recursive: true });

  try {
    await bundle({
      destinationDir: 'dist/public',
      componentLoader: new ComponentLoader(),
    });
  } catch (err) {
    console.error('AdminJS bundler failed:', err);
    throw err;
  }

  if (existsSync(distPublicDir)) {
    await mkdir(publicAssetsDir, { recursive: true });
    await cp(distPublicDir, publicAssetsDir, { recursive: true });
    console.log('Copied AdminJS assets to public/public/');
  } else {
    throw new Error('Bundler did not produce output in dist/public');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
