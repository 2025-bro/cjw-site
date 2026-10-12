---
title: 位运算常用技巧
description: lowbit、子集枚举、popcount 与一批常用位技巧，均为 O(1) 或 O(2^k)
category: 位运算
tags: [位运算, lowbit, 子集枚举, 状压]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define lowbit(x) ((x) & -(x))
#define bit(x, i) (((x) >> (i)) & 1)
#define setb(x, i) ((x) | (1 << (i)))
#define clrb(x, i) ((x) & ~(1 << (i)))

// 返回 x 的二进制表示，最高位在左
string tostr(unsigned x) {
    if (!x) return "0";
    string s;
    for (; x; x >>= 1) s += char('0' + (x & 1));
    reverse(s.begin(), s.end());
    return s;
}

signed main() {
    int x = 0b10110100;                  // 180
    cout << "lowbit = " << lowbit(x) << "\n";       // 最低位的 1 及其后的 0
    cout << "去掉最低位1 = " << tostr(x & (x - 1)) << "\n";
    cout << "popcount = " << __builtin_popcount(x) << "\n";
    cout << "最高位位置 = " << (31 - __builtin_clz(x)) << "\n";
    cout << "是否 2 的幂 = " << (x > 0 && !(x & (x - 1))) << "\n";
    cout << "枚举所有子集:";
    int m = 0b1101;
    for (int s = m; s; s = (s - 1) & m) cout << " " << s;
    cout << " 0\n";                                 // 别忘了最后还有空集 0
    return 0;
}
```

## 说明

- 复杂度：lowbit / popcount / clz 都是 O(1)（`__builtin_*` 由编译器直接生成指令）；枚举一个 k 元集合的所有子集是 O(2^k)，枚举所有集合的子集总和是 O(3^n)。
- `lowbit(x) = x & -x`，配合 `x & (x-1)` 可以做到「每次消掉一个 1」，是树状数组的基石。负数在补码下取反加一，所以 `-x` 能保留最低位的 1。
- 子集枚举 `for (int s = m; s; s = (s - 1) & m)` 会**跳过空集**，需要空集时单独处理；`(s-1)&m` 是降序枚举子集的正确写法，`s = (s*2) % ...` 之类都不对。
- `__builtin_popcount` 参数是 `unsigned int`；long long 要用 `__builtin_popcountll`。`__builtin_clz(0)` 是未定义行为，务必先判 `x > 0`，最高位位置 = `31 - clz(x)`（long long 用 63）。
- 位移陷阱：`1 << 31` 是有符号溢出（UB），写 `1LL << 31` 或 `1u << 31`；`x >> i` 对负数是算术右移，不是逻辑右移。
- 常用套路还有 `x & -x` 判奇偶（`x & 1`）、`__builtin_ctz(x)` 取最低位 1 的下标、`__builtin_parity` 判奇偶校验。

## 典型应用

- 洛谷 P3374 树状数组 1（lowbit 维护 i += lowbit(i) / i -= lowbit(i) 的跳转）
- 洛谷 P1896 [SCOI2005] 互不侵犯（状压 DP：`s & (s<<1)` 判相邻 + 子集枚举）
- 洛谷 P1433 吃奶酪（位掩码表示已访问点集合，配合 `__builtin_popcount` 统计已走个数）
