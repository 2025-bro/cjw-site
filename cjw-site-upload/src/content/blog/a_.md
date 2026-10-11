# 第8-11章 数据结构知识点整理

---

## 第8章 栈（Stack）

### 1. 栈的定义与特性
- 栈是一个**线性表**，插入和删除操作都在表的同一端进行。
- 允许插入和删除的一端称为**栈顶（top）**，另一端称为**栈底（bottom）**。
- 插入操作称为 `push`，删除操作称为 `pop`。
- 栈是**后进先出（LIFO, Last-In, First-Out）**表。

### 2. 栈的抽象数据类型
操作：
- `empty()`：栈为空返回 `true`
- `size()`：返回栈中元素个数
- `top()`：返回栈顶元素
- `pop()`：删除栈顶元素
- `push(x)`：将元素 `x` 压入栈

C++ 抽象类：
```cpp
template <class T>
class stack {
public:
    virtual ~stack() {}
    virtual bool empty() const = 0;
    virtual int size() const = 0;
    virtual T& top() = 0;
    virtual void pop() = 0;
    virtual void push(const T& theElement) = 0;
};
```

### 3. 栈的描述方法
栈可以使用任何线性表的描述方法：
- 数组描述
- 链表描述

#### 3.1 数组描述
有两种实现方法：
1. 从 `ArrayList` 派生得到 `derivedArrayStack`
2. 定制数组描述的栈类 `arrayStack`

**derivedArrayStack：**
- 栈顶元素索引：`ArrayList<T>::size() - 1`
- 优点：减少编码量，提高程序可靠性
- 缺点：运行效率降低；`push` 中有不必要的下标检查和拷贝

**定制 arrayStack：**
- 成员：
  - `stackTop`：栈顶索引
  - `arrayLength`：数组容量
  - `stack`：数组指针
- 空栈：`stackTop == -1`
- 栈满：`stackTop == arrayLength - 1`
- 栈中元素个数：`stackTop + 1`

关键操作：
```cpp
template<class T>
T& arrayStack<T>::top() {
    if (stackTop == -1) throw StackEmpty();
    return stack[stackTop];
}

template<class T>
void arrayStack<T>::pop() {
    if (stackTop == -1) throw StackEmpty();
    stack[stackTop--].~T();
}

template<class T>
void arrayStack<T>::push(const T& theElement) {
    if (stackTop == arrayLength - 1) {
        changeLength1D(stack, arrayLength, 2 * arrayLength);
        arrayLength *= 2;
    }
    stack[++stackTop] = theElement;
}
```

**双栈共享一个数组：**
- 两个栈从数组两端向中间增长。
- 可减少多栈同时使用时的空间浪费。

#### 3.2 链表描述
有两种实现方法：
1. 从 `chain` 派生得到 `derivedLinkedListStack`
2. 定制链表描述的栈类 `LinkedListStack`

**derivedLinkedListStack：**
- 若把链表右端作为栈顶：
  - `top()` → `get(size()-1)`
  - `push()` → `insert(size(), theElement)`
  - `pop()` → `erase(size()-1)`
  - 时间复杂度：`Θ(size())`
- 若把链表左端作为栈顶：
  - `top()` → `get(0)`
  - `push()` → `insert(0, theElement)`
  - `pop()` → `erase(0)`
  - 时间复杂度：`Θ(1)`

**LinkedListStack：**
- 成员：
  - `stackTop`：栈顶指针
  - `stackSize`：栈中元素个数
- 空栈：`stackTop == NULL, stackSize == 0`
- 栈顶元素：`stackTop->element`

### 4. 栈的应用

#### 4.1 括号匹配
- 顺序扫描表达式，仅处理左右括号。
- 遇到左括号：压栈。
- 遇到右括号：
  - 若栈空：右括号无匹配。
  - 否则栈顶为最近的左括号，输出匹配位置并弹栈。
- 扫描结束后，若栈不空，则栈中左括号无匹配。

```cpp
void printMatchedPairs(string expr) {
    arrayStack<int> s;
    int length = (int)expr.size();
    for (int i = 0; i < length; i++) {
        if (expr.at(i) == '(') {
            s.push(i);
        } else if (expr.at(i) == ')') {
            try {
                cout << s.top() << ' ' << i << endl;
                s.pop();
            } catch (StackEmpty) {
                cout << "No match for right parenthesis at " << i << endl;
            }
        }
    }
    while (!s.empty()) {
        cout << "No match for left parenthesis at " << s.top() << endl;
        s.pop();
    }
}
```

#### 4.2 汉诺塔
- 目标：将 `n` 个碟子从塔 A 移到塔 C，借助塔 B。
- 规则：每次移动一个碟子；任何时候不能把大碟子放到小碟子上面。
- 递归解法：
  1. 将 `n-1` 个碟子从 x 移到 z，借用 y；
  2. 将最重的碟子从 x 移到 y；
  3. 将 `n-1` 个碟子从 z 移到 y，借用 x。

移动次数：
\[
moves(n) =
\begin{cases}
0, & n = 0 \\
2 \cdot moves(n-1) + 1, & n > 0
\end{cases}
\]
\[
moves(n) = 2^n - 1
\]
时间复杂度：\(\Theta(2^n)\)

可用栈表示各塔状态：
```cpp
arrayStack<int> tower[4]; // tower[1], tower[2], tower[3]
```

#### 4.3 列车车厢重排
- 缓冲铁轨按 LIFO 方式使用。
- 选择缓冲铁轨的分配规则：
  - 已有车厢编号应大于想要进缓冲轨道的车厢编号，否则无法保证出轨顺序。
  - 若有多个大于入轨编号的缓冲轨道，挑选最小的。
  - 否则会导致后续入轨编号较大的车厢无处可去。

#### 4.4 迷宫老鼠
- 从入口出发，若当前位置是出口，则找到路径。
- 否则在当前位置放置障碍物，防止绕回。
- 检查相邻位置是否有空闲位置；有则移动到新位置，并把当前位置保存在栈中。
- 若无空闲相邻位置，则回退到上一位置。
- 若所有相邻空闲位置都探索过且未找到路径，则不存在路径。

---

## 第9章 队列（Queue）

### 1. 队列的定义与特性
- 队列是一个线性表，插入和删除操作分别在表的不同端进行。
- 添加新元素的一端称为**队尾（queueBack / qBack）**。
- 删除元素的一端称为**队首（queueFront / qFront）**。
- 队列是**先进先出（FIFO, First-In, First-Out）**的线性表。

### 2. 队列的抽象数据类型
操作：
- `empty()`：队列为空返回 `true`
- `size()`：返回队列中元素个数
- `front()`：返回队头元素
- `back()`：返回队尾元素
- `pop()`：删除队头元素
- `push(x)`：将元素 `x` 加入队尾

C++ 抽象类：
```cpp
template <class T>
class queue {
public:
    virtual ~queue() {}
    virtual bool empty() const = 0;
    virtual int size() const = 0;
    virtual T& front() = 0;
    virtual T& back() = 0;
    virtual void pop() = 0;
    virtual void push(const T& theElement) = 0;
};
```

### 3. 队列的数组描述

#### 3.1 数组描述1
- `qFront` 总是 0，`qBack` 指向最后一个元素。
- 队列长度：`qBack + 1`
- 队列为空：`qBack == -1`
- 队首出队：所有元素前移一位，`O(n)`
- 队尾入队：元素插入 `qBack+1` 位置，`O(1)`

#### 3.2 数组描述2
- `qFront` 和 `qBack` 均动态移动。
- 队列长度：`qBack - qFront + 1`
- 队列为空：`qBack < qFront`
- 队首出队：`O(1)`
- 队尾入队：`O(1)`
- 队尾抵达数组末端时，可将队列拷贝至数组前端，`O(n)`

#### 3.3 循环队列
- 将数组视为一个“环”。
- 使用 `i % n` 表示队列第 `i` 个元素到数组位置的映射。
- `qFront` 修改为指向队头前一个位置（该位置总为空）。
- 队列不能插满：最多 `n-1` 个元素。
- 队列为空：`qFront == qBack`
- 队列为满：`(qBack + 1) % n == qFront`
- 队列长度：
\[
(arrayLength + queueBack - queueFront) \% arrayLength
\]

`arrayQueue` 关键操作：
```cpp
template<class T>
T& arrayQueue<T>::front() const {
    if (queueFront == queueBack) throw queueEmpty();
    return queue[(queueFront + 1) % arrayLength];
}

template<class T>
T& arrayQueue<T>::back() const {
    if (queueFront == queueBack) throw queueEmpty();
    return queue[queueBack];
}

template<class T>
void arrayQueue<T>::pop() {
    if (queueFront == queueBack) throw queueEmpty();
    queueFront = (queueFront + 1) % arrayLength;
    queue[queueFront].~T();
}

template<class T>
void arrayQueue<T>::push(const T& theElement) {
    if ((queueBack + 1) % arrayLength == queueFront) {
        // 扩展数组
    }
    queueBack = (queueBack + 1) % arrayLength;
    queue[queueBack] = theElement;
}
```

**循环队列数组扩展：**
- 队尾未绕回数组开始：一次拷贝。
- 队尾在第一元素前：两次拷贝。
  - 队首至数组末尾
  - 数组起始至队尾
- 扩展后：
  - `queueFront = 2 * arrayLength - 1`
  - `queueBack = arrayLength - 2`

### 4. 队列的链表描述
- 队头就是链表头，队尾就是链表尾。
- 插入：`O(1)`
- 删除：`O(1)`

`LinkedListQueue` 成员：
- `queueFront`
- `queueBack`
- `queueSize`

关键操作：
```cpp
template<class T>
void LinkedListQueue<T>::push(const T& theElement) {
    chainNode<T>* newNode = new chainNode<T>(theElement, nullptr);
    if (queueSize != 0)
        queueBack->next = newNode;
    else
        queueFront = newNode;
    queueBack = newNode;
    queueSize++;
}

template<class T>
void LinkedListQueue<T>::pop() {
    if (queueFront == NULL) throw queueEmpty();
    chainNode<T>* nextNode = queueFront->next;
    delete queueFront;
    queueFront = nextNode;
    queueSize--;
}
```

### 5. 队列的应用：列车车厢重排
- 缓冲铁轨位于入轨和出轨之间。
- 禁止：
  - 将车厢从缓冲铁轨移动至入轨
  - 从出轨移动车厢至缓冲铁轨
  - 铁轨 Hk 为可直接将车厢从入轨移动到出轨的通道
- 车厢移动到缓冲铁轨的原则：
  - 该缓冲铁轨中现有各车厢的编号均小于 `c`；
  - 如果有多个缓冲铁轨都满足这一条件，则选择一个左端车厢编号最大的缓冲铁轨；
  - 否则选择一个空的缓冲铁轨（如果有）。

重排思想：
```cpp
int NowOut = 1;
for (int i = 1; i <= n; i++) {
    // 车厢 p[i] 从入轨上移出
    if (p[i] == NowOut) {
        // 使用缓冲铁轨 Hk 把 p[i] 放到出轨上去
        NowOut++;
        while (minH == NowOut) {
            // 把 minH 放到出轨上去
            // 更新 minH, minQ
            NowOut++;
        }
    } else {
        // 按照分配规则将车厢 p[i] 送入某个缓冲铁轨
    }
}
```

---

## 第10章 散列（Hashing）

### 1. 字典
- 字典是一些形如 `(k, v)` 的数对组成的集合。
- `k` 是关键字，`v` 是关键字 `k` 对应的值。
- 任意两个数对，其关键字各不相同。
- 操作：
  - `empty()`
  - `size()`
  - `find(k)`
  - `insert(p)`
  - `erase(k)`

C++ 抽象类：
```cpp
template<typename K, typename E>
class dictionary {
public:
    virtual ~dictionary() {}
    virtual bool empty() const = 0;
    virtual int size() const = 0;
    virtual std::pair<const K, E>* find(const K&) const = 0;
    virtual void erase(const K&) = 0;
    virtual void insert(const std::pair<const K, E>&) = 0;
};
```

### 2. 字典的线性表描述

#### 2.1 有序数组描述 `sortedArrayList`
- 搜索：折半搜索，`O(log n)`
- 插入：`O(n)`
- 删除：`O(n)`

#### 2.2 有序链表描述 `sortedChain`
- 搜索：`O(n)`
- 插入：`O(n)`
- 删除：`O(n)`

节点结构：
```cpp
template<typename K, typename E>
struct pairNode {
    pair<const K, E> element;
    pairNode<const K, E>* next;
};
```

### 3. 散列表描述
- 散列方法：通过散列函数将给定键值映射到散列表的一个位置上。
- 数对 `p = {k, v}`，散列函数 `f`，哈希表 `H`。
- 理想散列：每个键值映射到唯一位置，操作时间复杂度 `Θ(1)`。
- 当关键字范围太大时，采用比关键字范围小的散列表。
- 除法散列函数：
\[
f(k) = k \% D
\]
其中 `D` 是散列表的大小。
- 桶（bucket）：散列表中的每一个位置。
- 起始桶（home bucket）：对关键字为 `k` 的数对，位置 `f(k)` 是起始桶。
- 冲突（collision）：两个不同关键字起始桶号相同。
- 溢出（overflow）：存储桶中没有空间。
- 当每个桶只能存储一个数对时，碰撞和溢出同时发生。

### 4. 解决溢出：线性探查
- 当溢出发生时，将元素插入下一个可用桶中。
- 寻找下一个可用桶时，表被视为环形。
- 插入：从 `f(k)` 开始找空桶。
- 搜索：从起始桶 `f(k)` 开始搜索，直到：
  1. 找到关键字为 `k` 的桶；
  2. 到达一个空桶；
  3. 又回到起始桶 `f(k)`。
- 删除：不能仅仅把相应位置置为空。
  - 可以为每个桶增加 `NeverUsed` 域：
    - 初始为 `true`，放过数据后为 `false`。
    - 直接删除数对；搜索时，碰到 `false` 的空桶继续搜索。
    - 一段时间后需要重新排列哈希表。

`hashTable` 类：
```cpp
template<class K, class E>
class hashTable : dictionary<K,E> {
private:
    int search(const K&) const;
    pair<const K, E>** table;
    int divisor;
    hashFunc<K> hash;
    int dSize;
public:
    hashTable(int theDivisor = 11);
    ~hashTable();
    bool empty() const { return dSize == 0; }
    int size() const { return dSize; }
    pair<const K, E>* find(const K&) const;
    void insert(const pair<const K, E>&);
    void erase(const K& theKey);
};
```

`search` 方法：
```cpp
template<class K, class E>
int hashTable<K,E>::search(const K& theKey) const {
    int i = (int)hash(theKey) % divisor;
    int j = i;
    do {
        if (table[j] == nullptr || table[j]->first == theKey)
            return j;
        j = (j + 1) % divisor;
    } while (j != i);
    return j;
}
```

三种结果：
1. 查找成功：返回索引指向位置的键值与查找键值一致。
2. 查找失败，但找到一个空位置。
3. 查找失败，数组已满。

`find` 和 `insert`：
```cpp
template<class K, class E>
pair<const K, E>* hashTable<K,E>::find(const K& theKey) const {
    int b = search(theKey);
    if (table[b] == nullptr || table[b]->first != theKey)
        return nullptr;
    return table[b];
}

template<class K, class E>
void hashTable<K,E>::insert(const pair<const K, E>& thePair) {
    int b = search(thePair.first);
    if (table[b] == nullptr) {
        table[b] = new pair<const K, E>(thePair);
        dSize++;
    } else if (table[b]->first == thePair.first) {
        table[b]->second = thePair.second;
    } else {
        throw hashTableFull();
    }
}
```

### 5. 散列性能
- 装填因子/负载因子：
\[
\alpha = n / b, \quad 0 \le \alpha \le 1
\]
其中 `n` 为元素个数，`b` 为桶数。
- 成功搜索平均搜索桶数：
\[
S_n \approx \frac{1}{2}\left(1 + \frac{1}{1-\alpha}\right)
\]
- 不成功搜索平均搜索桶数：
\[
U_n \approx \frac{1}{2}\left(1 + \frac{1}{(1-\alpha)^2}\right)
\]
- 最坏情况：所有关键字在同一个桶中，插入和搜索时间均为 `Θ(n)`。

### 6. 除数 D 的选择
方法 1：
- 确定 `U_n` 和 `S_n`；
- 使用公式确定最大 `α`，即 `α_max`；
- 根据 `α_max` 和预期数对数量 `n`，计算最少桶数：
\[
b_{min} = n / \alpha_{max}
\]
- 取 `D` 为大于等于 `b_min` 的最小整数：
  - 素数，或
  - 没有小于 20 的素数因子的数。

方法 2：
- 根据散列表最大空间确定 `b_max`；
- 取 `D` 为不大于这个最大值的整数，且要么是素数，要么没有小于 20 的素数因子。

### 7. 链式散列
- 设一个桶可以放无限多个数对，散列表中的桶用一个链表来配置。
- 一个链表上的数对具有同样起始桶。
- 操作：
  - 查找：计算 `f(k)`，搜索该桶对应链表。
  - 插入：计算 `f(k)`，搜索，插入。
  - 删除：计算 `f(k)`，搜索，删除。

`hashChains` 类直接复用 `sortedChain` 为桶内链表：
```cpp
template<class K, class E>
class hashChains : public dictionary<K, E> {
protected:
    sortedChain<K,E>* table;
    int divisor;
    hash<K> hash;
    int dSize;
public:
    hashChains(int theDivisor = 11) : divisor(theDivisor), dSize(0) {
        table = new sortedChain<K,E>[divisor];
    }
    ~hashChains() { delete[] table; }
    bool empty() const { return dSize == 0; }
    int size() const { return dSize; }
    pairNode<const K,E>* find(const K& theKey) const {
        return table[hash(theKey) % divisor].find(theKey);
    }
    void insert(const pair<const K,E>& thePair);
    void erase(const K& theKey) {
        table[hash(theKey) % divisor].erase(theKey);
    }
};
```

性能：
- 线性探查空间少。
- 链式散列平均性能：
  - 不成功搜索：
\[
U_n \approx \frac{\alpha(\alpha+3)}{2(\alpha+1)} \quad (\alpha \ge 1)
\]
\[
U_n \le \alpha \quad (\alpha < 1)
\]
  - 成功搜索：
\[
S_n = \frac{1}{n}\sum_{i=1}^{n}\left(\frac{i-1}{b}+1\right) = 1 + \frac{n-1}{2b} \sim 1 + \frac{\alpha}{2}
\]

### 8. 应用：LZW 文本压缩
- 将一段数据转为更紧凑的表达。
- 基于原始数据创建字典，字典中存放字符串到编码的映射。
- 压缩时用字典中的编码代替原始数据中的相应字符串。
- 规则：
  - 开始，为文本中所有可能出现的字母分配一个代码，构成初始字典。
  - 压缩器不断在输入文件的未编码部分中寻找在字典中出现的最长前缀 `p`，输出 `p` 的代码；若输入文件中的下一个字符为 `c`，则为 `pc` 分配一个代码，并插入字典。
- 解压时需要重新构建字典。

---

## 第11章 二叉树和其他树

### 1. 树的定义与术语
- 树 `t` 是一个有限元素的集合：
  - 其中一个元素为根（root）。
  - 其余元素组成 `t` 的子树（subtrees）。
- 术语：
  - 根（root）
  - 孩子（children）
  - 叶子（leaves）
  - 父母（Parent）
  - 孙子（grandchildren）
  - 祖父（Grandparent）
  - 兄弟（Sibling）
  - 祖先（Ancestors）
  - 后代（Descendent）
  - 级/层次（level）：根的级为 1，孩子的级为父母的级 + 1。
  - 元素的度（Degree of an element）：孩子的个数。
  - 树的度：元素度的最大值。

### 2. 二叉树
- 二叉树 `t` 是有限个元素的集合：
  - 一个根元素；
  - 余下元素组成 2 个二叉树，为 `t` 的左子树和右子树。
- 树 vs 二叉树：
  - 任意子树 vs 不多于两个子树；
  - 子树无序 vs 子树有序。
- 表达式树是二叉树。

### 3. 二叉树特性
1. 包含 `n (n > 0)` 个元素的二叉树边数为 `n-1`。
2. 若二叉树高度为 `h` 且 `h ≥ 0`：
   - 最少有 `h` 个元素；
   - 最多有 `2^h - 1` 个元素。
3. 包含 `n (n ≥ 0)` 个元素的二叉树：
   - 高度最大为 `n`；
   - 高度最小为：
\[
\lceil \log_2(n+1) \rceil
\]
4. 满二叉树：高度为 `h` 的二叉树恰好有 `2^h - 1` 个元素。
5. 完全二叉树：
   - 从满二叉树中删除 `k` 个元素，其编号为 `2^h - i, 1 ≤ i ≤ k`，所得到的二叉树。
   - 前 `k-1` 层为满二叉树；
   - 第 `k` 层上的节点都连续排列于第 `k` 层的左端。
6. 完全二叉树编号特性：
   - 设元素序号为 `i, 1 ≤ i ≤ n`：
     - 若 `i = 1`，为根；若 `i > 1`，父节点编号为 `⌊i/2⌋`。
     - 若 `2i > n`，无左孩子；否则左孩子编号为 `2i`。
     - 若 `2i + 1 > n`，无右孩子；否则右孩子编号为 `2i + 1`。

### 4. 二叉树描述

#### 4.1 数组描述
- 按完全二叉树编号方法将元素存储在数组中。
- 适合完全二叉树。
- 有 `n` 个元素的二叉树需要存储空间：`n+1` 到 `2^n`（或 `n` 到 `2^n - 1`）。
- 右斜二叉树存储空间达到最大。
- 当缺少元素数目较少时，数组描述有效。

#### 4.2 链表描述
- 最常用的描述方法。
- 节点结构：
```cpp
template<class T>
struct binaryTreeNode {
    T element;
    binaryTreeNode<T> *leftChild;
    binaryTreeNode<T> *rightChild;

    binaryTreeNode() {
        leftChild = rightChild = nullptr;
    }
    binaryTreeNode(const T& theElement) {
        element = theElement;
        leftChild = rightChild = nullptr;
    }
    binaryTreeNode(const T& theElement,
                   binaryTreeNode *theLeftChild,
                   binaryTreeNode *theRightChild) {
        element = theElement;
        leftChild = theLeftChild;
        rightChild = theRightChild;
    }
};
```

### 5. 二叉树遍历
- 遍历中每个元素被访问且仅被访问一次。
- 方法：
  1. 前序遍历：根、左、右
  2. 中序遍历：左、根、右
  3. 后序遍历：左、右、根
  4. 层次遍历：按从顶层到底层，同层从左到右访问。

代码：
```cpp
template<class E>
void preOrder(binaryTreeNode<E> *t) {
    if (t != nullptr) {
        visit(t);
        preOrder(t->leftChild);
        preOrder(t->rightChild);
    }
}

template<class E>
void inOrder(binaryTreeNode<E> *t) {
    if (t != nullptr) {
        inOrder(t->leftChild);
        visit(t);
        inOrder(t->rightChild);
    }
}

template<class E>
void postOrder(binaryTreeNode<E> *t) {
    if (t != nullptr) {
        postOrder(t->leftChild);
        postOrder(t->rightChild);
        visit(t);
    }
}
```

层次遍历：
```cpp
template<class E>
void levelOrder(binaryTreeNode<E> *t) {
    arrayQueue<binaryTreeNode<E>*> q;
    while (t != NULL) {
        visit(t);
        if (t->leftChild) q.push(t->leftChild);
        if (t->rightChild) q.push(t->rightChild);
        try {
            t = q.front();
        } catch (queueEmpty) {
            return;
        }
        q.pop();
    }
}
```

复杂度：
- 空间复杂性均为 `O(n)`
- 时间复杂性均为 `Θ(n)`

### 6. 表达式树
- 中序遍历表达式树时，输出表达式具有歧义性。
- 使用括号避免歧义：
  - 每个操作符使用括号括起来；
  - 每个操作数和操作符使用括号括起来。
- 前序和后缀表达式中不会存在歧义。

完全括号化中缀表达式：
```cpp
template<class E>
void infix(binaryTreeNode<E> *t) {
    if (t != nullptr) {
        cout << '(';
        infix(t->leftChild);
        cout << t->element;
        infix(t->rightChild);
        cout << ')';
    }
}
```

### 7. 抽象类 linkedBinaryTree
```cpp
template<class E>
class linkedBinaryTree : public binaryTree<binaryTreeNode<E>> {
private:
    binaryTreeNode<E>* root;
    int treeSize;
    static void (*visit)(binaryTreeNode<E>*);
    static void preOrder(binaryTreeNode<E>* t);
    static void inOrder(binaryTreeNode<E>* t);
    static void postOrder(binaryTreeNode<E>* t);
    static void dispose(binaryTreeNode<E>* t) { delete t; }
public:
    linkedBinaryTree() { root = nullptr; treeSize = 0; }
    ~linkedBinaryTree() { erase(); }
    bool empty() const { return treeSize == 0; }
    void preOrder(void (*theVisit)(binaryTreeNode<E>*)) {
        visit = theVisit;
        preOrder(root);
    }
    void inOrder(void (*theVisit)(binaryTreeNode<E>*)) {
        visit = theVisit;
        inOrder(root);
    }
    void postOrder(void (*theVisit)(binaryTreeNode<E>*)) {
        visit = theVisit;
        postOrder(root);
    }
    void levelOrder(void (*)(binaryTreeNode<E>*));
    void erase() {
        postOrder(dispose);
        root = nullptr;
        treeSize = 0;
    }
};
```

### 8. 应用

#### 8.1 设置信号放大器
- 信号在网络中传输时可能衰减，仅能容忍一定范围内的衰减。
- 目标：使放大器数目最少，并保证信号衰减不超过容忍值。
- 定义：
  - `degradeFromParent(i)`：节点 `i` 与其父节点间的衰减量。
  - `degradeToLeaf(i)`：从节点 `i` 到以 `i` 为根的子树的任一叶子的衰减量最大值。
- 若 `i` 为叶节点，`degradeToLeaf(i) = 0`。
- 对其它节点：
\[
degradeToLeaf(i) = \max_{j \in children(i)} \{ degradeToLeaf(j) + degradeFromParent(j) \}
\]

伪代码：
```cpp
degradeToLeaf(i) = 0;
for (j in children(i)) {
    if (degradeToLeaf(j) + degradeFromParent(j) > 容忍值) {
        在 j 放置放大器;
        degradeToLeaf(i) = max(degradeToLeaf(i), degradeFromParent(j));
    } else {
        degradeToLeaf(i) = max(degradeToLeaf(i),
                              degradeToLeaf(j) + degradeFromParent(j));
    }
}
```

#### 8.2 树的二叉树描述
- 对树 `t` 的每个节点 `x`：
  - `x` 的 `leftChild` 指针指向 `x` 的第一个孩子；
  - `x` 的 `rightChild` 域指向 `x` 的下一个兄弟。
- 森林的二叉树表示：
  - 先得到森林中每棵树的二叉树描述；
  - 第 `i` 棵作为第 `i-1` 棵树的右子树。

二叉树转换为树：
1. 若某结点的左孩子存在，将左孩子的右孩子、右孩子的右孩子……都作为该结点的孩子，用线连接；
2. 删除原二叉树中所有结点与其右孩子的连线；
3. 整理结构。

二叉树转换为森林：
1. 从根节点开始，删除其与右孩子的连线，重复对右孩子做同样操作，得到分离的二叉树；
2. 把分离后的每棵二叉树转换为树；
3. 整理得到森林。

#### 8.3 并查集
- 集合的树形描述：每个集合描述为一棵树，用根元素作为集合标识符。
- `parent` 数组描述：每个非根节点指向其父节点。
- `find(i)`：返回 `i` 所在树的根元素。
- `unite(rootA, rootB)`：将根为 `rootA` 和 `rootB` 的两棵树合并。

基本实现：
```cpp
void initialize(int numberOfElements) {
    parent = new int[numberOfElements + 1];
    for (int e = 1; e <= numberOfElements; e++)
        parent[e] = 0;
}

int find(int theElement) {
    while (parent[theElement] != 0)
        theElement = parent[theElement];
    return theElement;
}

void unite(int rootA, int rootB) {
    parent[rootB] = rootA;
}
```

性能改进：
- 重量规则：若树 `i` 节点数少于树 `j` 节点数，则将 `j` 作为 `i` 的父节点；否则将 `i` 作为 `j` 的父节点。
- 高度规则：若树 `i` 的高度小于树 `j` 的高度，则将 `j` 作为 `i` 的父节点；否则将 `i` 作为 `j` 的父节点。
- 路径压缩：
  1. 紧凑路径法：改变从 `e` 到根节点路径上所有节点的 `parent` 指针，使其指向根节点。
  2. 路径分割法：改变从 `e` 到根节点路径上每个节点（除根和其子节点）的 `parent` 指针，使其指向各自的祖父节点。
  3. 路径对折法：改变从 `e` 到根节点路径上每隔一个节点（除根和其子节点）的 `parent` 域，使其指向各自的祖父节点。

---

## 核心对比与复习重点

| 结构 | 特性 | 插入 | 删除 | 搜索 |
|---|---|---|---|---|
| 栈 | LIFO | 栈顶 O(1) | 栈顶 O(1) | 仅栈顶 |
| 队列 | FIFO | 队尾 O(1) | 队首 O(1) | 仅队首/队尾 |
| 有序数组字典 | 关键字有序 | O(n) | O(n) | O(log n) |
| 有序链表字典 | 关键字有序 | O(n) | O(n) | O(n) |
| 散列表（线性探查） | 装填因子 α | 平均 O(1)，最坏 O(n) | 平均 O(1)，最坏 O(n) | 平均 O(1)，最坏 O(n) |
| 链式散列 | 桶内链表 | 平均 O(1)，最坏 O(n) | 平均 O(1)，最坏 O(n) | 平均 O(1)，最坏 O(n) |
| 二叉树遍历 | 前/中/后/层次 | — | — | 时间 Θ(n)，空间 O(n) |

重点掌握：
- 栈和队列的数组/链表实现及循环队列判空、判满、扩容。
- 栈的应用：括号匹配、汉诺塔、迷宫老鼠。
- 散列函数、冲突解决、线性探查、链式散列、性能公式。
- 二叉树性质、完全二叉树编号、四种遍历、表达式树。
- 树/森林与二叉树转换、并查集及优化。