---
title: Trie 字典树
description: 字符串前缀树模板，支持插入与查询前缀出现次数
category: 字典树
tags: [Trie, 字符串, 前缀]
author: CJW
date: 2026-09-28
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;                    // 总字符数上界
int ch[N][26], cnt[N], tot = 1;           // 根为 1

void insert(const string &s) {
    int u = 1;
    for (char c : s) {
        int x = c - 'a';
        if (!ch[u][x]) ch[u][x] = ++tot;
        u = ch[u][x], ++cnt[u];           // cnt: 经过该点的串数
    }
}
int ask(const string &s) {                // 以 s 为前缀的串数，0 表示不存在
    int u = 1;
    for (char c : s) {
        int x = c - 'a';
        if (!ch[u][x]) return 0;
        u = ch[u][x];
    }
    return cnt[u];
}

signed main() {
    insert("apple"), insert("app"), insert("apply");
    cout << ask("app") << ' ' << ask("apq") << '\n';   // 3 0
    return 0;
}
```

## 说明

- 空间 O(总字符数 × 26)，串多且长时注意内存，可换成 `map` 或边表存转移。
- 再开一个 `end[]` 在插入结束时打标记，即可判断「某串是否恰好插入过」。
- 01-Trie 取 SIGMA = 2 逐位插入，可解决最大异或对。

## 典型应用

- 洛谷 P8306【模板】字典树；
- 洛谷 P4551 最长异或路径（01-Trie + 树上异或前缀）；
- 字符串自动补全、前缀匹配统计。
