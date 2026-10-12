---
title: 矩阵快速幂
description: O(N^3 log b) 求矩阵幂，用于线性递推加速（如斐波那契）
category: 线性代数
tags: [矩阵, 快速幂, 线性递推]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MOD = 1000000007;
const int N = 2;                 // 矩阵阶数，按题目修改

struct Mat {
    long long a[N][N];
    Mat() { memset(a, 0, sizeof(a)); }
    static Mat identity() {      // 单位矩阵
        Mat I;
        for (int i = 0; i < N; ++i) I.a[i][i] = 1;
        return I;
    }
};

Mat mul(const Mat& A, const Mat& B) {
    Mat C;
    for (int i = 0; i < N; ++i)
        for (int k = 0; k < N; ++k) {
            if (!A.a[i][k]) continue;             // 稀疏时省时间
            for (int j = 0; j < N; ++j)
                C.a[i][j] = (C.a[i][j] + A.a[i][k] * B.a[k][j]) % MOD;
        }
    return C;
}

// 矩阵快速幂：A^b
Mat matPow(Mat A, long long b) {
    Mat res = Mat::identity();
    while (b > 0) {
        if (b & 1) res = mul(res, A);
        A = mul(A, A);
        b >>= 1;
    }
    return res;
}

// 用法示例：斐波那契 F(1)=F(2)=1
// [F(n+1), F(n)]^T = [[1,1],[1,0]]^(n-1) * [F(2), F(1)]^T
long long fib(long long n) {
    if (n <= 2) return 1 % MOD;
    Mat A;
    A.a[0][0] = 1; A.a[0][1] = 1;
    A.a[1][0] = 1; A.a[1][1] = 0;
    Mat P = matPow(A, n - 1);
    return P.a[0][0] % MOD;      // F(n+1) 的系数
}

signed main() {
    cout << fib(10) << ' ' << fib(20) << '\n';   // 55 6765
    return 0;
}
```

## 说明

- 只要递推式是线性的（含常数项也可以，给矩阵多加一维），就能写成 `状态向量 × 转移矩阵`，用快速幂把 `O(n)` 优化到 `O(N³ log n)`。
- 相乘时先 `% MOD` 再累加；`MOD` 在 `10^9` 量级时两个数相乘可能溢出 `int`，要用 `long long`。
- 阶数固定时（如本题 `N = 2`）用静态数组最快；需要动态阶数就改成 `vector<vector<long long>>`。
- 若递推式带常数项，把状态向量加一维恒为 1 的分量即可。

## 典型应用

- 洛谷 P3390【模板】矩阵快速幂；
- 洛谷 P1962 斐波那契数列（n 极大）；
- 图上长度为 k 的路径计数（邻接矩阵的 k 次幂）。
