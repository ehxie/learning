# 所有权

所有权是 rust 最独特的特性，让 rust 无需 GC 就可以保证内存安全

## 什么是所有权？

Rust 的核心特性就是所有权

- 所有程序在运行时都必须管理它们使用计算机内存的方式
  - 有些语言有垃圾收集机制，在程序运行时会不断寻找不再使用的内存
  - 而在其他语言中，程序员必须显示地分配和释放内存

rust 采用了所有权来管理内存，其中包含一组编译器在编译时检查的规则

- 在程序运行时，所有权特性不会减慢程序的运行速度(内存管理工作都提前到了编译时)

## Stack vs Heap

在 rust 中，一个值是在 stack 还是 heap 上对语言的行为和你为什么要做某些决定室友更大的影响的

- stack 和 heap 都是程序中可用的内存，但是结构不相同

### stack

stack 会按值的接收顺序来存储，按相反的顺序来将它们移出（后进先出, LIFO)

- 添加数据叫压入栈
- 移出数据叫弹出栈

所有存储在 stack 上的数据必须拥有已知的固定的大小

- 编译时大小未知的数据或运行时大小可能发生变化的数据必须放在 heap 上

### heap

heap 内存组织性差一些

- 当把数据存入 heap 时，会请求一定数量的空间
  - 操作系统会在 heap 里找到一块足够大的空间，把它标记为在用，并返回一个指针，也就是这个空间的地址(这个过程叫做在 heap 上进行分配)
  - 因为指针大小是固定的，所以可以把指针放在 stack 上

### 对比

把数据压到 stack 上要比 heap 上分配快得多

- 操作系统不需要寻找寻找用来存储新数据的空间，那个位置永远在 stack 的顶端
- heap 上分配空间需要做更多的工作
  - 操作系统需要找到一个足够大的空间来存放数据，然后要做好记录方便下次分配

### 访问数据

- 访问 heap 中的数据要比 stack 中的数据慢，因为需要通过指针才能找到 heap 中的数据
  - 对于现代处理器来说，由于缓存的缘故，如果指令在内存中跳转的次数越少，那么速度越快
- 数据存放的距离比较近，那么处理器处理速度就会更快一些(stack 上)，比较远就比较慢(heap)

### 函数调用

当代码调用函数时，值被传入到函数(也包括指向 heap 的指针)

- 函数本地的变量压入 stack，函数结束时会从 stack 上弹出

### 所有权存在的原因

所有权解决的问题

- 跟踪代码的哪些部分正在使用 heap 的哪些数据
- 最小化 heap 上的重复数据量
- 清理 heap 上未使用的数据以避免空间不足

> 一旦懂得了所有权，就不再需要去想是 stack 还是 heap
>
> - 管理 heap 数据才是所有权存在的原理

## 所有权规则

1、每个值都有一个变量，这个变量是该值的所有者
2、每个值同时只能拥有一个所有者
3、当所有者超出作用域(scope)时，这个值将被删除

### scope

```rust
fn main() {
  // s 不可用
  let s = "hello"; // s 可用
  // s 可用
} // s 作用域到此结束，s 不可用
```

### String 类型

String 类型 bi 基础标量数据类型更加复杂(上面介绍的例子在 stack 上，而 String 在 heap 上)

创建字符串的两种方式

- 字符串字面值：程序里手写的哪些字符串值，他们是不可变的
- 使用 String 类型，在 heap 上分配，能够存储再编译时未知数量的文本
  - 使用 from 函数从字符串字面值创建出 String 类型

```rust
// 两个冒号表示 from 是 String 类型下的函数
let mut s = String::from("hello");
// 修改
s.push_str(" world!");
```

为什么字符串字面值不能修改，而 String 类型可以？

- 因为它们处理内存的方式不同

**内存和分配**

字符串字面值，在编译时就知道它的内容了，其文本内容直接被硬编码到最终的可执行文件里(速度快，高效是因为其不可变性)
String 类型，为了支持可变性，需要在 heap 上分配内存来保存编译时未知的文本内容

- 操作系统必须在运行时来请求内存
  - 通过调用 String::from 来实现
  - 当使用完 String 之后，需要使用某种方式将内存返回给操作系统
    - 拥有 GC 的语言，GC 会跟踪并清理不再使用的内存
    - 没有 GC 就需要手动识别内存何时不再使用，并调用代码将它返回
    - rust 采用了不同的方式，对于某个值来说，当拥有它的变量走出作用范围时，内存会立即自动的交还给操作系统
      - drop 函数

### 变量和数据交互的方式

#### 移动(move)

**简单类型**

多个变量可以与同一个数据使用一种独特的方式来交互

```rust
let x = 5;
let y = x;
```

- 整数是已知且固定大小的值，这两个 5 被压到了 stack 中

**String 类型**

String 由 3 部分组成(都放在 stack 上)

- 一个指向存放字符串内容的指针
- 一个长度(len)
- 一个容量(capacity，指 String 从操作系统总共获得内存的总字节数)

存放字符串内容的部分在 heap 上

```rust
let s1 = String::from("hello");
let s2 = s1;
```

![Alt text](/rust/03_ownership/assets/image.png)

- 并没有复制 heap 的数据，只是在 stack 上复制了一份指针、长度、容量
  - 当变量离开作用域时，rust 自动调用 drop 函数，将变量使用的 heap 内存释放
  - 当 s1、s2 离开作用域时，它们都会尝试释放相同的内存(两次释放 double free，这是严重的 bug)，所以 rust 为了保证内存安全会让 s1 失效（即离开作用域不需要释放任何东西）

```rust
fun main() {
  let s1 = String::from("hello");
  let s2 = s1;

  // 这时会报错: value borrowed here after move
  println!("value: {}", s1);
}
```

或许会将复制指针、长度、容量视为浅拷贝，但是由于 rust 让 s1 失效了，所以用新的术语：移动(move)

> 隐含的一个设计原则：rust 不会自动创建数据的深拷贝
>
> - 就运行时性能而言，任何自动赋值的操作都是廉价的

#### clone(克隆)

如果想对 heap 上的 String 进行深拷贝，那么就可以使用 clone 方法

```rust
fun main() {
  let s1 = String::from("hello");
  let s2 = s1.clone();

  println!("value: {}", s1);
}
```

#### 其他

stack 上的数据都是复制

- 如果一个类型实现了 copy 这个 trait，那么旧的变量在赋值后仍然可用
- 如果应该类型或者该类型的一部分实现了 Drop trait，那么 rust 不允许它再去实现 copy trait

拥有 copy trait 的类型: 整数、bool、char、浮点、tuple(如果所有字段都是可以 copy 的)

- 任何简单的标量的组合类型都可以是 copy 的
- 任何需要分配内存或者某种资源的都不是 copy 的

## 函数与所有权

- 入参和返回值都会可能发生所有权的转移

```rust
fn main() {
  let s = String::from("Hello World!");
  take_ownership(s);
  // s 失效了

  let x = 5;
  makes_copy(x);
  // x 仍然有效
}

fn take_ownership(some_string: String) {
  println!("{}", some_string);
}

fn makes_copy(some_number: i32) {
  println!("{}", some_number);
}
```

一个变量的所有权总是遵循同样的模式

- 把一个值赋给其他变量时就会发生移动
- 当一个包含 heap 数据的变量离开作用域时，它的值就会被 drop 函数清理，除非数据的所有权移动到另一个变量上

如何让函数使用某个值，但不获得其所有权？

```rust
// bad
fn main() {
  let s1 = String::from("hello");

  // 将 s1 的所有权返回回来了：s2
  // 但这样写就总是得多写一个
  let (s2, len) = calculate_length(s1);

  println!("the length of {} is {}", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
  (s, s.len())
}
```

- rust 中有一种特性，叫做引用(reference)

## 引用

### 引用和借用

引用：允许使用某些值而不取得所有权

- 把引用作为参数的行为叫做借用

```rust
fn main() {
  let s1 = "hello";
  let len = calculate_number(&s1);
  println!("the length of {} is {}", s1);
}

fn calculate_length(s: &String) -> usize {
  s.len()
}
```

![Alt text](/rust/03_ownership/assets/image1.png)

和变量一样。引用默认是不可变的

**可变引用**

- ~~可变引用的重要限制：在特定作用域内，对某一块数据，只能有一个可变引用(在编译时就能防止数据竞争)~~(2021 版没了这个限制，但引入了新概念：左值)
- 另一个限制：不可以同时拥有一个可变引用和不可变引用
  - 多个不可变引用是可以的

> 编译级别的读写锁

> 数据竞争发生的三个条件
>
> - 两个或多个指针同时访问同一个数据
> - 至少有一个指针用于写入数据
> - 没有任何机制来同步对数据的访问

```rust
fn main() {
  let mut s1 = "hello";
  let len = calculate_number(&mut s1);
  println!("the length of {} is {}", s1);
}

fn calculate_length(s: $mut String) -> usize {
  s.push_str(" world");
  s.len()
}
```

### 悬空引用 Dangling Reference

悬空指针(Dangling Pointer): 一个指针引用了内存中的某个地址，而这块地址可能已经释放并分配给其他人使用了

rust 编译器可保证引用永远都不会进入悬空状态

- 如果你引用了某些数据，编译器将保证在引用离开作用域之前数据不会离开作用域

```rust
fn main() {
  let r= dangle();
}

// 下面这行代码编译时就报错了: expected named lifetime parameter
fn dangle() -> &String {
  let s = String::from("hello");
  &s
}
```

### 引用规则

在任何给定的时刻，只能满足下列条件之一

- 一个可变的引用
- 任意数量不可变的引用

引用必须一直有效

## 切片

rust 中另一种不持有所有权的数据类型：切片(slice)

- 字符串切片：指向字符串中一部分内容

e.g.：写一个函数

- 接收字符串作为参数
- 返回它在这个字符串里找到的第一个单词
- 如果没有找到任何空格，那么整个字符串就被返回

```rust
fn main() {
  let mut s1 = "hello";
  let index = first_world(s1);

  s1.clear();

  // 此时 index 毫无意义了，因为 s1 已经清空了
}

fn first_world(s: &String) -> usize {
  let bytes = s.as_bytes();

  for (i, &item) in bytes.iter().enumerate() {
    if item == b' ' {
      return i;
    }
  }

  s.len()
}
```

### 字符串切片

```rust
let s = "hello world";

let hello = &s[0..5]; // hello
let hello1 = &s[..5]; // hello

let world = &s[6..11]; // world
let world1 = &s[6..]; // world

let whole = &s[0..s.len()]; // hello world
let whole1 = &s[..]; // hello world
```

使用字符串切片重写上面的例子

```rust
fn main() {
  let mut s1 = "hello";
  let index = first_world(s1);

  // 此时无法调用该函数，因为 s 已经 borrow 为不可变的了
  // s1.clear();
}

fn first_world(s: &String) -> &str {
  let bytes = s.as_bytes();

  for (i, &item) in bytes.iter().enumerate() {
    if item == b' ' {
      return &s[..i];
    }
  }

  &s[..]
}
```

字符串字面值是切片

- 直接被存储在二进制程序中

将字符串切片作为参数传递

- 有经验的 rust 开发者会采用 &str 作为参数类型，因为这样就能同时接收 String 和 &str 类型的参数了
  - 使用字符串切片，直接调用该函数
  - 使用 String，可以创建一个完整的 String 切片来调用该函数
- 定义函数时使用字符串切片来代替字符串引用会使我们的 API 更加通用，而不会损失任何功能

### 其他类型的切片

```rust
fn main() {
  let a = [1, 2, 3, 4, 5];

  let slice: &[i32] = &a[1..3]; // [2, 3]
}
```
