---
title: 构造题常用手法
description: 奇偶/对称构造、按大小交替、小数据特判，附一个可运行的构造示例
category: 构造
tags: [构造, 思维, 对称]
author: 通用
date: 2026-10-12
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

// 构造 1..n 的一个排列，使相邻两数之和全为奇数（即奇偶必须交替）
// 有解 <=> 奇数个数与偶数个数相差不超过 1
vector<int> construct(int n) {
    vector<int> odd, even, res;
    for (int i = 1; i <= n; i++) (i & 1 ? odd : even).push_back(i);
    if (abs((int)odd.size() - (int)even.size()) > 1) return {};      // 无解
    bool useOdd = odd.size() >= even.size();
    while ((int)res.size() < n) {
        if (useOdd && !odd.empty()) res.push_back(odd.back()), odd.pop_back();
        else if (!useOdd && !even.empty()) res.push_back(even.back()), even.pop_back();
        else if (!odd.empty()) res.push_back(odd.back()), odd.pop_back();
        else res.push_back(even.back()), even.pop_back();
        useOdd ^= 1;
    }
    return res;
}

signed main() {
    for (int n : {1, 2, 4, 5, 7}) {
        vector<int> p = construct(n);
        cout << "n = " << n << " : ";
        if (p.empty()) { cout << "无解\n"; continue; }
        for (int i = 0; i < n; i++) cout << p[i] << " \n"[i == n - 1];
    }
    return 0;
}
```

## 说明

- 构造题没有万能模板，套路是**先手算小数据找规律**，再设计统一格式：奇偶分组、大小交替、正方形/对称摆放、按模数分块是最常见的四种。
- 常见切入点：极值情况（`n = 1, 2`）、奇偶性、总和/平均值的限制、把无解情况先判掉。
- 有序构造常配合排序贪心：先排序，再从两端交替取（最大最小配对），可保证相邻差单调。
- 递归/分治构造：`n` 的解可以由 `n - 1` 或 `n / 2` 的解拼出来（如格雷码、汉诺塔）。
- 写完一定要**自检验证**：把构造结果按题意重新检查一遍（越界、重复、相邻关系），别只信"看起来对"。

## 典型应用

- 洛谷 P1563 玩具谜题 / 洛谷 P1017 进制转换（模拟 + 构造）；
- 洛谷 P1236 算24点（枚举所有运算顺序构造答案）；
- Codeforces Div.2 的 A/B 类构造题（如「构造一个数组使…」）。
