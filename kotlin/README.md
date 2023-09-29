# Kotlin

官方简介：Kotlin is a modern but already mature programming language designed to **make developers happier.**
特点：

- 简洁
- 安全（几乎杜绝了空指针）
- 可与其他语言(例如 Java)通信
- 跨平台

## 简介

编程语言分为编译型和解释型，编译型语言在执行时需要先编译成`二进制文件`然后机器直接执行，而解释型语言则是在执行时需要先编译成`中间代码`，然后由解释器执行。

Java 属于解析型语言，虽然有一个编译的过程，但是编译的结果是 `.class` 文件而不是机器可执行的二进制文件，Java 的 `.class` 文件由 JVM 去执行(Android 中为 ART)

那么如果开发一个新的语言，再写一个编译器，编译的结果是 `.class` 文件，那么就可以直接在 JVM 上执行了。没错，这就是 kotlin 的工作原理

kotlin 代码在线网站：<https://try.kotlinlang.org>

- 国内访问可能比较慢，可以用 Android Studio (推荐，有较好的代码补全和自动导包功能)或者 VSCode 安装插件后使用

## 目录结构

[base](/kotlin/base/)

- kotlin 基础语法(适合有其他语言基础的同学快速掌握 kotlin)

[advanced](/kotlin/advanced)

- 高级用法

[vscode](/kotlin/vscode)

- 在 VSCode 中使用 kotlin，体验其实并不好，还是使用官方推荐的 [IDE](https://kotlinlang.org/docs/kotlin-ide.html#what-s-next) 吧

## 参考

<https://www.bilibili.com/video/BV15N411A7P8/?p=3&spm_id_from=pageDriver&vd_source=e26f2011a16ecc33e81c886261d5a3c6>
