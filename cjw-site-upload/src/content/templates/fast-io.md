---
title: 快读快写（读入优化）
description: 手工高速输入输出，适合百万级数据的题目
category: 读入优化
tags: [快读, 快写, 卡常]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
// ---------- 方案一：最省事，先加这两行 ----------
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // 之后正常使用 cin / cout，注意不要再混用 scanf / printf
}

// ---------- 方案二：手工快读，适合 10^6 以上的整数输入 ----------
inline long long readInt() {
    long long x = 0;
    int f = 1;
    char c = getchar();
    while (c != '-' && (c < '0' || c > '9')) c = getchar();   // 跳过非数字
    if (c == '-') {
        f = -1;
        c = getchar();
    }
    while (c >= '0' && c <= '9') {
        x = x * 10 + (c - '0');
        c = getchar();
    }
    return x * f;
}

// ---------- 快写：输出整数 ----------
inline void writeInt(long long x) {
    if (x < 0) {
        putchar('-');
        x = -x;
    }
    if (x > 9) writeInt(x / 10);
    putchar(char('0' + x % 10));
}

// ---------- 用法 ----------
// long long n = readInt();
// writeInt(n); putchar('\n');
// 结尾记得 fflush(stdout) 或用 putchar('\n') 保证换行
```

## 说明

- 数据量 `≤ 10^5`：`cin` + 关闭同步足够；`≥ 10^6` 的整数输入才值得上手工快读。
- 手工快读混用 `cin` / `scanf` 时要小心缓冲区：用了 `getchar()` 就不要再混 `cin`。
- Linux 评测机（如洛谷、Codeforces）可以进一步用 `getchar_unlocked()` / `putchar_unlocked()`，比 `getchar` 更快（Windows 本地没有这两个函数，注意条件编译）。
- 卡常顺序建议：先换算法（复杂度）→ 再用快读 → 最后才是各种微优化。

## 典型应用

- 洛谷 P10815【模板】快速读入；
- 任何「输入 10^6 个整数、时限很紧」的题目；
- 输出量为百万级时配合快写使用。
