---
title: 树上差分（点差分 / 边差分）
description: 配合倍增 LCA 把一次路径修改压成 4 次差分标记，总复杂度 O((n + m) log n)
category: 树上问题
tags: [树上差分, LCA, 倍增]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 2e5 + 5, M = 4e5 + 5, LOG = 19;   // 2^18 > 2e5
int h[N], e[M], ne[M], idx;
int dep[N], up[N][LOG], pd[N], ed[N];
int n;
void add(int u, int v) { e[++idx] = v, ne[idx] = h[u], h[u] = idx; }
void dfs(int u, int f) {
    dep[u] = dep[f] + 1, up[u][0] = f;
    for (int k = 1; k < LOG; k++) up[u][k] = up[up[u][k - 1]][k - 1];
    for (int i = h[u]; i; i = ne[i]) if (e[i] != f) dfs(e[i], u);
}
int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    int dt = dep[u] - dep[v];
    for (int k = 0; k < LOG; k++) if (dt >> k & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; k--)
        if (up[u][k] != up[v][k]) u = up[u][k], v = up[v][k];
    return up[u][0];
}
void pointAdd(int u, int v) {            // 点差分：u 到 v 路径上每个点 +1
    int w = lca(u, v);
    pd[u]++, pd[v]++, pd[w]--, pd[up[w][0]]--;
}
void edgeAdd(int u, int v) {             // 边差分：u 到 v 路径上每条边 +1
    int w = lca(u, v);
    ed[u]++, ed[v]++, ed[w] -= 2;
}
void pushUp(int u, int f) {              // 自底向上合并，把标记还到点上/边上
    for (int i = h[u]; i; i = ne[i]) {
        int v = e[i];
        if (v != f) pushUp(v, u), pd[u] += pd[v], ed[u] += ed[v];
    }
}
signed main() {
    n = 5;                               // 树：1-2, 1-3, 2-4, 2-5
    add(1, 2); add(2, 1); add(1, 3); add(3, 1); add(2, 4); add(4, 2); add(2, 5); add(5, 2);
    dfs(1, 0);
    pointAdd(4, 5), edgeAdd(4, 5);
    pushUp(1, 0);
    cout << lca(4, 5) << "\n";
    for (int i = 1; i <= n; i++) cout << pd[i] << " \n"[i == n];
    for (int i = 1; i <= n; i++) cout << ed[i] << " \n"[i == n];
    return 0;
}
```

## 说明

- 预处理倍增 O(n log n)，每次路径修改 O(log n)，最后一遍 DFS 合并 O(n)；m 次修改总 O((n + m) log n)。
- 点差分：`pd[u]++ pd[v]++ pd[w]-- pd[up[w][0]]--`（w = LCA）；合并后 `pd[x]` 就是覆盖点 x 的路径条数。
- 边差分：`ed[u]++ ed[v]++ ed[w] -= 2`；合并后 `ed[x]` 表示边 (x, parent[x]) 被覆盖的次数，根的 `ed` 恒为 0。
- 边差分只能对“点权化”后的边统计，根节点没有入边；若 LCA 就是端点之一，回退量与端点重合也不会多算，公式照用。
- 点差分的两条 LCA 回退容易漏掉 `pd[up[w][0]]--`（只有一条路径时看不出来，多条路径时答案偏大）。
- 需要“路径赋值/查单点历史值”这类操作树上差分无能为力，要用树链剖分或 LCT。
- 链状树递归 `dfs` 会爆栈，n 很大时改成手写栈。

## 典型应用

- 洛谷 P3128 [USACO15DEC] Max Flow P（边/点差分求最大覆盖次数）
- 洛谷 P3258 [JLOI2014] 松鼠的新家（点差分统计每个点访问次数）
- 洛谷 P1600 天天爱跑步（路径拆分 + 树上差分统计）
