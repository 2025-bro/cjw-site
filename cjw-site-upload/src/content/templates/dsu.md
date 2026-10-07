---
title: 并查集（DSU）
description: 路径压缩 + 按大小合并，支持查询连通性与合并集合
category: 数据结构
tags: [并查集, 连通性, Kruskal]
author: CJW
date: 2026-09-22
---

## 代码

```cpp
// 需要 <vector> <numeric> <algorithm>
struct DSU {
    vector<int> fa, sz;

    DSU(int n) : fa(n + 1), sz(n + 1, 1) {
        iota(fa.begin(), fa.end(), 0);   // fa[i] = i
    }

    // 查找根，同时路径压缩
    int find(int x) {
        return fa[x] == x ? x : fa[x] = find(fa[x]);
    }

    bool same(int x, int y) {
        return find(x) == find(y);
    }

    // 按大小合并，保持树高 O(log n)
    void merge(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return;
        if (sz[x] < sz[y]) swap(x, y);
        fa[y] = x;
        sz[x] += sz[y];
    }

    // 连通块数量
    int count() {
        int res = 0;
        for (int i = 1; i < (int)fa.size(); ++i)
            if (fa[i] == i) ++res;
        return res;
    }
};
```

## 说明

- `find` 的路径压缩写法让后续查询接近 `O(1)`（均摊反阿克曼函数级别）。
- `merge` 按集合大小合并，避免退化成链。
- 下标从 1 开始（`n + 1` 大小），若从 0 开始请自行调整。

## 典型应用

- 判断无向图连通性、统计连通块数；
- Kruskal 最小生成树（配合边排序）；
- 「动态加边」的场景，如洛谷 P3367【模板】并查集。
