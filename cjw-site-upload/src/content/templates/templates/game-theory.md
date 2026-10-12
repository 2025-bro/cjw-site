---
title: Nim 游戏与 SG 函数
description: Nim 异或判胜负 O(n)，有向图游戏 SG 记忆化搜索 O(V+E) 求胜负
category: 博弈论
tags: [博弈论, Nim, SG函数, 有向图游戏]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 1005;
vector<vector<int>> g;              // 有向图出边表
int sgv[MAXN];

// 有向图游戏 SG 值：mex{ sg(v) | u->v }
int sg(int u) {
    if (sgv[u] >= 0) return sgv[u]; // 记忆化
    bitset<MAXN> s;
    for (int v : g[u]) s[sg(v)] = true;
    int r = 0;
    while (s[r]) r++;               // 求 mex
    return sgv[u] = r;
}

int main() {
    int a[3] = {1, 2, 3}, x = 0;    // Nim：各堆异或，非零则先手必胜
    for (int v : a) x ^= v;
    cout << (x ? "win" : "lose") << '\n';       // lose

    g.resize(4);                    // 0->1,0->2,1->2,2->3
    g[0] = {1, 2}; g[1] = {2}; g[2] = {3};
    fill(sgv, sgv + 4, -1);
    for (int i = 0; i < 4; i++) cout << sg(i) << " \n"[i == 3];   // 2 0 1 0
    cout << (sg(0) ? "win" : "lose") << '\n';   // win
}
```

## 说明

- 复杂度：Nim 判胜负 `O(n)`；SG 记忆化搜索为 `O(V + E)`（每个点只算一次，`mex` 用 `bitset` 压到 `O(V/64)`）。
- Nim 结论：所有堆石子数异或和 `x != 0` 先手必胜，`x == 0` 先手必败；求第一步方案时找一堆满足 `a[i] ^ x < a[i]`，把它减到 `a[i] ^ x`。
- 多个独立游戏的和 = 各子游戏 SG 值异或，异或和非零先手必胜；单个游戏 `sg != 0` 时先手胜。
- 终点（无出边）的 `sg = mex(∅) = 0`，这是必败态，记忆化数组要初始化成 `-1` 而不是 `0`，否则会把未访问态当成必败。
- SG 函数要求博弈图是 DAG（无环）且游戏是公平组合游戏（无平局、双方走法相同、有限步结束）；有环或非公平博弈要用别的模型。
- 若游戏可拆成「每堆只和自己的数量有关」的一维局面（如取石子），可直接用规律 `sg(n) = n % (k+1)` 之类，不必建图。

## 典型应用

- 洛谷 P2197【模板】nim 游戏
- 洛谷 P1247 取火柴游戏（Nim 求第一步走法）
- 洛谷 P2575 高手过招（SG 函数 + 状压局面）
