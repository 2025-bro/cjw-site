---
title: 线性 DP（LIS 与 LCS）
description: 最长上升子序列的 O(n log n) 贪心 + 二分，最长公共子序列的 O(nm) 滚动数组
category: 线性 DP
tags: [LIS, LCS, 二分, 滚动数组]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MAXN = 100005;
const int MAXM = 1005;

int a[MAXN], g[MAXN];
int dp[2][MAXM];                  // LCS 滚动数组，MAXM 为较短串长度上界

int lis(int n) {                  // 严格上升，O(n log n)：g 存长度为 k+1 的上升子序列的最小结尾
    int len = 0;
    for (int i = 1; i <= n; ++i) {
        int p = lower_bound(g + 1, g + len + 1, a[i]) - g;  // 非降用 upper_bound
        g[p] = a[i];
        if (p > len) len = p;
    }
    return len;
}

int lcs(const string &s, const string &t) {
    int n = s.size(), m = t.size();
    for (int j = 0; j <= m; ++j) dp[0][j] = 0;             // 第一维用异或滚动，必须逐行刷新
    for (int i = 1; i <= n; ++i) {
        int cur = i & 1, pre = cur ^ 1;
        dp[cur][0] = 0;
        for (int j = 1; j <= m; ++j) {
            if (s[i - 1] == t[j - 1]) dp[cur][j] = dp[pre][j - 1] + 1;
            else dp[cur][j] = max(dp[pre][j], dp[cur][j - 1]);
        }
    }
    return dp[n & 1][m];
}

signed main() {
    int n = 8;
    int b[9] = {0, 10, 9, 2, 5, 3, 7, 101, 18};
    for (int i = 1; i <= n; ++i) a[i] = b[i];
    cout << "LIS = " << lis(n) << '\n';                    // 4：2,3,7,101
    cout << "LCS = " << lcs("abcde", "ace") << '\n';       // 3：ace
    return 0;
}
```

## 说明

- `LIS` 的 `g` 数组**本身不是**某个合法的上升子序列，只保证长度是对的、且 `g` 单调——只有长度能拿来当答案。
- 严格上升用 `lower_bound`，非降上升用 `upper_bound`；改成下降只需把 `a` 整体取反。
- 需要输出方案时用 `O(n^2)` 的 `dp[i] = max(dp[j]) + 1`，并记录前驱；`n <= 5000` 时可以接受。
- `LCS` 的滚动数组必须保证每行都刷新（这里循环从 `j = 0` 开始），否则会用到残留在上一轮的数据。
- 只求长度且字符集小时，可以把 `LCS` 转成「一个串中每个字符在另一个串里的位置序列」再做 `LIS`，得到 `O(n log n)`。
- 子串（连续）问题不要用这两个，直接上 KMP / 后缀数组。

## 典型应用

- 洛谷 P1439【模板】最长公共子序列（排列 LCS → LIS）；
- 洛谷 P1020 [NOIP1999 普及组] 导弹拦截（LIS + 贪心求最少不升序列数）；
- 洛谷 P1091 [NOIP2004 提高组] 合唱队形（正反两遍 LIS）。
