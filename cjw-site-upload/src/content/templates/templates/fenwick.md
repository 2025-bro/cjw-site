---
title: 树状数组（Fenwick）
description: 单点修改 + 区间查询、区间加 + 区间和，常数小、代码短
category: 树状数组
tags: [树状数组, 前缀和, 动态区间和]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 5;
int n, t1[N], t2[N];                      // t1 维护 d[i], t2 维护 d[i]*(i-1)

void add(int *t, int i, int v) { for (; i <= n; i += i & -i) t[i] += v; }
void update(int l, int r, int v) {        // 区间加 v
    add(t1, l, v), add(t1, r + 1, -v);
    add(t2, l, v * (l - 1)), add(t2, r + 1, -v * r);
}
int ask(int i) {                          // 前缀和 a[1..i]
    int s1 = 0, s2 = 0;
    for (int x = i; x > 0; x -= x & -x) s1 += t1[x], s2 += t2[x];
    return s1 * i - s2;
}
int query(int l, int r) { return ask(r) - ask(l - 1); }

signed main() {
    n = 5;                                // 初始 1 1 1 1 1
    for (int i = 1; i <= n; ++i) update(i, i, 1);
    update(2, 4, 10);                     // 1 11 11 11 1
    cout << query(1, 5) << ' ' << query(2, 3) << '\n';   // 35 22
    return 0;
}
```

## 说明

- 核心是 lowbit `i & -i`：`t[i]` 维护区间 `(i - lowbit(i), i]` 的信息。
- 单点加 + 区间和用一维树状数组即可；区间加 + 区间和要维护两个（差分思想）。
- 只能维护可减的信息（和、异或、计数），求最值请用线段树或 ST 表。

## 典型应用

- 洛谷 P3374【模板】树状数组 1（单点加、区间和）；
- 洛谷 P3368【模板】树状数组 2（区间加、单点查）；
- 逆序对计数（配合离散化）。
