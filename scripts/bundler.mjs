import { bundle } from '@adminjs/bundler';
import { ComponentLoader } from 'adminjs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

await bundle({
  destinationDir: join(rootDir, 'dist', 'public'),
  componentLoader: new ComponentLoader(),
});
