# struct

## 定义并实例化 struct

struct：自定义的数据类型

- 使用 struct 关键字
- 在花括号内，为所有字段(Field)定义名称和类型

```rust
// 定义
struct User {
  username String,
  email: String,
  sign_in_count: u64,
  active: bool,
}

fn main() {
  // 实例化
  // 声明为 mut 则所有字段可变
  let mut user1 = User {
    email: String::from("abc@123.com"),
    username: String::from("hh"),
    active: true,
    sign_in_count: 550,
  }

  // user1 需要是 mut 的才可变
  user1.email = String::from("hhh@123.com");
}

// 字段初始化简写
fn build_user(email: String, username: String) -> User {
  User {
    email, // 和 JavaScript 一样
    username,
    active: true,
    sign_in_count: 1,
  }
}
```

struct 更新语法

- 基于某个 struct 实例来创建一个新的实例

```rust
// bad
let user2 = User {
  email: String::from("another@example.com"),
  username: String::from("another"),
  active: user.active,
  sign_in_count: user1.sign_in_count,
}

// good
let user2 = User {
  email: String::from("another@example.com"),
  username: String::from("another"),
  ..user1
}
```

## tuple struct

定义类似 tuple 的 struct，叫做 tuple struct

- 整体有个名，但里面元素没有名
- 适用：想给整个 tuple 启明，并不同于其他 tuple，又不想给每个元素起名

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
// black 和 origin 是不同的类型，即使他们的值是一样的
```

## unit-like struct

可以定义没有任何字段的 struct，叫做 Unit-Like struct(因为与`()`，单元类型类似)

- 适用于需要在某个类型上实现某个 trait，但是在里面又没有想要存储的数据

## struct 数据的所有权

```rust
struct User {
  username String, // 这里使用 String 而不是 &str，所以拥有所有权
  email: String,
  sign_in_count: u64, // 标量都有所有权
  active: bool,
}
// 只要 struct 实例是有效的，那么里面的字段也是有效的
// struct 里面也可以放引用，这里就需要使用生命周期
// - 生命周期可以保证 struct 的实例是有效的，那么里面的引用也是有效的
```

## 方法

方法和函数类似：fn 关键字、名称、参数、返回值

- 方法是在 struct(或 enum、trait 对象)的上下文中定义
  - 第一个参数的 self，表示方法被调用的 struct 实例
  - 需要在 impl 块里定义
    - 可以有多个 impl 块

```rust
struct Rectangle {
  width: u32,
  height: u32,
}

// 定义方法需要使用 impl
impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }
}

fn main() {
  let rect = Rectangle {
    width: 10,
    height: 10,
  }
  // 这里的 rect 是地址
  // 在 C/C++ 中需要解引用 object->something() 或 (*object).something()
  // 而 rust 会根据情况自动添加 &、&mut 或 *
  rect.area();
  // 等价于：(&rect).area();
}
```

## 关联函数

可以在 impl 块中定义不把 self 作为第一个参数的函数，这叫做关联函数

- e.g.: String::from()
- 通常用于创建构造器
- 或用于模块创建的命名空间

```rust

impl Rectangle {
  // 创建一个正方形
  fn square(size: u32) -> Rectangle {
    Rectangle {
      width: size,
      height: size,
    }
  }
}

fn main() {
  let square = Rectangle::square(10);
}
```
