---
title: 后缀表达式求偏导数/导数
platform: 其他
problemId:  acwing-5299
problemUrl: https://www.acwing.com/file_system/file/content/whole/index/content/10768525/
difficulty: 普及
tags: [模拟,字符串]
author: Jeonghong Song
date:  2026-10-09
---

## 题意简述
给定后缀表达式如下:
```
x1 x1 x1 * x2 + *
x2 x2 * x2 * 0 + -100000 -100000 * x2 * -
```
之后多次查询每次给出所有自变量的值，尝试求得其中对指定变量偏导数的值。

## 思路

- 首先使用stringstream对表达式中的元素进行读取，读取到vector容器中。
-对于数字字符串直接使用stoi进行转换，x的下标也是如此。

- 对于每一个栈中已经存在的表达式，存储对应的函数值和导数值，
因为每次使用乘法合并两个函数值时，都需要进行u*v'+u'*v。这种运算。
- 至于加减法只需要注意先弹出后边的元素，在弹出前面的元素就可以了。
最后栈顶的元素就是所求偏导数。

## 代码

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;

constexpr int MOD = 1e9 + 7;

// 安全取模函数，处理负数情况
int safe_mod(int a) {
    return (a % MOD + MOD) % MOD;  // a取模加模再取模
}

signed main() {
    ios_base::sync_with_stdio(false);cin.tie(NULL);
    int n, m;cin>>n>>m;
    // 读取第二行的逆波兰式
    cin.ignore();                   // 忽略第一行末尾的换行符
    string line;  getline(cin, line);
    stringstream ss(line);      
    vector<string> expr;
    string token;
    while (ss >> token) {
        expr.push_back(token);
    }
    while (m--) {
        int target_i; cin >> target_i;
        vector<int> a(n + 1);  for (int j = 1; j <= n;j++) cin >> a[j];

        // 栈存储 pair<val, der>
        stack<pair<int, int>> st;

        // 遍历逆波兰式
        for (const string& t : expr) {
            if (t[0] == 'x') {
                // 变量 xj
                int j = stoi(t.substr(1));
                int val = safe_mod(a[j]);
                int der = (j == target_i) ? 1 : 0;      // der为什么就直接为1了
                st.push({val, der});
            } else if (t == "+" || t == "-" || t == "*") {
                // 运算符，弹出两个操作数
                auto [v2, d2] = st.top(); st.pop();
                auto [v1, d1] = st.top(); st.pop();
                
                if (t == "+") {
                    int val = safe_mod(v1 + v2);
                    int der = safe_mod(d1 + d2);
                    st.push({val, der});
                } else if (t == "-") {
                    int val = safe_mod(v1 - v2);
                    int der = safe_mod(d1 - d2);
                    st.push({val, der});
                } else if (t == "*") {
                    // 乘法法则：(uv)' = u'v + uv'
                    int val = safe_mod(v1 * v2);
                    int der = safe_mod(d1 * v2 + v1 * d2);
                    st.push({val, der});
                }
            } else {
                // 常数
                int val = safe_mod(stoll(t));
                st.push({val, 0});
            }
        }
        // 最终栈顶元素的der即为所求偏导数
        cout << safe_mod(st.top().second) << "\n";
    }return 0;
}
```
## 小结
这道题其实并不是那么的难，关键要学习的点利用处理这种空格分割的字符串操作，以及最核心的偏导数结合后缀表达式的高效求解。
