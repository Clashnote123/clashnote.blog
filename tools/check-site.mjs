// 对 public/ 做静态检查：路由、标题/描述/H1/canonical、内部链接、锚点、JSON-LD、外链安全、17 家机场
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const airports = JSON.parse(fs.readFileSync(path.join(root, 'source/_data/airports.json'), 'utf8'));
const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);

function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]); }
const files = walk(pub);
const htmls = files.filter(f => f.endsWith('.html'));
const rel = f => '/' + path.relative(pub, f).replace(/\\/g, '/');
const urlOf = f => rel(f).replace(/index\.html$/, '');
const exists = u => {
  const p = decodeURIComponent(u.split('#')[0].split('?')[0]);
  if (p === '' ) return true;
  const fp = path.join(pub, p);
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return true;
  return fs.existsSync(path.join(fp, 'index.html'));
};

// 必需路由
const must = ['/', '/tutorials/', '/clients/', '/troubleshooting/', '/wiki/', '/airports/', '/compare/', '/speedtests/', '/faq/', '/about/', '/privacy/', '/search/', '/404.html', '/sitemap.xml', '/robots.txt', '/search.json', '/data/airports.json', '/favicon.svg', '/css/main.css', '/js/main.js'];
airports.forEach(a => must.push(`/airports/${a.slug}/`));
must.forEach(u => { if (!exists(u)) err(`缺少路由: ${u}`); });

const titles = new Map(), descs = new Map(), idsByPage = new Map();
let linkCount = 0;
const pages = {};
for (const f of htmls) {
  const html = fs.readFileSync(f, 'utf8'); const u = urlOf(f); pages[u] = html;
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || '';
  const indexable = !/noindex/.test(robots);
  if (!/<html lang="zh-CN"/.test(html)) err(`${u}: 缺少 lang=zh-CN`);
  if (!title) err(`${u}: 缺少 title`); else if (indexable) { if (titles.has(title)) err(`${u}: title 与 ${titles.get(title)} 重复`); titles.set(title, u); }
  if (!desc) err(`${u}: 缺少 description`); else if (indexable) { if (descs.has(desc)) err(`${u}: description 与 ${descs.get(desc)} 重复`); descs.set(desc, u); if (desc.length < 40) warn(`${u}: description 过短(${desc.length})`); if (desc.length > 200) warn(`${u}: description 偏长(${desc.length})`); }
  if (!canon) err(`${u}: 缺少 canonical`); else if (u !== '/404.html' && canon !== 'https://clashnote.blog' + u) err(`${u}: canonical 不匹配 -> ${canon}`);
  if (h1s !== 1) err(`${u}: H1 数量为 ${h1s}`);
  if (/Clash[:：]\s*undefined/.test(html)) err(u + ': 出现 Clash: undefined');
  if (/undefined|\[object Object\]|NaN/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) err(`${u}: 页面含 undefined/NaN/[object Object]`);
  if (/jichang|stellar/i.test(html)) warn(`${u}: 含旧站关键字`);
  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch (e) { err(`${u}: JSON-LD 无法解析`); } }
  // 图片 alt
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) err(`${u}: img 缺少 alt`);
  // ids
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])); idsByPage.set(u, ids);
}

for (const f of htmls) {
  const html = pages[urlOf(f)]; const u = urlOf(f);
  for (const m of html.matchAll(/<a\b([^>]*)>/g)) {
    const attrs = m[1]; const href = (attrs.match(/\bhref="([^"]*)"/) || [])[1];
    if (href === undefined) continue; linkCount++;
    if (href === '#' || href === '') { err(`${u}: 无效链接 href="${href}"`); continue; }
    if (/^https?:\/\//.test(href)) {
      if (!/clashnote\.blog/.test(href)) {
        if (/target="_blank"/.test(attrs) && !/noopener/.test(attrs)) err(`${u}: 外链缺 noopener -> ${href}`);
        if (/aff|code=/.test(href) && !/sponsored/.test(attrs)) err(`${u}: 推广链接缺 sponsored -> ${href}`);
      }
      continue;
    }
    if (/^(mailto:|tel:|javascript:)/.test(href)) continue;
    let target = href;
    if (href.startsWith('#')) { const id = decodeURIComponent(href.slice(1)); if (!idsByPage.get(u).has(id)) err(`${u}: 锚点不存在 ${href}`); continue; }
    if (!href.startsWith('/')) { warn(`${u}: 相对链接 ${href}`); continue; }
    if (!exists(target)) { err(`${u}: 死链 ${href}`); continue; }
    const hash = href.split('#')[1];
    if (hash) { const tu = href.split('#')[0].split('?')[0]; const tp = pages[tu] || pages[tu + 'index.html']; const ids = idsByPage.get(tu); if (ids && !ids.has(decodeURIComponent(hash))) err(`${u}: 目标锚点不存在 ${href}`); }
  }
}

// 17 家机场：顺序、推广链接、唯一性
const order = airports.map(a => a.name).join('|');
const expected = '灵动云|暮光加速|微风网络|飞猫云|大佬云|隐形人|梯子云|飞V|浪网|无忧|Firefly|唯兔云|灵猫|全球云|跨界|闪跃|Sogo云';
if (order !== expected) err('机场顺序与固定顺序不一致: ' + order);
const refs = new Set();
airports.forEach(a => {
  const pg = pages[`/airports/${a.slug}/`] || '';
  if (a.referralUrl) { if (!pg.includes(a.referralUrl)) err(`机场页 ${a.slug}: 未包含自己的推广链接`); if (refs.has(a.referralUrl)) err(`推广链接重复: ${a.referralUrl}`); refs.add(a.referralUrl); }
  else if (!pg.includes(a.officialUrl)) err(`机场页 ${a.slug}: 缺少官网链接`);
  airports.filter(b => b.slug !== a.slug && b.referralUrl).forEach(b => { if (pg.includes(b.referralUrl)) err(`机场页 ${a.slug}: 串入了 ${b.slug} 的推广链接`); });
  if (/34\s*家/.test(pg)) err(`机场页 ${a.slug}: 仍含"34 家"表述`);
});
const sm = fs.readFileSync(path.join(pub, 'sitemap.xml'), 'utf8');
const smUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace('https://clashnote.blog', ''));
smUrls.forEach(u => { if (!exists(u)) err(`sitemap 含不存在页面: ${u}`); if (/noindex/.test(pages[u] || '')) err(`sitemap 含 noindex 页面: ${u}`); });
[...Object.keys(pages)].filter(u => !/noindex/.test(pages[u]) && u !== '/404.html' && !smUrls.includes(u)).forEach(u => warn(`可索引页面未在 sitemap: ${u}`));
const search = JSON.parse(fs.readFileSync(path.join(pub, 'search.json'), 'utf8'));
search.forEach(s => { const u = s.u.split('#')[0]; if (!exists(u)) err(`search.json 指向不存在页面: ${s.u}`); });

const posts = Object.keys(pages).filter(u => u.startsWith('/posts/'));
console.log(`HTML 页面 ${htmls.length} | 文章 ${posts.length} | 机场页 ${airports.length} | 内部/外部链接检查 ${linkCount} | sitemap ${smUrls.length} 条 | 搜索条目 ${search.length}`);
console.log(`错误 ${errors.length} | 警告 ${warns.length}`);
errors.slice(0, 80).forEach(e => console.log('ERROR ' + e));
warns.slice(0, 40).forEach(e => console.log('WARN  ' + e));
process.exit(errors.length ? 1 : 0);
