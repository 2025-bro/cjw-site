---
title: SPFA 单源最短路与负环判定
description: 队列松弛求单源最短路，平均 O(km)、最坏 O(nm)，用 cnt 数组判定负环
category: 最短路
tags: [SPFA, 最短路, 负环]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 2e5 + 5, M = 4e5 + 5;
int h[N], e[M], ne[M], w[M], idx;
int dis[N], cnt[N], inq[N], n, s;
void add(int u, int v, int c) { e[++idx] = v, w[idx] = c, ne[idx] = h[u], h[u] = idx; }
bool spfa() {                           // 返回 false 表示存在负环，最短路无意义
    memset(dis, 0x3f, sizeof(dis));
    memset(cnt, 0, sizeof(cnt));
    memset(inq, 0, sizeof(inq));
    queue<int> q;
    dis[s] = 0, inq[s] = 1, q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        inq[u] = 0;
        for (int i = h[u]; i; i = ne[i]) {
            int v = e[i];
            if (dis[u] + w[i] < dis[v]) {
                dis[v] = dis[u] + w[i];
                cnt[v] = cnt[u] + 1;     // 最短路经过的边数
                if (cnt[v] >= n) return 0;   // 边数 >= n 必有负环
                if (!inq[v]) inq[v] = 1, q.push(v);
            }
        }
    }
    return 1;
}
signed main() {
    n = 4, s = 1;
    add(1, 2, 1); add(2, 3, 2); add(1, 3, 5); add(3, 4, -1);
    cout << spfa() << "\n";
    for (int i = 1; i <= n; i++) cout << dis[i] << " \n"[i == n];
    add(2, 1, -5);                       // 造出负环 1 -> 2 -> 1
    cout << spfa() << "\n";
    return 0;
}
```

## 说明

- 平均 O(km)（k 为小常数，约 2~3），最坏被网格图卡到 O(nm)；正权图请用 Dijkstra 堆优化 O(m log n)。
- `cnt[v] = cnt[u] + 1` 是最短路边数，`>= n` 说明绕了负环；用“入队次数”计数也可以，但初值必须只对起点置 0。
- 判负环时最好让所有点一开始都入队（虚拟源点），否则只能发现起点可达的负环。
- `dis` 必须用 `long long` 且 `memset(dis, 0x3f, ...)`，否则 `dis[u] + w[i]` 在松弛负边时溢出。
- 卡 SPFA 的题很常见（出题人会构造网格图），能用 SLF/LLL 优化缓解但无法根治；优先考虑 Dijkstra 或 Johnson。
- 有向图边表按 m 开，无向图按 2m 开；`inq` 数组管的是“是否在队列中”，不是“是否访问过”。

## 典型应用

- 洛谷 P3371【模板】单源最短路径（弱化版）
- 洛谷 P3385【模板】负环
- 洛谷 P5905【模板】Johnson 全源最短路（SPFA 预处理势能）
