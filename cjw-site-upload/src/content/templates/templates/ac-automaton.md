---
title: AC 自动机（多模式串匹配）
description: Trie + fail 指针，O(Σ|s| + |t|) 统计每个模式串在文本中的出现次数
category: AC 自动机
tags: [字符串, Trie, fail指针, 多模式匹配]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 5;
int tr[N][26], fail[N], c[N], cnt[N], q[N], tot;

void insert(const string& s) {
    int u = 0;
    for (char ch : s) {
        int e = ch - 'a';
        if (!tr[u][e]) tr[u][e] = ++tot;
        u = tr[u][e];
    }
    c[u]++;                                  // 同一模式串重复出现只算一次，第二个参数可控制
}

void build() {
    int h = 0, t = 0;
    for (int e = 0; e < 26; ++e)
        if (tr[0][e]) q[++t] = tr[0][e];
    while (h < t) {
        int u = q[++h];
        for (int e = 0; e < 26; ++e) {
            int v = tr[u][e];
            if (v) fail[v] = tr[fail[u]][e], q[++t] = v;
            else tr[u][e] = tr[fail[u]][e];  // 失配路径压成 Trie 图
        }
    }
}

// 文本 t 扫一遍，把经过的节点打标记
void query(const string& t) {
    for (int i = 0, u = 0; i < (int)t.size(); ++i) {
        u = tr[u][t[i] - 'a'];
        cnt[u]++;                            // 只记终点，沿 fail 的贡献在 count 中累加
    }
}

// 按 fail 树自底向上累加，得到每个节点的出现次数
void count() {
    for (int i = tot; i >= 1; --i) cnt[fail[q[i]]] += cnt[q[i]];
}

int main() {
    insert("a");
    insert("ab");
    insert("bab");
    build();
    query("ababa");
    count();
    int u = 0;
    for (char ch : string("bab")) u = tr[u][ch - 'a'];
    cout << cnt[u] << '\n';
    u = 0;
    for (char ch : string("ab")) u = tr[u][ch - 'a'];
    cout << cnt[u] << '\n';
    return 0;
}
```

## 说明

- 建 Trie 时在模式串结尾打标记，`fail[u]` 指向「`u` 代表的串的最长真后缀」所在节点，按 BFS 逐层求，保证 `tr[fail[u]][e]` 已经算好。
- 把失配边补全成 Trie 图（`else tr[u][e] = tr[fail[u]][e]`）后，匹配过程不用跳 `while`，一次扫描即 `O(|t|)`。
- 朴素做法对每个节点沿 `fail` 链跳是 `O(|t|·√Σ|s|)` 最坏；正确姿势是只在终点 `cnt[u]++`，最后按 BFS 序（`tot → 1`，即 fail 树自底向上）累加一次即可。
- `cnt[q[i]]` 的累加依赖 BFS 序：`q` 中父节点一定在子节点之前、深度不降，所以倒序枚举就是自底向上。
- 求「哪些模式串出现」用 `c[u]` 与累加值判断；求字典序最小的出现位置需在 `insert` 时记录串编号与长度。

## 典型应用

- 洛谷 P3808【模板】AC 自动机（简单版，是否出现）；
- 洛谷 P3796【模板】AC 自动机（加强版，出现次数并输出串）；
- 洛谷 P5357【模板】AC 自动机（二次加强版，fail 树累加）。
