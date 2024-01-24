# 泛型、trait、生命周期

## 泛型

泛型是具体属性或其他属性的抽象的代替

- 提高代码复用能力

声明

```rust
fn hello<T>(arg: &T) {
  println!("{}", arg);
}

struct Point<T> {
  x: T,
  y: T,
}

impl<K> Point<K> {
  fn my_fn(&self) {
    // ...
  }
}


enum Addr<T> {
  ip: T,
}

```

### 性能

使用泛型的代码和使用具体类型的代码运行速度是一样的

单态化(monomorphization)

- 在编译时将泛型替换为具体类型的过程

## trait

trait 告诉 rust 编译器

- 某种类型具有哪些并且可以与其他类型共享的功能

trait：抽象的定义共享行为

trait bounds(约束)：泛型类型参数指定为实现了特定行为的类型

> trait 与其他语言的 interface 类似但又有区别

### 定义一个 trait

trait 把方法签名放在一起，来定义实现某种目的所必须的一组行为

- 关键字：trait
- 只有方法签名，没有实现
- 可以有多个方法，每个方法签名占一行，以`;`结尾
- 实现 trait 的类型必须提供具体的方法实现

```rust
pub trait Summary {
  fn summarize(&self) -> String;

  fn summarize1(&self) -> String {
    // 可以有默认实现

    // 甚至可以调用没有实现的方法
    self.summarize();
  };
}
```

### 在类型上实现 trait

语法：impl xxx for my_struct

```rust
pub trait Summary {
  fn summarize(&self) -> String;
}

struct Tweet {
  pub username: String,
}

impl Summary for Tweet {
  fn summarize(&self) -> String {
    // ...
  }
}
```

### 实现 trait 的约束

可以在某个类型上实现某个 trait 的前提条件

- 这个类型或这个 trait 是在本地 crate 里定义的
- 无法为外部类型来实现外部的 trait
  - 例如无法为 Vector 实现上面的 Summary
  - 这个限制是程序属性的一部分(也就是一致性)
  - 更具体来说是孤儿原则：父类型不存在
  - 能够保证其他人写的代码不能破坏你写的代码

### trait 作为参数

1、impl trait 语法：适用简单情况

```rust
pub trait Summary {
  fn summarize(&self) -> String;
}

struct Tweet {
  pub username: String,
}

impl Summary for Tweet {
  fn summarize(&self) -> String {
    // ...
  }
}

struct News {
  pub title: String,
}

impl Summary for News {
  fn summarize(&self) -> String {
    // ...
  }
}

// 这样就能传 Tweet 或者 News 了
fn notify(item: impl Summary) {

}

fn notify1(item: impl Summary + Display) {

}
```

2、trait bound 语法

```rust
fn notify<T: Summary + Display>(item1: T, item2: T) {

}
```

使用 where 子句简化

```rust
pub fn notify<T: Summary + Display, U: Clone + Debug>(a: T, b: U) -> String {
  //...
}

pub fn notify1<T, U>(a: T, b: U) -> String
  where
    T: Summary + Display,
    U: Clone + Debug,
{
  //...
}
```

### 使用 trait bound 有条件的实现方法

在使用泛型类型参数的 impl 块上使用 trait bound，可以有条件的为实现了特定 trait 的类型来实现方法

```rust
struct Pair<T> {
  x: T,
  y: T,
}

impl<T> Pair<T> {
  // 无论 T 是什么类型都会有这个方法
  fn new(x: T, y: T) -> Self {
    Self {x, y}
  }
}

// 只有当 T 是实现了 Display 和 PartialOrd 的才会有这个方法
impl<T: Display + PartialOrd> Pair<T> {
  fn cmp_display(&self) {
    // ...
  }

}
```

也可以为实现了其他 trait 的人一类型有条件的实现某个 trait

- 为满足 trait bound 的所有类型上实现 trait 叫做覆盖实现(blanket implementations)

从标准库代码中看到为什么 3 可以使用 to_string 转化为 String

```rust
trait ToString {
  fn to_string() -> String;
}
// 对于所有满足 Display 的 trait 约束的类型都实现 ToString 这个 trait
// 覆盖实现
impl<T: fmt::Display> ToString for T {
  default fn to_string(&self) -> {
    // ...
  }
}

fn main() {
  // 由于 3 实现了 Display，所以这里就有了
  3.to_string();
}
```

## 生命周期

rust 中每个引用都有自己的生命周期

- 生命周期：引用保持有效的作用域
- 大多数情况下生命周期都是隐式的、可被推断的
  - 当引用的生命周期可能以不同的方式互相关联时：手动标注生命周期

生命周期的主要目的：避免悬垂引用(dangling reference)

```rust
fn main() {
  {
    let r;
    {
      let x = 5;
      r = &x; // 这里有问题
    }
    // 这里在使用时 x 已经离开作用域了(r 指向 x 的引用)
    println!("r: {}", r)
  }
}
```

rust 怎么发现上面代码的问题的？使用了借用检查器

借用检查器

- 比较作用域来判断所有的借用是否合法

### 生命周期标注语法

- 生命周期的标注不会改变引用的生命周期长度
- 当指定了泛型生命周期参数，函数可以接收带有任何生命周期的引用
- 生命周期的标注：描述了多个引用的生命周期间的关系，但不影响生命周期

语法：

- 以`'`(单引号)开
- 通常使用全小写字母且非常短
  - 很多人用 'a
- 标注的位置：在引用的 `&` 符号后，之后用空格将标注和引用类型分开

```rust
&i32  // 这是有个引用
&'a i32 // 带有显示生命周期的引用
&'a mut i32 // 带有显示生命周期的可变引用
```

```rust
fn main() {
  let string1 = String::from("abcd");
  let result;
  {
    let string2 = String::from("efg");
    // 代码报错，string2 作用域不够
    result = longest(string1.as_str(), string2.as_str());
  } // string2 的生命周期到这里结束了
  println!("result: {}", result);
} // result 的生命周期到这里结束，所以 string2 的生命周期不够长

// 'a 得到的生命周期就是 x 和 y 中比较短的那个(最快结束的)
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
  if x.len() > y.len() {
    x
  } else {
    y
  }
}
```

### 生命周期省略

输入生命周期参数：泛型和参数上的生命周期
输出生命周期参数：返回值的生命周期

早期的 rust 的引用都是需要标注生命周期的，但是后来 rust 团队发现在某些情况下可以省略

编译器使用 3 个规则在没有显式标注生命周期的情况下，来确定引用的生命周期

- 规则 1 应用于输入生命周期
- 规则 2、3 应用于输出生命周期
- 如果编译器应用完 3 个规则后，仍然有无法确定生命周期的应用 -> 报错
- 这些规则适用于 fn 定义和 impl 块

规则 1：每个引用类型的参数都有自己的生命周期
规则 2：如果只有 1 个输入生命周期参数，那么该生命周期被赋给所有的输出生命周期参数
规则 3：如果有多个输入生命周期参数，但其中一个是 &self 或 &mut self，那么 self 就的生命周期会赋给所有的输出生命周期参数

e.g.假设我们是编译器

case1: fn first_world(s: &str) -> &str {}

- 应用规则 1：fn first_world<'a>(s: &'a str) -> &str {}
- 应用规则 2：fn first_world<'a>(s: &'a str) -> &'a str {}

case2: fn longest(x: &str, y: &str) -> &str {}

- 应用规则 1：fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str {}
- 规则 2、3 不适用，此时还不知道返回值的生命周期，所以报错了

### 静态生命周期

`'static` 是一个特殊的生命周期：整个程序的持续时间

- 例如：所有的字符串字面值都拥有 `'static` 生命周期
  - let s: &'static str = "i have a static lifetime"

使用需要谨慎：是否引用在程序的整个生命周期中都存活
