import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, basename, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'public', 'images', 'dg-transport');

const HERO = 'dg-hero-main.jpg';
const HERO_CFG   = { width: 1920, quality: 82 };
const CARD_CFG   = { width: 1200, quality: 80 };

const files = (await readdir(DIR)).filter(f => extname(f).toLowerCase() === '.jpg');

for (const file of files) {
  const cfg = file === HERO ? HERO_CFG : CARD_CFG;
  const input  = join(DIR, file);
  const output = join(DIR, basename(file, '.jpg') + '.webp');
  const info = await sharp(input)
    .resize({ width: cfg.width, withoutEnlargement: true })
    .webp({ quality: cfg.quality })
    .toFile(output);
  const kb = (info.size / 1024).toFixed(0);
  console.log(`✓ ${basename(output)}  ${info.width}×${info.height}  ${kb} KB`);
}
