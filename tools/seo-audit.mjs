// SEO 审计：全站 URL 清单、标题/描述长度、正文长度、入链、孤岛页、关键词覆盖、近似段落、繁体字与占位文字
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const htmls = walk(pub).filter(f => f.endsWith('.html'));
const urlOf = f => '/' + path.relative(pub, f).replace(/\\/g, '/').replace(/index\.html$/, '');
const text = h => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
const sm = fs.readFileSync(path.join(pub, 'sitemap.xml'), 'utf8');
const smSet = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace('https://clashnote.blog', '')));
const pages = {};
for (const f of htmls) {
  const h = fs.readFileSync(f, 'utf8'); const u = urlOf(f);
  const main = (h.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1] || '';
  pages[u] = {
    url: u, html: h, title: (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '', desc: (h.match(/name="description" content="([^"]*)"/) || [])[1] || '',
    h1: (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '', canon: (h.match(/rel="canonical" href="([^"]*)"/) || [])[1] || '',
    noindex: /noindex/.test((h.match(/name="robots" content="([^"]*)"/) || [])[1] || ''), body: text(main), inSitemap: smSet.has(u),
    ogImage: /og:image/.test(h), hasArticleLd: /"@type":"Article"/.test(h), out: new Set(),
  };
}
for (const p of Object.values(pages)) for (const m of p.html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)) { const t = m[1]; if (pages[t]) pages[t].inlinks = (pages[t].inlinks || new Set()).add(p.url); p.out.add(t); }
// 主内容内的入链（排除导航/页脚）
for (const p of Object.values(pages)) {
  const main = (p.html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1] || '';
  p.mainOut = new Set([...main.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)].map(m => m[1]));
}
for (const p of Object.values(pages)) for (const t of p.mainOut) if (pages[t]) (pages[t].mainIn = pages[t].mainIn || new Set()).add(p.url);

const rows = Object.values(pages).map(p => ({
  url: p.url, title: p.title, tl: [...p.title].length, dl: [...p.desc].length, h1: p.h1, canonOK: p.canon === 'https://clashnote.blog' + p.url || p.url === '/404.html',
  noindex: p.noindex, inSitemap: p.inSitemap, chars: [...p.body].length, inAll: (p.inlinks || new Set()).size, inMain: (p.mainIn || new Set()).size, outMain: p.mainOut.size, ogImage: p.ogImage,
})).sort((a, b) => a.url.localeCompare(b.url));

// 关键词覆盖
const KW = ['Clash教程', 'Clash 教程', 'Clash下载', 'Clash Verge Rev', 'Clash订阅', 'Clash 订阅', '订阅导入', '订阅链接', 'Clash节点', 'Clash机场', '机场推荐', '规则模式', '全局模式', 'TUN', 'DNS 泄露', 'DNS泄露', '连接不上', '订阅更新失败', '节点超时', '超时', 'Mihomo', 'Windows 11', 'Clash Party', '配置文件', 'YAML', '无法上网', '稳定机场', 'IEPL', 'IPLC', 'macOS', 'Android', 'iOS'];
const posts = rows.filter(r => r.url.startsWith('/posts/'));
const kw = {}; for (const k of KW) kw[k] = { inTitle: posts.filter(r => r.title.includes(k) || r.h1.includes(k)).map(r => r.url), inBody: Object.values(pages).filter(p => p.body.includes(k)).length };

// 近似段落（5 字 shingle 重叠 > 60% 的段落对，跨文章）
const paras = []; for (const p of Object.values(pages)) if (p.url.startsWith('/posts/')) for (const m of ((p.html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1] || '').matchAll(/<p>([\s\S]*?)<\/p>/g)) { const t = text(m[1]); if (t.length > 60) paras.push({ u: p.url, t }); }
const sh = t => { const s = new Set(); for (let i = 0; i < t.length - 5; i++) s.add(t.slice(i, i + 6)); return s; };
const dup = []; const sets = paras.map(p => sh(p.t));
for (let i = 0; i < paras.length; i++) for (let j = i + 1; j < paras.length; j++) { if (paras[i].u === paras[j].u) continue; let c = 0; for (const x of sets[i]) if (sets[j].has(x)) c++; const r = c / Math.min(sets[i].size, sets[j].size); if (r > 0.6) dup.push({ a: paras[i].u, b: paras[j].u, r: +r.toFixed(2), t: paras[i].t.slice(0, 50) }); }
// 繁体字/占位
const TRAD = /[們這來個說關開還時過後點應該為麼體網務個種線電長與無區裡檔經現臺]/; const PH = /TODO|待补充|lorem|占位文字|XXX|此处省略/i;
const flags = []; for (const p of Object.values(pages)) { if (TRAD.test(p.body)) flags.push(['trad', p.url]); if (PH.test(p.body)) flags.push(['placeholder', p.url]); }
fs.writeFileSync(path.join(root, 'docs/seo-audit-data.json'), JSON.stringify({ rows, kw, dup, flags }, null, 1));
const idx = rows.filter(r => !r.noindex && r.url !== '/404.html');
console.log('总 HTML', rows.length, '| 可索引', idx.length, '| noindex', rows.filter(r => r.noindex).length, '| sitemap', smSet.size, '| 文章', posts.length);
console.log('可索引但不在 sitemap:', idx.filter(r => !r.inSitemap).map(r => r.url).join(' ') || '无');
console.log('title 长度>60:', idx.filter(r => r.tl > 60).map(r => r.url + '(' + r.tl + ')').join(' ') || '无');
console.log('title 长度<15:', idx.filter(r => r.tl < 15).map(r => r.url + '(' + r.tl + ')').join(' ') || '无');
console.log('desc 长度>120:', idx.filter(r => r.dl > 120).map(r => r.url + '(' + r.dl + ')').join(' ') || '无');
console.log('desc 长度<50:', idx.filter(r => r.dl < 50).map(r => r.url + '(' + r.dl + ')').join(' ') || '无');
console.log('正文<800 字的文章:', posts.filter(r => r.chars < 800).map(r => r.url + '(' + r.chars + ')').join(' ') || '无');
console.log('主内容入链为0:', idx.filter(r => r.inMain === 0).map(r => r.url).join(' ') || '无');
console.log('文章主内容入链:', posts.map(r => r.url.slice(7, -1) + '=' + r.inMain).join(' '));
console.log('无 og:image 的可索引页:', idx.filter(r => !r.ogImage).length);
console.log('近似段落:', dup.length, JSON.stringify(dup.slice(0, 8)));
console.log('繁体/占位:', JSON.stringify(flags));
console.log('关键词: ' + Object.entries(kw).map(([k, v]) => `${k}[标题${v.inTitle.length}/正文${v.inBody}页]`).join(' '));
