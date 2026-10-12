---
title: 高斯消元（浮点与异或方程组）
description: 列主元高斯-约当消元解线性方程组 O(n^3)，bitset 版解异或方程组并统计解的个数
category: 线性代数
tags: [线性代数, 高斯消元, 异或方程组, bitset]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const double eps = 1e-8;
const int MAXN = 105, MAXM = 505;
double a[MAXN][MAXN];               // 浮点增广矩阵：n 行 n+1 列
bitset<MAXM> e[MAXM];               // 异或方程组：第 m 位存右端项

// 高斯-约当消元（列主元）：返回 0 表示唯一解（写入 x），>0 为自由元个数，-1 无解
int gauss(int n, double x[]) {
    int r = 0;
    for (int c = 0; c < n && r < n; c++) {
        int t = r;
        for (int i = r; i < n; i++) if (fabs(a[i][c]) > fabs(a[t][c])) t = i;
        if (fabs(a[t][c]) < eps) continue;            // 该列无主元，c 是自由元
        for (int j = c; j <= n; j++) swap(a[r][j], a[t][j]);
        for (int j = n; j >= c; j--) a[r][j] /= a[r][c];
        for (int i = 0; i < n; i++) if (i != r && fabs(a[i][c]) > eps)
            for (int j = n; j >= c; j--) a[i][j] -= a[r][j] * a[i][c];
        r++;
    }
    for (int i = r; i < n; i++) if (fabs(a[i][n]) > eps) return -1;   // 0 = 非零
    if (r < n) return n - r;                          // 无穷多解
    for (int i = 0; i < n; i++) x[i] = a[i][n];
    return 0;
}

// 异或方程组：n 个方程 m 个未知数，返回解的个数 1<<自由元数；0 表示无解
int gaussXor(int n, int m) {
    int r = 0;
    for (int c = 0; c < m && r < n; c++) {
        int t = -1;
        for (int i = r; i < n; i++) if (e[i][c]) { t = i; break; }
        if (t < 0) continue;
        swap(e[r], e[t]);
        for (int i = 0; i < n; i++) if (i != r && e[i][c]) e[i] ^= e[r];
        r++;
    }
    for (int i = r; i < n; i++) if (e[i][m]) return 0;            // 0 = 1 矛盾
    return 1 << (m - r);
}

int main() {
    double x[2];
    a[0][0] = 1, a[0][1] = 1, a[0][2] = 3;
    a[1][0] = 2, a[1][1] = -1, a[1][2] = 0;
    int s = gauss(2, x);
    printf("%d %.4f %.4f\n", s, x[0], x[1]);          // 0 1.0000 2.0000

    e[0] = 0b011, e[0][3] = 1;                        // x1^x2 = 1
    e[1] = 0b110;                                     // x2^x3 = 0
    e[2] = 0b001, e[2][3] = 1;                        // x1 = 1
    printf("%d\n", gaussXor(3, 3));                   // 1
}
```

## 说明

- 复杂度：浮点消元 `O(n^3)`，异或消元用 `bitset` 后为 `O(n*m/64)`；空间分别为 `O(n^2)`、`O(n*m/64)`。
- 列主元（选该列绝对值最大的行）是为了控制舍入误差，浮点比较一律用 `eps`，不要写 `a[i][c] != 0`。
- 判解：增广列出现 `0 = 非零` 即无解；主元个数 `r < n` 且不矛盾则有无穷多解，自由元个数为 `n - r`（此时 `x[]` 里的值无意义，本题型一般只需输出解的个数或一组合法解）。
- 异或方程组里 `e[i][m]` 是右端项，消元用 `^=` 等价于加减，消完检查 `r` 行之后是否出现 `0 = 1`。
- 系数为整数且要求精确解时（如取模方程组）应改用模意义下的高斯消元，`double` 会有精度问题。
- 未知数与方程数可以不相等：方程多则消完检查矛盾行，方程少则必然有自由元。

## 典型应用

- 洛谷 P3389【模板】高斯消元法
- 洛谷 P2455 [SDOI2006] 线性方程组（需区分无解与无穷多解）
- 洛谷 P2962 [USACO09NOV] Lights G（异或方程组 + bitset）
