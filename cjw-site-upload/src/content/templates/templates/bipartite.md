---
title: 二分图染色判定与匈牙利最大匹配
description: 染色法 O(n + m) 判定二分图，匈牙利算法 O(nm) 求二分图最大匹配
category: 二分图
tags: [二分图, 匈牙利算法, 最大匹配]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 505;                   // 左右部各 N 个点，匹配数不超过 N
vector<int> g[N];
int col[N], match[N], vis[N];
int n;
bool color(int s) {                  // BFS 染色：返回 false 说明不是二分图
    queue<int> q;
    col[s] = 1, q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) {
            if (!col[v]) col[v] = 3 - col[u], q.push(v);
            else if (col[v] == col[u]) return 0;   // 奇环
        }
    }
    return 1;
}
bool dfs(int u, int tag) {           // 匈牙利：给左部点 u 找增广路
    for (int v : g[u]) {
        if (vis[v] == tag) continue;             // tag 代替每轮清空 vis
        vis[v] = tag;
        if (!match[v] || dfs(match[v], tag)) { match[v] = u; return 1; }
    }
    return 0;
}
signed main() {
    n = 6;                           // 左部 1~3，右部 4~6
    auto E = [](int u, int v) { g[u].push_back(v); g[v].push_back(u); };
    E(1, 4); E(1, 5); E(2, 4); E(3, 5); E(3, 6);
    cout << color(1) << "\n";
    int res = 0, tag = 0;
    for (int i = 1; i <= n; i++) if (col[i] == 1 && dfs(i, ++tag)) res++;
    cout << res << "\n";
    return 0;
}
```

## 说明

- 判定 O(n + m)；匈牙利单次增广 O(m)，共 O(nm)，二分图最大匹配一般写这个。
- 匈牙利必须只在“左部点”上跑 `dfs`，右部点靠 `match[]` 递归回溯；不分部直接对所有点跑会得到错误结果。
- `vis` 标记的是右部点，用递增的 `tag` 代替 `memset` 可以省掉 O(n) 的清空，多组数据时尤其明显。
- `match[]` 只存右部点匹配到的左部点，方向别写反；无向边建图时左右部都会连，染色后按 `col` 过滤即可。
- 边权二分图（最大权匹配）要用 KM 算法；一般图最大匹配要用带花树，都不是匈牙利能解决的。
- Dinic 也能跑二分图最大匹配（O(m√n)），比匈牙利快，但常数与代码量更大。

## 典型应用

- 洛谷 P3386【模板】二分图最大匹配
- 洛谷 P1525 关押罪犯（二分答案 + 二分图判定）
- 洛谷 P2756 飞行员配对方案问题（输出匹配方案）
