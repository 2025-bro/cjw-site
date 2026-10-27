---
title: DP 训练题单（ACM 版 · 按类型递进）
date: 2026-10-27
author: CJW
---

# DP 训练题单

> 目标：把"看到 DP 就慌"变成"10 分钟内说出状态定义"。
> **所有 CF 题目都核对过官方题库**（题号 / 题名 / rating / 通过数均为 Codeforces 数据），点开即可练。
> 洛谷题号未能自动校验，若打不开对照题名搜一下。

## 一、练法（比题量重要）

每道题严格按这四步走，**前三步不写代码**：

1. **状态定义一句话**：`dp[...]` 表示"（什么集合/位置）已经（处理到哪）时的（最值/方案数）" —— 10 分钟内说不出来，就去看题解的状态定义（只看这一句，转移自己推）。
2. **转移**：最后一个决策是什么？从哪些更小的状态来？
3. **边界**：空集 / 长度 0 / 单点 / 不可达 → 初值是多少。
4. **实现 + 对拍**：写完先用暴力对拍小数据（`check()` 这类函数最容易错的就是边界）。

**每题收尾写 3 行**：状态 / 转移 / 这题教会我什么。一周 6~8 题，别贪多。

## 二、P0 · 递推与线性 DP（先把"状态"这个概念吃透）

| 题 | rating | 通过数 | 练什么 |
|:--|:--:|:--:|:--|
| [189A Cut Ribbon](https://codeforces.com/problemset/problem/189/A) | 1300 | 86k | 无限次选取的最大段数（完全背包的"最值"思路） |
| [327A Flipping Game](https://codeforces.com/problemset/problem/327/A) | 1200 | 53k | 翻转一段 0/1，先按 dp 想一遍，再看贪心怎么做 |
| [698A Vacations](https://codeforces.com/problemset/problem/698/A) | 1400 | 41k | **状态机 DP 入门**：每天 3 种状态，转移依赖前一天 |
| [1195C Basketball Exercise](https://codeforces.com/problemset/problem/1195/C) | 1400 | 38k | 两行交替取数的线性 dp |
| [489C Given Length and Sum of Digits](https://codeforces.com/problemset/problem/489/C) | 1400 | 54k | 构造 + dp：前/后缀各做一遍求极值 |
| [414B Mashmokh and ACM](https://codeforces.com/problemset/problem/414/B) | 1400 | 32k | 用"倍数"当转移：`O(n log n)` 的枚举因子 |
| [1350B Orac and Models](https://codeforces.com/problemset/problem/1350/B) | 1400 | 32k | 整除关系上的最长链 |
| [455A Boredom](https://codeforces.com/problemset/problem/455/A) | 1500 | 77k | 排序后"选它就删邻居"：经典的打家劫舍型 |
| [977F Consecutive Subsequence](https://codeforces.com/problemset/problem/977/F) | 1700 | 27k | 状态不是下标而是"值"：用 map 记录 |
| [1526B I Hate 1111](https://codeforces.com/problemset/problem/1526/B) | 1400 | 38k | 小范围结论 + 背包可行性 |

## 三、P1 · 背包专题

| 题 | rating | 通过数 | 练什么 |
|:--|:--:|:--:|:--|
| [687C The Values You Can Make](https://codeforces.com/problemset/problem/687/C) | 1900 | 9.5k | 二维背包：可达性 + "方案里能拼出哪些子集和" |
| [577B Modulo Sum](https://codeforces.com/problemset/problem/577/B) | 1900 | 16k | **余数背包**：把"和"压缩成 mod m 的余数 |
| [19B Checkout Assistant](https://codeforces.com/problemset/problem/19/B) | 1900 | 6.3k | 01 背包变形：把"时间"当容量 |
| [2B The least round way](https://codeforces.com/problemset/problem/2/B) | 2000 | 14k | 二维路径 dp：2 和 5 各跑一遍再合并（学"多目标分别 dp"） |

## 四、P2 · 区间 DP

| 题 | rating | 通过数 | 练什么 |
|:--|:--:|:--:|:--|
| [607B Zuma](https://codeforces.com/problemset/problem/607/B) | 1900 | 18k | 区间 dp 入门经典（消回文串） |
| [149D Coloring Brackets](https://codeforces.com/problemset/problem/149/D) | 1900 | 5k | 括号序列区间 dp（配对 + 颜色状态） |
| [5C Longest Regular Bracket Sequence](https://codeforces.com/problemset/problem/5/C) | 1900 | 20k | 括号串最值 dp（线性写法也行，两种都试） |
| [1509C The Sports Festival](https://codeforces.com/problemset/problem/1509/C) | 1800 | 17k | 排序后区间扩展式 dp |
| [1132F Clear the String](https://codeforces.com/problemset/problem/1132/F) | 2000 | 12k | 区间 dp + "相邻相同可合并"的优化思路 |

## 五、P3 · 树形 DP 与换根

| 题 | rating | 通过数 | 练什么 |
|:--|:--:|:--:|:--|
| [1528A Parsa's Humongous Tree](https://codeforces.com/problemset/problem/1528/A) | 1600 | 21k | 树上"每个点选一个值"的 dp |
| [1336A Linova and Kingdom](https://codeforces.com/problemset/problem/1336/A) | 1600 | 26k | 树上选 k 个点的贡献 dp（贪心 + dp 结合） |
| [161D Distance in Tree](https://codeforces.com/problemset/problem/161/D) | 1800 | 21k | 树形背包：按"距离"计数 |
| [1324F Maximum White Subtree](https://codeforces.com/problemset/problem/1324/F) | 1800 | 15k | **换根 DP 入门（必练）**：先算子树答案，再把父亲推给儿子 |
| [1153D Serval and Rooted Tree](https://codeforces.com/problemset/problem/1153/D) | 1900 | 5.8k | 树上 min/max 转移 + 二分配合 |
| [1187E Tree Painting](https://codeforces.com/problemset/problem/1187/E) | 2100 | 13k | 换根 DP：贡献怎么在换根时增量更新 |

## 六、P4 · 状压 DP

| 题 | rating | 通过数 | 练什么 |
|:--|:--:|:--:|:--|
| [580D Kefa and Dishes](https://codeforces.com/problemset/problem/580/D) | 1800 | 13k | **状压入门（必练）**：集合 + "最后吃的是哪个" |
| [401D Roman and Numbers](https://codeforces.com/problemset/problem/401/D) | 2000 | 4.9k | 状压 + 余数：状态里带 mod |
| [1288D Minimax Problem](https://codeforces.com/problemset/problem/1288/D) | 2000 | 8.8k | 状压 + 二分：按位判可行性 |
| [165E Compatible Numbers](https://codeforces.com/problemset/problem/165/E) | 2200 | 10k | SOS dp 思想（子集/超集布尔传递） |
| [1316E Team Building](https://codeforces.com/problemset/problem/1316/E) | 2300 | 6.1k | 状压 + 排序贪心（难，但套路很经典） |

## 七、P5 · 数位 DP 与计数 DP

| 题 | rating | 通过数 | 练什么 |
|:--|:--:|:--:|:--|
| [1036C Classy Numbers](https://codeforces.com/problemset/problem/1036/C) | 1900 | 15k | 数位 dp 入门：非零数位不超过 3 个 |
| [628D Magic Numbers](https://codeforces.com/problemset/problem/628/D) | 2200 | 9.4k | 数位 dp + 取模（[L,R] 差分写法） |
| [559C Gerald and Giant Chess](https://codeforces.com/problemset/problem/559/C) | 2200 | 8.8k | 组合计数 + 容斥：按障碍排序后 dp |

## 八、洛谷配套（中文题面，先把模板和手感打牢）

| 题 | 练什么 |
|:--|:--|
| [P1002 过河卒](https://www.luogu.com.cn/problem/P1002) | 最基础的网格 dp |
| [P1216 数字三角形](https://www.luogu.com.cn/problem/P1216) | 线性 dp 入门（上下两种方向都写） |
| [P1048 采药](https://www.luogu.com.cn/problem/P1048) | 01 背包模板 |
| [P1060 开心的金明](https://www.luogu.com.cn/problem/P1060) | 01 背包（价值 = 价格 × 重要度） |
| [P1049 装箱问题](https://www.luogu.com.cn/problem/P1049) | 01 背包可达性 |
| [P1352 没有上司的舞会](https://www.luogu.com.cn/problem/P1352) | 树形 dp 入门 |
| [P2014 选课](https://www.luogu.com.cn/problem/P2014) | 树形背包 |
| [P1880 石子合并](https://www.luogu.com.cn/problem/P1880) | 区间 dp 模板（环拆链） |
| [P1063 能量项链](https://www.luogu.com.cn/problem/P1063) | 区间 dp（环形） |
| [P4170 涂色](https://www.luogu.com.cn/problem/P4170) | 区间 dp（染色） |
| [P1005 矩阵取数游戏](https://www.luogu.com.cn/problem/P1005) | 区间 dp + 高精度（正好用上站内高精度模板） |
| [P1879 玉米田](https://www.luogu.com.cn/problem/P1879) | 状压 dp 入门（相邻不能种） |
| [P1896 互不侵犯](https://www.luogu.com.cn/problem/P1896) | 状压 dp（国王不能相邻） |
| [P2704 炮兵阵地](https://www.luogu.com.cn/problem/P2704) | 状压 dp + 三行状态 |
| [P1091 合唱队形](https://www.luogu.com.cn/problem/P1091) | LIS 变形（正反各一遍） |
| [P1282 多米诺骨牌](https://www.luogu.com.cn/problem/P1282) | 差值 dp（把"差"当状态） |
| [P1434 滑雪](https://www.luogu.com.cn/problem/P1434) | 记忆化搜索（dp 的另一种写法） |
| [P4017 最大食物链计数](https://www.luogu.com.cn/problem/P4017) | DAG 上计数 dp（拓扑序 + dp） |
| [P2196 挖地雷](https://www.luogu.com.cn/problem/P2196) | DAG 上 dp + 记录路径 |
| [P1044 栈](https://www.luogu.com.cn/problem/P1044) | 卡特兰数 / 区间 dp |

## 九、六周推进节奏

| 周 | 阶段 | 题量 | 通关判据 |
|:--:|:--|:--:|:--|
| 1 | P0 + 洛谷基础 | 8 | 能写"状态机 dp"和"选/不选"两种 |
| 2 | P1 背包 | 5 | 能把"容量"换成余数/时间/差值 |
| 3 | P2 区间 dp | 6 | 见"区间合并/消除"能立刻想到 `dp[l][r]` |
| 4 | P3 树形 + 换根 | 6 | 换根能自己推增量 |
| 5 | P4 状压 | 6 | 能判断"什么时候该状压"（n ≤ 20 且要集合） |
| 6 | P5 数位/计数 + 总复盘 | 5 | 数位 dp 的 `dfs(pos, ...)` 模板能默写 |

## 十、卡住时的「DP 五问」

1. 状态里**必须**有哪些信息才能决定后续？（少一个就错，多一个就爆）
2. 最后一个决策是什么？（枚举它）
3. 转移从哪些**更小**的状态来？会不会重复/漏？
4. 边界：空 / 长度 0 / 单点 / 不可达，初值各是什么？
5. 复杂度 = 状态数 × 转移代价，超了吗？超了就在哪里做优化（前缀和 / 单调队列 / 滚动 / bitset）？

> 一句话：**DP 不是背模板，是把"暴力搜索的参数"翻译成状态。**
> 每道题先写出暴力，再问自己"哪些参数是多余的"——删掉多余参数，状态就出来了。
