---
title: 内部区使用说明
date: 2026-10-01
author: CJW
---

## 这里是干什么的

这个目录（`src/content/private/`）下的笔记只有**登录后**才能看到，适合放：

- 未完成的草稿；
- 比赛账号、邀请码等敏感信息；
- 只有我们三个需要知道的计划与安排。

> ⚠️ 其它目录（blog / templates / problems）都是公开的，任何人都能看，别把密码贴过去。

## 怎么新增笔记

在 `src/content/private/` 下新建 `.md` 文件，开头写：

```md
---
title: 笔记标题
date: 2026-10-01
author: CJW
---
```

提交后 1～2 分钟自动出现在内部区列表里。

## 管理密码在哪改

Cloudflare 控制台 → Pages → 本项目 → Settings → Variables and Secrets → 修改 `PASSWORD`，重新部署生效。

## 约定

- 三人共用同一个管理密码，别外传；
- 谁写的笔记标注自己的 author；
- 公开内容一律走 public 目录，内部区只放私密内容。
