// IndexNow 提交工具（默认 dry-run，不发送任何请求）
//   node tools/indexnow.mjs            → 只列出"自上次提交以来内容有变化"的 URL
//   node tools/indexnow.mjs --submit   → 部署上线、且密钥文件可公开访问后，才真正提交
// 规则：只提交有变化的页面（按 public/ 中 HTML 内容哈希对比 .indexnow-state.json）；单次最多 100 条；提交成功不等于被收录。
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); const pub = path.join(root, 'public');
const HOST = 'clashnote.blog'; const KEY = '6c4281aa5435f66d2cea051ff7dca68a'; const state = path.join(root, '.indexnow-state.json');
const submit = process.argv.includes('--submit');
const sm = fs.readFileSync(path.join(pub, 'sitemap.xml'), 'utf8'); const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const prev = fs.existsSync(state) ? JSON.parse(fs.readFileSync(state, 'utf8')) : {}; const next = {}; const changed = [];
for (const u of urls) { const rel = u.replace('https://' + HOST, ''); const f = path.join(pub, rel, rel.endsWith('/') ? 'index.html' : ''); const h = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); next[u] = h; if (prev[u] !== h) changed.push(u); }
console.log('sitemap URL', urls.length, '| 有变化', changed.length, '| 模式', submit ? 'SUBMIT' : 'dry-run');
if (!changed.length) { console.log('没有变化，不提交。'); process.exit(0); }
if (!submit) { changed.slice(0, 20).forEach(u => console.log(' ', u)); console.log('（dry-run：未发送）'); process.exit(0); }
if (changed.length > 100) { console.log('超过 100 条，请分批并先人工确认。'); process.exit(1); }
const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: changed }) });
console.log('IndexNow 返回状态', res.status, '（200/202 仅表示已接收，不代表收录）');
if (res.status === 200 || res.status === 202) fs.writeFileSync(state, JSON.stringify(next, null, 1));
