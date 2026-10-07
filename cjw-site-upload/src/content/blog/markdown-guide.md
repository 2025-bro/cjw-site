---
title: Markdown 排版速查：写好每一篇博客
description: 本站所有内容都用 Markdown 书写，这里汇总了常用语法和本站特有的注意事项。
date: 2026-10-02
author: WJC
tags: [Markdown, 教程]
---

## 基础语法

```md
# 一级标题（文章里建议从 ## 开始）
## 二级标题
**加粗**、*斜体*、~~删除线~~
`行内代码`
[链接文字](https://example.com)
```

列表：

```md
- 无序列表项
- 无序列表项

1. 有序列表项
2. 有序列表项
```

## 代码块

用三个反引号包住代码，并写上语言名，本站会自动高亮：

````md
```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello" << endl;
    return 0;
}
```
````

## 表格与引用

```md
| 平台 | 题号 | 难度 |
| --- | --- | --- |
| 洛谷 | P1001 | 入门 |

> 引用块：用来强调重点或引用他人的话。
```

## 本站注意事项

1. **分类字段必须来自允许列表**：`category` 只能是 数据结构 / 图论 / 数学 / 字符串 / 动态规划 / 其他；`platform` 只能是 洛谷 / Codeforces / AtCoder / LeetCode / USACO / 其他。写错了构建会失败。
2. **日期格式**：`YYYY-MM-DD`，如 `2025-06-01`。
3. **敏感信息**：只有 `private/` 目录是登录可见的，其余内容任何人（包括搜索引擎）都能看到。
4. 图片：把图片放到 `public/images/` 下，正文里用 `![](/images/xxx.png)` 引用。

掌握这些就能顺畅地给网站添砖加瓦了，快去写第一篇吧！
