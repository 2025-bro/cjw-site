---
title: Dijkstra 最短路（堆优化）
description: 单源最短路模板，O((n+m) log n)，支持非负权图
category: 图论
tags: [最短路, 优先队列, Dijkstra]
author: QWQ
date: 2026-09-27
---

## 代码

```cpp
// 需要 <vector> <queue>，using ll = long long;
const ll INF = 1e18;

// g: 邻接表，g[u] 存放 {v, w}（u -> v，边权 w）
// 返回 dist[1..n]，dist[i] 为 s 到 i 的最短距离，不可达为 INF
vector<ll> dijkstra(int n, const vector<vector<pair<int, ll>>>& g, int s) {
    vector<ll> dist(n + 1, INF);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    dist[s] = 0;
    pq.emplace(0, s);
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;          // 过期状态，跳过
        for (auto [v, w] : g[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.emplace(dist[v], v);
            }
        }
    }
    return dist;
}
```

## 说明

- 只适用于**边权非负**的图；有负权请用 SPFA（可能被卡）或 Bellman-Ford。
- `if (d > dist[u]) continue;` 这行很重要：同一个点可能被多次入队，跳过旧状态保证复杂度。
- 稠密图（`m ≈ n²`）时朴素 O(n²) 版本可能更快。

## 典型应用

- 洛谷 P4779【模板】单源最短路径（标准版）；
- 建反图求「所有点到某点」的最短路；
- 分层图、拆点等技巧常与 Dijkstra 结合。
