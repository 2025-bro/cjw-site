---
title: 树链剖分（路径加 + 路径求和）
description: 重链剖分把树上路径拆成 O(log n) 段连续区间，套线段树后单次操作 O(log^2 n)
category: 树链剖分
tags: [树链剖分, 线段树, LCA]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long

const int MAXN = 200005;
int n, tot;
vector<int> g[MAXN];
int a[MAXN], fa[MAXN], dep[MAXN], sz[MAXN], son[MAXN], top[MAXN], dfn[MAXN], rnk[MAXN];
int val[MAXN << 2], tag[MAXN << 2];

void dfs1(int u, int f) {                    // 求父亲、深度、子树大小、重儿子
    fa[u] = f, dep[u] = dep[f] + 1, sz[u] = 1, son[u] = 0;
    for (int v : g[u]) {
        if (v == f) continue;
        dfs1(v, u), sz[u] += sz[v];
        if (sz[v] > sz[son[u]]) son[u] = v;  // sz[0] = 0，哨兵
    }
}

void dfs2(int u, int tp) {                   // 重儿子优先，保证重链 dfn 连续
    top[u] = tp, dfn[u] = ++tot, rnk[tot] = u;
    if (son[u]) dfs2(son[u], tp);
    for (int v : g[u]) if (v != fa[u] && v != son[u]) dfs2(v, v);
}

void build(int p, int l, int r) {
    if (l == r) { val[p] = a[rnk[l]]; return; }
    int mid = (l + r) >> 1;
    build(p << 1, l, mid), build(p << 1 | 1, mid + 1, r);
    val[p] = val[p << 1] + val[p << 1 | 1];
}

void apply(int p, int l, int r, int v) { val[p] += v * (r - l + 1), tag[p] += v; }

void pushdown(int p, int l, int r) {
    if (!tag[p]) return;
    int mid = (l + r) >> 1;
    apply(p << 1, l, mid, tag[p]), apply(p << 1 | 1, mid + 1, r, tag[p]);
    tag[p] = 0;
}

void upd(int p, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) { apply(p, l, r, v); return; }
    pushdown(p, l, r);
    int mid = (l + r) >> 1;
    if (ql <= mid) upd(p << 1, l, mid, ql, qr, v);
    if (qr > mid) upd(p << 1 | 1, mid + 1, r, ql, qr, v);
    val[p] = val[p << 1] + val[p << 1 | 1];
}

int qry(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return val[p];
    pushdown(p, l, r);
    int mid = (l + r) >> 1, res = 0;
    if (ql <= mid) res += qry(p << 1, l, mid, ql, qr);
    if (qr > mid) res += qry(p << 1 | 1, mid + 1, r, ql, qr);
    return res;
}

void path_upd(int u, int v, int x) {
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        upd(1, 1, n, dfn[top[u]], dfn[u], x);
        u = fa[top[u]];
    }
    if (dep[u] > dep[v]) swap(u, v);
    upd(1, 1, n, dfn[u], dfn[v], x);         // 点权：保留 LCA
}

int path_qry(int u, int v) {
    int res = 0;
    while (top[u] != top[v]) {
        if (dep[top[u]] < dep[top[v]]) swap(u, v);
        res += qry(1, 1, n, dfn[top[u]], dfn[u]);
        u = fa[top[u]];
    }
    if (dep[u] > dep[v]) swap(u, v);
    return res + qry(1, 1, n, dfn[u], dfn[v]);
}

signed main() {
    n = 5;
    int es[][2] = {{1, 2}, {1, 3}, {2, 4}, {3, 5}};
    for (auto& e : es) g[e[0]].push_back(e[1]), g[e[1]].push_back(e[0]);
    for (int i = 1; i <= n; ++i) a[i] = i;
    dfs1(1, 0), dfs2(1, 1), build(1, 1, n);
    path_upd(4, 5, 1);
    cout << path_qry(1, 5) << ' ' << path_qry(4, 5) << '\n';   // 12 20
}
```

## 说明

- 两次 DFS：`dfs1` 求父亲、深度、子树大小、重儿子；`dfs2` 重儿子优先编号，使每条重链的 dfn 连续。
- 路径操作把 u→v 拆成 O(log n) 条重链，每条链对应一段连续 dfn，套线段树后单次 O(log^2 n)。
- 点权写法最后一步包含 LCA；边权要把权值下放到深度较大的端点，最后一步改成 `dfn[son[u]]..dfn[v]`。
- 链状树递归 `dfs1/dfs2` 会爆栈，n 到 2e5 时建议手写栈或改迭代；数组至少要开到 2e5 以上。
- 顺带能 O(log n) 求 LCA（top 相同后返回深度小的点），常数比倍增小。
- 子树操作也很方便：子树在 dfn 上是连续的 `dfn[u]..dfn[u]+sz[u]-1`；多测时 `tot`、`son[]`、线段树都要清空。

## 典型应用

- 洛谷 P3384【模板】树链剖分（路径加、路径和、子树加、子树和）；
- 洛谷 P3178 [HAOI2015] 树上操作（路径加 + 子树加与查询）；
- 洛谷 P2590 [ZJOI2008] 树的统计（路径最大值与路径和）。
