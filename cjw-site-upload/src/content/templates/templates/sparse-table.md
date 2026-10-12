---
title: ST 表（RMQ 区间最值）
description: 静态区间最值查询，O(n log n) 预处理、O(1) 单次询问，不支持修改
category: ST 表
tags: [ST表, RMQ, 倍增]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 200005, LOG = 18;   // 2^17 < 2e5 < 2^18，按 n 调 LOG
int n, a[MAXN], lg[MAXN];
int st[LOG][MAXN];                   // st[k][i]: [i, i+2^k-1] 的最值

void build() {
    for (int i = 2; i <= n; ++i) lg[i] = lg[i >> 1] + 1;
    for (int i = 1; i <= n; ++i) st[0][i] = a[i];
    for (int k = 1; k < LOG; ++k)
        for (int i = 1; i + (1 << k) - 1 <= n; ++i)
            st[k][i] = max(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
}

int ask(int l, int r) {              // 闭区间 [l, r] 最大值
    int k = lg[r - l + 1];
    return max(st[k][l], st[k][r - (1 << k) + 1]);
}

int main() {
    n = 8;
    int arr[] = {0, 3, 1, 4, 1, 5, 9, 2, 6};
    for (int i = 1; i <= n; ++i) a[i] = arr[i];
    build();
    cout << ask(2, 5) << ' ' << ask(1, 8) << ' ' << ask(6, 6) << '\n';   // 5 9 9
    return 0;
}
```

## 说明

- 预处理 O(n log n)、单次询问 O(1)、空间 O(n log n)；`LOG` 必须满足 2^LOG > n，否则越界。
- 只能用于"可重复贡献"的运算（max / min / gcd / 按位与或），因为查询的两段允许重叠；区间和不行，用前缀和。
- 查询用两个长度 2^k 的块覆盖 [l, r]，k 取 `lg[r-l+1]`，两块并集恰好盖住整段且可以重叠。
- `lg` 数组必须预处理到 n，`lg[1] = 0` 不能漏；直接用 `log2()` 算会有浮点误差。
- 带修改就只能换线段树 / 树状数组；静态 RMQ 场景下 ST 表常数最小、代码最短。
- `st[k][i]` 的第一维放 k 比 `st[i][k]` 缓存更友好，开数组时别写反。

## 典型应用

- 洛谷 P3865【模板】ST 表 & RMQ 问题；
- 洛谷 P2880 [USACO07JAN] Balanced Lineup G（区间极差）；
- 洛谷 P1816 忠诚（静态区间最小值）。
