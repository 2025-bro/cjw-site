# 部署指南（首次上线，全程零花费）

目标：把本仓库部署到 Cloudflare Pages，并把 `cjw-wjc-qwq.top` 解析过去。
只需要两个免费账号：**GitHub** + **Cloudflare**。不需要服务器、不需要备案、不需要花钱。

---

## 第 1 步：把代码放到 GitHub

1. 打开 https://github.com ，登录（没有就注册一个）。
2. 右上角 `+` → **New repository**：
   - Repository name：`cjw-site`（随意）；
   - 选 **Private**（私有，只有你们三人能看源码）或 Public 都行，Cloudflare Pages 两种都支持；
   - 不要勾选任何初始化选项，点 **Create repository**。
3. 上传代码（两种方式任选）：
   - **方式 A（网页上传，无需安装任何东西，推荐）**：仓库页 → **uploading an existing file** → 打开 `D:\deepseek-API-key\cjw-site-upload` 文件夹（已为你准备好，共 51 个文件，不含 node_modules 等重文件），把里面的文件**全部选中**拖进浏览器上传区 → Commit changes。
     > ⚠️ 不要上传 `website` 原目录：里面含 node_modules（上万文件）、dist、.dev.vars（本地测试密码）等，拖原目录会导致上传卡死或泄露本地配置。
   - **方式 B（Git 命令行）**：先到 https://git-scm.com/download/win 安装 Git，然后在 `website` 目录执行（.gitignore 已自动排除重文件）：

     ```bash
     git init
     git add .
     git commit -m "init site"
     git branch -M main
     git remote add origin https://github.com/<你的用户名>/cjw-site.git
     git push -u origin main
     ```

4. 之后你们三人每天更新内容：直接在 GitHub 网页上改 Markdown 文件 / 上传新文件，提交即可（也可以用方式 B 的 Git）。

---

## 第 2 步：Cloudflare Pages 部署

1. 打开 https://dash.cloudflare.com/sign-up ，注册并登录（免费计划即可）。
2. 左侧菜单 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**。
3. 授权 GitHub，选择刚才的仓库 `cjw-site`，点 **Begin setup**：
   - Framework preset：**Astro**；
   - Build command：`npm run build`；
   - Build output directory：`dist`；
4. **展开 Environment variables**，添加两个变量（点 Add variable）：

   | 变量名 | 值 | 说明 |
   | --- | --- | --- |
   | `PASSWORD` | 你们三人商量好的管理密码 | 登录内部区用 |
   | `SITE_SECRET` | 一段长随机字符串（如 `K7x#mQ2@pL9$zR5!vT8^wN3`，可多敲几下键盘） | 用于签名登录 Cookie |

5. 点 **Save and Deploy**，等待 1～3 分钟构建完成。
6. 构建完成后，页面会给你一个地址：`https://cjw-site-xxx.pages.dev`，先打开确认网站能访问、能登录（用你设置的 PASSWORD 试一次）。

---

## 第 3 步：绑定域名 cjw-wjc-qwq.top（阿里云 DNS）

> 你已打开阿里云控制台，跟着做即可。域名不需要转入 Cloudflare，只需加 CNAME 记录。

1. 回到 Cloudflare Pages 项目页面：**Custom domains** → **Set up a custom domain**，输入 `cjw-wjc-qwq.top`，Continue。
2. Cloudflare 会显示一个 CNAME 目标，形如：`cjw-site-xxx.pages.dev`（记下来）。
3. 打开阿里云控制台 → **域名** → 找到 `cjw-wjc-qwq.top` → **解析设置**（云解析 DNS）：
   - 点 **添加记录**，添加两条：

     | 记录类型 | 主机记录 | 记录值 |
     | --- | --- | --- |
     | CNAME | `@` | `cjw-site-xxx.pages.dev` |
     | CNAME | `www` | `cjw-site-xxx.pages.dev` |

   - 保存（阿里云支持 @ 主机的 CNAME，若提示冲突，删掉原有的 @ A 记录即可；TTL 默认 10 分钟）。
4. 回到 Cloudflare 的 Custom domains 页面，等状态变成 **Active**（一般几分钟到十几分钟）。
5. 浏览器访问 `https://cjw-wjc-qwq.top`，看到网站即成功。

---

## 第 4 步：日常使用

- **发博客 / 传模板 / 写题解 / 内部笔记**：在 GitHub 仓库对应目录加 `.md` 文件 → 提交 → 1～2 分钟自动上线。格式见站内「发布指南」。
- **改管理密码**：Cloudflare Pages → 项目 → Settings → Variables and Secrets → 改 `PASSWORD` → 重新部署。
- **网站代码更新**：改完代码 push 到 main，自动重新构建。

## 常见问题

- **构建失败**：去 Cloudflare Pages 的部署记录看日志，常见原因是 Markdown frontmatter 写错（category/platform/difficulty 必须在允许列表）。
- **国内访问慢 / 打不开**：Cloudflare 在国内速度一般但通常可用；若长时间异常，可后续考虑把 DNS 迁到 Cloudflare 开启加速（仍免费），或换 Vercel 备用。
- **忘记 Cloudflare 密码**：走 Cloudflare 找回流程；三人中建议至少两人知道账号密码。  在微信里。
