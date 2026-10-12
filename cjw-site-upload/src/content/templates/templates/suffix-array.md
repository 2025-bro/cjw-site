---
title: 后缀数组（倍增法 SA + height）
description: O(n log n) 倍增求后缀数组与相邻后缀 LCP，任意两后缀 LCP 化为区间最小值
category: 后缀数组
tags: [字符串, 倍增, LCP, 后缀排序]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 5;
int sa[N], rk[N], oldrk[N], cnt[N], id[N], h[N];

// s 下标 1 起（s[0] 是占位符），m 为字符集大小
void buildSA(const string& s, int n, int m) {
    for (int i = 1; i <= n; ++i) cnt[rk[i] = (unsigned char)s[i]]++;
    for (int i = 1; i <= m; ++i) cnt[i] += cnt[i - 1];
    for (int i = n; i >= 1; --i) sa[cnt[rk[i]]--] = i;
    for (int w = 1, p = 0; w < n; w <<= 1, m = p) {
        p = 0;
        for (int i = n - w + 1; i <= n; ++i) id[++p] = i;          // 第二关键字为空，排最前
        for (int i = 1; i <= n; ++i)
            if (sa[i] > w) id[++p] = sa[i] - w;
        memset(cnt, 0, (m + 1) << 2);                             // 只清用到的一段
        for (int i = 1; i <= n; ++i) cnt[rk[i]]++;
        for (int i = 1; i <= m; ++i) cnt[i] += cnt[i - 1];
        for (int i = n; i >= 1; --i) sa[cnt[rk[id[i]]]--] = id[i];
        memcpy(oldrk, rk, (n + 1) << 2);                          // oldrk[0]=0 兜住越界比较
        p = 0;
        for (int i = 1; i <= n; ++i)
            rk[sa[i]] = (oldrk[sa[i]] == oldrk[sa[i - 1]] &&
                         oldrk[sa[i] + w] == oldrk[sa[i - 1] + w]) ? p : ++p;
        if (p == n) break;                                        // 已全部区分
    }
}

// h[i] = LCP(sa[i], sa[i-1])，h[1] = 0
void buildHeight(const string& s, int n) {
    for (int i = 1, k = 0; i <= n; ++i) {
        if (rk[i] == 1) { h[1] = k = 0; continue; }
        if (k) --k;
        int j = sa[rk[i] - 1];
        while (i + k <= n && j + k <= n && s[i + k] == s[j + k]) ++k;
        h[rk[i]] = k;
    }
}

signed main() {
    string s = " banana";                  // s[0] 占位
    int n = 6;
    buildSA(s, n, 256);
    buildHeight(s, n);
    for (int i = 1; i <= n; ++i) cout << sa[i] << ' ';
    cout << '\n';
    for (int i = 1; i <= n; ++i) cout << h[i] << ' ';
    cout << '\n';
    return 0;
}
```

## 说明

- 倍增思路：把每个后缀按长度 `2w` 的两段排名（前半段 `rk[i]`、后半段 `rk[i+w]`）做基数排序，`O(n log n)` 直到所有排名互不相同。
- 第二关键字排序利用「`sa[i] - w` 的第二关键字就是 `sa[i]` 的第一关键字」，只需跳过 `sa[i] <= w` 的位置，无需再排序。
- `memset(cnt, 0, (m+1) << 2)` 只清用到的一段，整体清空会退化成 `O(n^2)`；`m` 用上一轮排名 `p` 作上界。
- 长度 `2w` 比较时 `rk[i+w]` 可能越界，靠 `oldrk` 多开一位且恒为 0 兜住（`w` 增大时越界位置正好落在 0 上）。
- `height` 性质 `h[rk[i]] >= h[rk[i-1]] - 1`，暴力加一递减总复杂度 `O(n)`；任意两后缀的 LCP 等于 `h` 数组对应区间最小值，配 ST 表可 `O(1)` 查询。
- 与后缀自动机取舍：SA 便于字典序区间定位与区间最值，SAM 便于统计子串出现次数与本质不同子串数。

## 典型应用

- 洛谷 P3809【模板】后缀排序；
- 洛谷 P2408 不同子串个数（`n(n+1)/2 - Σh[i]`）；
- 洛谷 P4248 [AHOI2013] 差异（height 数组 + 单调栈）。
