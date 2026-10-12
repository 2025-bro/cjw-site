---
title: 图的存储与遍历
description: 链式前向星 / 邻接表存图，DFS 与 BFS 遍历，附连通块计数
category: 图的存储与遍历
tags: [存图, 链式前向星, DFS, BFS]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
// ---------- 写法一：链式前向星（边数大时省内存、遍历快） ----------
const int MAXN = 100005, MAXM = 400005;
int head[MAXN], nxt[MAXM], to[MAXM], w[MAXM], ecnt = 0;

void initGraph(int n) {
    fill(head, head + n + 1, 0);
    ecnt = 0;
}

// 有向边 u -> v，边权 weight；无向图调用两次
void addEdge(int u, int v, int weight = 1) {
    to[++ecnt] = v;
    w[ecnt] = weight;
    nxt[ecnt] = head[u];
    head[u] = ecnt;
}

// 遍历 u 的所有出边
void walk(int u) {
    for (int e = head[u]; e; e = nxt[e]) {
        int v = to[e], weight = w[e];
        // 处理边 (u -> v, weight)
    }
}

// ---------- 写法二：vector 邻接表（写起来最舒服） ----------
vector<vector<int>> g;   // g[u] = {v1, v2, ...}
// 使用时：g.assign(n + 1, {});  g[u].push_back(v);  g[v].push_back(u);

// ---------- DFS：求每个连通块的顶点 ----------
vector<int> order;
vector<char> vis;

void dfs(int u) {
    vis[u] = 1;
    order.push_back(u);
    for (int v : g[u]) {
        if (!vis[v]) dfs(v);
    }
}

// ---------- BFS：求无权图最短路（最少边数） ----------
vector<int> bfs(int n, const vector<vector<int>>& g, int s) {
    vector<int> dist(n + 1, -1);
    queue<int> q;
    dist[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : g[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}

signed main() {
    int n = 4, es[4][2] = {{1, 2}, {2, 3}, {1, 4}, {3, 4}};
    g.assign(n + 1, {});
    for (auto& e : es) g[e[0]].push_back(e[1]), g[e[1]].push_back(e[0]);
    vector<int> d = bfs(n, g, 1);
    for (int i = 1; i <= n; i++) cout << d[i] << " \n"[i == n];   // 0 1 2 1
    return 0;
}
```

## 说明

- 点数 `n ≤ 10^5`、边数 `m ≤ 10^5`：用 `vector` 邻接表；边数很大（如 `10^6`）或需要按边遍历：链式前向星。
- 无向图存边要加两次（`addEdge(u, v); addEdge(v, u);`），数组大小按 `2m` 开。
- 图深（链状图）时递归 DFS 会爆栈，改成手写栈或写非递归版本。
- 需要按出边权排序、或涉及反向边（网络流）时，链式前向星 + `^ 1` 取反向边更方便。

## 典型应用

- 洛谷 P5318【深基18.例3】查找文献（DFS + BFS）；
- 洛谷 P3916 图的遍历（反向建图 + BFS）；
- 统计连通块数量（配合并查集或 DFS）。
