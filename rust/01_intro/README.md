# intro

> rust 是 Mozilla 公司的产品

为什么要用 rust？

- 可以用来替换 C/C++，拥有相同的性能，但是很多 BUG 在编译时就能被消灭了
- 内存安全的
- 更好的利用多处理器
- 易于维护、调试、代码安全高效

擅长领域

- 高性能 Web Service
- WebAssemble
- 命令行工具
- 网络编程
- 嵌入式设备
- 系统编程

## 安装

自行按照官网提示安装：https://www.rust-lang.org/tools/install

> windows 在安装时会自动安装 Visual Studio 2013 或以上的环境（需要 C/C++ 支持）以使用 MSVC 或安装 MinGW + GCC 编译环境
> macOS，需要安装 Xcode

验证是否安装成功

```bash
rustc --version
```

## 开发工具

使用 VSCode 并安装 Rust 插件

- 直接搜索 rust 就可以搜到插件了(ExtensionId: 1YiB.rust-bundle)

## Hello World Demo

1、新建一个 `hello_world.rs` 文件

```rust
// 每个 rust 可执行程序最先执行的都是 main()
fn main() {
  println!("Hello World");
}
```

2、编译

- 默认生成同名的可执行文件
- windows 上还会生成 `.pdb` 文件，里面包含调试信息

```bash
rustc hello_world.rs
```

> rustc 只适合简单的 rust 程序（复杂的用 cargo）

3、运行

```bash
# windows
.\hello_world.exe

# Mac/Linux

./hello_world

```

## Cargo

Cargo 是 Rust 的构建系统和包管理工具

- 安装 Rust 时默认会装上

```bash
# 验证是否安装成功
cargo --version
```

### 创建项目

```bash
# cargo new <项目名>
cargo new hello_cargo

```

```txt
|- Cargo.toml  // 这是 Cargo 的配置文件(toml 即 Tom's Obvious, Minimal Language)
|- src
|-- main.ts
```

`Cargo.toml`

- [package] 到下一个行首中括号开始的地方技术属于 package 的区域

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
authors = []
edition = "2023"  // rust 版本

[dependencies]
```

> rust 中代码的包都称为 crate

### 本地构建项目

```bash
cargo build
```

- 会在项目根目录下生成 cargo.lock 文件
  - 负责追踪项目依赖的精确版本(类似于 package-lock.json)
  - 不要手动修改这个文件
- 生成的可执行文件 `target/debug/hello_cargo`
  - 需要手动运行

### 构建并运行

```bash
cargo run
```

- 如果之前编译成功过且代码没有修改则会跳过编译直接执行

### 代码检查

```bash
cargo check
```

- 检查代码，确保编译能通过，但不产生可执行文件
  - 速度比 cargo build 快得多，可以先 check 没有问题再 build

### 生产环境构建

```bash
cargo build --release
```

- 编译会优化，但构建时间就更长
- 生成内容在 `target/release`
