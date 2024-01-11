# error handling

rust 错误处理概述

- rust 的可靠性：错误处理
  - 大部分问题能在编译时给到提示并处理
- 错误分类
  - 可恢复
    - e.g.: 文件未找到，可再次尝试
  - 不可恢复
    - bug: 例如索引超出范围

rust 中没有类似异常的机制(try catch)

- 可恢复错误：Result\<T, E\>
- 不可恢复错误：panic! 宏

## panic! 与不可恢复的错误

当 `panic!` 宏执行(默认)

- 程序会打印一个错误信息
- 展开(unwind)、清理调用栈(stack)
- 退出程序

为了应对 panic，展开或中止(abort)调用栈

默认情况下，当 panic 产生：

- 程序展开调用栈(工作量大)
  - rust 沿着调用栈往回走
  - 清理每个遇到的函数中的数据
- 或垃圾中止调用栈
  - 不进行清理，直接停止程序
  - 内存需要 OS 清理

想让二进制文件更小，把设置从“展开”改为“中止”

- 修改 `Cargo.toml`

```
# ...
[profile.release]
panic = 'abort'
```

使用 panic! 产生的回溯信息

- 设置环境变量 RUST_BACKTRACE 可得到回溯信息
- 为了获取带有调试信息的回溯，必须启用调试符号(不带 --release)

```rust
// case1
fn main() {
  // 执行 cargo run 会打印一些报错信息
  panic!("panic in main");
}

// case2
fn main() {
  let v = vec![1, 2, 3];

  // 这里也会 panic
  // 如果只执行 cargo run 则 panic 代码指向的是这里
  // 可执行 `set RUST_BACKTRACE=1 && cargo run` 会打印到源代码 panic 的地方
  v[99];
}
```

## Result 与可恢复错误

### Result 枚举的定义

```rust
enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

### 处理 Result 的一种方式

- 和 Option 枚举一样，Result 及其变体也是由 prelude 带入作用域

```rust
use std::fs::File;

fn main() {
  let f = File::open("hello.txt");

  let f = match f {
    Ok(file) => file,
    Err(error) => {
      panic!("Error opening file {:?}", error)
    }
  }

  // 上面的所有代码等价于，成功会返回文件，错误就执行 panic!
  // 缺点是无法定义错误信息
  let f = File::open("hello.txt").unwrap();

  // 使用 expect 就可以自定义错误信息了
  let f = File::open("hello.txt").expect("无法打开文件");

}
```

### 匹配不同的错误

- error.kind() 返回

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
  let f = File::open("hello.txt");

  let f = match f {
    Ok(file) => file,
    Err(error) => match error.kind() {
      ErrorKind::NotFound => match File::create("hello.txt") {
        Ok(fc) => fc,
        Err(e) => panic!("Error create: {:?}", e),
      },
      oe => panic!("Error open: {:?}", oe),
    };
  }
}
```

上面的例子会套很多 match，可以使用闭包来改善一下(以后会学到)

### 传播错误

除了上面自己处理错误外，还可以将错误返回给调用者

```rust
use std::fs::File;
use std::io;
use std::is::Read;

fn read_username_from_file() -> Result<String, io::Error> {
  let f = File::open("hello.txt");

  let mut f = match f {
    Ok(file) => file,
    Err(e) => return Err(e),
  }

  let mut s = String::Err(e),
  match f.read_to_string(&mut s) {
    Ok(_) => Ok(s),
    Err(e) => Err(e),
  }
}
```

rust 中使用 `?` 来简化传播错误(只能用于返回类型为 Result 的函数)

- 如果 Result 是 Ok: Ok 中的值就是表达式的结果, 然后继续执行程序
- 如果 Result 是 Err: Err 就是整个函数的返回值，就像使用了 return

下面的代码和上面等价

```rust
use std::fs::File;
use std::io;
use std::is::Read;

fn read_username_from_file() -> Result<String, io::Error> {
  let mut f = File::open("hello.txt")?;

  let mut s = String::Err(e),
  f.read_to_string(&mut s)?;
  Ok(s)
}

// 甚至可以用链式调用优化
fn read_username_from_file() -> Result<String, io::Error> {
  let mut s = String::Err(e),
  File::open("hello.txt")?.f.read_to_string(&mut s)?;
  Ok(s)
}
```

? 与 from 函数

- trait std::convert::From 上的 from 函数
  - 用于错误之间的转换
- 被 ? 所应用的错误，会隐式的被 from 函数处理
- 当 ? 调用 from 函数时
  - 它所接收的错误类型会被转化为当前函数返回类型所定义的错误类型

> 当我们想从 EA -> EB，只有当 EA 中实现了 from 且返回值是 EB 才可以

## 何时使用 panic!

总体原则

- 在定义一个可能失败的函数时，优先考虑返回 Result
- 否则就 panic!

可以使用 panic!

- 演示某些概念: unwrap
- 原型代码: unwrap、expect
- 测试：unwrap、expect

错误处理的指导性建议

- 当代码最终可能处于损坏状态时，最好使用 panic!
- 损坏状态(Bas State): 某些假设、保证、约定或不可变性被打破
  - 非法的值、矛盾的值或空缺的值被传入了代码
  - 以下中任意的一条
    - 这种损坏状态并不是预期能够偶尔发生的事情
    - 在此之后，代码如果处于这种损坏状态就无法运行
    - 在你使用的类型中没有一个好的方法来将这些信息(处于损坏状态)进行编码

场景建议

- 调用你的代码，传入无意义的参数值：panic!
- 调用外部不可控代码，返回非法状态，你无法恢复：panic!
- 如果失败是可预期的：Result
- 当你的代码对值进行操作，首先应该验证这些值：panic!
