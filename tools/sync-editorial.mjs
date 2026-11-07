// 让 editorial.yml 中涉及 Clash 的文字与 clashSupport 状态一致（一次性同步脚本，可重复运行）
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const f = path.join(root, 'source/_data/editorial.yml');
const ed = yaml.load(fs.readFileSync(f, 'utf8'));
const air = JSON.parse(fs.readFileSync(path.join(root, 'source/_data/airports.json'), 'utf8'));
const CL = /Clash|第三方|不提供订阅|订阅链接|官方客户端|新订单/;
const NOTE = '站长证实可以导入 Clash，但订阅链接必须通过客服渠道询问获取，没有公开订阅入口';
for (const a of air) {
  const e = ed[a.slug]; if (!e) continue; const st = a.clashSupport.status;
  if (a.slug === 'lingdongyun') continue;
  if (st === 'supported') {
    e.seoDesc = e.seoDesc.split('；').filter(s => !/不支持|不推荐|不提供订阅|仅官方客户端|仅自研官方客户端|仅限官方客户端/.test(s)).join('；').replace(/。?$/, '') + '；站长确认支持导入 Clash。';
    e.take = String(e.take || '').split('。').filter(s => !/只能用官方客户端|只能使用官方客户端/.test(s)).join('。').replace(/。?$/, '。');
    e.watch = (e.watch || []).filter(w => !/不支持|不推荐|不提供订阅|仅官方|只能使用|新订单|老用户|站长证实|运营方已向站长/.test(w));
    e.watch.unshift(NOTE);
    (e.faq || []).forEach(q => { if (/Clash/.test(q.q)) { q.q = `${a.name}支持导入 Clash 吗？`; q.a = '站长证实：可以导入 Clash，但订阅链接必须通过客服渠道询问获取（2026-11-07，本站未取得书面记录）。品牌资料早期写法不同（' + String(a.clashSupport.sourceRaw.subscription || '未提供') + '；' + String(a.clashSupport.sourceRaw.thirdParty || '未提供') + '），请以客服答复为准，不要购买转售订阅。'; } });
    if (!(e.faq || []).some(q => /Clash/.test(q.q))) (e.faq = e.faq || []).unshift({ q: `${a.name}支持导入 Clash 吗？`, a: '站长转述：该服务商运营方已确认支持导入 Clash（2026-11-07，未取得书面记录）。订阅怎么获取、哪些套餐可用，请先向客服确认。' });
  } else if (a.slug === 'lingmao') {
    e.seoDesc = e.seoDesc.replace('新订单不支持 Clash', 'Clash 兼容待核实');
  }
}
fs.writeFileSync(f, yaml.dump(ed, { lineWidth: -1, noRefs: true }), 'utf8');
console.log('editorial synced');
