import { bundle } from '@adminjs/bundler';
import { ComponentLoader } from 'adminjs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { mkdir, cp } from 'fs/promises';
import { existsSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

async function main() {
  // Ensure public directory exists (Vercel expects it)
  await mkdir(join(rootDir, 'public'), { recursive: true });

  // 1. Bundle AdminJS assets
  await bundle({
    destinationDir: join(rootDir, 'dist', 'public'),
    componentLoader: new ComponentLoader(),
  });

  // 2. Copy to public/public for Vercel static serving
  const srcDir = join(rootDir, 'dist', 'public');
  const destDir = join(rootDir, 'public', 'public');

  if (existsSync(srcDir)) {
    await mkdir(destDir, { recursive: true });
    await cp(srcDir, destDir, { recursive: true });
    console.log('Copied AdminJS assets to public/public/');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
