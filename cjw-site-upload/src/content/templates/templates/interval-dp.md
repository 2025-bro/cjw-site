---
title: 区间 DP（石子合并，环形 / 括号匹配）
description: 按区间长度递推的石子合并 O(n^3)，含环形断链与括号匹配写法
category: 区间 DP
tags: [区间DP, 石子合并, 环形, 括号匹配]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MAXN = 105;
const int INF = 0x3f3f3f3f;

int a[2 * MAXN], s[2 * MAXN];
int f[2 * MAXN][2 * MAXN], g[2 * MAXN][2 * MAXN];   // f 最小代价，g 最大代价

int stone(int n) {                                  // 环形：断成 2n 的链，取长度为 n 的窗口
    int m = n * 2;
    for (int i = 1; i <= m; ++i) s[i] = s[i - 1] + a[i];
    for (int i = 1; i <= m; ++i) f[i][i] = g[i][i] = 0;
    for (int len = 2; len <= n; ++len)
        for (int l = 1; l + len - 1 <= m; ++l) {
            int r = l + len - 1;
            f[l][r] = INF; g[l][r] = -INF;
            for (int k = l; k < r; ++k) {                // 最后一次合并的分界
                f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r]);
                g[l][r] = max(g[l][r], g[l][k] + g[k + 1][r]);
            }
            f[l][r] += s[r] - s[l - 1];                  // 合并总代价就是区间和
            g[l][r] += s[r] - s[l - 1];
        }
    int mn = INF, mx = -INF;                             // 枚举环的断点
    for (int l = 1; l <= n; ++l) {
        mn = min(mn, f[l][l + n - 1]);
        mx = max(mx, g[l][l + n - 1]);
    }
    cout << "min = " << mn << ", max = " << mx << '\n';
    return mn;
}

int paren(const string &s) {        // 最长合法括号子序列长度，O(n^2)
    int n = s.size();
    static int d[MAXN][MAXN];
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j) d[i][j] = 0;
    for (int len = 2; len <= n; ++len)
        for (int l = 0; l + len <= n; ++l) {
            int r = l + len - 1;
            if ((s[l] == '(' && s[r] == ')') || (s[l] == '[' && s[r] == ']'))
                d[l][r] = d[l + 1][r - 1] + 2;
            for (int k = l; k < r; ++k)
                d[l][r] = max(d[l][r], d[l][k] + d[k + 1][r]);
        }
    return d[0][n - 1];
}

signed main() {
    int n = 4, w[5] = {0, 4, 5, 9, 4};
    for (int i = 1; i <= n; ++i) { a[i] = w[i]; a[i + n] = w[i]; }
    stone(n);
    cout << "paren = " << paren("()[]") << '\n';         // 4
    return 0;
}
```

## 说明

- 区间 DP 三件套：**枚举区间长度 → 枚举左端点 → 枚举分界点 `k`**，用长度而不是左右端点做最外层，保证子区间已经算好。
- 一次合并的代价是区间和时，只在最外层加一次 `s[r] - s[l-1]`，不要写进 `k` 的循环里重复加。
- **环形**的两种写法：断成 `2n` 的链取长度 `n` 的窗口（上面这种），或直接令 `r` 越界时取模；前者更好写也不易错。
- 求最大代价时初值要设 `-INF`（`0` 会在负权时出错），求最小设 `INF`。
- `O(n^3)` 只能撑到 `n ≈ 500`；`n` 到 `10^5` 时石子合并要用 Garsia–Wachs 或四边形不等式优化。
- 括号匹配若只要求**长度**可以用栈做到 `O(n)`，上面 `O(n^2)` 的写法是为了顺便求最长合法**子序列**（不要求连续）。

## 典型应用

- 洛谷 P1880 [NOI1995] 石子合并（环形区间 DP 模板）；
- 洛谷 P4170 [CQOI2007] 涂色（区间 DP 计数）；
- 洛谷 P3205 [HNOI2010] 合唱队（区间 DP 计数方案数）。
