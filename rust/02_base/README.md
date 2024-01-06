# Base

rust 基础概念

## 变量与可变性

- 声明变量使用 let 关键字
  - 默认情况下，变量是不可变的(Immutable)
  - 使用 `mut` 使变量可变
- 常量使用 const 声明，绑定值后是不可变的
  - 不可以使用 mut
  - 值可以绑定到常量表达式，无法绑定到函数的调用结果或只能在运行时才能计算出的值
  - 在程序运行期间，常量在其声明的作用域内一直有效
  - 命名规范：全大写字母，单词用下划线隔开

```rust
let x = 10;
// x = 20; 不可以给不可变变量赋值

let mut y = 10;
y = 20;

const MAX_POINTS: u32 = 100_000;

```

## Shadowing(隐藏)

- 可以使用相同的名字声明新的变量，新的变量就会 shadow(隐藏)之前声明的变量

```rust
let x = 5;

// x = x + 1; 不可以这样写

// 将之前声明的变量 shadow 了
let x = x + 1;
```

- 上面看起来和 mut 效果差不多，但是实际上是不一样的，使用 let 声明新变量是可以修改类型的

```rust
let x = 5;
// 修改类型
let x = '123';
```

## 数据类型

rust 是静态编译语言，在编译时必须知道所有变量类型

- 基于使用的值，编译器通常能够推断出来，但是如果类型比较多，例如把 String 转为整数的 parse 方法，就必须类型标注，否则编译会报错

### 标量

```rust
// rust 中有很多数据类型可以包含 42，所以需要手动指定
let guess: u32 = "42".parse();
```

rust 有四个主要的标量类型

- 整数类型
  - 无符号(>=0)以`u`开头(0 ~ 2^n-1)
  - 有符号以`i`开头(-2^(n-1) ~ 2^(n-1)-1)
  - 按长度可以分为 8, 16, 32, 64, 128
    - u8, u16, ...
    - isize, usize：由程序运行的计算机架构所决定，如果是 64 位计算机，那就是 64 位
  - 字面值
    - 十进制：可以使用下划线增强可读写(e.g.: 100_000)
    - 十六进制：`0x`开头(e.g.: 0xff)
    - 八进制：以`0o`开头(e.g.: 0o77)
    - 二进制：以`0b`开头(e.g.: 0b1111_0000)
    - Byte(u8 only): `b`开头，跟着一个字符(e.g.: b'A')
  - 除了 byte 之外，所有的数字字面值都允许使用类型后缀
    - e.g.: 57u8
  - 默认类型 i32
- 浮点类型
  - f32、f64(默认类型)
- 布尔类型
  - 占用一个字节大小
- 字符类型
  - 使用单引号
  - 占用 4 字节大小
  - 使用 Unicode 标量值

### 复合类型

可以将多个值放在一个类型里

- rust 提供了两种基础的复合类型：元组(Tuple)、数组

**Tuple**

- 可以将多个类型的多个值放在一个类型里
- 长度是固定的，一旦声明就无法改变

```rust
let tup: (i32, f64, u8) = (500, 6.3, 1);

println!("{}, {}, {}", tup.0, tup.1, tup.2);
```

- 可以使用模式匹配来结构(destructure) 一个 tuple 来获取元素的值
  - 或者使用点标记法(如上面例子)

```rust
let tup: (i32, f64, u8) = (500, 6.3, 1);

let (x, y, z) = tup;

println!("{}, {}, {}", x, y, z);

```

**数组**

- 可以将多个值放在同一个类型里面，但是每个元素的类型必须相同
- 长度是固定的

```rust
let arr = [1, 2, 3, 4, 5];
```

- 作用：如果想让数据放在 stack(栈)上而不是 heap(堆)上，或者想保证固定数量的元素

数组没有 Vector 灵活

- Vector 由标准库提供
- Vector 长度可变

类型定义：`[类型: 长度]`

```rust
let a: [i32: 5] = [1, 2, 3, 4, 5];

// 如果每个元素值都是相等的
let a = [3; 5]; // 相当于 let a = [3, 3, 3, 3, 3];

// 访问数组
let first = a[0];
// 数组下标越界编译不会报错，而是在运行时报错

```

## 函数

使用 `fn` 关键字进行声明

- 命名使用 snake case 规范

```rust
fn main() {
  println!("hello world");
  // 跟函数声明位置没关系，只要能够得着就行了，无需写在上面
  another_function();
}

fn another_function() {
  println!("Another function");
}
```

**函数的参数**

- parameters: 定义函数时的参数(形参)
- arguments: 调用函数时传进去的参数(实参)
- 函数签名里，必须声明每个参数的类型

```rust
fn my_fun(x: i32) {
  println!("the value of x: {}", x);
}
```

**函数体**

- 函数体由一系列语句组成，可选的由一个表达式结束
- rust 是基于表达式的语言
- 语句是执行一些动作的指令（let x = 1;)
- 表达式会计算产生一些值(5 + 6 或者 6 本身也是一个表达式)
- 函数的定义也是语句

```rust
let number = {
  println!("hello");
  5 // 块中最后一个表达式就是块的值
}

```

**返回值**

- 在 `->` 符号后边声明函数返回值类型，但是不可以为返回值命名
- rust 中返回值就是函数体里最后一个表达式的值(和 kotlin 一样)
  - 如果想提前返回，可以使用 return 关键字

```rust
fn five() -> i32 {
  5  // 注意，这里没有分号，加了分号就是语句了
}
```

## 注释

```rust
// 单行注释

/*
  多行注释
  多行注释
 */
```

## 控制流

### if 表达式

- 条件必须是 bool 类型
  - 与条件相关联的代码块叫做分支(arm)

```rust
fn main() {
  let number = 3;

  if number < 5 {
    println!("condition is true");
  } else {
    println!("condition is false");
  }
}
```

> 如果代码使用了多于一个 else if，最好使用 match 来重构代码

由于 if 是表达式，所以可以放在 let 语句中等号的右边

```rust
let condition = true;

let number = if condition { 5 } else { 6 };
```

### 循环

rust 中有三种实现循环的方式

- `loop`：告诉 rust 反复执行这一块代码，直到你喊停(break 关键字)
- `while`: 每次执行前都会判断一下条件
- `for`: 用于遍历集合（效率更高不容易出错）

```rust
fn main() {
  let a = [10, 20, 30, 40];
  // 索引不会超出范围
  for element in a.iter() { // element 拿到的是指针
    println!("the value is: {}", element);
  }

  let mut index = 0;
  // 索引会超出范围
  // 每次都需要进行一次判断
  while index < 6 {
    println!("the value is: {}", a[index]);
    index = index + 1;
  }
}

```

rust 中使用 for 会更安全更快速一些

- 可以结合 range 来实现指定次数遍历
  - (0..3): 即 0, 1, 2,
  - (0..3).rev(): 即 2, 1, 0

```rust
// 实现 3 2 1 倒数
fn main() {
  // bad: 使用 while
  let mut number = 3;
  while number > 0 {
    println!("{}!", number);
    number = number -1;
  }

  // good: 使用 range + for
  for number in (1..4).rev() {
    println!("{}!", number);
  }
  println!("LIFTOFF");
}
```
