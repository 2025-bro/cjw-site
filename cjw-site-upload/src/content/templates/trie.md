---
title: Trie 字典树
description: 字符串前缀树模板，支持插入与查询前缀出现次数
category: 字符串
tags: [Trie, 字符串, 前缀]
author: CJW
date: 2026-09-28
---

## 代码

```cpp
// 需要 <string> <vector> <array>
// 小写字母版；大写字母 / 数字请改 SIGMA 与映射方式
struct Trie {
    static const int SIGMA = 26;

    vector<array<int, SIGMA>> ch;   // 转移边
    vector<int> cnt;                // 经过该节点的字符串数（前缀出现次数）

    Trie() {
        ch.push_back({});
        ch[0].fill(0);
        cnt.push_back(0);
    }

    void insert(const string& s) {
        int u = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!ch[u][x]) {
                ch[u][x] = (int)ch.size();
                ch.push_back({});
                ch.back().fill(0);
                cnt.push_back(0);
            }
            u = ch[u][x];
            cnt[u]++;
        }
    }

    // 查询以 s 为前缀的字符串个数
    int prefixCount(const string& s) {
        int u = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!ch[u][x]) return 0;
            u = ch[u][x];
        }
        return cnt[u];
    }
};
```

## 说明

- 空间复杂度 O(总字符数 × SIGMA)，字符串很长/很多时注意内存。
- 要判断「某字符串是否恰好插入过」，可以再加一个 `end[]` 数组在插入结束时标记。
- 01-Trie 可用来解决「最大异或对」等问题（SIGMA = 2，逐位插入二进制）。

## 典型应用

- 洛谷 P8306【模板】字典树；
- 洛谷 P4551 最长异或路径（01-Trie + 树上异或前缀）；
- 字符串自动补全、前缀匹配统计。
