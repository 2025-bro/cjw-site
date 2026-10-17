---
title: 学习计划：CF 1200 → 1800（10 周冲刺）
date: 2026-10-17
author: CJW
---

# 学习计划：CF 1200 → 1800（2026-10-17 ~ 12-31）

## 一、现状诊断（先别急着刷题）

| 项目 | 自述 | 换算成实战水平 |
| --- | --- | --- |
| CF rating | 1200 | 评分 1200，但**实战约 1350–1450** |
| Div2 | 接近做出 C | B 稳、C 有思路，缺**收尾能力** |
| Div3 | 3–4 题 | 第 4 题（约 1400–1500）不稳定 |
| Div4 | 5 题以上 | 基础扎实，速度尚可 |

**结论**：真实缺口 ≈ **400 分**。短板只有三个：**收尾能力**（会想不会写）、**题型覆盖窄**（二分答案/DP/图论没成条件反射）、**时间分配**（卡一题太久）。

## 二、三档预期（说实话）

| 档位 | 条件 | 12/31 预期 |
| --- | --- | --- |
| 保底 | 2h/天 + 每周 2 场 | **1450–1550** |
| 达标 | 2.5–3h/天 + 每周 3 场 + 全部补题 | **1600–1700** |
| 冲刺 | 4h/天 + 每周 3–4 场 + 严格复盘 | **1750–1850** |

## 三、🔗 训练入口（都已实测可访问）

| 用途 | 链接 |
| --- | --- |
| 按标签 + 难度刷题（主战场） | [Codeforces Problemset](https://codeforces.com/problemset?order=BY_RATING_ASC) |
| 看题目真实难度、找 ABC 题 | [AtCoder Problems](https://kenkoooo.com/atcoder/#/table/) |
| AtCoder 官网 / 比赛 | [AtCoder](https://atcoder.jp/) |
| 中文题单、题解社区 | [洛谷](https://www.luogu.com.cn/) |
| 模板与证明（中文） | [OI Wiki](https://oi-wiki.org/) |
| 进阶算法库（英文） | [cp-algorithms](https://cp-algorithms.com/) |
| 本站模板库（每天过 2 个） | [代码模板](/templates/) |
| CSES 题库（⚠️ 国内需代理） | [CSES Problem Set](https://cses.fi/problemset/list/) |

> **CF 题单用法**：Problemset → 右侧 Difficulty 勾选区间（如 1200–1400）→ 顶部 Tags 选专题 → 排序选 **BY_RATING_ASC**（从易到难）。
> CSES 如果连不上（国内多数网络如此），就用 **CF 同标签题 + AtCoder ABC 的 A–E** 代替，效果接近。

## 四、专题资源（每个专题去哪学、去哪练）

| 专题 | 学（OI Wiki） | 练（CF 题单，记得勾难度区间） |
| --- | --- | --- |
| 贪心 | [greedy](https://oi-wiki.org/basic/greedy/) | [tag: greedy](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=greedy) |
| 排序 / 前缀和 | [prefix-sum](https://oi-wiki.org/basic/prefix-sum/) | [tag: prefix sums](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=prefix+sums) |
| 二分 | [binary](https://oi-wiki.org/basic/binary/) | [tag: binary search](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=binary+search) |
| 双指针 | [two-pointers](https://oi-wiki.org/basic/two-pointers/) | [tag: two pointers](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=two+pointers) |
| DP 入门 | [dp](https://oi-wiki.org/dp/) | [tag: dp](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=dp) |
| 背包 | [knapsack](https://oi-wiki.org/dp/knapsack/) | [tag: knapsack](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=knapsack) |
| 图论基础 | [graph](https://oi-wiki.org/graph/) | [tag: graphs](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=graphs) |
| 并查集 | [dsu](https://oi-wiki.org/ds/dsu/) | [tag: dsu](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=dsu) |
| 最短路 | [shortest-path](https://oi-wiki.org/graph/shortest-path/) | [tag: shortest paths](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=shortest+paths) |
| 最小生成树 | [mst](https://oi-wiki.org/graph/mst/) | [tag: minimum spanning tree](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=minimum+spanning+tree) |
| 数论（gcd / 素数 / 筛法） | [prime](https://oi-wiki.org/math/prime/) · [gcd](https://oi-wiki.org/math/gcd/) | [tag: number theory](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=number+theory) |
| 快速幂 / 逆元 | [quick-pow](https://oi-wiki.org/math/quick-pow/) · [inverse](https://oi-wiki.org/math/inverse/) | [tag: math](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=math) |
| 组合计数 | [combination](https://oi-wiki.org/math/combination/) | [tag: combinatorics](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=combinatorics) |
| 单调栈 / 队列 | [monotonous-stack](https://oi-wiki.org/ds/monotonous-stack/) | [tag: data structures](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=data+structures) |
| 树状数组 | [fenwick](https://oi-wiki.org/ds/fenwick/) | [tag: data structures](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=data+structures) |
| 构造题 | [construction](https://oi-wiki.org/basic/construction/) | [tag: constructive](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=constructive+algorithms) |
| 交互题 | [interactive](https://oi-wiki.org/misc/interactive/) | [tag: interactive](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=interactive) |
| 位运算 | [bit](https://oi-wiki.org/math/bit/) | [tag: bitmasks](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=bitmasks) |
| 字符串哈希 | [hash](https://oi-wiki.org/string/hash/) | [tag: hashing](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=hashing) |

## 五、本周计划：10/17（六）– 10/25（日）｜W1 贪心 + 排序 + 前缀和

**本周目标**：找回节奏 → 贪心条件反射 → 前缀和熟练。总量 **18–20 题 + 2–3 场比赛**。

| 日期 | 主任务 | 题量 | 链接 |
| --- | --- | --- | --- |
| **10/17 六** | 建记录表；热身 2 道 1200 的 A/B（每题限时 20 min）；排序基础 3 题 | 5 | [tag: sortings](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=sortings)（勾 1000–1200） |
| **10/18 日** | 复盘日（3h）：周六没 AC 的题**全部重写**；贪心 2 题 | 2–4 | [tag: greedy](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=greedy)（勾 1200–1300） |
| **10/19 一** | 贪心基础 3 题；AtCoder ABC 的 A/B 各 1 题练手速 | 5 | [greedy](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=greedy) · [ABC 难度表](https://kenkoooo.com/atcoder/#/table/) |
| **10/20 二** | 排序 + 双关键字贪心 3 题（含"按两个键排序"的题） | 3 | [greedy 1300–1400](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=greedy) |
| **10/21 三** | 前缀和 3 题（先做一维，再做"子数组和 = k"） | 3 | [tag: prefix sums](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=prefix+sums)（勾 1200–1400） |
| **10/22 四** | 二分入门 3 题：**只练"在已排序数组里查找"**，不碰二分答案 | 3 | [tag: binary search](https://codeforces.com/problemset?order=BY_RATING_ASC&tags=binary+search)（勾 1200–1300） |
| **10/23 五** | 查漏：本周错题重做 3–4 道 + 1 场 virtual（60 min，只做 A–C） | 3–4 | [CF 赛程](https://codeforces.com/contests) |
| **10/24 六** | **比赛日**：优先 Div2 正式场；赛后 30 min 内补 A/B | 1 场 | [CF 赛程](https://codeforces.com/contests) |
| **10/25 日** | **W1 验收（3h）**：补 C（D 只写思路）→ 填记录表 → 限时 Div3 模拟（100–120 min，目标 4 题） | 1 场 | [Problemset](https://codeforces.com/problemset) |

**如果 CSES 能连上**（有代理），把每天的 3 题替换成 CSES「Sorting and Searching」对应题，地基会更牢。

**本周验收标准**（不达标就别进 W2）：

- [ ] 独立 AC **≥ 12 题**（不含看题解后抄的）
- [ ] 贪心 / 前缀和 / 排序三类都能不看题解直接写
- [ ] Div3 模拟 **稳 4 题**
- [ ] 补题完成率 **100%**（每道都要自己写出来并 AC）
- [ ] 记录表填满 9 行

**卡住时的处理**：
- 一题想 25 分钟没思路 → 先看**标签和难度**，判断是"知识不会"还是"不会实现"；
- 知识不会 → 当天去 OI Wiki 对应页（上表）补 20 分钟；不会实现 → 看题解，然后**关掉题解重写**；
- 别在一道 1200 的题上耗 1 小时——这是本周最需要纠正的习惯。

## 六、每日节奏（基准 2.5h）

| 时段 | 时长 | 内容 |
| --- | --- | --- |
| 热身 | 15 min | 复习昨天的题（重写关键段）+ 2 个模板 |
| 专题 | 70 min | 2–3 道本专题新题，**单题上限 25 min** |
| 补题 | 40 min | 上场没做出的题，**必须自己 AC** |
| 总结 | 15 min | 3 行：卡在哪 / 学到什么 / 下次怎么判 |

**铁律**：单题 25 分钟想不出就换；看懂 ≠ 会做；每天至少 1 道独立 AC 的新题。

## 七、10 周总表

| 周 | 日期 | 专题 | 训练 |
| --- | --- | --- | --- |
| W1 | 10/17–10/25 | 贪心 + 排序 + 前缀和 | greedy / 1200–1400 |
| W2 | 10/26–11/01 | 二分答案 + 双指针 | binary search / 1300–1500 |
| W3 | 11/02–11/08 | 基础 DP（线性 + 背包） | dp / 1300–1500 |
| W4 | 11/09–11/15 | 图论基础（BFS/DFS/连通块/拓扑） | graphs / 1300–1500 |
| W5 | 11/16–11/22 | 并查集 + MST + Dijkstra | dsu, shortest paths / 1400–1600 |
| W6 | 11/23–11/29 | 数学：gcd/筛/模/快速幂/组合入门 | math / 1300–1600 |
| W7 | 11/30–12/06 | 单调栈/队列/堆/有序集合 + 树状数组入门 | data structures / 1400–1600 |
| W8 | 12/07–12/13 | 构造 + 交互入门 + 位运算 | constructive, bitmasks / 1400–1700 |
| W9 | 12/14–12/20 | 弱点补齐 + 全真模拟 2 场 | 混合 / 1500–1700 |
| W10 | 12/21–12/27 | 冲刺：Div2 D 专项 + 限时速度 | 1500–1800 |
| W11 | 12/28–12/31 | 只模拟 + 复盘，**不学新东西** | 模拟赛 |

## 八、比赛策略（隐形涨分）

1. 前 5 分钟扫 A–C，**按难度而不是字母顺序**写；
2. 思考上限：A 5′ / B 12′ / C 20′ / D 30′，超时换题；
3. 先拿稳的分，再回头攻难；
4. 提交前 30 秒自查：多测 / n=1 与全相同 / long long / 数组大小 / 0-1 下标；
5. WA 后先确认**有没有读错题**（比算法错更常见）；
6. 掉 50+ 分当天停打，第二天再来；
7. **每场结束 30 分钟内补 A/B，当天补 C，次日补 D**——统计上最涨分的一步。

## 九、里程碑检查点

| 检查日 | 目标 | 没达标的对策 |
| --- | --- | --- |
| 10/31 | 1350+（Div3 稳 4 题） | 回炉实现速度：每天限时 2 道 1200 |
| 11/15 | 1450+（Div2 C 常规出） | 二分/DP 加练一周，暂停新专题 |
| 11/30 | 1550+（Div2 C 快 + D 偶尔） | 补图论+数学，减少 Div3 比例 |
| 12/15 | 1650+（Div2 D 能出一半） | 专攻 Div2 D 题单 + 限时训练 |
| 12/31 | 1700–1800 | 达标即止，不冒险冲分 |

## 十、记录表（每周填，最有效的自我诊断）

| 日期 | 场次 | 分数变化 | AC 题号 | 卡在哪 | 知识点 | 补题完成 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

**卡点只分两类**：`知识不会` → 去学专题；`会但写挂/太慢` → 去限时训练。连续 3 场都是"会但写挂"，说明缺的是速度和实现，不是新知识。

## 十一、一句话总结

**10.5 周里，比"多学一个算法"更重要的是：单题限时、每场补题、卡点分类。** 这三件事做到位，1400 必然、1600 大概率、1800 是奖励。
