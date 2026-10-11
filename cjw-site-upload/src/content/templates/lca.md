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
const int MAXN = 500005;
const int LOG = 20;          // 2^19 > 5e5，按 n 调整

vector<int> g[MAXN];
int dep[MAXN];
int up[MAXN][LOG];           // up[u][k]：u 向上跳 2^k 步到的点

void dfs(int u, int fa) {
    up[u][0] = fa;
    for (int k = 1; k < LOG; ++k)
        up[u][k] = up[up[u][k - 1]][k - 1];
    for (int v : g[u]) {
        if (v == fa) continue;
        dep[v] = dep[u] + 1;
        dfs(v, u);
    }
}

int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    int diff = dep[u] - dep[v];
    for (int k = 0; k < LOG; ++k)          // 先跳到同一深度
        if (diff >> k & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k)     // 一起上跳，停在 LCA 下方
        if (up[u][k] != up[v][k]) {
            u = up[u][k];
            v = up[v][k];
        }
    return up[u][0];
}

// 树上两点距离（边权为 1 时）：dist(u,v) = dep[u] + dep[v] - 2 * dep[lca(u,v)]
```

## 说明

- 根节点的 `up[root][*]` 都是 0，所以要把 0 号点当哨兵（`dep[0] = 0`，不参与答案）。
- 树是链状时递归 DFS 会爆栈，n 很大时改手写栈（或把 `dfs` 写成非递归）。
- 还有 Tarjan 离线 LCA（`O(n + m)`，常数小但必须离线）和树链剖分 LCA（预处理更快），倍增是最不容易写错的。
- 若边权不为 1，把 `dep` 换成到根的加权距离，答案公式不变。

## 典型应用

- 洛谷 P3379【模板】最近公共祖先（LCA）；
- 树上路径统计（配合树上差分 / 树链剖分）；
- 求树上两点距离、判断祖先关系（`lca(u,v) == u` 说明 u 是 v 的祖先）。
