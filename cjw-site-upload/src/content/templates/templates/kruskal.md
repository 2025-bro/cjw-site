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
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 5;
int fa[N], sz[N];

int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
bool merge(int x, int y) {
    x = find(x), y = find(y);
    if (x == y) return false;
    if (sz[x] < sz[y]) swap(x, y);
    fa[y] = x, sz[x] += sz[y];
    return true;
}
struct Edge { int u, v, w; };
bool operator<(const Edge &a, const Edge &b) { return a.w < b.w; }

int kruskal(int n, vector<Edge> &e) {     // 边权和；图不连通返回 -1
    for (int i = 1; i <= n; ++i) fa[i] = i, sz[i] = 1;
    sort(e.begin(), e.end());
    int res = 0, cnt = 0;
    for (auto [u, v, w] : e) {
        if (!merge(u, v)) continue;       // 成环，跳过
        res += w;
        if (++cnt == n - 1) break;        // 已选够 n-1 条边
    }
    return cnt == n - 1 ? res : -1;
}

signed main() {
    int n = 4;
    vector<Edge> e = {{1, 2, 1}, {2, 3, 2}, {1, 3, 5}, {3, 4, 1}};
    cout << kruskal(n, e) << '\n';        // 4
    return 0;
}
```

## 说明

- 贪心正确性来自切割性质：当前最小的不成环边一定在某棵 MST 里。
- 复杂度 O(m log m) 来自排序，并查集部分近似线性；稠密图可考虑 Prim + 堆。
- 求**最大**生成树把排序改成从大到小；返回 -1 表示原图不连通（得到生成森林）。

## 典型应用

- 洛谷 P3366【模板】最小生成树；
- 洛谷 P1195 口袋的天空（生成 K 棵树的最小花费）；
- 合并连通块代价最小、建图费用最小的建模题。
