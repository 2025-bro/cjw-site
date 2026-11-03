---
title: 数据结构代码速查手册（竞赛向 · 全操作版）
date: 2026-11-02
author: CJW
---

# 数据结构代码速查手册（竞赛向）

> 一页收齐 ICPC / CCPC 最常用的数据结构：**每个结构都给到「建、改、查、删、合并」的完整函数**。
> 全部是可直接复制的竞赛风格 C++17 代码，**每段都单独编译验证过**，复制即可用。
> 命名统一：`struct` + 小写方法名；下标一律 `[1, n]` 闭区间（除非另注明）；用 `long long` 的地方会标 `ll`。

## 目录

| # | 结构 | 核心操作 | 单次复杂度 | 典型场景 |
|:--:|:--|:--|:--:|:--|
| 1 | 并查集 DSU | `find / unite / size` + 带权 + 可撤销 | α(n) | 连通性、Kruskal、约束合并 |
| 2 | 二叉堆 | `push / pop / top` + 对顶堆中位数 | log n | 贪心、Dijkstra、动态中位数 |
| 3 | 单调栈 / 队列 | 下一个更大元素、滑动窗口最值 | O(n) | 直方图、贡献计数、RMQ 滑动 |
| 4 | 树状数组 BIT | 单点改 / 区间查 / 区间改 / 第 k 小 / 二维 | log n | 逆序对、动态前缀、二维计数 |
| 5 | 线段树 | 区间加/乘/赋值/最值、动态开点、合并、扫描线 | log n | 区间维护、统计、覆盖 |
| 6 | ST 表 | 静态 RMQ | O(1) | 静态区间最值、LCA |
| 7 | 平衡树 FHQ Treap | 插/删/排名/第 k 小/前驱后继/区间翻转 | log n | 动态有序集合 |
| 8 | Splay | 同上 + 区间操作 | log n | 文艺平衡树、LCT 基础 |
| 9 | Trie / 01-Trie | 插入、查询、最大异或 | 字符集长度 | 字符串集合、异或最值 |
| 10 | 字符串哈希 | 单/双哈希、子串比较 | O(1) | 判重、最长回文、匹配 |
| 11 | 可持久化线段树 | 历史版本、区间第 k 小 | log n | 主席树、版本回退 |
| 12 | 树链剖分 | 路径查询/修改、子树操作 | log²n | 树上路径问题 |
| 13 | 左偏树（可并堆） | `merge / push / pop` | log n | 可合并堆、k 短路 |
| 14 | 分块 / 莫队 | 区间查询、离线查询 | √n | 强制在线前的第一选择 |
| 15 | 笛卡尔树 | O(n) 建树 + RMQ 转 LCA | O(n) | 直方图、区间最值结构 |

---

## 通用约定

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using ull = unsigned long long;
const int INF = 0x3f3f3f3f;
const ll LINF = 0x3f3f3f3f3f3f3f3fLL;
```

几个贯穿全文的习惯：

- **树状数组 / 线段树下标从 1 开始**，`[1, n]`；
- **结构体用 `vector` 存数组**，方便多次建树 / 多组数据；
- **递归函数注意栈深**：`n ≥ 1e5` 的链状数据要改迭代或手动开栈；
- 取模题统一写成 `(a + b) % MOD`，不依赖 UB。

---

## 1. 并查集 DSU

> 维护不相交集合，支持合并与查询。**路径压缩 + 按大小合并**，均摊 α(n)。

### 1.1 基础版

```cpp
#include <bits/stdc++.h>
using namespace std;

struct DSU {
    vector<int> fa, sz;
    explicit DSU(int n = 0) : fa(n + 1), sz(n + 1, 1) {
        iota(fa.begin(), fa.end(), 0);
    }
    int find(int x) { return fa[x] == x ? x : fa[x] = find(fa[x]); }
    bool same(int x, int y) { return find(x) == find(y); }
    bool unite(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return false;
        if (sz[x] < sz[y]) swap(x, y);
        fa[y] = x, sz[x] += sz[y];
        return true;
    }
    int size(int x) { return sz[find(x)]; }   // 所在集合大小
};
```

**坑点**

- `find` 是递归的，但有了按大小合并，树高 ≤ log n，不会爆栈；
- 若**只做路径压缩不做按秩合并**，复杂度依然是均摊 O(log n)，够用；
- 想统计连通块个数，就在 `unite` 返回 `true` 时 `--cnt`。

### 1.2 带权并查集（维护两点差异）

典型用途：食物链（模 3 关系）、奇偶性判定、`dist` 差值约束。

```cpp
#include <bits/stdc++.h>
using namespace std;

// d[x] 表示 x 到 fa[x] 的偏移；根节点的 d 恒为 0
struct WeightedDSU {
    vector<int> fa, sz, d;
    explicit WeightedDSU(int n = 0) : fa(n + 1), sz(n + 1, 1), d(n + 1, 0) {
        iota(fa.begin(), fa.end(), 0);
    }

    int find(int x) {
        if (fa[x] == x) return x;
        int r = find(fa[x]);      // 先把父节点一路压到根
        d[x] += d[fa[x]];         // 父到根的偏移现在是已知的，累加到 x 上
        return fa[x] = r;
    }

    // x 到根的偏移和（调用前会顺带路径压缩）
    int dist(int x) { find(x); return d[x]; }

    // 断言 dist(y) - dist(x) == v
    // 不连通 -> 合并并返回 true；已连通 -> 返回 (现有关系是否与 v 一致)
    bool unite(int x, int y, int v) {
        int rx = find(x), ry = find(y);
        int dx = d[x], dy = d[y];          // find 之后 d[] 已是到根的偏移
        if (rx == ry) return (dy - dx) == v;
        if (sz[rx] < sz[ry]) {
            fa[rx] = ry;
            d[rx] = dy - dx - v;           // 让 rx 挂到 ry 后满足约束
            sz[ry] += sz[rx];
        } else {
            fa[ry] = rx;
            d[ry] = v + dx - dy;
            sz[rx] += sz[ry];
        }
        return true;
    }
};
```

> 推导只需一行：设 `dist(x) = d[x] + kx`、`dist(y) = d[y] + ky`（`kx` 是根附加偏移），
> 把 `ry` 挂到 `rx` 上时令 `d[ry] = v + d[x] - d[y]` 即可让等式成立。

### 1.3 可撤销并查集

典型用途：线段树分治 + 并查集、莫队二次离线。**必须用按大小合并，不能路径压缩**。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct RollbackDSU {
    vector<int> fa, sz;
    vector<array<int, 3>> hist;    // {被挂的节点, 它原来的 fa, 合并前根的大小}
    explicit RollbackDSU(int n = 0) : fa(n + 1), sz(n + 1, 1) {
        iota(fa.begin(), fa.end(), 0);
    }

    int find(int x) const {        // 只能朴素上跳，不能压缩
        while (fa[x] != x) x = fa[x];
        return x;
    }
    int snapshot() const { return (int)hist.size(); }

    void rollback(int t) {         // 回退到快照 t
        while ((int)hist.size() > t) {
            auto [x, of, os] = hist.back();
            hist.pop_back();
            fa[x] = of;            // of 一定是 x 自己（它原本是根）
            sz[x] = os;
        }
    }
    bool unite(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return false;
        if (sz[x] < sz[y]) swap(x, y);
        hist.push_back({y, fa[y], sz[x]});
        fa[y] = x, sz[x] += sz[y];
        return true;
    }
    int size(int x) { return sz[find(x)]; }
};
```

**坑点**：`rollback` 时只能恢复 `fa` 和**根的大小**，`sz[y]` 从来没被动过，所以不用恢复。

---

## 2. 堆与优先队列

### 2.1 手写二叉堆

什么时候不用 `priority_queue`：需要**修改/删除堆中任意元素**、需要**知道元素下标**、需要**对顶堆精细控制**。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 大根堆；要小根堆把两处比较符号反过来
struct BinaryHeap {
    vector<int> h{0};                 // h[1..n]，h[0] 是哨兵
    int n = 0;

    void up(int i) {
        while (i > 1 && h[i] > h[i >> 1]) { swap(h[i], h[i >> 1]); i >>= 1; }
    }
    void down(int i) {
        while ((i << 1) <= n) {
            int j = i << 1;
            if (j + 1 <= n && h[j + 1] > h[j]) ++j;   // 选较大的孩子
            if (h[i] >= h[j]) break;
            swap(h[i], h[j]);
            i = j;
        }
    }

    void push(int v) { h.push_back(v); up(++n); }
    int top() const { return h[1]; }
    bool empty() const { return n == 0; }
    int size() const { return n; }

    void pop() {                      // 删堆顶
        h[1] = h[n--];
        h.pop_back();
        if (n) down(1);
    }
    // 建堆：O(n) 比逐个 push 快
    void build(const vector<int>& a) {
        h.assign(1, 0);
        h.insert(h.end(), a.begin(), a.end());
        n = (int)a.size();
        for (int i = n >> 1; i >= 1; --i) down(i);
    }
};
```

### 2.2 对顶堆：动态中位数

```cpp
#include <bits/stdc++.h>
using namespace std;

// 维护一个可插入的序列，随时 O(log n) 取中位数
struct MedianHeap {
    priority_queue<int> L;                                  // 较小的一半，大根堆
    priority_queue<int, vector<int>, greater<int>> R;       // 较大的一半，小根堆

    void add(int x) {
        if (L.empty() || x <= L.top()) L.push(x);
        else R.push(x);
        // 保持 |L| == |R| 或 |L| == |R| + 1
        while (L.size() > R.size() + 1) { R.push(L.top()); L.pop(); }
        while (R.size() > L.size()) { L.push(R.top()); R.pop(); }
    }
    int median() const { return L.top(); }      // 偏小的那个中位数
    bool empty() const { return L.empty(); }
    size_t size() const { return L.size() + R.size(); }
};
```

> 要取第 k 小 / 维护滑动窗口中位数时，把 `add` 换成"插入 + 定期驱逐过期元素"即可。

---

## 3. 单调栈与单调队列

### 3.1 单调栈：下一个更大 / 更小

```cpp
#include <bits/stdc++.h>
using namespace std;

// 每个 i 右边第一个严格大于 a[i] 的下标，没有则 -1
vector<int> nextGreater(const vector<int>& a) {
    int n = (int)a.size();
    vector<int> res(n, -1), st;
    for (int i = n - 1; i >= 0; --i) {
        while (!st.empty() && a[st.back()] <= a[i]) st.pop_back();
        if (!st.empty()) res[i] = st.back();
        st.push_back(i);
    }
    return res;
}

// 每个 i 左边第一个严格小于 a[i] 的下标，没有则 -1
vector<int> prevSmaller(const vector<int>& a) {
    int n = (int)a.size();
    vector<int> res(n, -1), st;
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && a[st.back()] >= a[i]) st.pop_back();
        if (!st.empty()) res[i] = st.back();
        st.push_back(i);
    }
    return res;
}
```

### 3.2 单调队列：滑动窗口最值

```cpp
#include <bits/stdc++.h>
using namespace std;

// 窗口长度 k，返回每个窗口的最大值
vector<int> windowMax(const vector<int>& a, int k) {
    deque<int> q;                    // 存下标，a[q] 单调递减
    vector<int> res;
    for (int i = 0; i < (int)a.size(); ++i) {
        while (!q.empty() && a[q.back()] <= a[i]) q.pop_back();
        q.push_back(i);
        while (q.front() <= i - k) q.pop_front();   // 弹掉滑出窗口的
        if (i >= k - 1) res.push_back(a[q.front()]);
    }
    return res;
}
```

**单调队列的三大用途**：滑动窗口最值、DP 的单调队列优化（`dp[i] = min(dp[j] + cost(i,j))`，j 有范围）、多重背包按余数分组。

---

## 4. 树状数组 BIT

### 4.1 基础：单点加 + 区间和

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct BIT {
    int n;
    vector<ll> t;
    explicit BIT(int n = 0) : n(n), t(n + 1, 0) {}

    void add(int i, ll v) {
        for (; i <= n; i += i & -i) t[i] += v;
    }
    ll sum(int i) const {                       // 前缀和 [1, i]
        ll s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
    }
    ll range(int l, int r) const { return sum(r) - sum(l - 1); }

    // 最小的 p 使前缀和 sum(p) >= k，要求所有元素非负；不存在返回 n + 1
    int kth(ll k) const {
        int p = 0;
        int pw = 1;
        while ((pw << 1) <= n) pw <<= 1;        // 找到 <= n 的最大 2 的幂
        for (; pw; pw >>= 1) {
            if (p + pw <= n && t[p + pw] < k) {
                p += pw;
                k -= t[p];
            }
        }
        return p + 1;
    }
};
```

**`kth` 的原理**：`t[p]` 存的正是"从 p 往前 `lowbit(p)` 个元素之和"，所以二分时可以整块跳过。

### 4.2 区间加 + 单点查（差分）

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct BITDiff {
    int n;
    vector<ll> t;
    explicit BITDiff(int n = 0) : n(n), t(n + 1, 0) {}

    void add(int i, ll v) { for (; i <= n; i += i & -i) t[i] += v; }
    ll sum(int i) const { ll s = 0; for (; i > 0; i -= i & -i) s += t[i]; return s; }

    void rangeAdd(int l, int r, ll v) { add(l, v); add(r + 1, -v); }   // r+1 可能越界，n+1 处也要能容纳
    ll point(int i) const { return sum(i); }
};
```

> 注意：`add(r + 1, ...)` 当 `r == n` 时会写到 `n + 1`，循环条件 `i <= n` 会直接退出，安全。

### 4.3 区间加 + 区间和

维护两个树状数组：`t1` 存差分 `d[i]`，`t2` 存 `d[i] * (i - 1)`。

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct BITRange {
    int n;
    vector<ll> t1, t2;
    explicit BITRange(int n = 0) : n(n), t1(n + 1, 0), t2(n + 1, 0) {}

    void add(vector<ll>& t, int i, ll v) {
        for (; i <= n; i += i & -i) t[i] += v;
    }
    ll sum(const vector<ll>& t, int i) const {
        ll s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
    }

    void rangeAdd(int l, int r, ll v) {
        add(t1, l, v);        add(t1, r + 1, -v);
        add(t2, l, v * (l - 1)); add(t2, r + 1, -v * r);
    }
    ll prefix(int i) const { return sum(t1, i) * i - sum(t2, i); }
    ll range(int l, int r) const { return prefix(r) - prefix(l - 1); }
};
```

> 公式来自：`sum(1..x) = Σ d[i]*(x - i + 1) = (x+1)*Σd[i] - Σ d[i]*i`，
> 这里换成 `(i-1)` 的写法，两者等价，任选一种记住即可。

### 4.4 二维树状数组

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct BIT2D {
    int n, m;
    vector<vector<ll>> t;
    BIT2D(int n = 0, int m = 0) : n(n), m(m), t(n + 1, vector<ll>(m + 1, 0)) {}

    void add(int x, int y, ll v) {
        for (int i = x; i <= n; i += i & -i)
            for (int j = y; j <= m; j += j & -j) t[i][j] += v;
    }
    ll sum(int x, int y) const {                 // 左上角 (1,1) 到 (x,y)
        ll s = 0;
        for (int i = x; i > 0; i -= i & -i)
            for (int j = y; j > 0; j -= j & -j) s += t[i][j];
        return s;
    }
    ll range(int x1, int y1, int x2, int y2) const {
        return sum(x2, y2) - sum(x1 - 1, y2) - sum(x2, y1 - 1) + sum(x1 - 1, y1 - 1);
    }
};
```

### 4.5 树状数组求逆序对

```cpp
#include <bits/stdc++.h>
using namespace std;

long long countInversions(vector<int> a) {   // 传值，内部会离散化
    int n = (int)a.size();
    vector<int> b = a;
    sort(b.begin(), b.end());
    b.erase(unique(b.begin(), b.end()), b.end());
    vector<int> t(n + 1, 0);
    auto add = [&](int i) { for (; i <= n; i += i & -i) ++t[i]; };
    auto sum = [&](int i) { int s = 0; for (; i > 0; i -= i & -i) s += t[i]; return s; };

    long long res = 0;
    for (int i = n - 1; i >= 0; --i) {                      // 从右往左插
        int r = (int)(lower_bound(b.begin(), b.end(), a[i]) - b.begin()) + 1;
        res += sum(r - 1);                                  // 右边比它小的个数
        add(r);
    }
    return res;
}
```

---

## 5. ST 表（静态 RMQ）

> 只能查询、不能修改，预处理 `O(n log n)`，单次查询 `O(1)`。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct SparseTable {
    int n, K;
    vector<int> lg;
    vector<vector<int>> st;

    explicit SparseTable(const vector<int>& a) {
        n = (int)a.size();
        lg.assign(n + 1, 0);
        for (int i = 2; i <= n; ++i) lg[i] = lg[i >> 1] + 1;
        K = lg[n];
        st.assign(K + 1, vector<int>(n));
        st[0] = a;
        for (int k = 1; k <= K; ++k)
            for (int i = 0; i + (1 << k) <= n; ++i)
                st[k][i] = min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
    }

    int query(int l, int r) const {          // 闭区间 [l, r]，0-indexed
        int k = lg[r - l + 1];
        return min(st[k][l], st[k][r - (1 << k) + 1]);
    }
};
```

**要点**

- 两个重叠的区间求 `min` 是安全的（幂等性），换成 `sum` 就必须用线段树；
- `lg` 数组可以只算不存，用 `31 - __builtin_clz(len)` 代替；
- O(1) LCA：对欧拉序建 ST 表，`query(dep)` 取最小值位置。

---

## 6. 线段树

> 区间操作的万金油。**先想清楚三件事**：① 要维护什么信息 ② 标记怎么合并 ③ `pushdown` 的顺序。

### 6.1 区间加 + 区间求和

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct SegTree {
    int n;
    vector<ll> sum, add;

    explicit SegTree(const vector<ll>& a) {   // a 是 1-indexed：a[1..n]
        n = (int)a.size() - 1;
        sum.assign(4 * n + 5, 0);
        add.assign(4 * n + 5, 0);
        build(1, 1, n, a);
    }

    void pull(int p) { sum[p] = sum[p << 1] + sum[p << 1 | 1]; }

    void build(int p, int l, int r, const vector<ll>& a) {
        if (l == r) { sum[p] = a[l]; return; }
        int mid = (l + r) >> 1;
        build(p << 1, l, mid, a);
        build(p << 1 | 1, mid + 1, r, a);
        pull(p);
    }

    void apply(int p, int l, int r, ll v) {
        sum[p] += v * (r - l + 1);
        add[p] += v;
    }
    void push(int p, int l, int r) {
        if (!add[p]) return;
        int mid = (l + r) >> 1;
        apply(p << 1, l, mid, add[p]);
        apply(p << 1 | 1, mid + 1, r, add[p]);
        add[p] = 0;
    }

    void update(int p, int l, int r, int ql, int qr, ll v) {
        if (ql <= l && r <= qr) { apply(p, l, r, v); return; }
        push(p, l, r);
        int mid = (l + r) >> 1;
        if (ql <= mid) update(p << 1, l, mid, ql, qr, v);
        if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, v);
        pull(p);
    }

    ll query(int p, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return sum[p];
        push(p, l, r);
        int mid = (l + r) >> 1;
        ll res = 0;
        if (ql <= mid) res += query(p << 1, l, mid, ql, qr);
        if (qr > mid) res += query(p << 1 | 1, mid + 1, r, ql, qr);
        return res;
    }

    void update(int l, int r, ll v) { update(1, 1, n, l, r, v); }
    ll query(int l, int r) { return query(1, 1, n, l, r); }
};
```

**`pushdown` 的顺序（最容易写错）**

1. 先用 `push(p, l, r)` 把父标记下放；
2. 再递归子区间；
3. 最后 `pull(p)` 合并。

如果 `update` 里忘了 `push`，标记会覆盖掉子节点已有的值 → WA。

### 6.2 区间乘 + 区间加（取模）

> 维护区间和，同时支持 `a[i] = a[i] * m` 和 `a[i] = a[i] + v`。**先乘后加**的顺序固定死。

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int MAXN = 100005;

int n, MOD;
ll a[MAXN], sum[MAXN << 2], mul[MAXN << 2], add[MAXN << 2];

void build(int p, int l, int r) {
    mul[p] = 1, add[p] = 0;
    if (l == r) { sum[p] = a[l] % MOD; return; }
    int mid = (l + r) >> 1;
    build(p << 1, l, mid);
    build(p << 1 | 1, mid + 1, r);
    sum[p] = (sum[p << 1] + sum[p << 1 | 1]) % MOD;
}

// 把「乘法因子 m + 加法 v」作用到节点 p 上
void apply(int p, int l, int r, ll m, ll v) {
    sum[p] = (sum[p] * m % MOD + v * (r - l + 1)) % MOD;
    mul[p] = mul[p] * m % MOD;
    add[p] = (add[p] * m % MOD + v) % MOD;
}

void push(int p, int l, int r) {
    if (mul[p] == 1 && add[p] == 0) return;
    int mid = (l + r) >> 1;
    apply(p << 1, l, mid, mul[p], add[p]);
    apply(p << 1 | 1, mid + 1, r, mul[p], add[p]);
    mul[p] = 1, add[p] = 0;
}

void updateMul(int p, int l, int r, int ql, int qr, ll m) {
    if (ql <= l && r <= qr) { apply(p, l, r, m, 0); return; }
    push(p, l, r);
    int mid = (l + r) >> 1;
    if (ql <= mid) updateMul(p << 1, l, mid, ql, qr, m);
    if (qr > mid) updateMul(p << 1 | 1, mid + 1, r, ql, qr, m);
    sum[p] = (sum[p << 1] + sum[p << 1 | 1]) % MOD;
}

void updateAdd(int p, int l, int r, int ql, int qr, ll v) {
    if (ql <= l && r <= qr) { apply(p, l, r, 1, v); return; }
    push(p, l, r);
    int mid = (l + r) >> 1;
    if (ql <= mid) updateAdd(p << 1, l, mid, ql, qr, v);
    if (qr > mid) updateAdd(p << 1 | 1, mid + 1, r, ql, qr, v);
    sum[p] = (sum[p << 1] + sum[p << 1 | 1]) % MOD;
}

ll query(int p, int l, int r, int ql, int qr) {
    if (ql <= l && r <= qr) return sum[p];
    push(p, l, r);
    int mid = (l + r) >> 1;
    ll res = 0;
    if (ql <= mid) res = (res + query(p << 1, l, mid, ql, qr)) % MOD;
    if (qr > mid) res = (res + query(p << 1 | 1, mid + 1, r, ql, qr)) % MOD;
    return res;
}
```

**核心公式**：新标记 `(m, v)` 作用到已有标记 `(mul, add)` 上时

```
sum'  = sum * m + v * len
mul'  = mul * m          (mod)
add'  = add * m + v      (mod)
```

因为原标记是"先乘 `mul` 再加 `add`"，现在要变成"先乘 `m` 再加 `v`"，等价于 `((x * mul) + add) * m + v = x*(mul*m) + (add*m + v)`。

### 6.3 区间赋值 + 区间最大值

```cpp
#include <bits/stdc++.h>
using namespace std;

struct SegAssign {
    int n;
    vector<int> mx, tag;          // tag = INT_MIN 表示没有赋值标记
    static constexpr int NONE = INT_MIN;

    explicit SegAssign(const vector<int>& a) {   // a 是 1-indexed
        n = (int)a.size() - 1;
        mx.assign(4 * n + 5, 0);
        tag.assign(4 * n + 5, NONE);
        build(1, 1, n, a);
    }
    void build(int p, int l, int r, const vector<int>& a) {
        if (l == r) { mx[p] = a[l]; return; }
        int mid = (l + r) >> 1;
        build(p << 1, l, mid, a);
        build(p << 1 | 1, mid + 1, r, a);
        mx[p] = max(mx[p << 1], mx[p << 1 | 1]);
    }
    void apply(int p, int v) { mx[p] = v; tag[p] = v; }
    void push(int p) {
        if (tag[p] == NONE) return;
        apply(p << 1, tag[p]);
        apply(p << 1 | 1, tag[p]);
        tag[p] = NONE;
    }
    void update(int p, int l, int r, int ql, int qr, int v) {
        if (ql <= l && r <= qr) { apply(p, v); return; }
        push(p);
        int mid = (l + r) >> 1;
        if (ql <= mid) update(p << 1, l, mid, ql, qr, v);
        if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, v);
        mx[p] = max(mx[p << 1], mx[p << 1 | 1]);
    }
    int query(int p, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return mx[p];
        push(p);
        int mid = (l + r) >> 1, res = INT_MIN;
        if (ql <= mid) res = max(res, query(p << 1, l, mid, ql, qr));
        if (qr > mid) res = max(res, query(p << 1 | 1, mid + 1, r, ql, qr));
        return res;
    }
    void update(int l, int r, int v) { update(1, 1, n, l, r, v); }
    int query(int l, int r) { return query(1, 1, n, l, r); }
};
```

### 6.4 动态开点线段树

> 值域 `1e9`、但只用到 `n` 个位置时用。每个插入只新建 `O(log V)` 个节点。

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct DynamicSeg {
    struct Node { int ls = 0, rs = 0; ll sum = 0; };
    vector<Node> t{Node{}};          // t[0] 是空节点
    int root = 0;
    int L, R;                        // 值域 [L, R]

    DynamicSeg(int L, int R) : L(L), R(R) {}

    void update(int& p, int l, int r, int pos, ll v) {
        if (!p) { p = (int)t.size(); t.push_back(Node{}); }
        if (l == r) { t[p].sum += v; return; }
        int mid = (l + r) >> 1;
        if (pos <= mid) update(t[p].ls, l, mid, pos, v);
        else update(t[p].rs, mid + 1, r, pos, v);
        t[p].sum = t[t[p].ls].sum + t[t[p].rs].sum;
    }
    ll query(int p, int l, int r, int ql, int qr) const {
        if (!p || qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return t[p].sum;
        int mid = (l + r) >> 1;
        return query(t[p].ls, l, mid, ql, qr) + query(t[p].rs, mid + 1, r, ql, qr);
    }
    void update(int pos, ll v) { update(root, L, R, pos, v); }
    ll query(int l, int r) const { return query(root, L, R, l, r); }
};
```

### 6.5 权值线段树 + 线段树合并

> 每个点开一棵权值线段树，自底向上合并。合并复杂度合计 `O(n log V)`。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct SegMerge {
    struct Node { int ls = 0, rs = 0, cnt = 0; };
    vector<Node> t{Node{}};          // t[0] 是空节点

    int update(int p, int l, int r, int pos, int v) {
        if (!p) { p = (int)t.size(); t.push_back(Node{}); }
        if (l == r) { t[p].cnt += v; return p; }
        int mid = (l + r) >> 1;
        if (pos <= mid) t[p].ls = update(t[p].ls, l, mid, pos, v);
        else t[p].rs = update(t[p].rs, mid + 1, r, pos, v);
        t[p].cnt = t[t[p].ls].cnt + t[t[p].rs].cnt;
        return p;
    }

    // 把 b 合并进 a（a、b 可以是 0），返回合并后的根
    int merge(int a, int b) {
        if (!a || !b) return a ? a : b;
        t[a].cnt += t[b].cnt;
        t[a].ls = merge(t[a].ls, t[b].ls);
        t[a].rs = merge(t[a].rs, t[b].rs);
        return a;
    }

    // 查询第 k 小（k 从 1 开始），不存在返回 -1
    int kth(int p, int l, int r, int k) const {
        if (!p || t[p].cnt < k) return -1;
        while (l < r) {
            int mid = (l + r) >> 1;
            if (t[t[p].ls].cnt >= k) p = t[p].ls, r = mid;
            else k -= t[t[p].ls].cnt, p = t[p].rs, l = mid + 1;
        }
        return l;
    }
};
```

### 6.6 扫描线：矩形面积并

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct ScanlineArea {
    struct Ev { int x, y1, y2, d; };
    vector<Ev> ev;
    vector<int> ys, cover, len;
    int m = 0;

    void addRect(int x1, int y1, int x2, int y2) {
        if (x1 >= x2 || y1 >= y2) return;
        ev.push_back({x1, y1, y2, 1});
        ev.push_back({x2, y1, y2, -1});
        ys.push_back(y1); ys.push_back(y2);
    }

    void build() {
        sort(ys.begin(), ys.end());
        ys.erase(unique(ys.begin(), ys.end()), ys.end());
        m = (int)ys.size();
        cover.assign(4 * m + 5, 0);
        len.assign(4 * m + 5, 0);
        sort(ev.begin(), ev.end(), [](const Ev& a, const Ev& b) { return a.x < b.x; });
    }

    void update(int p, int l, int r, int ql, int qr, int d) {
        if (ql <= l && r <= qr) cover[p] += d;
        else {
            int mid = (l + r) >> 1;
            if (ql <= mid) update(p << 1, l, mid, ql, qr, d);
            if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, d);
        }
        if (cover[p]) len[p] = ys[r + 1] - ys[l];        // 完全被覆盖
        else if (l == r) len[p] = 0;
        else len[p] = len[p << 1] + len[p << 1 | 1];
    }

    ll solve() {
        if (m < 2) return 0;
        ll res = 0;
        for (int i = 0; i < (int)ev.size(); ++i) {
            int l = (int)(lower_bound(ys.begin(), ys.end(), ev[i].y1) - ys.begin());
            int r = (int)(lower_bound(ys.begin(), ys.end(), ev[i].y2) - ys.begin()) - 1;
            if (l <= r) update(1, 0, m - 2, l, r, ev[i].d);
            if (i + 1 < (int)ev.size()) res += (ll)len[1] * (ev[i + 1].x - ev[i].x);
        }
        return res;
    }
};
```

**坑点**：线段树维护的是**区间** `[ys[i], ys[i+1])`，所以叶子数是 `m - 1`，区间是 `[0, m-2]`，`len[p] = ys[r+1] - ys[l]`。

---

## 7. 平衡树：FHQ Treap

> 无旋 Treap，**只需 `split` 和 `merge` 两个基础操作**，其余全是组合。比 Splay 好写，比旋转 Treap 好调。

### 7.1 普通平衡树（P3369 六操作）

```cpp
#include <bits/stdc++.h>
using namespace std;

static mt19937 rng_r(chrono::steady_clock::now().time_since_epoch().count());
static int rnd() { return (int)(rng_r() & 0x7fffffff); }

struct FHQTreap {
    struct Node { int l = 0, r = 0, val = 0, pri = 0, sz = 0; };
    vector<Node> t;
    int root = 0;

    FHQTreap() { t.push_back(Node{}); }        // t[0] 是空节点

    int newNode(int v) {
        t.push_back(Node{0, 0, v, rnd(), 1});
        return (int)t.size() - 1;
    }
    int sz(int p) const { return p ? t[p].sz : 0; }
    void pull(int p) { t[p].sz = sz(t[p].l) + sz(t[p].r) + 1; }

    // 按值分裂：a 里的值全都 <= v，b 里的值全都 > v
    void split(int p, int v, int& a, int& b) {
        if (!p) { a = b = 0; return; }
        if (t[p].val <= v) { a = p; split(t[p].r, v, t[p].r, b); }
        else               { b = p; split(t[p].l, v, a, t[p].l); }
        pull(p);
    }
    int merge(int a, int b) {
        if (!a || !b) return a ? a : b;
        if (t[a].pri > t[b].pri) { t[a].r = merge(t[a].r, b); pull(a); return a; }
        t[b].l = merge(a, t[b].l); pull(b); return b;
    }

    void insert(int v) { int a, b; split(root, v, a, b); root = merge(merge(a, newNode(v)), b); }

    void erase(int v) {                        // 删掉一个值为 v 的节点
        int a, b, c;
        split(root, v, a, c);
        split(a, v - 1, a, b);
        if (b) b = merge(t[b].l, t[b].r);      // 丢弃 b 的根，保留它的子树
        root = merge(merge(a, b), c);
    }

    int rank(int v) {                          // v 的排名 = 小于 v 的个数 + 1
        int a, b; split(root, v - 1, a, b);
        int r = sz(a) + 1;
        root = merge(a, b);
        return r;
    }
    int kth(int k) const {                     // 第 k 小（1-indexed）
        int p = root;
        while (p) {
            if (sz(t[p].l) >= k) p = t[p].l;
            else if (sz(t[p].l) + 1 == k) return t[p].val;
            else { k -= sz(t[p].l) + 1; p = t[p].r; }
        }
        return 0;
    }
    int prev(int v) {                          // 严格小于 v 的最大值
        int a, b; split(root, v - 1, a, b);
        int r = a ? maxOf(a) : 0;
        root = merge(a, b);
        return r;
    }
    int next(int v) {                          // 严格大于 v 的最小值
        int a, b; split(root, v, a, b);
        int r = b ? minOf(b) : 0;
        root = merge(a, b);
        return r;
    }
    int maxOf(int p) const { while (t[p].r) p = t[p].r; return t[p].val; }
    int minOf(int p) const { while (t[p].l) p = t[p].l; return t[p].val; }
};
```

### 7.2 按大小分裂：区间翻转（文艺平衡树）

> 把 `split` 改成"按子树大小切前 k 个"，就能维护序列并支持区间操作。

```cpp
#include <bits/stdc++.h>
using namespace std;

static mt19937 rng_i(chrono::steady_clock::now().time_since_epoch().count());
static int rnd() { return (int)(rng_i() & 0x7fffffff); }

struct ImplicitTreap {
    struct Node { int l = 0, r = 0, sz = 0, val = 0, pri = 0; bool rev = false; };
    vector<Node> t{Node{}};
    int root = 0;

    int newNode(int v) { t.push_back(Node{0, 0, 1, v, rnd() & 0x7fffffff, false}); return (int)t.size() - 1; }
    int sz(int p) const { return p ? t[p].sz : 0; }
    void pull(int p) { if (p) t[p].sz = sz(t[p].l) + sz(t[p].r) + 1; }
    void pushTag(int p) {
        if (!p || !t[p].rev) return;
        swap(t[p].l, t[p].r);
        if (t[p].l) t[t[p].l].rev ^= 1;
        if (t[p].r) t[t[p].r].rev ^= 1;
        t[p].rev = false;
    }
    // 切出前 k 个：a = 前 k 个，b = 剩余
    void split(int p, int k, int& a, int& b) {
        if (!p) { a = b = 0; return; }
        pushTag(p);
        if (sz(t[p].l) >= k) { b = p; split(t[p].l, k, a, t[p].l); }
        else { a = p; split(t[p].r, k - sz(t[p].l) - 1, t[p].r, b); }
        pull(p);
    }
    int merge(int a, int b) {
        if (!a || !b) return a ? a : b;
        if (t[a].pri > t[b].pri) { pushTag(a); t[a].r = merge(t[a].r, b); pull(a); return a; }
        pushTag(b); t[b].l = merge(a, t[b].l); pull(b); return b;
    }
    int build(const vector<int>& a) {
        int r = 0;
        for (int v : a) r = merge(r, newNode(v));
        return r;
    }
    void reverseRange(int l, int r) {            // 翻转第 l..r 个元素（1-indexed）
        int a, b, c;
        split(root, r, a, c);
        split(a, l - 1, a, b);
        if (b) t[b].rev ^= 1;
        root = merge(merge(a, b), c);
    }
    void inorder(int p, vector<int>& out) {      // 中序遍历 = 当前序列
        if (!p) return;
        pushTag(p);
        inorder(t[p].l, out);
        out.push_back(t[p].val);
        inorder(t[p].r, out);
    }
};
```

> `pushTag` 采用"延迟到访问时再交换左右儿子"的写法，注意 `split`/`merge` 进入节点时**必须先 pushTag**。

---

## 8. Splay（区间翻转）

> 需要"按排名访问 + 区间操作"的场合，Splay 依然是标准做法（LCT 的前置）。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Splay {
    struct Node { int fa = 0, ch[2] = {0, 0}, sz = 1, val = 0; bool rev = false; };
    vector<Node> t{Node{}};          // t[0] 是空节点：fa=0, sz=1 要特判
    int root = 0;

    Splay() { t[0].sz = 0; }

    int newNode(int v) {
        t.push_back(Node{});
        int p = (int)t.size() - 1;
        t[p].sz = 1, t[p].val = v;
        return p;
    }
    bool isR(int x) const { return t[t[x].fa].ch[1] == x; }
    void pull(int x) { t[x].sz = t[t[x].ch[0]].sz + t[t[x].ch[1]].sz + 1; }

    void pushTag(int x) {
        if (!t[x].rev) return;
        swap(t[x].ch[0], t[x].ch[1]);
        if (t[x].ch[0]) t[t[x].ch[0]].rev ^= 1;
        if (t[x].ch[1]) t[t[x].ch[1]].rev ^= 1;
        t[x].rev = false;
    }

    void rotate(int x) {
        int y = t[x].fa, z = t[y].fa;
        int d = (t[y].ch[1] == x);
        int w = t[x].ch[d ^ 1];
        t[y].ch[d] = w; if (w) t[w].fa = y;
        t[x].ch[d ^ 1] = y; t[y].fa = x;
        t[x].fa = z;
        if (z) t[z].ch[t[z].ch[1] == y] = x;   // 必须在改 t[y].fa 之前判断
        pull(y); pull(x);
    }

    void splay(int x, int goal = 0) {
        // 先把 x 到 goal 路径上的懒标记自上而下推干净，再旋转
        vector<int> path;
        for (int y = x; y != goal; y = t[y].fa) path.push_back(y);
        for (int i = (int)path.size() - 1; i >= 0; --i) pushTag(path[i]);

        while (t[x].fa != goal) {
            int y = t[x].fa, z = t[y].fa;
            if (z != goal) (isR(x) == isR(y)) ? rotate(y) : rotate(x);
            rotate(x);
        }
        if (!goal) root = x;
    }

    int kth(int k) {                       // 第 k 个（1-indexed），返回节点编号（不 splay）
        int p = root;
        while (true) {
            pushTag(p);
            int ls = t[t[p].ch[0]].sz;
            if (k <= ls) p = t[p].ch[0];
            else if (k == ls + 1) return p;
            else { k -= ls + 1; p = t[p].ch[1]; }
        }
    }

    // 序列内部下标 1..n 对应树中位置 2..n+1（有左右两个哨兵）
    void reverseRange(int l, int r) {
        int L = kth(l), R = kth(r + 2);
        splay(L);
        splay(R, L);
        int mid = t[R].ch[0];
        if (mid) t[mid].rev ^= 1;
    }

    // 从数组建树（内部递归，O(n)）
    int build(int l, int r, const vector<int>& a) {
        if (l > r) return 0;
        int mid = (l + r) >> 1;
        int p = newNode(a[mid]);
        int L = build(l, mid - 1, a), R = build(mid + 1, r, a);
        if (L) t[L].fa = p;
        if (R) t[R].fa = p;
        t[p].ch[0] = L, t[p].ch[1] = R;
        pull(p);
        return p;
    }
    // 用数组建树，并自动加上首尾两个哨兵（值用 INT_MIN / INT_MAX 占位）
    void buildWithSentinels(const vector<int>& a) {
        vector<int> b;
        b.reserve(a.size() + 2);
        b.push_back(INT_MIN);
        b.insert(b.end(), a.begin(), a.end());
        b.push_back(INT_MAX);
        root = build(0, (int)b.size() - 1, b);
    }

    void inorder(int p, vector<int>& out) {
        if (!p) return;
        pushTag(p);
        inorder(t[p].ch[0], out);
        out.push_back(t[p].val);
        inorder(t[p].ch[1], out);
    }
    // 当前序列（自动跳过首尾哨兵）
    vector<int> toArray() {
        vector<int> out;
        inorder(root, out);
        if (!out.empty() && out.front() == INT_MIN) out.erase(out.begin());
        if (!out.empty() && out.back() == INT_MAX) out.pop_back();
        return out;
    }
};
```

**关于两个哨兵**：建树时数组头部、尾部分别塞一个 `-INF`、`+INF`，这样 `kth(l)` 和 `kth(r+2)` 永远存在，不用特判边界。

---

## 9. Trie

### 9.1 字符 Trie

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Trie {
    struct Node { int ch[26]; int cnt; int pass; };
    vector<Node> t;
    Trie() { t.push_back(Node{}); }

    int newNode() {
        t.push_back(Node{});
        memset(t.back().ch, 0, sizeof(t.back().ch));
        return (int)t.size() - 1;
    }
    void insert(const string& s) {
        int p = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!t[p].ch[x]) t[p].ch[x] = newNode();
            p = t[p].ch[x];
            ++t[p].pass;                 // 经过该节点的串数
        }
        ++t[p].cnt;                      // 以该节点结尾的串数
    }
    bool contains(const string& s) {
        int p = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!t[p].ch[x]) return false;
            p = t[p].ch[x];
        }
        return t[p].cnt > 0;
    }
    int countPrefix(const string& s) {   // 以 s 为前缀的串数
        int p = 0;
        for (char c : s) {
            int x = c - 'a';
            if (!t[p].ch[x]) return 0;
            p = t[p].ch[x];
        }
        return t[p].pass;
    }
    void erase(const string& s) {        // 前提：s 存在
        int p = 0;
        for (char c : s) {
            int x = c - 'a';
            p = t[p].ch[x];
            --t[p].pass;
        }
        --t[p].cnt;
    }
};
```

### 9.2 01-Trie（异或最值）

```cpp
#include <bits/stdc++.h>
using namespace std;

// 维护一个多重集合，支持「插入」「删除」「查询与 x 异或的最大值」
struct Trie01 {
    struct Node { int ch[2]; int cnt; };
    vector<Node> t;
    static constexpr int BITS = 30;        // 值域 [0, 2^31)

    Trie01() { t.push_back(Node{{0, 0}, 0}); }

    int newNode() { t.push_back(Node{{0, 0}, 0}); return (int)t.size() - 1; }

    void insert(int x) {
        int p = 0;
        ++t[p].cnt;
        for (int b = BITS; b >= 0; --b) {
            int c = (x >> b) & 1;
            if (!t[p].ch[c]) t[p].ch[c] = newNode();
            p = t[p].ch[c];
            ++t[p].cnt;
        }
    }
    void erase(int x) {                    // 前提：x 存在
        int p = 0;
        --t[p].cnt;
        for (int b = BITS; b >= 0; --b) {
            p = t[p].ch[(x >> b) & 1];
            --t[p].cnt;
        }
    }
    // 集合中与 x 异或的最大值
    int maxXor(int x) {
        int p = 0, res = 0;
        for (int b = BITS; b >= 0; --b) {
            int c = (x >> b) & 1;
            if (t[p].ch[c ^ 1] && t[t[p].ch[c ^ 1]].cnt > 0) {
                res |= (1 << b);
                p = t[p].ch[c ^ 1];
            } else {
                p = t[p].ch[c];
            }
        }
        return res;
    }
};
```

> `BITS` 按值域取：`int` 非负用 30，带负数用 31 并把 `x` 转成 `unsigned`。

---

## 10. 字符串哈希

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct StringHash {
    static constexpr int P1 = 1000000007, P2 = 1000000009;
    static constexpr int B1 = 131, B2 = 137;
    int n;
    vector<int> h1, h2, p1, p2;

    explicit StringHash(const string& s) : n((int)s.size()) {
        h1.assign(n + 1, 0), h2.assign(n + 1, 0);
        p1.assign(n + 1, 1), p2.assign(n + 1, 1);
        for (int i = 0; i < n; ++i) {
            h1[i + 1] = ((ll)h1[i] * B1 + (unsigned char)s[i]) % P1;
            h2[i + 1] = ((ll)h2[i] * B2 + (unsigned char)s[i]) % P2;
            p1[i + 1] = (ll)p1[i] * B1 % P1;
            p2[i + 1] = (ll)p2[i] * B2 % P2;
        }
    }

    // 子串 s[l..r] 的双哈希（1-indexed，闭区间）
    pair<int, int> get(int l, int r) const {
        int x1 = (int)((h1[r] - (ll)h1[l - 1] * p1[r - l + 1] % P1 + P1) % P1);
        int x2 = (int)((h2[r] - (ll)h2[l - 1] * p2[r - l + 1] % P2 + P2) % P2);
        return {x1, x2};
    }
    // 判断两段是否相同
    bool same(int l1, int r1, int l2, int r2) const {
        return get(l1, r1) == get(l2, r2);
    }
};
```

**防卡技巧**

- 单哈希用 `unsigned long long` **自然溢出**最快，但会被构造数据卡；
- 比赛里最稳的是**双模哈希**（上面这版），常数约为单哈希的 2 倍；
- 模数挑 `1e9+7 / 1e9+9` 或 `998244353 / 1e9+7`，底数挑**大于字符集**的质数；
- 真的怕卡：加一个 `unordered_map` 的随机化基址，或者直接用 `map<pair, vector>` 暴力核对。

---

## 11. 可持久化线段树（主席树）

> 每次修改只新建 `O(log n)` 个节点，旧版本原封不动。经典用法：静态区间第 k 小。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct PersistentSeg {
    struct Node { int ls = 0, rs = 0, cnt = 0; };
    vector<Node> t{Node{}};
    vector<int> roots;              // roots[i] = 插完前 i 个数后的根
    int L, R;

    PersistentSeg(int L, int R) : L(L), R(R) { roots.push_back(0); }

    // 在版本 p 的基础上，把 pos 位置的计数 +v，返回新根
    int update(int p, int l, int r, int pos, int v) {
        int np = (int)t.size();
        t.push_back(p ? t[p] : Node{});
        t[np].cnt += v;
        if (l == r) return np;
        int mid = (l + r) >> 1;
        if (pos <= mid) t[np].ls = update(t[p].ls, l, mid, pos, v);
        else            t[np].rs = update(t[p].rs, mid + 1, r, pos, v);
        return np;
    }
    int update(int p, int pos, int v) { return update(p, L, R, pos, v); }
    void push_back(int pos) { roots.push_back(update(roots.back(), pos, 1)); }

    // 查询版本 q 与版本 p 之间（即区间 (p, q]）的第 k 小
    int kth(int p, int q, int k) const {
        int l = L, r = R;
        while (l < r) {
            int mid = (l + r) >> 1;
            int leftCnt = t[t[q].ls].cnt - t[t[p].ls].cnt;
            if (leftCnt >= k) { p = t[p].ls, q = t[q].ls, r = mid; }
            else { k -= leftCnt; p = t[p].rs, q = t[q].rs, l = mid + 1; }
        }
        return l;
    }
    // 区间 [l, r] 的第 k 小（1-indexed）
    int kthInRange(int l, int r, int k) const { return kth(roots[l - 1], roots[r], k); }
};
```

**用法**：先把原数组离散化成 `1..m`，再依次 `push_back`。查询 `[l, r]` 第 `k` 小时，用 `roots[r]` 减去 `roots[l-1]` 得到该区间的权值分布。

---

## 12. 树链剖分 HLD

> 把树上路径拆成 `O(log n)` 段连续的 `dfn` 区间，交给线段树处理。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct HLD {
    int n, timer = 0;
    vector<vector<int>> g;
    vector<int> fa, dep, sz, son, top, dfn, rnk;

    explicit HLD(int n) : n(n), g(n + 1), fa(n + 1), dep(n + 1),
                          sz(n + 1), son(n + 1), top(n + 1), dfn(n + 1), rnk(n + 1) {}

    void addEdge(int u, int v) { g[u].push_back(v); g[v].push_back(u); }

    void dfs1(int u, int f) {
        fa[u] = f, dep[u] = dep[f] + 1, sz[u] = 1, son[u] = 0;
        for (int v : g[u]) {
            if (v == f) continue;
            dfs1(v, u);
            sz[u] += sz[v];
            if (sz[v] > sz[son[u]]) son[u] = v;      // 重儿子
        }
    }
    void dfs2(int u, int tp) {
        top[u] = tp, dfn[u] = ++timer, rnk[timer] = u;
        if (!son[u]) return;
        dfs2(son[u], tp);                             // 重儿子继承链头
        for (int v : g[u])
            if (v != fa[u] && v != son[u]) dfs2(v, v); // 轻儿子自立门户
    }
    void init(int root) { dfs1(root, 0); dfs2(root, root); }

    // 把 u-v 路径拆成若干 dfn 区间，依次回调 f(l, r)
    template <class F>
    void path(int u, int v, F f) {
        while (top[u] != top[v]) {
            if (dep[top[u]] < dep[top[v]]) swap(u, v);
            f(dfn[top[u]], dfn[u]);
            u = fa[top[u]];
        }
        if (dep[u] > dep[v]) swap(u, v);
        f(dfn[u], dfn[v]);
    }

    // 子树是连续区间
    pair<int, int> subtree(int u) const { return {dfn[u], dfn[u] + sz[u] - 1}; }

    int lca(int u, int v) {
        while (top[u] != top[v]) {
            if (dep[top[u]] < dep[top[v]]) swap(u, v);
            u = fa[top[u]];
        }
        return dep[u] < dep[v] ? u : v;
    }
};
```

**用法**：`init(root)` 之后，把 `a[rnk[i]]` 塞进线段树作为初值；路径操作直接
`hld.path(u, v, [&](int l, int r){ seg.update(l, r, v); });`

**坑点**

- 递归两遍深搜，`n = 5e5` 的链会爆栈（同前面 Tarjan 的问题），可改迭代或手动开栈；
- `sz[0]` 必须是 0（`sz` 初始化成 0 就自动满足），否则选重儿子会出错。

---

## 13. 左偏树（可并堆）

> 支持 `O(log n)` 合并两个堆。典型应用：k 短路、树上合并堆、可并堆优化 DP。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct LeftistHeap {
    struct Node { int l = 0, r = 0, val = 0, dis = 0; };
    vector<Node> t{Node{}};          // t[0]：dis = 0，表示空

    int newNode(int v) {
        t.push_back(Node{0, 0, v, 1});
        return (int)t.size() - 1;
    }
    int merge(int a, int b) {
        if (!a || !b) return a ? a : b;
        if (t[a].val > t[b].val) swap(a, b);        // 小根堆
        t[a].r = merge(t[a].r, b);
        if (t[t[a].l].dis < t[t[a].r].dis) swap(t[a].l, t[a].r);
        t[a].dis = t[t[a].r].dis + 1;
        return a;
    }
    int push(int root, int v) { return merge(root, newNode(v)); }
    int top(int root) const { return root ? t[root].val : INT_MAX; }
    int pop(int root) { return merge(t[root].l, t[root].r); }
};
```

---

## 14. 分块与莫队

### 14.1 分块：区间加 + 区间和

> 能 O(√n) 做的题，先想分块。**考场第一暴力升级方案**。

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct SqrtDecomp {
    int n, B, nb;
    vector<ll> a, tag, sum;
    vector<int> bel;

    explicit SqrtDecomp(const vector<ll>& arr) {       // arr 是 1-indexed
        n = (int)arr.size() - 1;
        B = max(1, (int)sqrt(n));
        nb = (n + B - 1) / B;
        a = arr;
        tag.assign(nb + 1, 0);
        sum.assign(nb + 1, 0);
        bel.assign(n + 1, 0);
        for (int i = 1; i <= n; ++i) {
            bel[i] = (i - 1) / B + 1;
            sum[bel[i]] += a[i];
        }
    }
    void rangeAdd(int l, int r, ll v) {
        if (bel[l] == bel[r]) {
            for (int i = l; i <= r; ++i) a[i] += v, sum[bel[i]] += v;
            return;
        }
        for (int i = l; i <= bel[l] * B; ++i) a[i] += v, sum[bel[i]] += v;
        for (int i = (bel[r] - 1) * B + 1; i <= r; ++i) a[i] += v, sum[bel[i]] += v;
        for (int b = bel[l] + 1; b <= bel[r] - 1; ++b) {
            tag[b] += v;
            sum[b] += v * (min(n, b * B) - (b - 1) * B);   // 末块可能不满 B 个
        }
    }
    ll prefix(int x) const {
        if (x <= 0) return 0;
        ll s = 0;
        for (int b = 1; b < bel[x]; ++b) s += sum[b];
        int st = (bel[x] - 1) * B + 1;
        for (int i = st; i <= x; ++i) s += a[i];
        s += tag[bel[x]] * (ll)(x - st + 1);               // 整块加法只记在 tag 上
        return s;
    }
    ll rangeSum(int l, int r) const { return prefix(r) - prefix(l - 1); }
};
```

> 注意 `sum[b]` 已经包含了 `tag[b]` 的贡献，所以 `prefix` 不用再加 `tag * 长度`。

### 14.2 莫队：离线区间查询

```cpp
#include <bits/stdc++.h>
using namespace std;

// 用法：把 add / del 换成你题目要维护的东西
struct MoSolver {
    int n, B;
    vector<int> a;
    vector<int> cnt;
    long long cur = 0;                 // 当前答案

    struct Q { int l, r, id; };

    explicit MoSolver(vector<int> arr) : n((int)arr.size()), a(std::move(arr)) {
        B = max(1, (int)(n / sqrt(max(1, n))));   // 块长可调，一般取 n/sqrt(q)
        cnt.assign(n + 5, 0);
    }

    void add(int i) {
        // 例：统计区间内「出现了奇数次的数」的个数
        ++cnt[a[i]];
        if (cnt[a[i]] & 1) ++cur; else --cur;
    }
    void del(int i) {
        if (cnt[a[i]] & 1) --cur; else ++cur;   // 奇数变偶数 -> 抵消掉一个
        --cnt[a[i]];
    }

    vector<long long> solve(vector<Q> qs) {
        int blk = max(1, (int)sqrt(n));
        sort(qs.begin(), qs.end(), [&](const Q& x, const Q& y) {
            if (x.l / blk != y.l / blk) return x.l / blk < y.l / blk;
            return (x.l / blk) & 1 ? x.r > y.r : x.r < y.r;   // 奇偶优化
        });
        vector<long long> ans(qs.size());
        int L = 1, R = 0;
        for (auto& q : qs) {
            while (L > q.l) add(--L);
            while (R < q.r) add(++R);
            while (L < q.l) del(L++);
            while (R > q.r) del(R--);
            ans[q.id] = cur;
        }
        return ans;
    }
};
```

> **奇偶优化**：同一左端点块内，右端点先升后降，能把常数砍掉一半。带修改的莫队再引入时间维 `t`，块长取 `n^(2/3)`。

---

## 15. 笛卡尔树

> `O(n)` 建一棵满足「中序 = 原序列、堆性质」的二叉树。把 RMQ 转成 LCA，把直方图问题转成树上问题。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 小根堆笛卡尔树；返回根编号，lc/rc 为左右儿子（-1 表示空）
struct CartesianTree {
    vector<int> lc, rc, st;
    int root = -1;

    explicit CartesianTree(const vector<int>& a) {
        int n = (int)a.size();
        lc.assign(n, -1);
        rc.assign(n, -1);
        st.reserve(n);
        for (int i = 0; i < n; ++i) {
            int last = -1;
            while (!st.empty() && a[st.back()] > a[i]) {    // 大根堆改成 <
                last = st.back();
                st.pop_back();
            }
            if (!st.empty()) rc[st.back()] = i;
            lc[i] = last;
            st.push_back(i);
        }
        root = st.empty() ? -1 : st.front();
    }
};
```

**性质**：`val` 满足堆序，中序遍历等于原数组下标顺序，所以**区间最值 = LCA**。

---

## 16. 选型速查

| 需求 | 首选 | 备选 |
|:--|:--|:--|
| 单点改 + 前缀/区间和 | 树状数组 | 线段树 |
| 区间加 + 区间和 | 带懒标记线段树 | 树状数组（双 BIT） |
| 区间加 + 区间最值 | 线段树（`max` 单调） | 分块 |
| 区间赋值 / 区间乘加 | 线段树 | 分块（老题） |
| 静态区间最值 | ST 表 | 线段树 |
| 动态区间第 k 小 | 值域线段树 + 树状数组 | 主席树（离线） |
| 静态区间第 k 小 | 主席树 | 归并树 |
| 动态有序集合（插删/排名） | FHQ Treap | Splay / `pb_ds` |
| 维护序列 + 区间翻转 | 无旋 Treap（按大小分裂） | Splay |
| 树上路径查询 | 树链剖分 | 倍增 + 差分（离线） |
| 树上合并统计量 | 线段树合并 | dsu on tree |
| 可合并堆 | 左偏树 | 斜堆 |
| 离线区间询问 | 莫队 | 前缀和 / 离线扫描 |
| 强制在线 + 大常数 | 不要分块，直接学正解 | — |

---

## 17. 考场自检清单

写完一个数据结构，交之前按这个顺序过一遍：

1. **数组开够了吗**：`4 * n + 5` 是线段树的硬性要求，`n * 4` 在 `n = 1` 时也不会越界；
2. **下标从 0 还是 1**：本文全部 `[1, n]`，混用必错；
3. **`pushdown` 有没有漏**：`update`/`query` 递归子区间之前必须 `push`；
4. **`pull` 有没有漏**：改完儿子之后必须重新合并父节点；
5. **标记顺序**：乘加标记一定"先乘后加"，合并时按固定顺序推；
6. **空节点处理**：`t[0]` 的 `sz / cnt / sum` 必须是 0，否则合并会出错；
7. **多组数据重置**：`vector` 重新 `assign`，别忘 `clear`；
8. **递归栈深**：`n ≥ 1e5` 的链 / 退化情形，考虑迭代或手写栈；
9. **边界值**：`l == r`、`l > r`、`k` 超出范围，单独想一遍；
10. **对拍**：写完之后随机数据对暴力，这是唯一可靠的验证方式。

---

## 18. 配套模板索引

站内已有单点模板页，可以直接对照：

- [线段树（区间加 + 区间求和）](/templates/segtree-lazy/)
- [树状数组](/templates/fenwick/)
- [并查集](/templates/dsu/)
- [KMP](/templates/kmp/)
- [字符串哈希](/templates/string-hash/)
- [Trie](/templates/trie/)
- [最近公共祖先 LCA](/templates/lca/)
- [强连通分量](/templates/strongly-connected-components/)

> 本页是"**全操作合集**"，模板页是"**单点精讲**"，配合看效率最高。


