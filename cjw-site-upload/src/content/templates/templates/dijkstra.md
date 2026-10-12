---
title: Dijkstra 最短路（堆优化）
description: 单源最短路模板，O((n+m) log n)，支持非负权图
category: 最短路
tags: [最短路, 优先队列, Dijkstra]
author: QWQ
date: 2026-09-27
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 5, INF = 1e18;
vector<pair<int, int>> g[N];              // {v, w}
int dis[N];

void dijkstra(int s) {
    fill(dis, dis + N, INF);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    dis[s] = 0, pq.push({0, s});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dis[u]) continue;         // 过期状态，跳过保证复杂度
        for (auto [v, w] : g[u])
            if (dis[v] > d + w) dis[v] = d + w, pq.push({dis[v], v});
    }
}

signed main() {
    g[1].push_back({2, 1}), g[2].push_back({3, 2}), g[1].push_back({3, 5});
    g[3].push_back({4, 1});
    dijkstra(1);
    cout << dis[3] << ' ' << dis[4] << '\n';   // 3 4
    return 0;
}
```

## 说明

- 只适用于**边权非负**的图；有负权请用 SPFA（可能被卡）或 Bellman-Ford。
- `if (d > dis[u]) continue;` 不能省：同一点可能多次入队，跳过旧状态才保证复杂度。
- 稠密图（`m ≈ n²`）时朴素 O(n²) 版本常数更小。

## 典型应用

- 洛谷 P4779【模板】单源最短路径（标准版）；
- 建反图求「所有点到某点」的最短路；
- 分层图、拆点等技巧常与 Dijkstra 结合。
