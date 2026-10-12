---
title: 并查集（DSU）
description: 路径压缩 + 按大小合并，支持查询连通性与合并集合
category: 并查集
tags: [并查集, 连通性, Kruskal]
author: CJW
date: 2026-09-22
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
int fa[N], sz[N];

void init(int n) { for (int i = 1; i <= n; ++i) fa[i] = i, sz[i] = 1; }
int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
void merge(int x, int y) {
    x = find(x), y = find(y);
    if (x == y) return;
    if (sz[x] < sz[y]) swap(x, y);              // 按大小合并
    fa[y] = x, sz[x] += sz[y];
}
bool same(int x, int y) { return find(x) == find(y); }
int count(int n) { int r = 0; for (int i = 1; i <= n; ++i) r += fa[i] == i; return r; }

signed main() {
    int n = 4; init(n);
    merge(1, 2), merge(2, 3);
    cout << same(1, 3) << ' ' << same(1, 4) << ' ' << count(n) << '\n';   // 1 0 2
    return 0;
}
```

## 说明

- `find` 路径压缩后单次均摊接近 O(1)（反阿克曼级别）。
- `merge` 按大小合并，防止退化成链。
- 下标从 1 开始；`count` 统计根节点个数即连通块数。

## 典型应用

- 判断无向图连通性、统计连通块数；
- Kruskal 最小生成树（配合边排序）；
- 动态加边场景，如洛谷 P3367【模板】并查集。
