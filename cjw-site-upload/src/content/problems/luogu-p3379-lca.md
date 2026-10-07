---
title: 【模板】最近公共祖先（LCA）
platform: 洛谷
problemId: P3379
problemUrl: https://www.luogu.com.cn/problem/P3379
difficulty: 普及
tags: [LCA, 倍增, 树, 模板]
author: CJW
date: 2026-10-03
---

## 题意简述

给一棵以 `s` 为根的树，`m` 次询问两个点的最近公共祖先（LCA）。`n ≤ 5×10^5`。

## 思路：倍增法

1. 预处理 `up[u][k]`：从 `u` 往上跳 `2^k` 步到达的节点（`up[u][0]` 是父节点），以及每个点的深度 `dep`；
2. 查询 `lca(u, v)`：
   - 先把较深的 `u` 跳到和 `v` 同深度；
   - 若此时 `u == v`，返回 `u`；
   - 从大到小枚举 `k`，若 `up[u][k] != up[v][k]` 则同时上跳，最后两者都在 LCA 的正下方；
   - 返回 `up[u][0]`。

预处理 `O(n log n)`，每次查询 `O(log n)`。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 500005;
const int LOG = 20;   // 2^19 > 5e5，够用

vector<int> g[MAXN];
int dep[MAXN];
int up[MAXN][LOG];

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
    for (int k = 0; k < LOG; ++k)
        if (diff >> k & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k) {
        if (up[u][k] != up[v][k]) {
            u = up[u][k];
            v = up[v][k];
        }
    }
    return up[u][0];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, s;
    cin >> n >> m >> s;
    for (int i = 1; i < n; ++i) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }

    dfs(s, 0);   // 设 s 的父节点为 0，up[0][*] 都是 0

    while (m--) {
        int a, b;
        cin >> a >> b;
        cout << lca(a, b) << '\n';
    }
    return 0;
}
```

## 小结

- 洛谷这题 n 较大，**不能递归 dfs 太深？** 本题树可能是一条链，递归会爆栈。稳妥做法：把 dfs 改成手写栈，或用 `std::vector` 存边加 `#pragma comment(linker, "/STACK:...")`（Windows 本地）。洛谷评测一般开栈较大，但正式比赛最好掌握非递归写法。
- LCA 还有 Tarjan 离线（O(n + m)）和树剖（预处理快、常数小）等做法，倍增是最容易写对的。
