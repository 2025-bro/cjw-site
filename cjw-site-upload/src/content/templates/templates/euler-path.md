---
title: Hierholzer 欧拉路径 / 欧拉回路
description: 栈式删边回溯求出有向图的一条欧拉路径或欧拉回路，O(n + m)
category: 欧拉路
tags: [欧拉路, Hierholzer, 有向图]
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
int din[N], dout[N], st[M], ans[M], top, acnt;
int n, m, s;
void add(int u, int v) { e[++idx] = v, ne[idx] = h[u], h[u] = idx, ++dout[u], ++din[v]; }
int findStart() {                        // 无欧拉路返回 0
    int c1 = 0, c2 = 0;
    s = 0;
    for (int i = 1; i <= n; i++) {
        if (dout[i] - din[i] == 1) ++c1, s = i;
        else if (din[i] - dout[i] == 1) ++c2;
        else if (din[i] != dout[i]) return 0;
    }
    if (!c1 && !c2) {                    // 欧拉回路：任取一个有出边的点
        for (int i = 1; i <= n; i++) if (dout[i]) return s = i;
        return 0;
    }
    return (c1 == 1 && c2 == 1) ? s : 0;
}
bool euler() {                           // Hierholzer：能走就走，无路可走才记录
    if (!findStart()) return 0;
    top = acnt = 0;
    st[++top] = s;
    while (top) {
        int u = st[top];
        if (h[u]) { int i = h[u]; h[u] = ne[i], st[++top] = e[i]; }   // 删边，每条边只用一次
        else ans[++acnt] = u, --top;                                  // 回溯时入答案（逆序）
    }
    reverse(ans + 1, ans + acnt + 1);
    return acnt == m + 1;                // 边没走完说明图不连通
}
signed main() {
    n = 4;
    add(1, 2); add(2, 3); add(3, 1); add(1, 4); add(4, 3);
    m = idx;
    cout << euler() << "\n";
    for (int i = 1; i <= acnt; i++) cout << ans[i] << " \n"[i == acnt];
    return 0;
}
```

## 说明

- 时间 O(n + m)，每条边恰好被访问一次；`st[]` 是模拟递归的栈，避免链长时爆栈。
- 有向图判定：所有点 `din == dout` 则存在欧拉回路（起点任取）；恰有一个点 `dout - din == 1`（起点）和一个点 `din - dout == 1`（终点）则存在欧拉路径；其余情况无解。
- 无向图判定把度数换成“点的度数为奇数”，且奇点必须恰好 0 或 2 个；还要用并查集或 DFS 检查所有边在同一连通块内。
- Hierholzer 得到的是逆序路径，必须 `reverse`；重边与自环都能正确处理，不需要额外去重。
- `acnt == m + 1` 这一步是连通性检查，少了它会把不连通图的“局部路径”当答案输出。
- 字典序最小的欧拉路径要求按字典序从小到大访问出边，用链式前向星时要逆序加边或用 `multiset`/排序后的邻接表。
- 入度为 0 且出度为 0 的孤立点不影响判定，但要保证 `findStart` 不会选到它们。

## 典型应用

- 洛谷 P7771【模板】欧拉路径（有向图欧拉路径）
- 洛谷 P2731 [USACO3.3] 骑马修栅栏（无向图字典序最小欧拉路）
- 洛谷 P1341 无序字母对（无向图欧拉路 + 字典序）
