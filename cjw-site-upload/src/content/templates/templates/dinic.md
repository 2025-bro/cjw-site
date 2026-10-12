---
title: Dinic 最大流（分层图 + 当前弧）
description: BFS 分层建图、DFS 多路增广并配当前弧优化，最坏 O(n^2 m)，实际远快于此
category: 网络流
tags: [网络流, Dinic, 最大流]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 5e4 + 5, M = 4e5 + 5;      // 边表按 2 * 边数 开够
const int INF = 0x3f3f3f3f3f3f3f3fLL;
int h[N], e[M], ne[M], w[M], idx;
int dep[N], cur[N], n, m, s, t;
void add(int u, int v, int c) { e[++idx] = v, w[idx] = c, ne[idx] = h[u], h[u] = idx; }
void adde(int u, int v, int c) { add(u, v, c), add(v, u, 0); }   // 成对加边，i ^ 1 是反向边
bool bfs() {                             // 分层：dep 同时充当 vis
    memset(dep, 0, sizeof(dep));
    queue<int> q;
    dep[s] = 1, q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int i = h[u]; i; i = ne[i])
            if (w[i] && !dep[e[i]]) dep[e[i]] = dep[u] + 1, q.push(e[i]);
    }
    return dep[t];                       // 汇点不可达则无增广路
}
int dfs(int u, int f) {                  // 当前弧优化：cur[u] 之前的边已榨干
    if (u == t) return f;
    for (int &i = cur[u]; i; i = ne[i]) {
        int v = e[i];
        if (w[i] && dep[v] == dep[u] + 1) {
            int d = dfs(v, min(f, w[i]));
            if (d) { w[i] -= d, w[i ^ 1] += d; return d; }
        }
    }
    return 0;
}
int dinic() {
    int flow = 0;
    while (bfs()) {
        memcpy(cur, h, sizeof(h));
        int f;
        while ((f = dfs(s, INF))) flow += f;
    }
    return flow;
}
signed main() {
    n = 4, s = 1, t = 4;
    adde(1, 2, 3); adde(1, 3, 2); adde(2, 3, 1); adde(2, 4, 2); adde(3, 4, 4);
    cout << dinic() << "\n";
    return 0;
}
```

## 说明

- 单次 BFS 分层 O(m)，每条边只可能在一层里被榨干一次，总复杂度 O(n^2 m)；单位容量二分图上为 O(m√n)。
- 反向边容量为 0，与正向边成对存储（1 和 2 互为反向），所以 `idx` 必须从 1 开始且 `adde` 中两次 `add` 不能拆开。
- 忘记当前弧优化（`cur`）或忘了 `memcpy(cur, h, ...)` 会退化到接近暴力；`for (int &i = cur[u]; ...)` 的引用写法是关键。
- `dfs` 一次只返回一条增广路的流量，靠外层 `while` 反复调用；想更快可写多路增广版本（一条流搜到底再继续）。
- `w[i]` 用 `long long` 才安全：容量可能达 1e9 且多条边相加，`int` 会溢出；`INF` 取 0x3f3f3f3f3f3f3f3f 数量级。
- 二分图匹配、最小割建模、最大权闭合子图都基于 Dinic；带上下界的可行流要在原图外加超级源汇。

## 典型应用

- 洛谷 P3376【模板】网络最大流
- 洛谷 P2756 飞行员配对方案问题（二分图匹配转最大流）
- 洛谷 P2762 太空飞行计划问题（最大权闭合子图 / 最小割）
