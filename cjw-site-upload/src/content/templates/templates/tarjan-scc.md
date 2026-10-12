---
title: Tarjan 强连通分量与缩点
description: 一次 DFS 用 dfn/low 与栈求出所有 SCC，并把图缩成 DAG，O(n + m)
category: 强连通分量
tags: [Tarjan, 强连通分量, 缩点]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 2e5 + 5, M = 4e5 + 5;
int h[N], e[M], ne[M], idx;
int h2[N], e2[M], ne2[M], idx2;      // 缩点后的 DAG
int dfn[N], low[N], stk[N], ins[N], col[N];
int top, tim, scc, n;
void add(int u, int v) { e[++idx] = v, ne[idx] = h[u], h[u] = idx; }
void add2(int u, int v) { e2[++idx2] = v, ne2[idx2] = h2[u], h2[u] = idx2; }
void tarjan(int u) {
    dfn[u] = low[u] = ++tim;
    stk[++top] = u, ins[u] = 1;
    for (int i = h[u]; i; i = ne[i]) {
        int v = e[i];
        if (!dfn[v]) tarjan(v), low[u] = min(low[u], low[v]);
        else if (ins[v]) low[u] = min(low[u], dfn[v]);   // 已在栈中才是横叉边更新
    }
    if (low[u] == dfn[u]) {                              // u 是当前 SCC 的根
        ++scc; int v;
        do { v = stk[top--], ins[v] = 0, col[v] = scc; } while (v != u);
    }
}
void rebuild() {                      // 按 SCC 编号重建 DAG 并去重边
    vector<pair<int, int>> es;
    for (int u = 1; u <= n; u++)
        for (int i = h[u]; i; i = ne[i])
            if (col[u] != col[e[i]]) es.push_back({col[u], col[e[i]]});
    sort(es.begin(), es.end());
    es.erase(unique(es.begin(), es.end()), es.end());
    for (auto &p : es) add2(p.first, p.second);
}
signed main() {
    n = 4;
    add(1, 2); add(2, 3); add(3, 1); add(3, 4);
    for (int i = 1; i <= n; i++) if (!dfn[i]) tarjan(i);
    cout << scc << "\n";
    for (int i = 1; i <= n; i++) cout << col[i] << " \n"[i == n];
    rebuild();
    cout << idx2 << "\n";
    return 0;
}
```

## 说明

- 时间 O(n + m)，空间 O(n + m)；`col[u]` 是 u 所属 SCC 的编号，编号顺序是缩点图的逆拓扑序（先出栈的编号小），DP 时可直接从大到小。
- 只有 `ins[v]` 为真的点才用 `dfn[v]` 更新 `low[u]`；用 `low[v]` 更新是错的，会把已出栈的 SCC 错误合并。
- 缩点后必须去重边，否则后续按入度统计或 DP 会重复计数；`sort + unique` 是最省事的写法。
- 有向图才需要缩点；无向图求边双/点双要用割边、割点版本的 Tarjan（判 `low[v] > dfn[u]`）。
- 链状图上递归会爆栈，n ≥ 2e5 时把 `tarjan` 改写成手写栈的迭代版本。
- 与 Kosaraju 的取舍：Kosaraju 要正反两遍 DFS，常数更大但更好写、能顺便拿到拓扑序，Tarjan 一遍更常用。

## 典型应用

- 洛谷 P3387【模板】缩点（缩点后在 DAG 上跑最长路）
- 洛谷 P2341 [USACO03FALL / HAOI2006] 受欢迎的牛 G（缩点后统计出度为 0 的点）
- 洛谷 P2812 校园网络（缩点后统计入度/出度为 0 的个数）
