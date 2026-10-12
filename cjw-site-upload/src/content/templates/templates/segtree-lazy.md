---
title: 线段树（区间加 + 区间求和）
description: 带懒标记的线段树模板，支持区间加法与区间求和查询
category: 线段树
tags: [线段树, 懒标记, RMQ]
author: WJC
date: 2026-09-25
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 5;
int n, a[N], s[N << 2], ad[N << 2];       // s: 区间和, ad: 加标记

void pushup(int p) { s[p] = s[p << 1] + s[p << 1 | 1]; }
void apply(int p, int l, int r, int v) { s[p] += v * (r - l + 1), ad[p] += v; }
void pushdown(int p, int l, int r) {
    if (!ad[p]) return;
    int mid = (l + r) >> 1;
    apply(p << 1, l, mid, ad[p]), apply(p << 1 | 1, mid + 1, r, ad[p]);
    ad[p] = 0;
}
void build(int p, int l, int r) {
    if (l == r) { s[p] = a[l]; return; }
    int mid = (l + r) >> 1;
    build(p << 1, l, mid), build(p << 1 | 1, mid + 1, r), pushup(p);
}
void update(int p, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) { apply(p, l, r, v); return; }
    pushdown(p, l, r);
    int mid = (l + r) >> 1;
    if (ql <= mid) update(p << 1, l, mid, ql, qr, v);
    if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, v);
    pushup(p);
}
int query(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return s[p];
    pushdown(p, l, r);
    int mid = (l + r) >> 1, res = 0;
    if (ql <= mid) res += query(p << 1, l, mid, ql, qr);
    if (qr > mid) res += query(p << 1 | 1, mid + 1, r, ql, qr);
    return res;
}

signed main() {
    n = 5;
    for (int i = 1; i <= n; ++i) a[i] = i;            // 1 2 3 4 5
    build(1, 1, n);
    update(1, 1, n, 2, 4, 10);                        // 1 12 13 14 5
    cout << query(1, 1, n, 1, 5) << ' ' << query(1, 1, n, 3, 4) << '\n';   // 45 27
    return 0;
}
```

## 说明

- 区间加 + 区间求和是懒标记最经典的形态，只改 `apply`/`pushdown` 就能扩展成区间赋值、区间乘。
- 单点修改等价于长度为 1 的区间修改。
- 常数要求高时用非递归（zkw）线段树。

## 典型应用

- 洛谷 P3372【模板】线段树 1（区间加、区间和）；
- 洛谷 P3373【模板】线段树 2（加乘混合标记）；
- 配合差分思想处理区间覆盖类问题。
