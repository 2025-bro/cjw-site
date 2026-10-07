---
title: 网站上线：零成本搭建我们的三人小站
description: 记录如何用 Astro + Cloudflare Pages 免费搭建 cjw-wjc-qwq.top，不买服务器、不用备案。
date: 2026-10-01
author: CJW
tags: [建站, Cloudflare, Astro]
---

## 为什么做这个小站

我们三个人平时刷题、写代码，经常遇到这些需求：

- 记录学习笔记和解题思路；
- 把常用的算法模板集中存放，比赛前随手查；
- 收藏题目链接，附上自己的解析，方便回看。

与其各存各的，不如共用一个网站。要求只有一条：**不花钱**。

## 方案选择

| 需求 | 方案 |
| --- | --- |
| 域名 | 已有的 `cjw-wjc-qwq.top`（阿里云购买） |
| 托管 | Cloudflare Pages（免费、不限流量） |
| 建站框架 | Astro（静态生成，速度快） |
| 内容维护 | Markdown + Git 提交，自动部署 |
| 内部区 | Cloudflare Pages Functions + 密码 Cookie |

这套组合**不需要服务器、不需要备案、没有任何月费**，域名本身是唯一的成本（已经付过了）。

## 大致原理

1. 网站的源代码和文章都放在 GitHub 仓库里；
2. 任何一次 `git push` 都会触发 Cloudflare Pages 自动构建；
3. 构建出的静态文件部署到 Cloudflare 全球边缘节点；
4. 阿里云 DNS 里加一条 CNAME 记录，把 `cjw-wjc-qwq.top` 指到 Cloudflare；
5. `/private/` 目录由 Functions 中间件拦截，登录后才放行。

## 后续计划

- [x] 博客、代码模板、题目解析三个板块
- [x] 站内搜索
- [x] 密码保护的内部区
- [ ] 更多算法模板
- [ ] 补齐历史题解

> 想参与维护？看「发布指南」页面即可上手。
