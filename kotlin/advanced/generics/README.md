# generics

什么是泛型？在一般编程模式下，我们需要给一个变量指定具体类型，泛型允许我们在不指定具体类型的情况下进行编程，这样写出来的代码会有更好的扩展性

e.g.：List 是可以存放数据的列表，但是 List 并没有限制我们只能存放整型数据或者字符串数据，因为它没有指定一个具体的类型，而是使用泛型来实现的，因此我们可以使用 `List<Int>`、`List<String>` 来构建具体类型的列表

## 基本使用

定义泛型有两种方式：一种是定义泛型类，另一种是定义泛型方法，使用的语法结构都是 `<T>`，其中 T 可以是任意字母，但是为了方便阅读，我们通常使用大写字母来表示泛型

```kotlin
// 定义泛型类
class MyClass<T> {
  fun method(param: T): T{
    return param
  }
}

fun main() {
  val myClass = MyClass<Int>()
  val result = myClass.method(1)
}
```

对泛型做限制(即不希望泛型可以是任意类型，而是指定的某些类型)

e.g.：指定泛型的上限是 Number

```kotlin
class MyClass {
  // 这里的泛型就只能是 Int、Float、Double 等
  fun <T : Number> method(param: T): T{
    return param
  }
}
```

> 默认情况下上限都是 `Any?`（即可为空的类型），如果不希望为空则可以使用 `Any` 限制

e.g.：使用泛型优化代码

```kotlin
fun StringBuilder.build(block: StringBuilder.() -> Unit) : StringBuilder {
  block()
  return this
}
```

上面函数的作用和 apply 是一样的，只是 build 函数只能作用在 StringBuilder 上，而 apply 函数可以作用在任意类上，使用泛型进行扩展，就能够实现和 apply 一样的效果

```kotlin
fun <T> T.build(block: T.() -> Unit) : T {
  block()
  return this
}
```
