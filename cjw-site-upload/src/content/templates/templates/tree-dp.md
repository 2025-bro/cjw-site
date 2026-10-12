---
title: 树形 DP（最大权独立集 + 树的直径）
description: 后序遍历式树形 DP，O(n) 求最大权独立集与树的直径（两遍 DFS / 树形 DP）
category: 树形 DP
tags: [树形DP, 最大权独立集, 树的直径, DFS]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MAXN = 100005;

int n;
vector<int> g[MAXN];
int w[MAXN], d1[MAXN], d2[MAXN];   // 子树内向下最长 / 次长链（点数计边数）
int dp[MAXN][2];                   // dp[u][0] 不选 u，dp[u][1] 选 u
int dia;

void dfs(int u, int fa) {          // 一趟 DFS 同时算两个东西
    dp[u][0] = 0;
    dp[u][1] = w[u];
    d1[u] = d2[u] = 0;
    for (int v : g[u]) {
        if (v == fa) continue;
        dfs(v, u);
        dp[u][0] += max(dp[v][0], dp[v][1]);   // u 不选，儿子随意
        dp[u][1] += dp[v][0];                  // u 选了，儿子不能选
        int t = d1[v] + 1;                     // 用最长链更新次长链，顺序不能反
        if (t > d1[u]) { d2[u] = d1[u]; d1[u] = t; }
        else if (t > d2[u]) d2[u] = t;
    }
    dia = max(dia, d1[u] + d2[u]);             // 经过 u 的最长路径
}

int diam2(int root) {              // 写法二：从任意点找最远点 s，再从 s 找最远距离
    auto bfs = [&](int s) {
        vector<int> d(n + 1, -1);
        queue<int> q; q.push(s); d[s] = 0;
        int far = s;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (d[u] > d[far]) far = u;
            for (int v : g[u]) if (d[v] < 0) { d[v] = d[u] + 1; q.push(v); }
        }
        return make_pair(far, d[far]);
    };
    int s = bfs(root).first;
    return bfs(s).second;
}

signed main() {
    n = 7;
    int e[6][2] = {{1,2},{1,3},{2,4},{2,5},{3,6},{3,7}};
    int ww[8] = {0, 3, 2, 5, 4, 1, 6, 7};
    for (int i = 1; i <= n; ++i) w[i] = ww[i];
    for (auto &x : e) { g[x[0]].push_back(x[1]); g[x[1]].push_back(x[0]); }
    dfs(1, 0);
    cout << "MWIS = " << max(dp[1][0], dp[1][1]) << '\n';   // 18
    cout << "diam = " << dia << " / " << diam2(1) << '\n';  // 3 / 3
    return 0;
}
```

## 说明

- 树形 DP 的骨架就是**后序 DFS**：先递归到儿子，回到 `u` 时儿子的答案已经算好，再合并到 `u`。
- 独立集的取舍：选 `u` 时儿子必须不选（`dp[u][1] += dp[v][0]`），不选 `u` 时儿子选不选都行（取 `max`）。
- 直径的树形 DP 只需维护**最长链 `d1` 和次长链 `d2`**，答案是所有 `d1[u] + d2[u]` 的最大值；两遍 DFS 只适用于非负边权。
- 边权可正可负（或需要在线的直径查询）时用树形 DP，或者更通用的树链剖分 / 点分治。
- 若给的是**边权**而不是点权：独立集改成把边权挂到儿子点上，直径把 `+1` 换成 `+ 边权`。
- `n` 达到 `10^5` 以上的链会爆递归栈（Windows 默认约 1MB），改手写栈或加上 `n` 更大时用 BFS 版。

## 典型应用

- 洛谷 P1352 没有上司的舞会（树上最大权独立集模板）；
- 洛谷 P1122 最大子树和（带负权的树形 DP）；
- 洛谷 P3304 [SDOI2013] 直径（求直径并统计所有直径的交）。
