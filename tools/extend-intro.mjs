import fs from 'node:fs'; import { createRequire } from 'node:module';
const yaml = createRequire(import.meta.url)('js-yaml'); const f = 'source/_data/editorial.yml';
const ed = yaml.load(fs.readFileSync(f, 'utf8'));
const X = {
  lingdongyun: '全节点统一 1x 倍率、不限设备；穿云年付小包 ¥99 / 年，不限时流量包有 150 / 400 / 800 GB；客服有 Crisp 在线客服和工单。',
  'muguang-jiasu': '55 个节点（BGP + IPLC 出口），年付轻量版 70 GB ¥109 / 年，另有独享私人定制节点；客服为 24 小时工单。',
  breezenet: '53 个节点，乘风 200 GB 月付 ¥25；iOS 通过 Nextin 登录，客服 7×24 小时在线（夜间 AI 客服值守）。',
  feimaoyun: '星耀 150 GB 月付 ¥25，资料称单节点最高 2.5 Gbps、高峰不降速；节点总数资料前后不一致，以官网为准。',
  dalaoyun: '全节点 1x、不限设备，客服为 7×24 小时真人客服；官方不提供试用，没有半年付。',
  yinxingren: '白银纪元 144 GB 月付 ¥24；周期套餐不限设备，一次性流量包限 1 / 2 / 3 台；支持 Windows、macOS、Linux、iOS、Android。',
  tiziyun: '自研全平台客户端（含 Android、iOS），60 GB 年度保活方案 ¥89 / 年；AI 工具资料只列出 ChatGPT。',
  flyv: '60 个节点，独享黄金专线 ¥680 / 月；官网 flyv.site，资料提醒 ¥9.9 / 月、1 折码都不是官方。',
  wanglang: '入门 150 GB 月付 ¥30；80 GB 年付标准 ¥119 / 年为全 IPLC；客服 24/7 在线。',
  wuyou: '全线 IPLC、不限设备、无倍率；没有半年付，客服 7×24 在线（夜间 AI 客服值守）。',
  firefly: 'Lite 150 GB 月付 ¥25，年付版 60 GB ¥96 / 年；没有半年付，客服 7×24 在线（夜间 AI 客服值守）。',
  weituyun: '普通版 150 GB 月付 ¥19.9；不限时流量包 100 / 200 / 500 GB，节点含马来西亚、英德法泰菲印等；客服全天在线。',
  lingmao: 'Small 150 GB 月付 ¥25、Big 300 GB ¥45；年付小包 45 GB ¥85 / 年；没有半年付与不限时流量包，客服全天在线。',
  quanqiuyun: '入门 120 GB 月付 ¥20；59 GB 轻量版 ¥99 / 年；支持 Windows、macOS、iOS、Android 和路由器。',
  kuajie: '跃云 330 GB ¥40、凌云 830 GB ¥90；60 GB 年付版 ¥96 / 年，不限登录设备数，资料没有不限时流量包。',
  shanyue: '飞跃 300 GB ¥44、瞬移 600 GB ¥84；60 GB 年付版 ¥96 / 年，支持 Windows、macOS、iOS、Android、Linux。',
  sogoyun: '基础版 150 GB 月付 ¥25；周期套餐每 30 天刷新流量，支持 Windows、macOS、iOS、Android 和主流软路由。'
};
let n = 0; for (const [k, v] of Object.entries(X)) { if (!ed[k].intro.includes(v)) { ed[k].intro = ed[k].intro + v; n++; } }
fs.writeFileSync(f, yaml.dump(ed, { lineWidth: -1, noRefs: true }), 'utf8'); console.log('extended', n, [...ed.lingdongyun.intro].length);
