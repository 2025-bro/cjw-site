---
title: Kahn 拓扑排序（入度法）
description: 不断取出零入度点并删边，O(n + m) 求出拓扑序，同时可判断有向图是否有环
category: 拓扑排序
tags: [拓扑排序, Kahn, 判环]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 2e5 + 5, M = 4e5 + 5;
int h[N], e[M], ne[M], idx;          // 链式前向星，idx 从 1 开始
int deg[N], ans[N], n, cnt;
void add(int u, int v) { e[++idx] = v, ne[idx] = h[u], h[u] = idx; }
bool topo() {                        // 返回 false 说明有环，不存在拓扑序
    queue<int> q;
    for (int i = 1; i <= n; i++) if (!deg[i]) q.push(i);
    cnt = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        ans[++cnt] = u;
        for (int i = h[u]; i; i = ne[i])
            if (--deg[e[i]] == 0) q.push(e[i]);
    }
    return cnt == n;                 // 出队点数不足 n 即有环
}
signed main() {
    n = 6;
    add(1, 2); add(1, 3); add(2, 4); add(3, 4); add(4, 5); add(5, 6);
    deg[2]++; deg[3]++; deg[4] += 2; deg[5]++; deg[6]++;
    cout << topo() << "\n";
    for (int i = 1; i <= cnt; i++) cout << ans[i] << " \n"[i == cnt];
    return 0;
}
```

## 说明

- 时间 O(n + m)，空间 O(n + m)；`topo()` 返回值就是“无环”判定，`cnt < n` 时剩下的点都在环上或依赖环。
- 入队顺序决定拓扑序：用 `queue` 是字典序无关的任意序，用 `priority_queue` 可得字典序最小/最大拓扑序（多一个 log）。
- 必须先把所有入度为 0 的点入队，不能只从 1 号点开始；图不连通时漏入队会导致误判有环。
- 删边就是 `--deg[v]`，会破坏 `deg` 数组，只能跑一次，需要复用就备份。
- 与 DFS 拓扑排序的取舍：DFS 版本顺带能求环上点、代码略长；Kahn 直观且天然判环，竞赛里优先。
- 编号从 1 到 n 时注意数组开 n + 1，`idx` 从 1 开始便于 `i` 作终止条件。

## 典型应用

- 洛谷 P1113 杂务（DAG 上最长路 + 拓扑序）
- 洛谷 P1347 排序（边加边判环与唯一性）
- 洛谷 P4017 最大食物链计数（拓扑序上 DP）
