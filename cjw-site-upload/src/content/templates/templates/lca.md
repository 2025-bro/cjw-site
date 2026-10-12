---
title: 倍增 LCA（最近公共祖先）
description: 预处理 O(n log n)、单次查询 O(log n)，附带树上两点距离
category: 树上问题
tags: [LCA, 倍增, 树上距离]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 5e5 + 5, LOG = 20;          // 2^19 > 5e5，按 n 调整
vector<int> g[N];
int dep[N], up[N][LOG];                   // up[u][k]: u 向上跳 2^k 步

void dfs(int u, int fa) {
    up[u][0] = fa, dep[u] = dep[fa] + 1;
    for (int k = 1; k < LOG; ++k) up[u][k] = up[up[u][k - 1]][k - 1];
    for (int v : g[u])
        if (v != fa) dfs(v, u);
}
int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    int d = dep[u] - dep[v];
    for (int k = 0; k < LOG; ++k)         // 先跳到同深度
        if (d >> k & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k)    // 一起上跳，停在 LCA 下方
        if (up[u][k] != up[v][k]) u = up[u][k], v = up[v][k];
    return up[u][0];
}
int dist(int u, int v) { int w = lca(u, v); return dep[u] + dep[v] - 2 * dep[w]; }

signed main() {
    g[1] = {2, 3}, g[2] = {4, 5}, g[3] = {6};
    dfs(1, 0);
    cout << lca(4, 5) << ' ' << lca(4, 6) << ' ' << dist(4, 6) << '\n';   // 2 1 4
    return 0;
}
```

## 说明

- 0 号点当哨兵（`dep[0] = 0`，`up[0][*] = 0`），所以根的父亲传 0。
- 树退化成链时递归 DFS 会爆栈，n 很大时改手写栈。
- 边权不为 1 时把 `dep` 换成到根的加权距离，`dist` 公式不变。
- 另有 Tarjan 离线 LCA（O(n + m)，必须离线）和树剖 LCA（预处理更快），倍增最不容易写错。

## 典型应用

- 洛谷 P3379【模板】最近公共祖先（LCA）；
- 树上路径统计（配合树上差分 / 树链剖分）；
- 求树上两点距离、判断祖先关系（`lca(u,v) == u` 说明 u 是 v 的祖先）。
