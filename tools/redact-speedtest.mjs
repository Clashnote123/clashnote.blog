// 将站长提供的测速汇总图转为网页图，并遮挡其中显示的完整出口 IP。
// 用法：node tools/redact-speedtest.mjs <源图> <输出图> [x y w h]
import { createRequire } from 'node:module';
const sharp = createRequire(import.meta.url)('sharp');
const [src, out, x = 228, y = 702, w = 128, h = 19] = process.argv.slice(2);
const m = await sharp(src).metadata();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#2b3a55"/></svg>`;
const info = await sharp(src).composite([{ input: Buffer.from(svg) }]).webp({ quality: 82 }).toFile(out);
console.log(m.width, m.height, info.size);
