// 站长决定：站内不再展示「支持 / 暂不支持 / 待核实」标签，改为中性的"Clash 订阅获取指引"。
// 本脚本把 editorial.yml 中带状态判断的文字统一改成中性表述（可重复运行）。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const yaml = createRequire(import.meta.url)('js-yaml');
const f = path.join(root, 'source/_data/editorial.yml');
const ed = yaml.load(fs.readFileSync(f, 'utf8'));
const air = JSON.parse(fs.readFileSync(path.join(root, 'source/_data/airports.json'), 'utf8'));
const BAD = /站长确认|站长证实|站长转述|Clash 兼容待核实|不支持 Clash|不推荐导入|支持 Clash|不推荐使用|不对外发放|不提供订阅|新订单不|订阅链接已暂停|订阅链接目前暂停|官方公开订阅|Clash 订阅需通过客服/;
const WATCH = '是否提供 Clash 订阅及获取方式，需通过官网客服渠道询问，以客服答复为准';
const FAQ_A = '资料中没有公开的订阅入口。请通过官网用户中心的客服渠道询问：是否提供适用于 Clash / Mihomo 的订阅、如何获取、哪些套餐可用，以客服答复为准。不要购买网上转售的订阅；订阅含个人凭证，不要公开。拿到订阅后，导入方法见<a href="/posts/clash-verge-rev-import-subscription/">导入订阅教程</a>。';
for (const a of air) {
  const e = ed[a.slug]; if (!e) continue;
  e.seoDesc = String(e.seoDesc).split('；').filter(s => !BAD.test(s)).join('；').replace(/[；。\s]+$/, '');
  e.seoDesc += '；附 Clash 订阅获取指引。';
  if (a.slug === 'lingdongyun') e.take = '这份资料的特点是线路与套餐写得很细（IEPL + BGP、穿云为 IPLC、全节点 1x）。订阅需通过客服或工单领取，请先联系客服了解获取方式。';
  e.take = String(e.take || '').split('。').filter(s => !BAD.test(s)).join('。').replace(/。?$/, '。');
  e.watch = (e.watch || []).filter(w => !BAD.test(w)); e.watch.push(WATCH);
  e.faq = (e.faq || []).filter(q => !(/Clash/.test(q.q) && /(支持|能用|导入|订阅)/.test(q.q)));
  e.faq.unshift({ q: `${a.name}怎么获取 Clash 订阅？`, a: FAQ_A });
}
fs.writeFileSync(f, yaml.dump(ed, { lineWidth: -1, noRefs: true }), 'utf8');
const bad = Object.entries(ed).filter(([, v]) => BAD.test(JSON.stringify(v)));
console.log('neutralized; 仍含状态措辞的品牌:', bad.map(([k]) => k).join(',') || '无');
console.log('seoDesc 最长', Math.max(...Object.values(ed).map(v => [...v.seoDesc].length)));
