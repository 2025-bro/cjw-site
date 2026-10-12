---
title: 枚举与模拟
description: 全排列 next_permutation、二进制枚举子集、DFS 枚举组合，暴力题的标准写法
category: 枚举与模拟
tags: [枚举, 模拟, 全排列, 子集枚举]
author: 通用
date: 2026-10-12
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 15;
int n = 4, a[N] = {0, 3, 1, 4, 2};

int main() {
    // 1) next_permutation 枚举全排列（必须先排序才不重不漏）
    sort(a + 1, a + n + 1);
    int cnt = 0;
    do { cnt++; } while (next_permutation(a + 1, a + n + 1));
    cout << "n! = " << cnt << '\n';                       // 24

    // 2) 二进制枚举子集：mask 的第 i 位表示是否选第 i 个元素
    int sum = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int s = 0;
        for (int i = 0; i < n; i++) if (mask >> i & 1) s += a[i + 1];
        sum += s;
    }
    cout << "所有子集元素和之和 = " << sum << '\n';        // 每个元素出现 2^(n-1) 次

    // 3) DFS 枚举组合 C(n, k)
    int k = 2, ways = 0;
    function<void(int, int)> dfs = [&](int start, int picked) {
        if (picked == k) { ways++; return; }
        for (int i = start; i <= n; i++) dfs(i + 1, picked + 1);
    };
    dfs(1, 0);
    cout << "C(4,2) = " << ways << '\n';                  // 6
    return 0;
}
```

## 说明

- 枚举的复杂度就是状态数：全排列 `O(n!)`、子集 `O(2^n)`、组合 `C(n,k)`，一般只适合 `n ≤ 20`（子集）或 `n ≤ 8`（全排列）。
- 想枚举**所有排列**又不想去重，必须先 `sort`；`next_permutation` 返回 `false` 说明已到最后一个排列。
- 二进制枚举时，判断第 `i` 位用 `mask >> i & 1`，枚举所有子集还有一个常用写法 `for (int s = m; s; s = (s - 1) & m)`（只枚举 `m` 的子集，不重复）。
- 模拟题的要点：**严格按题意顺序执行**，边界（`n = 1`、同分、并列）单独手算验证；建议先写暴力枚举当"对拍标准答案"。
- 数据规模一上来，枚举就必须换成 DP / 二分 / 贪心，枚举只作为暴力对拍和验证用。

## 典型应用

- 洛谷 P1706 全排列问题、洛谷 P1157 组合的输出；
- 洛谷 P1036 [NOIP2002 普及组] 选数（DFS 枚举组合）；
- 任何需要「先暴力再优化」的题目，先用枚举写出标准答案。
