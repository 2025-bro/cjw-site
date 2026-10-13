# cjw-wjc-qwq 的代码小站

三人共同维护的免费个人网站：**博客 / 代码模板 / 题目解析 / 密码保护的内部区**。

- 域名：`cjw-wjc-qwq.top`（阿里云，DNS 解析到 Cloudflare Pages）
- 托管：Cloudflare Pages（免费，无服务器）
- 框架：Astro（静态生成）+ Cloudflare Pages Functions（密码鉴权）
- 内容：Markdown + Git 提交，自动构建部署

## 目录结构

```
src/content/
├── blog/        博客文章（公开）
├── templates/   代码模板（公开）
├── problems/    题目链接与解析（公开）
└── private/     内部笔记（需登录）
src/pages/       页面与路由
functions/       Cloudflare Pages Functions（登录接口 + 内部区鉴权）
public/          静态资源（图片等放这里）
```

## 本地运行

```bash
npm install
npm run dev          # 开发预览：http://localhost:4321
npm run pages:dev    # 带登录鉴权的完整预览：http://localhost:8788（密码见 .dev.vars）
npm run build        # 构建产物输出到 dist/
```

## 部署

首次部署步骤见 [DEPLOY.md](./DEPLOY.md)。

## 添加内容

在对应目录新建 `.md` 文件（开头带 frontmatter），提交即可，格式见站内「发布指南」页面。
