---
title: Kruskal 最小生成树
description: 边排序 + 并查集，O(m log m) 求最小生成树（或判断图不连通）
category: 最小生成树
tags: [MST, Kruskal, 并查集, 贪心]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
struct DSU {
    vector<int> fa, sz;
    DSU(int n) : fa(n + 1), sz(n + 1, 1) { iota(fa.begin(), fa.end(), 0); }
    int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
    bool same(int x, int y) { return find(x) == find(y); }
    void merge(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return;
        if (sz[x] < sz[y]) swap(x, y);
        fa[y] = x, sz[x] += sz[y];
    }
};

struct Edge {
    int u, v;
    long long w;
};

// 返回最小生成树总边权；图不连通返回 -1
long long kruskal(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(),
         [](const Edge& a, const Edge& b) { return a.w < b.w; });

    DSU dsu(n);
    long long total = 0;
    int used = 0;
    for (const Edge& e : edges) {
        if (dsu.same(e.u, e.v)) continue;   // 会成环，跳过
        dsu.merge(e.u, e.v);
        total += e.w;
        if (++used == n - 1) break;         // 已经选够 n-1 条边
    }
    return used == n - 1 ? total : -1;
}
```

## 说明

- 贪心正确性：边权最小的边一定在某棵最小生成树里（切割性质），所以从小到大试边、不成环就要。
- 复杂度 `O(m log m)` 主要来自排序，并查集部分近似线性。稠密图（`m ≈ n²`）可以考虑 Prim + 堆。
- 若要求**最大**生成树，把排序改成从大到小即可。
- 返回值 `-1` 表示原图不连通，此时得到的是一片生成森林。

## 典型应用

- 洛谷 P3366【模板】最小生成树；
- 洛谷 P1195 口袋的天空（生成 K 棵树最少花费）；
- 建图费用最小、合并连通块代价最小的建模题。
