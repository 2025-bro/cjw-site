---
title: 差分约束系统（不等式转最短路）
description: 把 x_v - x_u <= c 建成 u -> v 权 c 的边跑最短路，SPFA 判无解，O(nm)
category: 差分约束
tags: [差分约束, SPFA, 最短路建模]
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
int dis[N], cnt[N], vis[N], n;
void add(int u, int v, int c) { e[++idx] = v, w[idx] = c, ne[idx] = h[u], h[u] = idx; }
// 约束 x[v] - x[u] <= c  =>  add(u, v, c)
// 约束 x[v] - x[u] >= c  =>  add(v, u, -c)
bool spfa(int s) {                       // 返回 false 表示约束冲突（负环）
    memset(dis, 0x3f, sizeof(dis));
    memset(cnt, 0, sizeof(cnt));
    memset(vis, 0, sizeof(vis));
    queue<int> q;
    dis[s] = 0, vis[s] = 1, q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        vis[u] = 0;
        for (int i = h[u]; i; i = ne[i]) {
            int v = e[i];
            if (dis[u] + w[i] < dis[v]) {
                dis[v] = dis[u] + w[i];
                cnt[v] = cnt[u] + 1;
                if (cnt[v] > n) return 0;   // 松弛链长超过点数 => 负环
                if (!vis[v]) vis[v] = 1, q.push(v);
            }
        }
    }
    return 1;
}
signed main() {
    n = 3;                               // 求 x1..x3 的一组可行解
    add(1, 2, 3); add(2, 3, -2); add(3, 1, 5);
    for (int i = 1; i <= n; i++) add(0, i, 0);   // 超级源点，保证每个点都可达
    cout << spfa(0) << "\n";
    for (int i = 1; i <= n; i++) cout << dis[i] << " \n"[i == n];
    add(3, 1, -7);                       // 与前面约束冲突，形成负环
    cout << spfa(0) << "\n";
    return 0;
}
```

## 说明

- 建图后从超级源点 0 跑一遍最短路，`dis[i]` 就是一组可行解；有负环则原不等式组无解，返回 false。
- 三种常见形式：`x_v - x_u <= c` 建 `u -> v` 权 c；`x_v - x_u >= c` 等价于 `x_u - x_v <= -c`，建 `v -> u` 权 -c；`x_u = x_v` 拆成两条反向边权 0。
- 求最大值用最短路（`<=` 约束），求最小值用最长路（`>=` 约束），两种写法不要混用。
- 超级源点必须连到每个点（边权 0），否则不连通的点 `dis` 仍是 INF，输出的是垃圾值。
- 明确要求解全为正/非负时，用最长路版本并把源点初值设为 0，同时注意先加“x_i >= 1”这类约束。
- 复杂度 O(nm)（SPFA 最坏），点数大且无负权时可用 Dijkstra + 拓扑序优化；实在被卡就用带势能的 Johnson。
- `dis` 与 `w` 都要 `long long`：`dis[u] + w[i]` 可能累加出很大负数。

## 典型应用

- 洛谷 P5960【模板】差分约束算法
- 洛谷 P3275 [SCOI2011] 糖果（最长路 + 超级源点，n 大要卡 SPFA）
- 洛谷 P1993 小 K 的农场（三种约束的建图）
