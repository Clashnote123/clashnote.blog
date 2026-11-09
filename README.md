# Clash Note｜Clash 订阅机场推荐与第三方客户端导入指南

> 专注 Clash 机场推荐与第三方订阅导入，整理兼容 Clash、Mihomo 的机场服务，提供订阅获取、节点配置及客户端教程。
>
> 网站：[https://clashnote.blog](https://clashnote.blog)（部署中；上线前部分链接暂不可访问）

本站整理 **17 家机场**的套餐、节点地区、线路类型与订阅获取方式，兼容 Clash Verge Rev、Mihomo Party、Clash Party 等第三方客户端，并提供订阅导入、节点更新、DNS 配置、TUN 模式与连接故障排查教程。

## 机场推荐（17 家）

17 家机场按**固定的编辑顺序**排列，**不是性能排名**。价格、节点与规则取自各品牌提供的资料，实际以官网结算页为准。

| # | 机场 | 月付起价 | 节点地区 | 特点 | 入口 |
|---|---|---|---|---|---|
| 01 | **[灵动云](https://clashnote.blog/airports/lingdongyun/)** | ¥20（拂风 100 GB） | 香港、台湾、日本、新加坡、美国 | 60 个节点、全节点 1x；周期套餐 100–1500 GB，三年付最低 75 折，另有独享 IP 定制线路 | [官网注册](https://varnexa.lingdongaff.com/#/?code=HHoxxHGa) |
| 02 | **[暮光加速](https://clashnote.blog/airports/muguang-jiasu/)** | ¥20（基础版 120 GB） | 香港、台湾、日本、新加坡、美国 | 大流量阶梯清晰：120 GB ¥20 起，至尊版 1500 GB ¥180；Windows、macOS、iOS、Android 都有官方客户端 | [官网注册](https://varnexa.twilightaff.com/#/?code=rkRvrsRc) |
| 03 | **[微风网络](https://clashnote.blog/airports/breezenet/)** | ¥25（乘风（Riding） 200 GB） | 香港、台湾、日本、新加坡、美国 | 全 IPLC、资料称全节点住宅 IP；乘风 200 GB ¥25，御风 1200 GB ¥125，所有设备共用同一份流量 | [官网注册](https://downloadshare.breezenetttt.sbs/#/?code=eS6rgePR) |
| 04 | **[飞猫云](https://clashnote.blog/airports/feimaoyun/)** | ¥25（星耀版 150 GB） | 香港、台湾、日本、新加坡、美国 等 | 节点地区覆盖更广（含韩国、东南亚、欧洲、南美），另有 ¥84 / 年学生版 | [官网注册](https://flycat1.flycatvipaff.cc/#/?code=Gja6RpJ8) |
| 05 | **[大佬云](https://clashnote.blog/airports/dalaoyun/)** | ¥19.99（初云·福利版 120 GB） | 香港、台湾、日本、新加坡、美国 等 | 新上线的 IEPL 机场，6 个地区 60 个节点，120 GB 档月付 ¥19.99 | [官网注册](https://a01vipaff.dalaoyunaff.com/#/?code=yN6HqG0d) |
| 06 | **[隐形人](https://clashnote.blog/airports/yinxingren/)** | ¥24（白银纪元 144 GB） | 香港、台湾、日本、新加坡、美国 等 | 月流量档位大（最高 1600 GB），节点含韩、德、法、英；支持 Linux，支持不满意退款 | [官网注册](https://varnexa.invisibleaff.com/#/?code=PoecAA0c) |
| 07 | **[梯子云](https://clashnote.blog/airports/tiziyun/)** | ¥25（初阶网络·基础视界 125 GB） | 香港、台湾、日本、新加坡、美国 等 | 125 GB ¥25 起，最高 1600 GB / 月；季付 95 折、半年 9 折、年付 85 折，有独享 IP 定制线路 | [官网注册](https://varnexa.ladderaff.com/#/?code=NSTRhs22) |
| 08 | **[飞V](https://clashnote.blog/airports/flyv/)** | ¥25（入门方案 150 GB） | 香港、台湾、日本、新加坡、美国 | 各地区线路类型逐项标注（IEPL / IPLC / BGP），资料称原生 IP；入门 150 GB ¥25，商业档 1.8 TB ¥190 | [官网注册](https://varnexa.flyvaff.com/#/?code=1mq17Z8C) |
| 09 | **[浪网](https://clashnote.blog/airports/wanglang/)** | ¥30（入门 150 GB） | 香港、台湾、日本、新加坡、美国 等 | 单档月流量最大（商业档 2000 GB ¥200）；月付套餐与年付标准的线路类型不同 | [官网注册](https://varnexa.wavenetaff.com/#/?code=Thua5OyI) |
| 10 | **[无忧](https://clashnote.blog/airports/wuyou/)** | ¥19（舒心链接 100 GB） | 香港、台湾、日本、新加坡、美国 | 月付起价最低（¥19），年付 MINI 仅 ¥79；资料称支持 TikTok 跨区直连与直播 | [官网注册](https://wep01.worryfreeaff.com/#/?code=HgKiCWFk) |
| 11 | **[Firefly](https://clashnote.blog/airports/firefly/)** | ¥25（Lite 150 GB） | 香港、台湾、日本、新加坡、美国 | IPLC 专线、原生 IP，套餐只有四档加年付版和一档不限时包，结构简单 | [官网注册](https://vip02.fireflyaff.com/#/?code=ChuJcdvd) |
| 12 | **[唯兔云](https://clashnote.blog/airports/weituyun/)** | ¥19.9（普通版 150 GB） | 香港、台湾、日本、新加坡、美国 等 | 档位多，常规起价 ¥19.9；年付加强专线为 IEPL，其他地区可找客服加开 | [官网注册](https://fast.v2yunvipaff.com/#/?code=sZt4VRYd) |
| 13 | **[灵猫](https://clashnote.blog/airports/lingmao/)** | ¥25（Small 150 GB） | 香港、台湾、日本、新加坡、美国 | 全 IPLC，只有 Small / Big 两档周期套餐；资料称最大带宽 1000 Mbps，流量用完可买加油包 | [官网注册](https://vip02.civetaff.com/#/?code=oL5LiBYi) |
| 14 | **[全球云](https://clashnote.blog/airports/quanqiuyun/)** | ¥20（入门方案 120 GB） | 香港、台湾、日本、新加坡、美国 等 | 60+ 节点、地区广，三年付最低 6 折，支持路由器 | [官网注册](https://sswdh.gcvipaff.com/#/?code=po8R1Rnl) |
| 15 | **[跨界](https://clashnote.blog/airports/kuajie/)** | ¥20（轻云 Lite 120 GB） | 香港、台湾、日本、新加坡、美国 | 顶档 1800 GB 月付 ¥130，入门 120 GB ¥20；全 IPLC | [官网注册](https://vip02.kuajieaff.com/#/?code=tpRqrYXx) |
| 16 | **[闪跃](https://clashnote.blog/airports/shanyue/)** | ¥24（闪动 Flicker 150 GB） | 香港、台湾、日本、新加坡、美国 | 全 IPLC 专线、原生 IP，闪动档 150 GB ¥24；支持 Linux，流量与设备规则以官网为准 | [官网注册](https://vip02.flashleapaff.com/#/?code=mS7mSSyk) |
| 17 | **[Sogo云](https://clashnote.blog/airports/sogoyun/)** | ¥25（基础版 150 GB） | 香港、台湾、日本、新加坡、美国 等 | IEPL + 三网 BGP，资料称覆盖 15 个国家和地区；提供 4 档不限时流量，支持软路由 | [官网注册](https://wzjc.sogoyunaff.cc/#/?code=EJx2Kerr) |

**Clash 订阅怎么拿：** 站长已确认上述机场都可以通过订阅链接导入 Clash 等第三方客户端，订阅链接**需要通过官网客服渠道获取**，没有公开入口。具体套餐与获取方式以客服答复为准（该结论目前为站长转述，无书面记录）。

- 流程与话术：[向机场客服索取 Clash 订阅](https://clashnote.blog/posts/get-clash-subscription-from-support/)
- 完整路线：[想用 Clash 或第三方客户端？先注册官方账号，再向客服索取订阅链接](https://clashnote.blog/posts/register-official-account-get-clash-subscription/)
- 选择思路：[Clash 机场怎么选](https://clashnote.blog/posts/how-to-choose-clash-airport/)、[17 家机场各有什么不同](https://clashnote.blog/posts/airport-differences-by-need/)
- 并排对比价格与流量：[套餐对比](https://clashnote.blog/compare/)

**付款方式：** 17 家统一通过支付宝付款；金额较大（超过 ¥500–¥1000）可联系客服使用微信或 USDT 渠道。

> **商业披露：** 表中"官网注册"为推广链接（sponsored），通过链接注册可能为本站带来佣金，但不影响购买价格。本站为独立内容站，不是 Clash、Mihomo 或任何客户端、机场的官方网站。

## 教程与文章（25 篇）

### 新手入门与客户端

- [Clash Verge Rev Windows 11 安装与使用](https://clashnote.blog/posts/clash-verge-rev-windows-install/)
- [Clash Verge Rev 正确导入订阅链接](https://clashnote.blog/posts/clash-verge-rev-import-subscription/)
- [Clash 规则模式、全局模式、直连模式的区别](https://clashnote.blog/posts/clash-rule-global-direct-mode/)
- [Windows 系统代理与 TUN 模式有什么区别](https://clashnote.blog/posts/system-proxy-vs-tun/)
- [Clash Verge Rev macOS 安装与使用指南](https://clashnote.blog/posts/clash-verge-rev-macos/)
- [Clash Party 安装与导入订阅教程](https://clashnote.blog/posts/clash-party-install-import/)
- [Android 使用 Clash 导入订阅教程（FlClash 等）](https://clashnote.blog/posts/clash-android-import-guide/)

### 机场选择与订阅获取

- [Clash 机场怎么选：先确认能不能导入，再看套餐与线路](https://clashnote.blog/posts/how-to-choose-clash-airport/)
- [机场订阅链接是什么？官方客户端、订阅与 Clash 导入的关系](https://clashnote.blog/posts/airport-subscription-link-explained/)
- [向机场客服索取 Clash 订阅：流程、话术与各家资料所列客服渠道](https://clashnote.blog/posts/get-clash-subscription-from-support/)
- [17 家机场各有什么不同：按需求找机场（资料对照）](https://clashnote.blog/posts/airport-differences-by-need/)
- [想用 Clash 或第三方客户端？先注册官方账号，再向客服索取订阅链接](https://clashnote.blog/posts/register-official-account-get-clash-subscription/)

### 故障排查

- [订阅导入报错 401、403、404 与超时怎么排查](https://clashnote.blog/posts/subscription-error-401-403-404/)
- [Clash 导入订阅成功但没有节点如何处理](https://clashnote.blog/posts/no-nodes-after-import/)
- [Clash 节点全部显示超时如何排查](https://clashnote.blog/posts/all-nodes-timeout/)
- [Clash TUN 模式无法开启的排查](https://clashnote.blog/posts/tun-mode-cannot-enable/)
- [Clash 已连接但浏览器无法访问网页怎么办](https://clashnote.blog/posts/connected-but-no-web/)
- [Clash 订阅更新失败、失效与版本兼容](https://clashnote.blog/posts/subscription-update-failed/)
- [退出 Clash 后 Windows 仍无法联网怎么办](https://clashnote.blog/posts/windows-no-internet-after-exit/)

### Mihomo 知识库

- [Clash DNS 泄露与 DNS 请求路径检查](https://clashnote.blog/posts/dns-leak-check/)
- [Mihomo YAML 配置文件入门](https://clashnote.blog/posts/mihomo-yaml-basics/)
- [Clash 规则覆写与防止更新覆盖配置](https://clashnote.blog/posts/override-keep-config-on-update/)
- [Clash 配置文件 YAML 报错怎么看、怎么改](https://clashnote.blog/posts/clash-yaml-error-fix/)
- [IEPL、IPLC、BGP 机场线路有什么区别，怎么看资料](https://clashnote.blog/posts/iepl-iplc-bgp-explained/)

### 节点测速

- [如何正确阅读机场节点测速图](https://clashnote.blog/posts/how-to-read-speedtest-images/)

## 站点栏目

| 栏目 | 说明 |
|---|---|
| [机场推荐](https://clashnote.blog/airports/) | 17 家机场资料库，可按地区、预算、线路筛选 |
| [套餐对比](https://clashnote.blog/compare/) | 2–4 家机场并排比较 |
| [Clash 教程](https://clashnote.blog/tutorials/) | 从安装到排查的教程目录 |
| [客户端下载](https://clashnote.blog/clients/) | 各系统客户端与官方下载渠道 |
| [故障排查](https://clashnote.blog/troubleshooting/) | 按报错与症状查找 |
| [Mihomo 知识库](https://clashnote.blog/wiki/) | YAML、DNS、规则覆写 |
| [节点测速](https://clashnote.blog/speedtests/) | 测速方法与记录（目前仅 1 条站长提供、未独立复测的记录） |
| [常见问题](https://clashnote.blog/faq/) | FAQ |

## 编辑原则

- 不编造价格、测速、评价；资料没有的内容标注"未提供"。
- 机场顺序为固定编辑顺序，不代表质量或速度排名。
- 测速记录需注明工具、时间与来源；未独立复测的会明确标出。
- 本站不提供、不公开任何订阅链接或令牌。

## 本地开发

技术栈：Hexo 8 + 自研主题 `clashnote`。

```bash
npm install
npm run parse     # 可选：重新解析 raw-data/*.md → source/_data/airports.json
npm run build     # hexo clean && hexo generate
npm run check     # 静态检查 public/
npx hexo server   # 本地预览 http://localhost:4000
npm run readme    # 重新生成本 README
```

- 机场数据：`source/_data/airports.json`；编辑点评 `source/_data/editorial.yml`；FAQ `faq.yml`；测速记录 `speedtests.yml`。
- 新文章：`source/_posts/<slug>.md`，front matter 需 `order`、`hub`、`description`、`applies`、`verified`。
- 审计与说明见 `docs/` 与根目录的 `BING_SEO_AUDIT_REPORT.md` 等文件。
