import fs from 'node:fs'; import { createRequire } from 'node:module';
const yaml = createRequire(import.meta.url)('js-yaml'); const f = 'source/_data/editorial.yml';
const ed = yaml.load(fs.readFileSync(f, 'utf8')); const K = /支付宝|微信|USDT|付款/;
const clean = s => String(s).replace(/[，；]?[^，；。]*(支付宝|微信|USDT|付款)[^，；。]*/g, '').replace(/[，；]+。/g, '。').replace(/；$/, '').replace(/^[，；]/, '');
let n = 0;
for (const [slug, e] of Object.entries(ed)) {
  for (const k of ['seoDesc', 'take', 'intro', 'story']) if (e[k] && K.test(e[k])) { const o = e[k]; e[k] = clean(o); n++; console.log(slug, k, '=>', e[k].slice(-60)); }
  if (e.watch) { const b = e.watch.length; e.watch = e.watch.filter(w => !K.test(w)); n += b - e.watch.length; }
}
fs.writeFileSync(f, yaml.dump(ed, { lineWidth: -1, noRefs: true }), 'utf8'); console.log('changed', n);
