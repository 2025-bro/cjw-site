---
title: ACM-ICPC 算法学习顺序（区域赛金牌路线）
date: 2026-11-10
author: CJW
---

# ACM-ICPC 算法学习顺序

> 这份路线图只回答三个问题：**先学什么、到什么程度算会、卡住了回哪补**。
> 上限按 **ICPC 区域赛金牌** 设：12 题赛制下稳定做出 7~9 题，其中至少 2~3 题不是纯模板题。
> 阶段之间是**前置依赖**，不是日历：判据没达到就往后跳，后面会加倍还债。
> 题号已逐条核对（洛谷 276 道、Codeforces 16 道，标题与 rating 取自官方题库）。

## 一、怎么用这份路线图

1. 每个阶段末尾都有**判据**：「能独立手写 + 能讲清为什么」。手写指不看模板、30 分钟内写出能过大样例并能对拍的版本；讲清指说得出复杂度、正确性理由和边界。
2. **必须** 与 **增量** 分开标：必须 = 金牌队基本功；增量 = 银牌到金牌之间那一步。时间不够时先只做必须。
3. 每个专题都要写**三件套**：思想一句话、适用条件、实现与复杂度。写不出来就是没学会，别急着开下一题。
4. 站内配套资料（都在内部区，链接可点）：
   - [DP 训练题单](/private/dp-training-list/)：P4 的题单与「DP 五问」在那里；
   - [图论通关清单](/private/graph-mastery-checklist/)：图论模板与易错点；
   - [数据结构代码库](/private/ds-code-library/)：树套树、点分治等代码；
   - 公开区[代码模板](/templates/)：快读、树状数组、线段树、KMP、LCA 可直接拿来默写。

## 二、阶段总览

| 阶段 | 主题 | 建议周数 | 累计 | CF 水平 | 学完能干什么 |
|:--|:--|:--:|:--:|:--:|:--|
| P0 | 语言与工具链 | 2 | 2 | 800~1000 | 写得出、调得动、对得了拍 |
| P1 | 基础算法与复杂度 | 3 | 5 | 1000~1300 | 看到单调性就想到二分 |
| P2 | 基础数据结构 | 4 | 9 | 1300~1600 | 树状数组、线段树随手写 |
| P3 | 图论 | 4 | 13 | 1500~1700 | 最短路、Tarjan、树上操作成体系 |
| P4 | 动态规划 | 6 | 19 | 1500~1800 | 10 分钟说出状态定义 |
| P5 | 数学 | 6 | 25 | 1600~1900 | 莫比乌斯反演、组合计数能推 |
| P6 | 字符串 | 4 | 29 | 1700~1900 | KMP、ACAM、SA、SAM 会用 |
| P7 | 高级数据结构 | 6 | 35 | 1900~2100 | 树套树、点分治、LCT 能写 |
| P8 | 高级专题与队伍训练 | 8 | 43 | 2000~2300 | 区域赛能打满 7 题 |

合计约 40~44 周（每天 3~4 小时）。每天只有 1~2 小时的，把周数乘 2。

前置依赖（左边全部完成再学右边）：

- P1 依赖 P0：会写代码、会对拍。
- P2 依赖 P1：会算复杂度、会写二分。
- P3 依赖 P2：堆、并查集、树状数组、树剖的基础。
- P4 依赖 P1 + P2：分治思想、单调队列、线段树优化。
- P5 依赖 P1：快速幂、模运算、复杂度。
- P6 依赖 P1：分治、哈希、字符串处理。
- P7 依赖 P2 + P4：线段树、可持久化、DP 优化场景。
- P8 依赖 P1 + P2 + P4：CDQ = 分治 + 偏序 + 树状数组的合成；网络流依赖图论。

## 三、P0 语言与工具链（2 周）

必须：

- C++ 常用写法：结构体 + 运算符重载、`lambda`、`auto`、`__int128`、位运算（`lowbit`、`__builtin_popcount`、`__builtin_ctz`）、`#define int long long` 的代价（内存翻倍）。
- IO：`scanf/printf`、`ios::sync_with_stdio(false)`、手写快读快写（`getchar` 版，处理负号）。
- STL：`vector / string / map / set / multiset / deque / priority_queue / pair / tuple`，`sort / stable_sort / nth_element / unique / lower_bound / next_permutation`。
- 调试：`assert`、编译开 `-g -Wall -fsanitize=address,undefined`、`gdb` 三条命令（`bt`、`p`、`frame`）、写对拍脚本（`gen + brute + std`）。
- 复杂度直觉：1e8 次简单操作约 1 秒；`n = 1e5` 时 `O(n log n)` 约 1.7e6，`O(n√n)` 约 3e7，`O(n²)` 直接死。

判据：30 分钟内从空文件写出「快读 + 归并排序求逆序对 + 自定义比较的 sort + 对拍脚本」，一次编译通过。

常见坑：`sort` 比较器写成 `<=`（不满足严格弱序，直接 RE）；循环里用 `endl` 超时；`int` 溢出；多测忘清空。

## 四、P1 基础算法与复杂度（3 周）

- 枚举与模拟：把题意准确翻译成循环，注意值域、多测、特殊边界（`n = 1`、全相同）。
- 贪心：交换论证 + 反例构造。套路是「先排序，再证明按这个顺序取不会更差」。
- 二分（三种形态都要会）：
  - 整数二分统一模板：`while (l < r) { mid = (l + r) >> 1; if (check(mid)) r = mid; else l = mid + 1; }`，退出时 `l` 就是第一个满足的位置。
  - 实数二分：固定迭代 100 次，不要写 `while (r - l > eps)`，会死循环。
  - 二分答案：先证明答案单调，再把 `check` 写成判定，最后套模板。
- 双指针 / 尺取：无重复字符最长子串、区间和、矩阵行列单调。
- 前缀和 / 差分 / 二维前缀和：区间修改、区间查询、离线统计。
- 离散化：`sort + unique + lower_bound`，别忘把答案映射回原值。
- 分治：归并排序、快速幂、快速排序、归并求逆序对、平面最近点对（P8 几何会用）。
- 排序：`sort` 的自定义比较、`stable_sort`、计数排序（值域小时比 `sort` 快）。

判据：任意单调问题 5 分钟内写出不会死循环的二分；能说清贪心为什么对；能手写归并求逆序对。

常见坑：`l + r` 溢出；离散化下标 0/1 混用；多测忘 `clear`；二分答案的 `check` 里面也有二分（两层 log）。

## 五、P2 基础数据结构（4 周）

必须：

- 栈 / 队列 / `deque`；单调栈（下一个更大元素、最大矩形面积）、单调队列（滑动窗口、DP 优化）。
- 堆：优先队列 + 懒删除、对顶堆求中位数。
- 并查集：路径压缩、按秩合并、扩展域（敌人）、带权（距离 / 奇偶）、**可撤销并查集**（只按秩合并、不路径压缩，线段树分治要用）。
- 树状数组：单点改区间查、区间改单点查、区间改区间查（两个 BIT）、二维 BIT、BIT 上二分求第 k 小。
- 线段树：区间加 / 乘懒标记、区间赋值、区间和与最值、动态开点、权值线段树、线段树合并、扫描线。
- ST 表（RMQ，不支持修改）、分块（区间加 + 区间和）。
- 平衡树：先会 FHQ Treap 的 `split / merge`（P7 再深挖）。

判据：10 分钟内默写「树状数组区间加区间和」和「线段树区间乘加」；能解释懒标记为什么可以合并。

常见坑：懒标记下传顺序（先乘后加）；区间开闭；线段树内存开 4 倍；`n = 1e5` 的链会递归爆栈（改写成迭代或加深系统栈）。

## 六、P3 图论（4 周）

- 存图：`vector<vector<pair<int,int>>>` 或链式前向星；无向图边数乘 2。
- 遍历：DFS / BFS、连通块、二分图染色、拓扑排序 + DAG 上 DP。
- 最短路：Dijkstra（堆优化，不能有负权）、SPFA（判负环，非必要不用）、Floyd（`n <= 500`，最小环、传递闭包）、01-BFS、Johnson（稀疏负权全源）。
- 生成树：Kruskal（边排序 + 并查集）、Prim（稠密图）、次小生成树（倍增维护最大 / 次大边）、Kruskal 重构树（瓶颈路）、最小树形图（朱刘算法，**增量**）。
- 连通性：Tarjan 求割点 / 桥、点双 / 边双、缩点 + DAG DP；圆方树（**增量**）。
- 二分图：匈牙利 / Dinic 最大匹配、König 定理（最小点覆盖 = 最大匹配）、最大独立集、最大团、KM 最大权匹配（**增量**）。
- 树上：LCA（倍增 / 树剖）、dfs 序（子树是连续区间）、树上差分（点 / 边）、树的重心与直径。
- 欧拉路：奇点数为 0 或 2 时存在，注意自环与连通性判定。
- 网络流：先把 Dinic 模板写熟（建模在 P8）。

判据：手写 Dijkstra + Tarjan 割点 + 树剖 LCA；拿到题能判断是「最短路 + 缩点」还是「二分 + 连通性」。

常见坑：Dijkstra 的 `greater<>` 比较器；重边与自环；多测要清 `head`、`dfn`、`low`；`vector` 存图比前向星慢但够用，`1e6` 边别用 `vector`。

## 七、P4 动态规划（6 周）

方法论：先写暴力搜索，再问「哪些参数是多余的」，删掉多余参数就是状态。

- 线性 DP：LIS（`O(n log n)` 的 `lower_bound` 写法）、LCS、最大子段和、状态机 DP。
- 背包：01 / 完全 / 多重（单调队列优化）/ 分组 / 依赖（树上背包）/ 二维费用 / 方案数 / 输出方案。
- 区间 DP：`dp[l][r]`，环形拆链、括号序列、消消乐。
- 树形 DP + 换根 DP：先算子树的答案，再把父亲的贡献推给儿子。
- 状压 DP + SOS DP：子集 / 超集和，`O(n 2ⁿ)` 用高维前缀和。
- 数位 DP：`dfs(pos, limit, lead, ...)` 记忆化模板。
- 概率 / 期望 DP：期望的线性性、正向（从起点推）与逆向（从终点倒推）别混用。
- 计数 DP + 容斥：先算合法，再用「总数减不合法」。

**DP 优化清单（金牌分水岭）**：

| 优化手段 | 什么时候用 | 复杂度变化 |
|:--|:--|:--|
| 单调队列 | 转移形如 `dp[i] = min(dp[j] + w(i-j))` 且窗口单调 | `O(n²)` → `O(n)` |
| 斜率优化 | 转移是点积形式 `dp[i] = min(dp[j] + a_i b_j + c_j)` | `O(n²)` → `O(n)` 或 `O(n log n)` |
| 决策单调性 | 最优决策点随 `i` 单调（四边形不等式） | `O(n²)` → `O(n log n)` |
| 矩阵快速幂 | 状态数小、转移固定、步数巨大 | `O(n³ log k)` |
| 倍增 | 图上走 `2^k` 步 | 预处理 + 合并 |
| bitset | 可达性、背包计数 | 除以 64 |
| 数据结构优化 | 转移是区间最值 / 区间和 | 加一个 `log` |
| wqs 二分 | 「恰好选 k 个」且答案关于 k 凸 | 去掉一维，`O(n log W)` |
| 分治 FFT | 转移含卷积 | `O(n log²n)` |

判据：见 [DP 训练题单](/private/dp-training-list/) 的「DP 五问」；每题 10 分钟内说出状态定义、转移、边界。

## 八、P5 数学（6 周）

- 数论：`gcd / exgcd`、线性筛、逆元（费马 / 欧拉 / 线性递推）、CRT / exCRT、欧拉函数、积性函数、莫比乌斯反演、整除分块、杜教筛（**增量**）、BSGS（**增量**）、Miller-Rabin + Pollard-Rho（**增量**）。
- 组合：组合数（阶乘 + 逆元）、Lucas、卡特兰 / 斯特林 / 贝尔数、容斥与二项式反演、min-max 容斥（**增量**）、生成函数（**增量**）。
- 线性代数：矩阵快速幂、高斯消元（浮点 / 模意义）、线性基、行列式与矩阵树定理（**增量**）。
- 概率与期望：期望线性性、条件期望、马尔可夫链直觉。
- 博弈：Nim、SG 函数、反 Nim、阶梯博弈。
- 多项式：FFT / NTT（模 998244353）、多项式求逆 / 开根 / ln / exp、分治 FFT、任意模数 NTT（**增量**）。

判据：能把「求前缀莫比乌斯函数和」推到杜教筛；能手推一个莫反式子的变换；能默写 NTT。

常见坑：取模后负数；乘法忘 `1LL *`；模数非质数时逆元不存在；`int` 存乘积溢出。

## 九、P6 字符串（4 周）

- 哈希：单 / 双哈希、自然溢出会被卡（改用大质数模）、区间哈希、树哈希。
- KMP：`nxt` 数组、失配树（fail 树的子树含义）；Z 函数（扩展 KMP）。
- Manacher：回文半径、回文自动机 PAM（**增量**）。
- Trie：普通 Trie、01-Trie（最大异或）、可持久化 Trie（**增量**）。
- AC 自动机：fail 树，多模式串匹配，fail 树上的树状数组 / 线段树。
- 后缀数组 SA：倍增 `O(n log n)`、`height` 数组、LCP 应用（本质不同子串数、多串最长公共子串）。
- 后缀自动机 SAM：endpos 等价类、parent 树、广义 SAM（**增量**）、后缀平衡树（**增量**）。

判据：默写 KMP、ACAM、SAM 建树；能用 SA 求本质不同子串数；能说清 SAM 每个状态代表什么。

常见坑：SAM 节点数要开 `2n`；多串建 SAM 要在每个串开始时把 `last` 重置为根；`nxt` 从 0 还是 1 开始要前后一致。

## 十、P7 高级数据结构（6 周，金牌分水岭）

先看「需求 → 结构」选择表，再逐个补细节。

| 需求 | 首选 | 备选 | 单次操作 |
|:--|:--|:--|:--|
| 静态区间第 k 小 | 主席树 | 归并树、整体二分 | `O(log n)` |
| 带修区间第 k 小（在线） | 树状数组套权值线段树 | 线段树套平衡树 | `O(log²n)` |
| 带修区间第 k 小（离线） | 整体二分 | CDQ + 值域分块 | `O(log V log n)` |
| 区间 rank、前驱后继 | 线段树套平衡树 | 分块 | `O(log²n)` |
| 路径修改 + 路径查询 | 树链剖分 + 线段树 | LCT | `O(log²n)` |
| 动态加删边、动态连通性 | LCT | 树剖 + 线段树 | 均摊 `O(log n)` |
| 子树统计（离线） | DSU on tree | 线段树合并、dfs 序 + BIT | `O(n log n)` |
| 树上路径计数（距离相关） | 点分治 | 点分树（动态） | `O(n log n)` |
| 动态点权改 + 距离查询 | 点分树 + 树状数组 | LCT | `O(log²n)` |
| 三维偏序 | CDQ 分治 | 树套树、KD-Tree | `O(n log²n)` |
| 区间 chmin/chmax + 求和 | Segment Tree Beats | 分块 | 均摊 `O(log n)` |
| 区间插线段求最值 | 李超线段树 | 线段树套凸包 | `O(log²n)` |
| 大量离线区间查询 | 莫队 | 分块 | `O((n+m)√n)` |

### 1. 树链剖分（HLD）

两遍 dfs 求 `size / heavy / top / dfn`；路径拆成 `O(log n)` 条重链，每条链在 `dfn` 上是连续区间，交给线段树。

- 路径查询 / 修改：`O(log²n)`；子树查询：`dfn[u]` 到 `dfn[u] + size[u] - 1` 一段，`O(log n)`。
- LCA 用 `top` 跳，比倍增常数小。
- 坑：边权转点权时（把边权记在深度较大的点上），最后一段要排除 LCA 那个点；`dfn` 从 1 开始。

### 2. 树套树（重点）

一句话：外层结构管一个维度（通常是位置区间），内层结构管另一个维度（通常是值域），嵌套起来做「同时满足两个条件」的统计。

三种主流形态：

| 形态 | 外层 | 内层 | 代表题 | 空间 |
|:--|:--|:--|:--|:--|
| 线段树套平衡树 | 位置线段树 | 每节点一棵 FHQ Treap | [P3380 树套树](https://www.luogu.com.cn/problem/P3380) | `O(n log n)` |
| 树状数组套权值线段树 | 位置树状数组 | 动态开点权值线段树 | [P2617 Dynamic Rankings](https://www.luogu.com.cn/problem/P2617) | `O(n log²n)` |
| 可持久化线段树（主席树） | 前缀版本 | 权值线段树 | [P3834 静态区间第 k 小](https://www.luogu.com.cn/problem/P3834) | `O(n log n)` |

以「树状数组套权值线段树」为例，实现要点：

1. 离线读入所有操作，把出现过的值离散化成 `[1, m]`。
2. `bit[i]` 挂一棵以值域为下标的动态开点线段树；`modify(pos, val, delta)` 沿着 BIT 上 `O(log n)` 个位置，每个位置各插入一次。
3. 查询 `[l, r]` 第 k 小：同时取出 `l-1` 与 `r` 的 `O(log n)` 个根，两两作差，靠「右子树节点数之和」决定往哪边走。
4. 空间先算再写：节点数上界约 `(n + q) * log2(n) * log2(m)`，`n = q = 1e5` 时约 `3e7` 个节点，用 `int` 静态数组 + 内存池，别用 `vector` 的 `push_back`。

变体：

- 树上路径第 k 小：`root[u] + root[v] - root[lca] - root[fa[lca]]` 四个根一起走。
- 带区间修改：内层换成「线段树套平衡树」，外层线段树每个节点维护排序数组 + 标记，或者直接上整体二分 / CDQ。
- 二维数点 / 矩形加：树状数组套树状数组、KD-Tree。

坑：

- **MLE 是这一节最常见的死法**，先算空间再写；
- 多测要清内存池指针和所有新开节点的左右儿子；
- 强制在线的题不能用整体二分，只能树套树；
- 内层用 `map / unordered_map` 常数爆炸，必须手写数组。

### 3. 可持久化结构

- 主席树：区间第 k 小（`O(log n)`）、区间内某值出现次数、树上路径。
- 可持久化数组 / 并查集：用「按秩合并 + 不路径压缩」，一次修改只动 `O(log n)` 个节点。
- 可持久化平衡树（FHQ）：`split` 时复制路径上的节点。
- 坑：`root[]` 数组大小 = 修改次数；每个版本都新建 `log n` 个节点，节点数要开够。

### 4. 点分治与点分树

- 点分治：每次找重心，统计「经过重心」的路径，再对每棵子树递归。
  - 复杂度 `O(n log n)`；`getRoot` 必须按当前连通块重算 `size`，否则复杂度退化。
  - 套路：到重心的距离排序 + 双指针；容斥时「先加整棵树的答案，再减去每棵子树内部的答案」。
- 点分树（动态点分治）：把每层的重心连成一棵树，深度 `O(log n)`。
  - 每个点维护「到各级祖先重心的距离」（空间 `O(n log n)`），配合树状数组 / 线段树做单点修改与距离查询，`O(log²n)`。
  - 修改时沿点分树的父亲链向上跳，查询时用容斥减去同一子树。
- 坑：距离要按层存（`dis[dep][i]`）；重心找错直接退化；多测清空。

### 5. 平衡树系列

- FHQ Treap：`split / merge` 两个函数搞定插入、删除、区间翻转、可持久化；随机优先级是核心。
- Splay：区间翻转、LCT 的基础；`pushup / pushdown` 写错会静默 WA。
- 替罪羊树：暴力重构，适合需要「按值插入」且不想写旋转的场景。
- 坑：不写 `pushdown` 就翻转；`split` 后忘了合并回去。

### 6. 分块与莫队

- 普通莫队：块大小 `√n`，复杂度 `O((n + m)√n)`；奇偶排序（块序交替）能快一倍。
- 带修莫队：三维（左、右、时间），块大小 `n^{2/3}`，复杂度 `O(n^{5/3})`。
- 树上莫队：欧拉序进 / 出各出现一次，`LCA` 单独处理。
- 回滚莫队：只加不删，维护「不删除的答案」；适合区间 mex / 最大值。
- 值域分块：修改 `O(1)`、查询 `O(√n)`，比分块套分块好写。

### 7. 其他高频

- 线段树合并：对每个点开一棵动态开点线段树，合并时把两棵树加起来；总复杂度 `O(总节点数)`，常用于树上统计。
- DSU on tree（树上启发式合并）：先递归轻儿子并清空，再递归重儿子保留，最后暴力加轻儿子；`O(n log n)`。
- 长链剖分：合并深度相关的 DP，`O(n)`（指针技巧）。
- 李超线段树：区间插入线段、单点查询最值；标记永久化，`O(log²n)`。
- Segment Tree Beats：区间 `chmin / chmax` + 求和，均摊 `O((n + q) log n)`，靠「最大值 / 次大值」剪枝。
- LCT：`access / makeroot / split / link / cut`，均摊 `O(log n)`，支持动态树上的路径查询与连通性。
- KD-Tree：多维最近点、矩形和；建树按方差最大维切分，查询靠剪枝。

## 十一、P8 高级专题（8 周）

### 1. CDQ 分治（重点）

一句话：**只统计「左边的修改对右边的询问」的贡献**，两半内部递归处理，跨区间的贡献用树状数组 / 归并 `O(n log n)` 统计掉。

适用条件：离线、能拆成「修改 + 询问」、修改之间互不影响（先后关系用时间 / 下标维表达）。

典型题型：三维偏序（P3810）、动态逆序对（P3157，把「删除时间」当一维）、带修改矩阵和（P4390，时间 + x + y）、CDQ 优化 DP（P2487 拦截导弹、P4093 序列）。

复杂度：`O(n log²n)`（分治 `log n` 层，每层树状数组 `log n`）。

代码骨架（三维偏序）：

```cpp
void cdq(int l, int r) {
  if (l == r) return;
  int mid = (l + r) >> 1;
  cdq(l, mid); cdq(mid + 1, r);              // 两边内部先算完，且都按 b 有序
  int i = l;
  for (int j = mid + 1; j <= r; ++j) {        // 右半每个点收左半的贡献
    while (i <= mid && a[i].b <= a[j].b) { bit.add(a[i].c, a[i].cnt); ++i; }
    a[j].ans += bit.sum(a[j].c);
  }
  for (int t = i - 1; t >= l; --t) bit.add(a[t].c, -a[t].cnt);   // 撤销，别 memset
  // 归并按 b 排序，保证上一层拿到的是有序序列
  int p = l, q = mid + 1, k = l;
  while (p <= mid && q <= r) tmp[k++] = (a[p].b <= a[q].b ? a[p++] : a[q++]);
  while (p <= mid) tmp[k++] = a[p++];
  while (q <= r) tmp[k++] = a[q++];
  for (int t = l; t <= r; ++t) a[t] = tmp[t];
}
```

实现要点：

1. **去重**：三元组完全相同的先合并计数（用 `cnt` 当权值），否则会重复统计。
2. **严格与非严格**：`<=` 还是 `<` 决定是「小于等于」还是「严格小于」，写之前定死。
3. **两套顺序**：外层按第一维排序 + 分治，内层按第二维归并 + 树状数组管第三维。三层维度各用各的结构，别混。
4. **撤销**：只撤销本层加过的位置，禁止 `memset` 整个树状数组，否则退化到 `O(n²)`。
5. **值域**：第三维离散化后作为 BIT 下标，注意 `1` 起始。
6. **答案类型**：`long long`（动态逆序对一类）。
7. **优化 DP**：转移必须用「上一轮」的 dp 值，需要临时数组，同一层内不能互相转移；先 `cdq(l, mid)` 再统计跨再 `cdq(mid+1, r)`。
8. **四维偏序**：CDQ 套 CDQ（或 CDQ + KD-Tree）。

三种离线做法的取舍：

| 方法 | 离线 | 分的是什么 | 复杂度 | 常数 | 典型场景 |
|:--|:--|:--|:--|:--:|:--|
| CDQ 分治 | 必须离线 | 时间 / 下标 | `O(n log²n)` | 小 | 三维偏序、动态逆序对、DP 优化 |
| 整体二分 | 必须离线 | 答案值域 | `O((n+q) log V log n)` | 小 | 第 k 小、答案可二分 |
| 树套树 | 可在线 | 位置 + 值域 | `O(log²n)` | 大 | 强制在线、要修改 |

### 2. 整体二分（重点）

一句话：所有询问**一起**二分答案。取值域中点 `mid`，用树状数组统计「加入值 ≤ mid 的修改」的贡献，把询问分成「答案 ≤ mid」和「答案 > mid」两组，递归下去。

适用：离线、答案是「第 k 小 / 第 k 大 / 满足条件的最小值」、能快速统计「≤ mid 的贡献」。

复杂度：`O((n + q) log V log n)`。

```cpp
void solve(int l, int r, int ql, int qr) {
  if (ql > qr) return;
  if (l == r) {
    for (int i = ql; i <= qr; ++i) if (q[i].type == QUERY) ans[q[i].id] = l;
    return;
  }
  int mid = (l + r) >> 1, c1 = 0, c2 = 0;
  for (int i = ql; i <= qr; ++i) {
    if (q[i].type == MODIFY) {
      if (q[i].val <= mid) { bit.add(q[i].pos, q[i].cnt); tmp1[++c1] = q[i]; }
      else tmp2[++c2] = q[i];
    } else {
      int t = bit.sum(q[i].pos);            // 值 <= mid 的个数
      if (t >= q[i].k) tmp1[++c1] = q[i];
      else { q[i].k -= t; tmp2[++c2] = q[i]; }
    }
  }
  for (int i = 1; i <= c1; ++i) if (tmp1[i].type == MODIFY) bit.add(tmp1[i].pos, -tmp1[i].cnt);
  for (int i = 1; i <= c1; ++i) q[ql + i - 1] = tmp1[i];
  for (int i = 1; i <= c2; ++i) q[ql + c1 + i - 1] = tmp2[i];
  solve(l, mid, ql, ql + c1 - 1);
  solve(mid + 1, r, ql + c1, ql + c1 + c2 - 1);
}
```

要点与坑：

- 递归前必须把 BIT 清干净（只撤销加过的）；
- 修改 / 询问要按时间顺序放，修改先于其后的询问；
- 值域离散化到 `[1, m]`，`l == r` 时直接落答案；
- 询问的 `k` 在分组时会被减掉，注意后续递归用的是修改后的 `k`。

### 3. 决策单调性 / 斜率优化 / wqs 二分

- 决策单调性：最优决策点随 `i` 单调。写法有两种——分治（`solve(l, r, optL, optR)`，`O(n log n)`）和二分栈（维护每段的决策点，`O(n log n)`）。
- 斜率优化：把转移整理成 `dp[i] = min_j (k_i x_j + b_j) + c_i`，用凸包 + 单调队列（`x` 单调时 `O(n)`），否则二分 / 平衡树（`O(n log n)`）。
- wqs 二分（拉格朗日松弛 / Aliens trick）：答案是「恰好 k 个」且关于 k 凸时，给每选一个加一个惩罚 `lambda`，二分 `lambda` 使选出的个数等于 k。
- 分治 FFT：转移带卷积时，用 CDQ 的框架在每层做一次 NTT，`O(n log²n)`。

### 4. 网络流与建模

基础：Dinic（分层 + 当前弧，`O(V²E)`，单位网络 `O(E√V)`）；最大流加强版用 HLPP / ISAP；费用流用 SPFA 或「Dijkstra + 势能」。

建模表：

| 模型 | 建图要点 |
|:--|:--|
| 二分图最大匹配 | 源 → 左部（容量 1），左 → 右（1），右部 → 汇（1） |
| 最小点覆盖 / 最大独立集 | König：最小点覆盖 = 最大匹配，最大独立集 = 点数 − 最大匹配 |
| 最大权闭合子图 | 正权点连源，负权点连汇，依赖边容量 `inf`；答案 = 正权和 − 最小割 |
| 最小路径覆盖（DAG） | 拆点，原边连 `inf`，路径数 = n − 最大匹配 |
| 方格取数 / 相邻冲突 | 黑白染色 → 二分图 → 最小割 |
| 文理分科类 | 两头收益 → 对称建图，最小割 |
| 上下界可行流 | 先减去下界，补超级源汇，判满流 |
| 二分 + 最大流判定 | 「能否在 x 天内完成」把时间轴建图 |

坑：`inf` 取 `1e9` 还是 `0x3f3f3f3f` 要统一；边数组开 `2 * (边数)`；多测清 `head` 与 `tot`；费用流要判负环。

### 5. 虚树、圆方树、树上问题

- 虚树：把关键点按 dfs 序排序，加入相邻 `LCA`，用单调栈建树；总点数 `O(k)`，在虚树上做 DP / 差分。代表题 P2495 消耗战、P4103 大工程、P3233 世界树。
- 圆方树：点双连通分量缩成方点，处理「必经点」「仙人掌」问题。
- 树上四种武器怎么选：**子树 → dfs 序 + 线段树 / DSU on tree；路径 → 树剖 / LCT；动态点权 + 距离 → 点分树；多点集 → 虚树**。

### 6. 计算几何

- 基础：向量点积 / 叉积、极角排序、`eps` 处理（浮点比较用 `sgn`）。
- 凸包：Andrew 单调链 `O(n log n)`；旋转卡壳求直径 / 最远点对。
- 半平面交：`O(n log n)`，注意平行与共线。
- 最小圆覆盖：随机增量，期望 `O(n)`。
- 平面最近点对：分治 `O(n log n)`。
- 坑：整数叉积用 `long long`；`eps = 1e-9`；退化情况（三点共线、重合点）单独判。

### 7. 其他金牌专题

- 2-SAT：建蕴含图 → Tarjan SCC → 判 `x` 与 `¬x` 是否同 SCC；赋值按 SCC 编号反序。
- 差分约束：`x_v - x_u <= w` 建边 `u → v` 权 `w`，跑最短路判负环；最长路方向别搞反。
- 线段树分治：边存在时间区间挂线段树，dfs 时用可撤销并查集加边、回溯撤销，做离线动态连通性。
- 博弈论：SG 函数、Nim、反 Nim、阶梯博弈、树上删边博弈。
- 随机化：字符串双哈希、Treap 随机优先级、随机化贪心、模拟退火。
- bitset 优化：传递闭包（`O(n³ / 64)`）、背包计数、LCS。
- 根号分治：度数分治（大点 / 小点）、值域分治、时间分治。
- 构造与交互：先构造小规模答案找规律，再做「增量构造」；交互题先把询问次数上限算清楚。

## 十二、比赛与队伍训练

节奏（每周）：

| 时间 | 内容 |
|:--|:--|
| 周一到周三 | 一个专题：看 1 篇博客 + 写 1 份模板 + 刷 3~5 题 |
| 周四到周五 | 补上周模拟赛的题（每题限 30 分钟看题解） |
| 周六 | 5 小时模拟赛（打印题面、不查题解、按正式赛规则） |
| 周日 | 复盘 + 写题解 + 更新模板库 |

队伍规则：

- 开题顺序：先把所有题读完（15 分钟内），按「稳、准、快」排，不按题号做。
- 卡题 30 分钟无进展就换人 / 换题，不要三个人同时卡一道。
- 罚时意识：简单题先过，别在一道题上交 10 发。
- 分工参考：A 数论 + 数据结构，B 图论 + DP，C 字符串 + 几何 + 杂项；比赛时按题面动态调整。

补题三行法（每题写三条）：考点是什么、我当时卡在哪、下次见到怎么想。

金牌判据：

- 模拟赛稳定 7 题以上，其中 2 道非模板题；
- CF Div.1 稳定 3 题，单题 2400 能独立推出来；
- 至少 3 个高级专题（CDQ、整体二分、网络流、点分治、LCT 之类）能不看模板手写。

## 十三、题单（按阶段集中）

> 洛谷题号已全部核对；Codeforces 的 rating 取自官方题库。带「模板」字样的先默写代码再做题。

### P0 语言与入门

| 题目 | 练什么 |
|:--|:--|
| [P1001 A+B Problem](https://www.luogu.com.cn/problem/P1001) | 输入输出格式 |
| [P1177 【模板】排序](https://www.luogu.com.cn/problem/P1177) | `sort` / `nth_element` |
| [P1059 明明的随机数](https://www.luogu.com.cn/problem/P1059) | 排序 + `unique` 去重 |
| [P1090 合并果子](https://www.luogu.com.cn/problem/P1090) | 优先队列 + 贪心 |
| [P1223 排队接水](https://www.luogu.com.cn/problem/P1223) | 排序 + 前缀和 |
| [P1012 拼数](https://www.luogu.com.cn/problem/P1012) | 自定义比较器 |
| [P1308 统计单词数](https://www.luogu.com.cn/problem/P1308) | 字符串处理、大小写 |
| [P1042 乒乓球](https://www.luogu.com.cn/problem/P1042) | 模拟 + 边界 |

### P1 基础算法

| 题目 | 练什么 |
|:--|:--|
| [P2249 查找](https://www.luogu.com.cn/problem/P2249) | 二分查找模板 |
| [P1102 A-B 数对](https://www.luogu.com.cn/problem/P1102) | 排序 + 二分计数 |
| [P1024 一元三次方程求解](https://www.luogu.com.cn/problem/P1024) | 实数二分 |
| [P1873 砍树](https://www.luogu.com.cn/problem/P1873) | 二分答案入门 |
| [P2678 跳石头](https://www.luogu.com.cn/problem/P2678) | 二分答案 + 贪心 check |
| [P3853 路标设置](https://www.luogu.com.cn/problem/P3853) | 二分答案（最大值最小） |
| [P1182 数列分段 Section II](https://www.luogu.com.cn/problem/P1182) | 二分答案经典 |
| [P1115 最大子段和](https://www.luogu.com.cn/problem/P1115) | 线性扫描 / 分治 |
| [P1908 逆序对](https://www.luogu.com.cn/problem/P1908) | 归并分治 + 树状数组 |
| [P3397 地毯](https://www.luogu.com.cn/problem/P3397) | 二维差分 |
| [P2367 语文成绩](https://www.luogu.com.cn/problem/P2367) | 差分 |
| [P5638 光骓者的荣耀](https://www.luogu.com.cn/problem/P5638) | 前缀和 |
| [P5788 【模板】单调栈](https://www.luogu.com.cn/problem/P5788) | 单调栈 |
| [P1886 滑动窗口](https://www.luogu.com.cn/problem/P1886) | 单调队列模板 |
| [P1440 求 m 区间内的最小值](https://www.luogu.com.cn/problem/P1440) | 单调队列 |
| [P1901 发射站](https://www.luogu.com.cn/problem/P1901) | 单调栈应用 |
| [P1950 长方形](https://www.luogu.com.cn/problem/P1950) | 单调栈统计子矩形 |
| [P1094 纪念品分组](https://www.luogu.com.cn/problem/P1094) | 贪心 + 双指针 |
| [P4995 跳跳！](https://www.luogu.com.cn/problem/P4995) | 贪心 |
| [P1208 混合牛奶](https://www.luogu.com.cn/problem/P1208) | 贪心 |

### P2 数据结构

| 题目 | 练什么 |
|:--|:--|
| [P1551 亲戚](https://www.luogu.com.cn/problem/P1551) | 并查集入门 |
| [P3367 【模板】并查集](https://www.luogu.com.cn/problem/P3367) | 路径压缩 + 按秩合并 |
| [P1525 关押罪犯](https://www.luogu.com.cn/problem/P1525) | 扩展域并查集 / 二分 + 染色 |
| [P2024 食物链](https://www.luogu.com.cn/problem/P2024) | 带权并查集 |
| [P1196 银河英雄传说](https://www.luogu.com.cn/problem/P1196) | 带权并查集（距离） |
| [P3958 奶酪](https://www.luogu.com.cn/problem/P3958) | 并查集 / 连通块 |
| [P1536 村村通](https://www.luogu.com.cn/problem/P1536) | 并查集计数 |
| [P1892 团伙](https://www.luogu.com.cn/problem/P1892) | 扩展域并查集 |
| [P3374 【模板】树状数组 1](https://www.luogu.com.cn/problem/P3374) | 单点改区间查 |
| [P3368 【模板】树状数组 2](https://www.luogu.com.cn/problem/P3368) | 区间改单点查 |
| [P1966 火柴排队](https://www.luogu.com.cn/problem/P1966) | 逆序对 + 离散化 |
| [P4514 上帝造题的七分钟](https://www.luogu.com.cn/problem/P4514) | 二维树状数组区间加区间和 |
| [P3372 【模板】线段树 1](https://www.luogu.com.cn/problem/P3372) | 区间加区间和 |
| [P3373 【模板】线段树 2](https://www.luogu.com.cn/problem/P3373) | 区间乘 + 区间加 |
| [P5490 【模板】扫描线](https://www.luogu.com.cn/problem/P5490) | 矩形面积并 |
| [P2572 序列操作](https://www.luogu.com.cn/problem/P2572) | 多标记线段树 |
| [P4145 花神游历各国](https://www.luogu.com.cn/problem/P4145) | 区间开方 + 剪枝 |
| [P1198 最大数](https://www.luogu.com.cn/problem/P1198) | 线段树 / ST 表 / 单调栈 |
| [P3870 开关](https://www.luogu.com.cn/problem/P3870) | 区间取反 |
| [P1471 方差](https://www.luogu.com.cn/problem/P1471) | 维护区间和与平方和 |
| [P3865 【模板】ST 表](https://www.luogu.com.cn/problem/P3865) | RMQ |
| [P2880 Balanced Lineup](https://www.luogu.com.cn/problem/P2880) | RMQ 应用 |
| [P2801 教主的魔法](https://www.luogu.com.cn/problem/P2801) | 分块入门 |

### P3 图论

| 题目 | 练什么 |
|:--|:--|
| [P5318 查找文献](https://www.luogu.com.cn/problem/P5318) | 图的遍历 |
| [P1113 杂务](https://www.luogu.com.cn/problem/P1113) | 拓扑排序 + DP |
| [P4017 最大食物链计数](https://www.luogu.com.cn/problem/P4017) | DAG 计数 |
| [P1807 最长路](https://www.luogu.com.cn/problem/P1807) | DAG 最长路 |
| [P3371 单源最短路径（弱化版）](https://www.luogu.com.cn/problem/P3371) | Dijkstra 基础 |
| [P4779 【模板】单源最短路径](https://www.luogu.com.cn/problem/P4779) | 堆优化 Dijkstra |
| [P1629 邮递员送信](https://www.luogu.com.cn/problem/P1629) | 正反建图 |
| [P1144 最短路计数](https://www.luogu.com.cn/problem/P1144) | 最短路 + 计数 |
| [P1462 通往奥格瑞玛的道路](https://www.luogu.com.cn/problem/P1462) | 二分 + 最短路 |
| [P1119 灾后重建](https://www.luogu.com.cn/problem/P1119) | Floyd 加点 |
| [P6175 无向图的最小环问题](https://www.luogu.com.cn/problem/P6175) | Floyd 求最小环 |
| [P3366 【模板】最小生成树](https://www.luogu.com.cn/problem/P3366) | Kruskal / Prim |
| [P1195 口袋的天空](https://www.luogu.com.cn/problem/P1195) | MST 计数 |
| [P4180 严格次小生成树](https://www.luogu.com.cn/problem/P4180) | 倍增 + MST |
| [P1967 货车运输](https://www.luogu.com.cn/problem/P1967) | 最大瓶颈路 |
| [P3388 【模板】割点](https://www.luogu.com.cn/problem/P3388) | Tarjan 割点 |
| [P8435 【模板】点双连通分量](https://www.luogu.com.cn/problem/P8435) | 点双 |
| [P8436 【模板】边双连通分量](https://www.luogu.com.cn/problem/P8436) | 边双 |
| [P1656 炸铁路](https://www.luogu.com.cn/problem/P1656) | 桥 |
| [P3225 矿场搭建](https://www.luogu.com.cn/problem/P3225) | 点双 + 计数 |
| [P3387 【模板】缩点](https://www.luogu.com.cn/problem/P3387) | SCC + DAG 上 DP |
| [P2341 受欢迎的牛](https://www.luogu.com.cn/problem/P2341) | SCC 结论 |
| [P2812 校园网络](https://www.luogu.com.cn/problem/P2812) | SCC 入度出度 |
| [P1407 稳定婚姻](https://www.luogu.com.cn/problem/P1407) | SCC 建模 |
| [P4782 【模板】2-SAT](https://www.luogu.com.cn/problem/P4782) | 2-SAT |
| [P4171 满汉全席](https://www.luogu.com.cn/problem/P4171) | 2-SAT 建模 |
| [P3386 【模板】二分图最大匹配](https://www.luogu.com.cn/problem/P3386) | 匈牙利 / Dinic |
| [P2756 飞行员配对方案问题](https://www.luogu.com.cn/problem/P2756) | 匹配 + 输出方案 |
| [P1129 矩阵游戏](https://www.luogu.com.cn/problem/P1129) | 匹配建模 |
| [P1640 连续攻击游戏](https://www.luogu.com.cn/problem/P1640) | 匹配建模 |
| [P3379 【模板】最近公共祖先](https://www.luogu.com.cn/problem/P3379) | 倍增 / 树剖 LCA |
| [P4281 紧急集合](https://www.luogu.com.cn/problem/P4281) | LCA 结论 |
| [P2420 让我们异或吧](https://www.luogu.com.cn/problem/P2420) | 前缀异或 + LCA |
| [P3258 松鼠的新家](https://www.luogu.com.cn/problem/P3258) | 树上点差分 |
| [P3128 Max Flow](https://www.luogu.com.cn/problem/P3128) | 树上点差分 |
| [P2680 运输计划](https://www.luogu.com.cn/problem/P2680) | 二分 + 树上差分 |
| [P3384 【模板】树链剖分](https://www.luogu.com.cn/problem/P3384) | 树剖模板 |
| [P3178 树上操作](https://www.luogu.com.cn/problem/P3178) | 树剖 + 线段树 |
| [P2146 软件包管理器](https://www.luogu.com.cn/problem/P2146) | 树剖 + 区间赋值 |
| [P2590 树的统计](https://www.luogu.com.cn/problem/P2590) | 树剖 |
| [P4114 Qtree1](https://www.luogu.com.cn/problem/P4114) | 树剖 + 边权 |
| [P4315 月下毛景树](https://www.luogu.com.cn/problem/P4315) | 树剖 + 区间加与赋值 |
| [P3478 STA-Station](https://www.luogu.com.cn/problem/P3478) | 换根 DP |
| [P2986 Great Cow Gathering](https://www.luogu.com.cn/problem/P2986) | 换根 DP |

### P4 DP

| 题目 | 练什么 |
|:--|:--|
| [P1002 过河卒](https://www.luogu.com.cn/problem/P1002) | 网格 DP 入门 |
| [P1216 数字三角形](https://www.luogu.com.cn/problem/P1216) | 线性 DP |
| [P1048 采药](https://www.luogu.com.cn/problem/P1048) | 01 背包 |
| [P1060 开心的金明](https://www.luogu.com.cn/problem/P1060) | 01 背包变形 |
| [P1049 装箱问题](https://www.luogu.com.cn/problem/P1049) | 背包可达性 |
| [P1352 没有上司的舞会](https://www.luogu.com.cn/problem/P1352) | 树形 DP 入门 |
| [P2014 选课](https://www.luogu.com.cn/problem/P2014) | 树上背包 |
| [P1880 石子合并](https://www.luogu.com.cn/problem/P1880) | 区间 DP（环拆链） |
| [P1063 能量项链](https://www.luogu.com.cn/problem/P1063) | 区间 DP（环形） |
| [P4170 涂色](https://www.luogu.com.cn/problem/P4170) | 区间 DP |
| [P1005 矩阵取数游戏](https://www.luogu.com.cn/problem/P1005) | 区间 DP + 高精度 |
| [P1879 玉米田](https://www.luogu.com.cn/problem/P1879) | 状压 DP 入门 |
| [P1896 互不侵犯](https://www.luogu.com.cn/problem/P1896) | 状压 DP |
| [P2704 炮兵阵地](https://www.luogu.com.cn/problem/P2704) | 状压 + 三行状态 |
| [P1091 合唱队形](https://www.luogu.com.cn/problem/P1091) | LIS 变形 |
| [P1282 多米诺骨牌](https://www.luogu.com.cn/problem/P1282) | 差值 DP |
| [P1434 滑雪](https://www.luogu.com.cn/problem/P1434) | 记忆化搜索 |
| [P2196 挖地雷](https://www.luogu.com.cn/problem/P2196) | DAG 上 DP + 记录路径 |
| [P1044 栈](https://www.luogu.com.cn/problem/P1044) | 卡特兰数 / 区间 DP |
| [P1020 导弹拦截](https://www.luogu.com.cn/problem/P1020) | LIS 的 O(n log n) 写法 |
| [P1095 守望者的逃离](https://www.luogu.com.cn/problem/P1095) | 状态机 DP |
| [P1541 乌龟棋](https://www.luogu.com.cn/problem/P1541) | 多维 DP |
| [P1757 通天之分组背包](https://www.luogu.com.cn/problem/P1757) | 分组背包 |
| [P1832 A+B Problem（再升级）](https://www.luogu.com.cn/problem/P1832) | 完全背包计数 |
| [P2831 愤怒的小鸟](https://www.luogu.com.cn/problem/P2831) | 状压 + 抛物线预处理 |
| [P1433 吃奶酪](https://www.luogu.com.cn/problem/P1433) | 状压 + 距离 |
| [P2622 关灯问题 II](https://www.luogu.com.cn/problem/P2622) | 状压 BFS / DP |
| [P2396 yyy loves Maths VII](https://www.luogu.com.cn/problem/P2396) | 状压计数 |
| [P4310 绝世好题](https://www.luogu.com.cn/problem/P4310) | 按位 DP |
| [P1006 传纸条](https://www.luogu.com.cn/problem/P1006) | 双路径 DP |
| [P1387 最大正方形](https://www.luogu.com.cn/problem/P1387) | 二维 DP |
| [P1417 烹调方案](https://www.luogu.com.cn/problem/P1417) | 排序 + 背包 |
| [P1854 花店橱窗布置](https://www.luogu.com.cn/problem/P1854) | 线性 DP + 记录方案 |
| [P1776 宝物筛选](https://www.luogu.com.cn/problem/P1776) | 多重背包 + 单调队列 |
| [P2254 瑰丽华尔兹](https://www.luogu.com.cn/problem/P2254) | 单调队列优化 DP |
| [P3572 PTA-Little Bird](https://www.luogu.com.cn/problem/P3572) | 单调队列优化 DP |
| [P3628 特别行动队](https://www.luogu.com.cn/problem/P3628) | 斜率优化入门 |
| [P4072 征途](https://www.luogu.com.cn/problem/P4072) | 斜率优化 |
| [P5785 任务安排](https://www.luogu.com.cn/problem/P5785) | 斜率优化（含二分） |
| [P4767 邮局 加强版](https://www.luogu.com.cn/problem/P4767) | 四边形不等式 / 决策单调 |
| [P1912 诗人小 G](https://www.luogu.com.cn/problem/P1912) | 决策单调性 + 二分栈 |
| [P2602 数字计数](https://www.luogu.com.cn/problem/P2602) | 数位 DP 入门 |
| [P2657 windy 数](https://www.luogu.com.cn/problem/P2657) | 数位 DP |
| [P4317 花神的数论题](https://www.luogu.com.cn/problem/P4317) | 数位 DP + 幂 |
| [P4124 手机号码](https://www.luogu.com.cn/problem/P4124) | 数位 DP（多状态） |
| [P4999 烦人的数学作业](https://www.luogu.com.cn/problem/P4999) | 数位 DP 计数 |

### P5 数学

| 题目 | 练什么 |
|:--|:--|
| [P3383 【模板】线性筛素数](https://www.luogu.com.cn/problem/P3383) | 线性筛 |
| [P1865 A % B Problem](https://www.luogu.com.cn/problem/P1865) | 筛法 + 前缀和 |
| [P3812 【模板】线性基](https://www.luogu.com.cn/problem/P3812) | 线性基 |
| [P3857 彩灯](https://www.luogu.com.cn/problem/P3857) | 线性基计数 |
| [P4301 新 Nim 游戏](https://www.luogu.com.cn/problem/P4301) | 线性基 + 贪心 |
| [P3292 幸运数字](https://www.luogu.com.cn/problem/P3292) | 倍增 + 线性基 |
| [P4570 元素](https://www.luogu.com.cn/problem/P4570) | 线性基 + 排序贪心 |
| [P3390 【模板】矩阵快速幂](https://www.luogu.com.cn/problem/P3390) | 矩阵快速幂 |
| [P1939 矩阵加速（数列）](https://www.luogu.com.cn/problem/P1939) | 递推转矩阵 |
| [P4783 【模板】矩阵求逆](https://www.luogu.com.cn/problem/P4783) | 高斯消元求逆 |
| [P4035 球形空间产生器](https://www.luogu.com.cn/problem/P4035) | 高斯消元建模 |
| [P5431 模意义下的乘法逆元 2](https://www.luogu.com.cn/problem/P5431) | 前缀积 + 逆元 |
| [P3811 【模板】模意义下的乘法逆元](https://www.luogu.com.cn/problem/P3811) | 线性递推逆元 |
| [P1082 同余方程](https://www.luogu.com.cn/problem/P1082) | exgcd |
| [P1495 【模板】中国剩余定理](https://www.luogu.com.cn/problem/P1495) | CRT |
| [P4777 【模板】扩展中国剩余定理](https://www.luogu.com.cn/problem/P4777) | exCRT |
| [P2261 余数求和](https://www.luogu.com.cn/problem/P2261) | 整除分块 |
| [P2424 约数和](https://www.luogu.com.cn/problem/P2424) | 约数函数 + 整除分块 |
| [P3935 Calculating](https://www.luogu.com.cn/problem/P3935) | 约数个数前缀和 |
| [P2522 Problem b](https://www.luogu.com.cn/problem/P2522) | 莫比乌斯反演入门 |
| [P1829 Crash 的数字表格](https://www.luogu.com.cn/problem/P1829) | 莫反 + 整除分块 |
| [P3312 数表](https://www.luogu.com.cn/problem/P3312) | 莫反 + 树状数组离线 |
| [P3455 ZAP-Queries](https://www.luogu.com.cn/problem/P3455) | 莫反模板 |
| [P1447 能量采集](https://www.luogu.com.cn/problem/P1447) | 欧拉函数求和 |
| [P2158 仪仗队](https://www.luogu.com.cn/problem/P2158) | 欧拉函数 |
| [P4213 【模板】杜教筛](https://www.luogu.com.cn/problem/P4213) | 杜教筛 |
| [P3807 【模板】卢卡斯定理](https://www.luogu.com.cn/problem/P3807) | Lucas |
| [P2822 组合数问题](https://www.luogu.com.cn/problem/P2822) | 组合数递推 |
| [P1350 车的放置](https://www.luogu.com.cn/problem/P1350) | 组合计数 |
| [P4071 排列计数](https://www.luogu.com.cn/problem/P4071) | 错排 + 组合数 |
| [P1290 欧几里德的游戏](https://www.luogu.com.cn/problem/P1290) | 博弈 + 欧几里得 |
| [P2197 【模板】Nim 游戏](https://www.luogu.com.cn/problem/P2197) | Nim |
| [P1247 取火柴游戏](https://www.luogu.com.cn/problem/P1247) | Nim 构造 |
| [P2148 E&D](https://www.luogu.com.cn/problem/P2148) | SG 函数 |
| [P3235 江南乐](https://www.luogu.com.cn/problem/P3235) | 整除分块 + SG |
| [P4316 绿豆蛙的归宿](https://www.luogu.com.cn/problem/P4316) | 期望 DP（拓扑序） |
| [P6154 游走](https://www.luogu.com.cn/problem/P6154) | 期望 + DAG 计数 |
| [P1654 OSU!](https://www.luogu.com.cn/problem/P1654) | 期望的线性性 |
| [P1850 换教室](https://www.luogu.com.cn/problem/P1850) | 期望 DP |
| [P3232 游走](https://www.luogu.com.cn/problem/P3232) | 高斯消元 + 期望 |
| [P4550 收集邮票](https://www.luogu.com.cn/problem/P4550) | 期望 DP |
| [P3803 【模板】多项式乘法（FFT）](https://www.luogu.com.cn/problem/P3803) | FFT / NTT |
| [P1919 A*B Problem 升级版](https://www.luogu.com.cn/problem/P1919) | 高精度乘法 + NTT |
| [P4245 【模板】任意模数多项式乘法](https://www.luogu.com.cn/problem/P4245) | 任意模数 NTT |
| [P4238 【模板】多项式乘法逆](https://www.luogu.com.cn/problem/P4238) | 多项式求逆 |
| [P4725 多项式对数函数](https://www.luogu.com.cn/problem/P4725) | 多项式 ln |
| [P4726 多项式指数函数](https://www.luogu.com.cn/problem/P4726) | 多项式 exp |
| [P3338 力](https://www.luogu.com.cn/problem/P3338) | FFT 推式子 |
| [P3723 礼物](https://www.luogu.com.cn/problem/P3723) | FFT + 推式子 |

### P6 字符串

| 题目 | 练什么 |
|:--|:--|
| [P3375 【模板】KMP](https://www.luogu.com.cn/problem/P3375) | KMP 与失配树 |
| [P5410 【模板】扩展 KMP / Z 函数](https://www.luogu.com.cn/problem/P5410) | Z 函数 |
| [P3805 【模板】Manacher](https://www.luogu.com.cn/problem/P3805) | Manacher |
| [P4287 双倍回文](https://www.luogu.com.cn/problem/P4287) | Manacher 变形 |
| [P4551 最长异或路径](https://www.luogu.com.cn/problem/P4551) | 01-Trie |
| [P2580 于是他错误的点名开始了](https://www.luogu.com.cn/problem/P2580) | Trie |
| [P3808 AC 自动机（简单版）](https://www.luogu.com.cn/problem/P3808) | ACAM 入门 |
| [P3796 AC 自动机（简单版 II）](https://www.luogu.com.cn/problem/P3796) | ACAM 统计 |
| [P5357 【模板】AC 自动机](https://www.luogu.com.cn/problem/P5357) | fail 树上拓扑 / 差分 |
| [P2444 病毒](https://www.luogu.com.cn/problem/P2444) | ACAM + 判环 |
| [P3966 单词](https://www.luogu.com.cn/problem/P3966) | ACAM + fail 树计数 |
| [P3809 【模板】后缀排序](https://www.luogu.com.cn/problem/P3809) | SA |
| [P4051 字符加密](https://www.luogu.com.cn/problem/P4051) | SA 循环同构 |
| [P2852 Milk Patterns](https://www.luogu.com.cn/problem/P2852) | SA + height |
| [P2408 不同子串个数](https://www.luogu.com.cn/problem/P2408) | SA / SAM 计数 |
| [P4248 差异](https://www.luogu.com.cn/problem/P4248) | SA + 单调栈 |
| [P3804 【模板】后缀自动机](https://www.luogu.com.cn/problem/P3804) | SAM |
| [P3975 弦论](https://www.luogu.com.cn/problem/P3975) | SAM 上第 k 小 |
| [P6139 【模板】广义后缀自动机](https://www.luogu.com.cn/problem/P6139) | 广义 SAM |
| [P3649 回文串](https://www.luogu.com.cn/problem/P3649) | PAM |
| [P2375 动物园](https://www.luogu.com.cn/problem/P2375) | KMP 变形 |

### P7 高级数据结构

| 题目 | 练什么 |
|:--|:--|
| [P3380 【模板】树套树](https://www.luogu.com.cn/problem/P3380) | 线段树套平衡树 |
| [P2617 Dynamic Rankings](https://www.luogu.com.cn/problem/P2617) | 树状数组套权值线段树 |
| [P3834 静态区间第 k 小](https://www.luogu.com.cn/problem/P3834) | 主席树 |
| [P3835 【模板】可持久化平衡树](https://www.luogu.com.cn/problem/P3835) | 可持久化 FHQ |
| [P4148 简单题](https://www.luogu.com.cn/problem/P4148) | KD-Tree |
| [P3806 【模板】点分治](https://www.luogu.com.cn/problem/P3806) | 点分治入门 |
| [P4178 Tree](https://www.luogu.com.cn/problem/P4178) | 点分治 + 双指针 |
| [P4149 Race](https://www.luogu.com.cn/problem/P4149) | 点分治 + 桶 |
| [P2634 聪聪可可](https://www.luogu.com.cn/problem/P2634) | 点分治 + 计数 |
| [P6329 【模板】点分树](https://www.luogu.com.cn/problem/P6329) | 动态点分治 |
| [P3345 幻想乡战略游戏](https://www.luogu.com.cn/problem/P3345) | 点分树 + 带权距离 |
| [P2664 树上游戏](https://www.luogu.com.cn/problem/P2664) | 点分治统计 |
| [P3690 【模板】动态树（LCT）](https://www.luogu.com.cn/problem/P3690) | LCT 模板 |
| [P2147 洞穴勘测](https://www.luogu.com.cn/problem/P2147) | LCT 维护连通性 |
| [P3203 弹飞绵羊](https://www.luogu.com.cn/problem/P3203) | LCT / 分块 |
| [P1501 Tree II](https://www.luogu.com.cn/problem/P1501) | LCT + 区间加乘 |
| [P2387 魔法森林](https://www.luogu.com.cn/problem/P2387) | LCT 维护最小生成树 |
| [P1494 小 Z 的袜子](https://www.luogu.com.cn/problem/P1494) | 莫队入门 |
| [P2709 【模板】莫队](https://www.luogu.com.cn/problem/P2709) | 莫队模板 |
| [P4462 异或序列](https://www.luogu.com.cn/problem/P4462) | 莫队 + 异或前缀 |
| [P4137 Rmq Problem](https://www.luogu.com.cn/problem/P4137) | 回滚莫队 / 主席树 |
| [P1903 【模板】带修莫队](https://www.luogu.com.cn/problem/P1903) | 带修莫队 |
| [P4074 糖果公园](https://www.luogu.com.cn/problem/P4074) | 树上带修莫队 |
| [P3674 小清新人渣的本愿](https://www.luogu.com.cn/problem/P3674) | 莫队 + bitset |
| [P4103 大工程](https://www.luogu.com.cn/problem/P4103) | 虚树 |
| [P2495 【模板】虚树](https://www.luogu.com.cn/problem/P2495) | 虚树 + 树形 DP |
| [P3233 世界树](https://www.luogu.com.cn/problem/P3233) | 虚树 + 倍增 |
| [P4211 LCA](https://www.luogu.com.cn/problem/P4211) | 树剖 + 离线 |

### P8 高级专题

CDQ 分治与整体二分：

| 题目 | 练什么 |
|:--|:--|
| [P3810 【模板】三维偏序](https://www.luogu.com.cn/problem/P3810) | CDQ 模板（也可用树套树 / bitset 对拍） |
| [P3157 动态逆序对](https://www.luogu.com.cn/problem/P3157) | CDQ：时间 + 位置 + 值 |
| [P2487 拦截导弹](https://www.luogu.com.cn/problem/P2487) | CDQ 优化 DP |
| [P4093 序列](https://www.luogu.com.cn/problem/P4093) | CDQ 优化 DP |
| [P4390 Mokia](https://www.luogu.com.cn/problem/P4390) | CDQ 带修矩阵和 |
| [P4169 天使玩偶](https://www.luogu.com.cn/problem/P4169) | CDQ + 曼哈顿距离转切比雪夫 |
| [P4655 Building Bridges](https://www.luogu.com.cn/problem/P4655) | CDQ + 斜率优化 |
| [P3527 MET-Meteors](https://www.luogu.com.cn/problem/P3527) | 整体二分入门 |
| [P3332 K 大数查询](https://www.luogu.com.cn/problem/P3332) | 整体二分 / 树套树 |
| [P1527 矩阵乘法](https://www.luogu.com.cn/problem/P1527) | 整体二分（二维） |
| [P4175 网络管理](https://www.luogu.com.cn/problem/P4175) | 整体二分 + 树剖 |

网络流：

| 题目 | 练什么 |
|:--|:--|
| [P3376 【模板】网络最大流](https://www.luogu.com.cn/problem/P3376) | Dinic |
| [P4722 【模板】最大流 加强版](https://www.luogu.com.cn/problem/P4722) | HLPP / ISAP |
| [P3381 【模板】最小费用最大流](https://www.luogu.com.cn/problem/P3381) | 费用流 |
| [P2762 太空飞行计划问题](https://www.luogu.com.cn/problem/P2762) | 最大权闭合子图 |
| [P4174 最大获利](https://www.luogu.com.cn/problem/P4174) | 最大权闭合子图 |
| [P2764 最小路径覆盖问题](https://www.luogu.com.cn/problem/P2764) | 最小路径覆盖 |
| [P2765 魔术球问题](https://www.luogu.com.cn/problem/P2765) | 拆点 + 路径覆盖 |
| [P2774 方格取数问题](https://www.luogu.com.cn/problem/P2774) | 黑白染色 + 最小割 |
| [P2598 狼和羊的故事](https://www.luogu.com.cn/problem/P2598) | 最小割建模 |
| [P4313 文理分科](https://www.luogu.com.cn/problem/P4313) | 对称建图 |
| [P1646 happiness](https://www.luogu.com.cn/problem/P1646) | 收益 / 代价建模 |
| [P2057 善意的投票](https://www.luogu.com.cn/problem/P2057) | 最小割 |
| [P2805 植物大战僵尸](https://www.luogu.com.cn/problem/P2805) | 拓扑 + 最大权闭合子图 |
| [P3410 拍照](https://www.luogu.com.cn/problem/P3410) | 最大权闭合子图 |
| [P3159 交换棋子](https://www.luogu.com.cn/problem/P3159) | 费用流建模 |
| [P2472 蜥蜴](https://www.luogu.com.cn/problem/P2472) | 拆点 + 最大流 |
| [P4553 80 人环游世界](https://www.luogu.com.cn/problem/P4553) | 上下界费用流 |
| [P6577 【模板】二分图最大权完美匹配](https://www.luogu.com.cn/problem/P6577) | KM |

计算几何与杂项：

| 题目 | 练什么 |
|:--|:--|
| [P2742 【模板】二维凸包](https://www.luogu.com.cn/problem/P2742) | Andrew 凸包 |
| [P3829 信用卡凸包](https://www.luogu.com.cn/problem/P3829) | 凸包 + 圆弧 |
| [P1452 Beauty Contest](https://www.luogu.com.cn/problem/P1452) | 旋转卡壳 |
| [P4196 【模板】半平面交](https://www.luogu.com.cn/problem/P4196) | 半平面交 |
| [P1742 最小圆覆盖](https://www.luogu.com.cn/problem/P1742) | 随机增量 |
| [P1429 平面最近点对](https://www.luogu.com.cn/problem/P1429) | 分治 |
| [P1856 矩形周长 Picture](https://www.luogu.com.cn/problem/P1856) | 扫描线求周长 |
| [P1502 窗口的星星](https://www.luogu.com.cn/problem/P1502) | 扫描线求点权和 |

Codeforces 补充（rating 取自官方题库）：

| 题目 | 练什么 |
|:--|:--|
| [600E Lomsat gelral](https://codeforces.com/problemset/problem/600/E) | DSU on tree 模板，2300 |
| [570D Tree Requests](https://codeforces.com/problemset/problem/570/D) | dfs 序 + 深度分组，2200 |
| [342E Xenia and Tree](https://codeforces.com/problemset/problem/342/E) | 点分树动态查询，2400 |
| [438D The Child and Sequence](https://codeforces.com/problemset/problem/438/D) | 线段树取模剪枝，2300 |
| [474F Ant colony](https://codeforces.com/problemset/problem/474/F) | 区间 gcd + 计数，2100 |
| [484B Maximum Value](https://codeforces.com/problemset/problem/484/B) | 枚举 + 二分，2100 |
| [786B Legacy](https://codeforces.com/problemset/problem/786/B) | 线段树优化建图，2300 |
| [311B Cats Transport](https://codeforces.com/problemset/problem/311/B) | 斜率优化，2400 |
| [321E Ciel and Gondolas](https://codeforces.com/problemset/problem/321/E) | 四边形不等式优化 DP，2600 |
| [868F Yet Another Minimization Problem](https://codeforces.com/problemset/problem/868/F) | 决策单调性 + 分治，2500 |
| [833B The Bakery](https://codeforces.com/problemset/problem/833/B) | 决策单调性 + 线段树，2200 |
| [713C Sonya and Problem Wihtout a Legend](https://codeforces.com/problemset/problem/713/C) | 排序后 DP，2300 |
| [280C Game on Tree](https://codeforces.com/problemset/problem/280/C) | 期望的线性性，2200 |
| [605E Intergalaxy Trips](https://codeforces.com/problemset/problem/605/E) | 期望 + 最短路，2700 |
| [559C Gerald and Giant Chess](https://codeforces.com/problemset/problem/559/C) | 组合计数 + 容斥，2200 |
| [1208F Bits And Pieces](https://codeforces.com/problemset/problem/1208/F) | SOS DP，2600 |

## 十四、卡住时查什么

| 症状 | 大概率原因 | 回补 |
|:--|:--|:--|
| 二分死循环 | 边界更新写错 | P1 整数二分模板 |
| 线段树 WA 但暴力对 | 懒标记下传 / 区间端点 | P2 |
| 树套树 MLE | 空间没算、没离散化 | P7 树套树 |
| 点分治 TLE | 重心求错导致退化 | P7 点分治 |
| CDQ 答案偏小 | 忘撤销 BIT / 严格小于写错 | P8 CDQ |
| 整体二分越界 | 修改与询问的顺序 / `k` 没减 | P8 整体二分 |
| 网络流 TLE | 没加当前弧 / 边开少 | P8 网络流 |
| 期望 DP 越推越乱 | 正向逆向混用 | P5 |
| SAM 越界 | 节点只开了 n | P6 SAM |
| 树剖边权错 | 最后一段没排除 LCA | P3 树剖 |
| 斜率优化 WA | 凸包方向 / 斜率相同 | P8 斜率优化 |

## 十五、两种排期

九个月常规版（每天 3~4 小时）：按「二、阶段总览」的周数顺序推进，每两周做一次自测（对应阶段的题单随机 3 题 + 1 场 CF Div.2 虚拟赛）。

十二周冲刺版（每天 5~6 小时，只保必须）：

| 周 | 内容 |
|:--:|:--|
| 1~2 | P0 + P1：语法、STL、二分、前缀和、单调栈队列 |
| 3~4 | P2：并查集、树状数组、线段树、ST 表、分块 |
| 5~6 | P3：最短路、MST、Tarjan、二分图、LCA、树上差分 |
| 7~8 | P4：背包、区间、树形换根、状压、数位、单调队列 / 斜率优化 |
| 9 | P5 + P6 必须部分：筛法、逆元、组合数、哈希、KMP、ACAM |
| 10 | P7 必须部分：树剖、主席树、树套树、点分治 |
| 11 | P8 必须部分：CDQ、整体二分、网络流基础建模、虚树 |
| 12 | 每天一场 5 小时模拟赛 + 补题，只复盘不学新东西 |

> 一句话总结：**基础决定你能不能上 5 题，高级数据结构决定你能不能上 7 题，CDQ / 整体二分 / 网络流建模决定你能不能拿金。**
