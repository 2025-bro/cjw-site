---
title: 对拍数据生成器与对拍脚本
description: 用 rand 造小数据的 gen.cpp，配 .bat 循环对拍 gen/brute/std，单次 O(n^2) 复杂度
category: 对拍与调试
tags: [对拍, 数据生成, 调试, rand]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

// 数据约定：第一行 n，第二行 n 个整数（可正可负），1 <= n <= 8，|a[i]| <= 20
int main() {
    srand(20261010);                          // 固定种子，便于复现错误数据
    int n = rand() % 8 + 1;
    printf("%d\n", n);
    for (int i = 1; i <= n; i++) printf("%d ", rand() % 41 - 20);
    printf("\n");
    return 0;
}
```

## 说明

- 三步走：`gen` 造数据、`brute` 写暴力（保证正确但慢）、`std` 写正解/待验证解，然后循环比较输出。
- 关键要求：**三个程序必须约定同一套输入输出格式**，且都不要输出任何调试信息或提示语，否则会被判成差异。
- 把 `gen.cpp`、`brute.cpp`、`std.cpp` 和下面的脚本放在同一个目录，然后双击运行脚本即可。

```bat
@echo off
g++ gen.cpp -O2 -o gen.exe -std=c++17
g++ brute.cpp -O2 -o brute.exe -std=c++17
g++ std.cpp -O2 -o std.exe -std=c++17
for /l %%i in (1,1,1000) do (
    gen.exe > in.txt
    brute.exe < in.txt > out1.txt
    std.exe   < in.txt > out2.txt
    fc out1.txt out2.txt > nul
    if errorlevel 1 (
        echo WA on test %%i
        type in.txt
        echo ---- brute ----
        type out1.txt
        echo ---- std ----
        type out2.txt
        pause
        exit /b
    )
)
echo All tests passed
pause
```

- 变量：`%%i` 是批处理的循环变量（写文件里要双写百分号），`> in.txt` 重定向输入、`fc` 比较两个文件，`errorlevel 1` 表示内容不同。
- `gen.cpp` 里的 `rand()` 只有 15 位且周期 2^31，造大数据要用 `mt19937_64`；但对拍小数据够用。强烈建议**固定种子并保存出错数据**，否则第二次不一定复现。
- 优先构造边界数据：n 取最小值 1、全相等、全负数、已排序/逆序、答案恰好取模边界。随机对拍只能发现「常见错误」，覆盖不了极端 case。
- 对拍规模要小（n ≤ 8、值域 ≤ 20），这样暴力才能秒出，几秒钟能跑上千组；同时小数据更容易出现重复、负数等边界，性价比最高。
- 只想快速定位时可以只留 `std` 加断言（`assert`），或者用 `fc /b` 比较二进制输出；Linux 下对应写法是 `diff -w out1.txt out2.txt`。
- 对拍通过 ≠ 正确，只是「在随机小数据上和暴力一致」。最终还要自己手算几组大数据的答案并检查 long long 溢出。

## 典型应用

- 洛谷 P1001 A+B Problem（入门对拍练习：暴力枚举 + 直接输出对比）
- 洛谷 P1908 逆序对（std 用归并、brute 用 O(n²) 双重循环对拍）
- 洛谷 P1177 【模板】快速排序（用 gen 造卡快排的数据检查退化情况）
