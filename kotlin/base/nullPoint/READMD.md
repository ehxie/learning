# 空指针检查

之前国外网站有人统计过，Android 崩溃率最高的是空指针异常，所以空指针异常是 Android 开发中非常常见的问题。

- 原因主要是空指针不受语言检查的运行时异常，只能由程序员自己手动检查，所以空指针异常非常容易发生。

> 很难有人能将所有潜在的空指针异常都全部考虑到

## 简单的例子

一段简单 java 代码

```java
public void doStudy(Study study) {
    study.doStudy();
    study.doHomework();
}
```

这段代码安全吗？不一定，因为可能传入的参数是 null，所以需要在调用前进行判空处理

```java
public void doStudy(Study study) {
    if (study != null) {
        study.doStudy();
        study.doHomework();
    }
}
```

> 一小段代码就有空指针异常的潜在风险，那么在大型项目中，需要全避免空指针几乎是不可能的

## 可空类型系统

kotlin 科学的解决了这个问题，利用编译时判空检查的机制几乎杜绝了空指针异常

- 虽然编译时判空检查会让代码变得比较难写，但是 kotlin 提供了一系列的辅助工具，让我们能轻松的处理各种判空情况

上面 java 版本的代码翻译为 kotlin

```kotlin
fun doStudy(study: Study) {
    study.doStudy()
    study.doHomework()
}
```

这段代码看上去和 java 的没区别，但实际上它是没有空指针风险的，因为 Kotlin 默认所有的参数和变量都是不可空，所以这里传入的 study 参数也一定不会是空的

如果是可空类型，则需要在变量名后面加 ?

```kotlin
fun doStudy(study: Study?) {
    if(study != null) {
        study.doStudy()
        study.doHomework()
    }
}
```

## 判空辅助工具

### `?.`

最常用的就是 `?.` 操作符：当对象不为空时正常调用

```kotlin
if(a != null) {
    a.doSomething()
}
// 等价于
a?.doSomething()
```

上面 doStudy 的代码简化为

```kotlin
fun doStudy(study: Study?) {
    study?.doStudy()
    study?.doHomework()
}
```

### `?:`

`?:` 操作符：操作符两边都接收一个表达式，如果左边不为空则返回左边的表达式，否则返回右边的表达式

```kotlin
val c = if(a != null) a else b
// 等价于
val c = a ?: b
```

### `?.` 和 `?:` 结合的例子

写一个函数获取字符串长度

```kotlin
fun getTextLength(text: String?): Int {
    if(text != null) {
        return text.length
    }
    return 0
}
// 等价于
fun getTextLength(text: String?) = text?.length ?: 0
```

### 特殊情况

kotlin 的空指针检查机制并非总是那么智能，有时候从逻辑上已经将空指针异常处理了，但是 kotlin 编译器并不知道，这个时候会编译失败

```kotlin
var content: String? = "hello"

fun main() {
    if(content != null) {
        printUpper()
    }
}
fun printUpper() {
    val upperCase = content.toUpperCase()
    println(upperCase)
}
```

- 以上代码已经在 main 中进行了判空操作了，但是编译器并不知道，所以编译失败

可以使用 `!!` 告诉编译器这里做空指针检查

```kotlin
fun printUpper() {
    val upperCase = content!!.toUpperCase()
    println(upperCase)
}
```

这样就可以通过编译了，但是会有风险的，这样写的话，如果 content 变量为空，就会抛出异常（潜在风险）

### let

let 并不是一个操作符，而是一个函数，用来简化判空操作

- 提供了函数式 API 的编程接口，将原始调用对象作为参数传递到 lambda 表达式中

```kotlin
// 语法
obj.let { obj2 ->
    // ...
}
```

可以使用 let 优化上面的 study 代码

```kotlin
fun doStudy(study: Study?) {
    study?.let {
        it.doStudy()
        it.doHomework()
    }
}
```
