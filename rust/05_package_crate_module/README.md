# 代码组织

rust 代码组织(模块系统)

- package: cargo 的特性，可以构建、测试、共享 crate
- crate：一个 module 树，可以产生一个 library 或可执行文件
- module: 让你控制代码的组织、作用域和私有路径
- path: 为 struct、function 或 module 等项目命名的路径

## package 和 crate

crate 类型

- binary
- library

crate root

- 源代码文件
- rust 编译器从这里，组成你的 Crate 的根 module

package

- 包含一个`cargo.toml`(描述了如何构建这些 crate)
- 只能包含 0-1 个 library crate
- 可以包含任意数量 binary crate
- 至少包含一个 crate

cargo 的惯例(约定配置)

1、

- `src/main.rs` 是 binary crate 的 crate root
- crate 名与 package 名相同

2、如果有 `src/lib.rs`

- package 包含一个 library crate
- library crate 的 crate root
- crate 名与 package 名相同

cargo 会把 crate root 文件交给 rustc 来构建 library 或 binary

3、`src/bin` 中的每个文件都是单独的 binary crate

crate 作用

- 将相关功能组合到一个作用域内，便于在项目间进行共享
  - 防止命名冲突

### module

定义 module 来控制作用域和私有性

module

- 在一个 crate 内，将代码进行分组
- 增加可读性，易于复用
- 控制项目的私有性

建立 module

- mod 关键字
- 可嵌套
- 可包含其他项(struct、enum、常量、trait、函数等)定义

```rust
mod front_of_house {
  // ...
}
```

## 路径（path）

为了在 rust 的模块中找到某个条目，需要使用路径

路径的两种形式

- 绝对路径：从 crate root 开始，使用 crate 名或者字面值 crate
- 相对路径：从当前模块开始，使用 self、super 或者当前模块的标识符

> 路径至少由一个标识符组成，标识符之间使用 `::`

`super`

```rust
fn serve_order() {}

mod back_of_house {
  fn fix_incorrect_order() {
    cook_order();
    // 相对路径
    super::serve_order();

    // 绝对路径
    crate::serve_order();
  }

  fn cook_order() {
  }
}
```

### 私有边界(privacy boundary)

模块不仅可以组织代码，还可以定义私有边界

rust 中所有的条目(函数，方法，struct，enum，模块，常量)默认是私有的

- 不额外声明默认字段都是私有的(pub enum 除外)

父模块无法访问子模块中的私有条目

子模块里可以使用所有祖先模块中的条目

> 私有的好处
>
> - 知道修改哪些内部细节不会对外部的使用产生影响

```rust
// 设为公共
// 都是文件的根级就可以直接调用
mod my_module {
  pub mod mod1 {
    pub fn hello() {
      println!("hello module");
    }
  }
}

fn main() {
  create::my_module::mod1::hello();
}
```

## use

使用 `use` 关键字将路径导入到作用域内

- 仍遵循私有性原则

```rust
mod front_of_house {
  pub mod hosting {
    pub fn add_to_waitlist() {}
  }
}

// 绝对路径
use crate::front_of_house::hosting;
// 也可以使用相对路径

pub fn eat_at_restaurant() {
  hosting::add_to_waitlist();
}
```

惯用作法

- 函数一般是引入父模块，这样我们就知道函数不是本文件定义的
- 其他的都是是直接引入它本身（除非有同名）
  - 同名可以用 as 关键字重命名

重新导出：怎么让外部代码访问内部 use 的模块

```rust
mod front_of_house {
  pub mod hosting {
    pub fn add_to_waitlist() {}
  }
}

// 使用 pub 关键字，相当于 js 中的 export
pub use crate::front_of_house::hosting;
```

使用嵌套路径清理大量的 use 语句

```rust
// use std::cmp::Ordering;
// use std::io;
// 等同于
use std::{cmp::Ordering, io};

// use std::io;
// use std::io::Write;
// 等同于
use std::io::{self, Write};

```

使用通配符将所有的条目引入

- 谨慎使用
- 一般使用场景
  - 测试：将所有测试代码引入 tests 模块中
  - 有时被用于预导入(prelude)模块

```rust
use std:collection::*;
```

## 如何将模块拆分成不同的文件

上面在定义模块时，模块名后面都是 `{}`，如果换成 `;`则会去找同名文件

**拆分前**

`lib.rs`

```rust
mod front_of_house {
  pub mod hosting {
    pub fn add_to_waitlist() {}
  }
}
```

**拆分后**

`src/lib.rs`

```rust
mod front_of_house;
```

`src/front_of_house.rs`

```rust
pub mod hosting;
```

`src/front_of_house/hosting.rs`

- 目录的层级结构要和模块的层级结构一致

```rust
pub fn add_to_waitlist() {}
```
