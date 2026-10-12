---
title: 数位 DP（统计不含连续 1 的数）
description: 记忆化搜索求 [l, r] 内二进制表示不含连续 1 的数的个数，O(log n · 状态数)
category: 数位 DP
tags: [数位DP, 记忆化搜索, 二进制, 计数]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int B = 64;

ll mem[B][2][2];                     // [位数][上一位是否为 1][是否仍是前导零]
int dig[B];
int lim;                             // 有效位数

ll dfs(int pos, int pre, int lead, bool less) {
    if (pos < 0) return 1;                        // 走完所有位，得到 1 个合法数
    if (!less && mem[pos][pre][lead] != -1) return mem[pos][pre][lead];
    int up = less ? dig[pos] : 1;
    ll res = 0;
    for (int d = 0; d <= up; ++d) {
        int zero = lead && d == 0;                // 前导零不算「这一位是 0」
        if (!zero && pre && d == 1) continue;     // 连续 1：剪枝
        res += dfs(pos - 1, (!zero && d == 1), zero, less && d == up);
    }
    if (!less) mem[pos][pre][lead] = res;
    return res;
}

ll cnt(ll x) {                       // [0, x] 内满足条件的个数
    if (x < 0) return 0;
    lim = 0;
    for (ll t = x; t > 0; t >>= 1) dig[lim++] = t & 1;
    if (lim == 0) dig[lim++] = 0;                 // x == 0 时要留一位
    memset(mem, -1, sizeof(mem));
    return dfs(lim - 1, 0, 1, true);
}

signed main() {
    ll l = 5, r = 10;                             // 合法：5(101) 8(1000) 9(1001) 10(1010)
    cout << "cnt[0,10] = " << cnt(10) << '\n';    // 8
    cout << "ans[5,10] = " << cnt(r) - cnt(l - 1) << '\n';   // 4
    return 0;
}
```

## 说明

- 记忆化搜索四件套：`pos`（当前位）、`pre`（前一位是否有限制）、`limit`（是否贴着上界，即 `less`）、`lead`（前导零状态）。
- **只有 `!limit` 的状态才能记忆化**：贴着上界的分支是单条链，不会被重复访问，存了反而错。上面用 `less` 表示「已经小于上界」，因此 `less == true` 时可缓存。
- 前导零必须单独标记，否则 `0011` 这类补位会被误判成含连续 1；本题里 `lead` 直接并入状态最省事。
- 区间答案用 `cnt(r) - cnt(l-1)`（前缀和思想），注意 `l = 0` 时 `l - 1` 为负，函数开头要先返回 0。
- 状态数 × 转移数就是复杂度；若 `pre` 的取值变多（如十进制模数、是否已出现某数字），把状态继续加维即可。
- 递归深度只有约 64 层，不会爆栈；`mem` 每次询问前 `memset(-1)`，多组询问要按状态复用范围清空。
- 与「数位统计递推写法」的取舍：记忆化搜索更好写、更好改条件，缺点是多组数据时 `memset` 有常数开销。

## 典型应用

- 洛谷 P2657 [SCOI2009] windy 数（相邻两位之差 ≥ 2 的数位 DP 模板）；
- 洛谷 P2602 [ZJOI2010] 数字计数（统计各数字出现次数）；
- 洛谷 P4124 [CQOI2016] 手机号码（多状态数位 DP）。
