// 将 raw-data/*.md（17 家机场原始资料）解析为 source/_data/airports.json
// 只做结构化抽取，不改写数字；缺失字段保持 null。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = path.join(root, 'raw-data');
const outFile = path.join(root, 'source', '_data', 'airports.json');
const auditFile = path.join(root, 'docs', 'parse-log.json');

const SLUGS = {
  '01': 'lingdongyun', '02': 'muguang-jiasu', '03': 'breezenet', '04': 'feimaoyun',
  '05': 'dalaoyun', '06': 'yinxingren', '07': 'tiziyun', '08': 'flyv', '09': 'wanglang',
  '10': 'wuyou', '11': 'firefly', '12': 'weituyun', '13': 'lingmao', '14': 'quanqiuyun',
  '15': 'kuajie', '16': 'shanyue', '17': 'sogoyun',
};

// Clash 兼容状态（统一数据源）。结构：
//   clashSupport: { status: supported|unsupported|unknown, displayName, evidence, lastVerified, subscriptionAvailable, ... }
// 规则：只有"有确认依据"才标 supported；资料明确写不支持 → unsupported；资料仅写"不推荐"、既未确认支持也未确认不支持 → unknown。
// lastVerified 一律为 null：本次没有联网核验服务商后台或实际订阅。
const DISPLAY = { supported: '支持导入 Clash', unsupported: '暂不支持导入 Clash', unknown: 'Clash 兼容待核实' };
const OWNER = '站长在《全站统一开发指令》中声明：通过客服/工单领取适用 Clash 客户端的订阅配置';
const UNSUP_NEW = '品牌资料：2026 年 10 月起新订单不提供订阅、不支持导入第三方客户端；老用户原有订阅不受影响';
const DISCOURAGED = '品牌资料仅写"不推荐"导入第三方客户端（避免订阅外泄），未明确支持也未明确不支持，待向服务商确认';
const OPCONF = '站长转述：该服务商运营方已向站长确认支持导入 Clash（2026-11-07，为口头/转述确认，未取得书面记录或截图）；品牌资料早期记载与之不同：';
const CLASH_SUPPORT = {
  lingdongyun: { status: 'supported', evidence: OWNER + '；同一份品牌资料注明官方公开订阅链接已暂停提供（平台遭遇异常流量攻击）。支持依据为站长声明，未经服务商公开文档或实际订阅验证', subscriptionAvailable: null, method: 'contact-support',
    howTo: ['在官网用户中心通过 Crisp 在线客服或工单联系客服（资料：工单 24 小时内回复）', '说明需要「适用于 Clash 客户端的订阅配置」，按客服指引领取', '订阅含个人凭证，不要公开或转发；网上出售的订阅不是官方渠道', '领取后按《Clash Verge Rev 正确导入订阅链接》导入'] },
  'muguang-jiasu': { status: 'supported', evidence: OPCONF + (DISCOURAGED).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  breezenet: { status: 'supported', evidence: OPCONF + (UNSUP_NEW).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  feimaoyun: { status: 'supported', evidence: OPCONF + (DISCOURAGED).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  dalaoyun: { status: 'supported', evidence: OPCONF + ('品牌资料：不提供订阅链接，只能使用官方客户端，不支持导入第三方客户端').replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  yinxingren: { status: 'supported', evidence: OPCONF + (DISCOURAGED).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  tiziyun: { status: 'unknown', evidence: DISCOURAGED, subscriptionAvailable: null },
  flyv: { status: 'supported', evidence: OPCONF + ('品牌资料：不对外发放订阅链接，不支持导入第三方客户端').replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  wanglang: { status: 'supported', evidence: OPCONF + (DISCOURAGED).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  wuyou: { status: 'supported', evidence: OPCONF + (UNSUP_NEW).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  firefly: { status: 'supported', evidence: OPCONF + (UNSUP_NEW).replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
  weituyun: { status: 'unknown', evidence: DISCOURAGED, subscriptionAvailable: null },
  lingmao: { status: 'unknown', evidence: '站长表示 Clash 兼容待核实；品牌资料早期记载：' + UNSUP_NEW.replace(/^品牌资料：/, ''), subscriptionAvailable: null },
  quanqiuyun: { status: 'unknown', evidence: DISCOURAGED, subscriptionAvailable: null },
  kuajie: { status: 'unknown', evidence: DISCOURAGED, subscriptionAvailable: null },
  shanyue: { status: 'unknown', evidence: DISCOURAGED, subscriptionAvailable: null },
  sogoyun: { status: 'supported', evidence: OPCONF + ('品牌资料：不提供订阅链接，只能使用自研官方客户端，不支持导入第三方客户端').replace(/^品牌资料：?/, ''), subscriptionAvailable: null, verifiedOn: '2026-11-07' },
};
function buildClashSupport(slug, dev) {
  const c = CLASH_SUPPORT[slug];
  if (!c) throw new Error('缺少 Clash 状态: ' + slug);
  return {
    status: c.status, displayName: DISPLAY[c.status], evidence: c.evidence, lastVerified: c.verifiedOn || null,
    subscriptionAvailable: c.subscriptionAvailable, method: c.method || null, howTo: c.howTo || null,
    sourceRaw: { subscription: dev['订阅链接'] || null, thirdParty: dev['第三方客户端'] || null },
  };
}

const CYCLES = [['月付', 'month'], ['季付', 'quarter'], ['半年付', 'halfyear'], ['年付', 'year'], ['两年付', 'twoyear'], ['三年付', 'threeyear']];
const parseLog = { removedClaims: [], unparsedPlanLines: [] };

function splitSections(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const secs = { head: [], };
  let cur = 'head';
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([一二三四五六七八九十]+)、(.+)$/);
    if (m && /^-{5,}/.test(lines[i + 1] || '')) { cur = m[2].trim(); secs[cur] = []; i++; continue; }
    secs[cur].push(lines[i]);
  }
  return secs;
}

function kv(lines) {
  const o = {}; let last = null;
  for (const l of lines) {
    if (!l.trim()) continue;
    const m = l.match(/^([^\s：:][^：:]*)：\s*(.*)$/);
    if (m && !/^\s/.test(l)) { last = m[1].trim(); o[last] = m[2].trim(); continue; }
    const m2 = l.match(/^官网:\s*(\S+)/);
    if (m2) { o['官网'] = m2[1]; continue; }
    if (last && /^\s/.test(l)) o[last] = (o[last] ? o[last] + '\n' : '') + l.trim();
  }
  return o;
}

function stripCrossClaims(text, ctx) {
  if (!text) return text;
  const parts = text.split('，');
  const kept = parts.filter(p => !/34\s*家/.test(p));
  if (kept.length !== parts.length) parseLog.removedClaims.push({ where: ctx, original: text });
  return kept.join('，');
}

function parsePlanBody(name, body) {
  const p = { name, raw: `${name}：${body}`, trafficGB: null, trafficPeriod: null, prices: {}, once: null, note: null, limited: false };
  const t = body.match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
  if (t) p.trafficGB = t[2].toUpperCase() === 'TB' ? parseFloat(t[1]) * 1000 : parseFloat(t[1]);
  if (t && /\/\s*月/.test(body.slice(t.index, t.index + t[0].length + 6))) p.trafficPeriod = 'month';
  let any = false;
  for (const [zh, key] of CYCLES.slice().sort((a, b) => b[0].length - a[0].length)) {
    const re = new RegExp(`(?<![两三半])${zh}\\s*¥([\\d.]+)`);
    const m = body.match(re);
    if (m) { p.prices[key] = parseFloat(m[1]); any = true; }
  }
  if (!any) {
    const per = body.match(/¥([\d.]+)\s*\/\s*(月|年)/);
    if (per) { p.prices[per[2] === '月' ? 'month' : 'year'] = parseFloat(per[1]); any = true; }
    else {
      const one = body.match(/¥([\d.]+)/);
      if (one) p.once = parseFloat(one[1]);
    }
  }
  const note = body.match(/[（(]([^）)]+)[）)]/);
  if (note) p.note = note[1];
  if (/限时/.test(name + body)) p.limited = true;
  return p;
}

function parsePricing(lines, slug) {
  const groups = { cycle: [], small: [], onetime: [], custom: [] };
  const notes = [];
  let group = null;
  for (const raw of lines) {
    if (!raw.trim()) continue;
    if (!/^\s/.test(raw) && /：\s*$/.test(raw)) {
      const h = raw.replace(/：\s*$/, '');
      if (/周期套餐/.test(h)) group = 'cycle';
      else if (/长周期/.test(h)) group = 'longcycle';
      else if (/年付小包|年付轻量/.test(h)) group = 'small';
      else if (/不限时/.test(h)) group = 'onetime';
      else if (/独享|定制/.test(h)) group = 'custom';
      else { group = null; parseLog.unparsedPlanLines.push({ slug, line: raw }); }
      continue;
    }
    const line = raw.trim();
    if (group === 'longcycle' || !line.includes('：')) { notes.push(line); continue; }
    const i = line.indexOf('：');
    const plan = parsePlanBody(line.slice(0, i).trim(), line.slice(i + 1).trim());
    if (groups[group]) groups[group].push(plan); else parseLog.unparsedPlanLines.push({ slug, line });
  }
  return { groups, longCycleNotes: notes };
}

function listFrom(v) { return v ? v.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : []; }

function parseFile(file) {
  const num = file.slice(0, 2);
  const slug = SLUGS[num];
  const text = fs.readFileSync(path.join(rawDir, file), 'utf8');
  const secs = splitSections(text);
  const head = secs.head.find(l => l.trim()) || '';
  const basic = kv(secs['基本信息'] || []);
  const route = kv(secs['线路与节点'] || []);
  const traffic = (secs['流量规则'] || []).map(s => s.trim()).filter(Boolean);
  const dev = kv(secs['设备与客户端'] || []);
  const media = kv(secs['流媒体与 AI'] || []);
  const coupon = kv(secs['优惠码'] || []);
  const service = kv(secs['客服与防骗'] || []);
  const { groups, longCycleNotes } = parsePricing(secs['套餐与价格'] || [], slug);
  const name = basic['中文名'];
  const aliases = [basic['别名'], basic['英文名']].filter(Boolean);
  const english = basic['英文名'] || null;
  const referral = (basic['推广链接'] || '').trim() || null;
  const official = basic['官网'] || null;

  const cycleReal = groups.cycle.filter(p => !p.limited && p.prices.month);
  let minMonthly = null;
  for (const p of cycleReal) if (!minMonthly || p.prices.month < minMonthly.price) minMonthly = { price: p.prices.month, plan: p.name, gb: p.trafficGB };
  for (const p of groups.cycle) if (p.prices.month && p.trafficGB) p.perGbMonthly = +(p.prices.month / p.trafficGB).toFixed(3);
  const maxGB = Math.max(0, ...groups.cycle.map(p => p.trafficGB || 0)) || null;

  const rec = {
    id: slug, rank: parseInt(num, 10), slug, name, englishName: english, aliases,
    sourceFile: file, sourceDate: null,
    officialUrl: official, referralUrl: referral,
    positioning: stripCrossClaims(basic['品牌定位'], `${slug}.品牌定位`),
    advantage: stripCrossClaims(basic['最大优势'], `${slug}.最大优势`) || null,
    audience: basic['适合人群'] || null,
    regions: route['节点地区'] || null,
    regionCounts: route['各地区节点数'] || null,
    lineTypeText: route['线路类型'] || null,
    lineDetail: route['各地区线路类型'] || null,
    multiplier: route['倍率'] || null,
    plans: groups,
    longCycleNotes,
    trafficRules: traffic,
    devices: dev['设备数'] || null,
    platforms: dev['支持系统'] || null,
    usage: dev['使用方式'] || null,
    subscription: dev['订阅链接'] || null,
    thirdParty: dev['第三方客户端'] || null,
    clientNote: dev['说明'] || null,
    download: dev['下载渠道'] || null,
    streaming: listFrom(media['流媒体']),
    ai: listFrom(media['AI 工具']),
    crossBorder: media['跨境 / 社交'] || null,
    nativeIp: /原生 IP/.test((secs['流媒体与 AI'] || []).join('\n')),
    residentialIp: /住宅 IP/.test((secs['流媒体与 AI'] || []).join('\n')),
    coupon: coupon['优惠码'] ? {
      code: coupon['优惠码'], discount: coupon['折扣'] || null, applies: coupon['适用套餐'] || null,
      excludes: coupon['不适用'] || null, limit: coupon['使用限制'] || null,
    } : null,
    service,
    clashSupport: buildClashSupport(slug, dev),
    derived: { minMonthly, maxMonthlyGB: maxGB, cyclePlanCount: groups.cycle.length },
    measured: null,
  };

  // 灵动云：第十节「晚高峰实测」为资料提供方自带，无截图/原始数据
  const m = secs['晚高峰实测'];
  if (m) {
    const k = kv(m);
    rec.measured = {
      time: k['测试时间'] || null, network: k['测试网络'] || null,
      rows: m.filter(l => /^(香港|新加坡|美国|台湾|日本)：/.test(l.trim())).map(l => l.trim()),
      apps: k['流媒体与 AI'] || null, conclusion: k['结论'] || null,
      evidence: '资料文件内文字记录；未附截图、工具名称、设备与原始数据',
    };
  }
  return rec;
}

const files = fs.readdirSync(rawDir).filter(f => /^\d\d_.+\.md$/.test(f)).sort();
const airports = files.map(parseFile);
if (airports.length !== 17) throw new Error(`期望 17 家，实际 ${airports.length}`);
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(airports, null, 2), 'utf8');
fs.writeFileSync(auditFile, JSON.stringify(parseLog, null, 2), 'utf8');
console.log('airports:', airports.length);
for (const a of airports) {
  const c = a.plans;
  console.log(String(a.rank).padStart(2, '0'), a.name, '| cycle', c.cycle.length, 'small', c.small.length, 'once', c.onetime.length, 'custom', c.custom.length, '| min', a.derived.minMonthly?.price ?? '-', '| ref', a.referralUrl ? 'Y' : 'N');
}
console.log('log:', JSON.stringify(parseLog.unparsedPlanLines), parseLog.removedClaims.length, 'claims removed');