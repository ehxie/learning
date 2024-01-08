# enum & match

## enum

枚举：允许我们列举所有的值来定义一个类型

创建和使用

```rust
enum IpAddrKind {
  V4,
  V6,
}

fn main() {
  let four = IpAddrKind::V4;
  let six = IpAddrKind::V6;
}
```

### 变体

将数据附加到枚举的变体中

e.g.：为了表示 ip 地址类型和 IP 地址，我们需要用到 struct

```rust
// bad
enum IpAddrKind {
  V4,
  V6,
}

struct IpAddr {
  kind: IpAddrKind,
  address: string,
}

fn main() {
  let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
  };

  let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
  };
}
```

```rust
//good
enum IpAddr {
  V4(u8, u8, u8, u8),
  V6(String),
}

fn main() {
  let home = IpAddr::V4(127, 0, 0, 1);

  let loopback = IpAddr::V6("::1");
}
```

使用 enum 变体的好处

- 不需要额外的 struct
- 每个变体都可以拥有不同的类型(也可以是 struct，甚至 enum)以及相关的数据量

### 枚举定义方法

和 struct 一样，可以定义 impl 块

```rust
enum Message {
  Quit,
  Move,
}

impl Message {
  fn call(&self) {
    // ...
  }
}
```

### option 枚举

定义于标准库中

- 在 Prelude(预导入模块)中
- 描述了：某个值(某种类型)可能存在或不存在的情况

> rust 中没有 null
> null reference 的作者：billion dollar mistake
>
> - 问题：当尝试使用非 null 值和 null 值的时候就会引起错误（例如拼接字符串）
> - 当这个概念还是有用的：因某种原因变为无效或者缺失的值
>   - rust 中类似于 null 的概念 Option<T>

标准库中定义

```rust
enum Option<T> {
  Some<T>,
  None,
}
```

这种设计的好处在于 Option<T> 和 T 不是同一种类型

```rust
fn main() {
  let x: i8 = 5;
  let y: Option<i8> = Some(5);

  // 不能直接相加
  // let res = x + y;

  // 可以使用模式匹配来处理
}
```

## match

允许一个值与一系列模式进行匹配，并执行匹配的模式对应的代码

- 模式可以是字面值、变量名、或者通配符...
- match 匹配时必须穷举所有的可能

上面相加的例子就可以用 match 解决

```rust
fn main() {
  let x: i8 = 5;
  let y: Option<i8> = Some(5);

  // 可以使用模式匹配来处理
  let res = match y {
    // 绑定值模式：由于 Some 可以存值，所以这里匹配的分支可以绑定到匹配对象的部分值
    Some(value) => value + x,
    Node => {
      // 多行代码需要花括号
      // 错误处理
    },
  };
}
```

如果不想处理所有的情况

- 使用 `_` 通配符，代替其余没列出的值

```rust
fn main() {
  let v = 0u8;

  match v {
    1 => println!("one"),
    2 => println!("two"),
    3 => println!("three"),
    4 => println!("four"),
    // 放在最后
    _ => (),
  };
}
```

## if let

处理只关心一种匹配而忽略其他匹配的情况

```rust
fn main() {
  let v = Some(0u8);

  // 只需要处理 Some(3u8) 的情况
  // bad: 写 match 显然还得写个通配符
  match v {
    Some(3u8) => {
      // ...
    },
    _ => (),
  };

  // good: 可以看成是 match 的语法糖
  if let Some(3) = v {
    // ...
  } else {
    // 可以有 else 语句
  };
}
```
