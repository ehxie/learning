# lambda

声明匿名函数

> java 中 lambda 表达式需要通过接口进行定义，而 kotlin 引入了函数类型的概念，所以不需要

```kotlin
fun main() {
    val fun1: (Int, Int) -> Int = {x, y ->
        // 最后一行是返回值
        x+y
    }
    fun1(1, 2)

    // 参数只有一个可以用 it
    val fun2: (Int) -> Int = {it ->
        // 最后一行是返回值
        it+1
    }
    fun2(2)

    // 没有用到的参数可以用 _ 代替
    val fun1: (Int, Int) -> Int = {_, y ->
        // 最后一行是返回值
        y+1
    }
    fun1(1, 2)

}
```

应用

```kotlin
fun main() {
    // lambda 表达式
    test({
        // 函数体
    })

    // 当函数的最后一个参数为 lambda 表达式时，可以将花括号写在外面
    test() {
        // 函数体
    }

    // 当函数只有一个参数且为 lambda 表达式时，可以将花括号写在外面
    test {
        // 函数体
    }
}

fun test(callback: () -> Unit) {

}

```

```kotlin
fun main() {
    test<Int>(1, {
        println(this) // 输出 1
    })

}

fun <T>test(a:T, callback: T.()->Unit) {
    a.callback()
}
```
