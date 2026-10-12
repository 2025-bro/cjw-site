---
title: 归并排序与逆序对
description: 归并排序模板，并在合并过程中顺手统计逆序对，复杂度 O(n log n)
category: 排序
tags: [归并排序, 逆序对, 分治]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 5;
int n, a[N], tmp[N], inv;

void msort(int l, int r) {
    if (l >= r) return;
    int mid = (l + r) >> 1;
    msort(l, mid); msort(mid + 1, r);
    int i = l, j = mid + 1, k = l;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];       // 取等号放前面才是稳定排序
        else inv += mid - i + 1, tmp[k++] = a[j++];  // a[i..mid] 全都比 a[j] 大
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (int t = l; t <= r; t++) a[t] = tmp[t];
}

signed main() {
    n = 6;
    int b[6] = {5, 2, 4, 6, 1, 3};
    for (int i = 1; i <= n; i++) a[i] = b[i - 1];
    inv = 0; msort(1, n);
    for (int i = 1; i <= n; i++) cout << a[i] << " \n"[i == n];
    cout << "逆序对: " << inv << "\n";
    return 0;
}
```

## 说明

- 复杂度：时间 O(n log n)，空间 O(n)（`tmp` 辅助数组）。逆序对统计不增加额外复杂度。
- 逆序对的核心是 `inv += mid - i + 1`：右段元素 `a[j]` 出队时，左段剩下的 `a[i..mid]` 都比它大且下标更小，正好构成这么多逆序对。
- 判断必须写 `a[i] <= a[j]` 取左段，`<` 会漏算相等元素导致的逆序对数；`inv` 和下标都要开 long long（最坏 n(n-1)/2 ≈ 5e9）。
- 归并排序是稳定排序；求「逆序对」时也常直接 `sort` 后树状数组/归并两种写法，n ≤ 5e5 时归并更快更省内存。
- 与树状数组求逆序对取舍：需要离散化且常数大；归并天然支持任意可比较类型、不要求值域，缺点是要 O(n) 额外空间。
- 递归深度只有 O(log n)，不会爆栈；`tmp` 必须放全局或传参，别在递归里开数组。

## 典型应用

- 洛谷 P1908 逆序对（归并排序或树状数组统计逆序对）
- 洛谷 P1177 【模板】快速排序（归并排序可用于卡快排的构造数据）
- 洛谷 P1966 [NOIP2013] 火柴排队（排序映射后转成逆序对计数）
