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
