---
title: 普通莫队（区间不同数个数）
description: 离线排序后移动双指针维护区间，总复杂度 O(n sqrt m)，每次增删 O(1)
category: 分块与莫队
tags: [莫队, 离线, 双指针]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 200005;
int n, m, B, cur;
int a[MAXN], cnt[MAXN], ans[MAXN];   // a[] 值域大时先离散化到 [1, n]

struct Q { int l, r, id; } q[MAXN];

bool cmp(const Q& x, const Q& y) {   // 奇偶块排序，右指针回退更少
    if (x.l / B != y.l / B) return x.l / B < y.l / B;
    return (x.l / B) & 1 ? x.r > y.r : x.r < y.r;
}

void add(int p) { if (++cnt[a[p]] == 1) ++cur; }
void del(int p) { if (--cnt[a[p]] == 0) --cur; }

void solve() {
    int l = 1, r = 0;                // 初始为空区间
    for (int i = 1; i <= m; ++i) {
        while (l > q[i].l) add(--l);
        while (r < q[i].r) add(++r);
        while (l < q[i].l) del(l++);
        while (r > q[i].r) del(r--);
        ans[q[i].id] = cur;
    }
}

int main() {
    n = 6, m = 3, B = max(1, (int)(n / sqrt(m)));
    int arr[] = {0, 1, 2, 1, 3, 2, 1};
    for (int i = 1; i <= n; ++i) a[i] = arr[i];
    q[1] = {1, 3, 1}, q[2] = {2, 5, 2}, q[3] = {1, 6, 3};
    sort(q + 1, q + m + 1, cmp), solve();
    for (int i = 1; i <= m; ++i) cout << ans[i] << ' ';   // 2 3 3
    cout << '\n';
    return 0;
}
```

## 说明

- 块长一般取 n / sqrt(m)（m 为询问个数），询问数与 n 同阶时就是 sqrt(n)，这是复杂度和常数的平衡点。
- 左指针总移动量 O(m sqrt n)，右指针在每块内单调而总移动量 O(n sqrt m)，实际跑的常数靠奇偶排序再降一半。
- 只能离线回答；强制在线的区间不同数问题要用可持久化 / 树套树等其他结构。
- `add` / `del` 必须严格配对，初始 `l = 1, r = 0` 表示空区间，指针中途不能越过 [1, n]。
- 莫队擅长维护"难删除/难合并"的信息（众数、出现次数平方和等），纯粹的区间不同数用树状数组离线做更快。
- `a[]` 值域很大时先离散化，`cnt` 数组按不同取值的个数开，否则会越界。

## 典型应用

- 洛谷 P1972 [SDOI2009] HH 的项链（区间不同数个数）；
- 洛谷 P2709 小 B 的询问（莫队模板题）；
- 洛谷 P1494 [国家集训队] 小 Z 的袜子（带计数组合的莫队）。
