# 函数高级用法

## 高阶函数

接收一个 Lambda 参数的函数就可以被成为具有函数式编程风格的 API

- 如果想定义自己的函数式 API，那么就需要借助高阶函数来实现了

高阶函数：如果一个函数接收另一个函数作为参数，或者返回值的类型是另一个函数，那么这个函数就被称为高阶函数

> 一个函数怎么能作为参数呢？kotlin 中不仅有整数、布尔值类型，还新增了函数类型

### 语法规则

```kotlin
(String, Int) -> Unit
```

e.g.

```kotlin
// 这里的 fun 接收的就是函数类型
fun example(fun: (String, Int) -> Unit) {
    fun('hello', 10)
}
```

### 作用

允许让函数类型的参数来决定函数的执行逻辑

- 即使是同一个高阶函数，只要传入不同的参数类型，那么它的执行逻辑和最终返回的结果就可能是完全不同的

e.g.

```kotlin
fun num1AndNumb2(num1: Int, num2: Int, operation: (Int, Int) -> Int): Int {
    return operation(num1, num2)
}

fun plus(num1: Int, num2: Int): Int {
    return num1 + num2
}

fun minus(num1: Int, num2: Int): Int {
    return num1 - num2
}

fun main() {
    val num1 = 100
    val num2 = 80
    // ::plus 这是引用函数的一种写法
    val result1 = num1AndNumb2(num1, num2, ::plus)
    val result2 = num1AndNumb2(num1, num2, ::minus)
    println("result1: $result1")
    println("result2: $result2")
}
```

如果每次调用高阶函数前还需要先定义一个函数，那么就太麻烦了，所以 kotlin 还支持其他方法来调用，例如 Lambda 表达式、匿名函数或成员引用

e.g.：使用 lamba 表达式

```kotlin
fun main() {
    val num1 = 100
    val num2 = 80

    val result1= num1AndNumb2(num1, num2) { n1, n2 ->
        n1 + n2
    }
    val result2 = num1AndNumb2(num1, num2) { n1, n2 ->
        n1 - n2
    }
    println("result1: $result1")
    println("result2: $result2")
}
```

### 实现原理

Kotlin 代码最终是会编译成 Java 字节码，但是 Java 字节码并没有高阶函数的概念，Kotlin 借助强大的编译器来支持这个功能

```kotlin
fun num1AndNumb2(num1: Int, num2: Int, operation: (Int, Int) -> Int): Int {
    return operation(num1, num2)
}

fun main() {
    val num1 = 100
    val num2 = 80
    val result1 = num1AndNumb2(num1, num2) { n1, n2 ->
        n1 + n2
    }
}
```

编译后(为了可读性做了些调整)：

- 可以看到 Lambda 表达式在这里变成了 Function 接口的匿名类的实现，里面有一个待实现的 invoke 函数

```java
public final class MainKt {
    public static final int num1AndNumb2(int, int, Function operation) {
        return (int)operation.invoke(num1, num2);
    }

    public static final void main() {
        int num1 = 100;
        int num2 = 80;
        int result = num1AndNumb2(num1, num2, new Function() {
            @Override
            public Integer invoke(int n1, int n2) {
                return n1 + n2;
            }
        })
    }
}

```

## 内联函数

根据上面 lambda 函数的实现可知，每调用一次 lambda 表达式就会创建一个新的匿名类实例，这样会造成额外的内存和性能开销

- 所以 kotlin 提供了内联函数来解决这个问题，可以将 lambda 表达式带来的开销完全消除

内联函数的用法非常简单，只需要在定义高阶函数时加上 inline 关键字即可

```kotlin
inline fun num1AndNumb2(num1: Int, num2: Int, operation: (Int, Int) -> Int): Int {
    return operation(num1, num2)
}

```

### 工作原理

内联函数怎么消除 lambda 表达式带来的开销呢？

- kotlin 编译器会将内联函数中的代码在编译的时候自动替换到调用它的地方，这样就不存在运行时的开销了

```kotlin
inline fun num1AndNum2(num1: Int, num2: Int, operation: (Int, Int) -> Int): Int {
    return operation(num1, num2)
}
fun main() {
    val num1 = 100
    val num2 = 80
    val result1 = num1AndNum2(num1, num2) { n1, n2 ->
        n1 + n2
    }
}

// 将 lambda 表达式中的代码替换到韩素好类型参数调用的地方
inline fun num1AndNum2(num1: Int, num2: Int): Int {
    return num1 + num2
}
fun main() {
    val num1 = 100
    val num2 = 80
    val result1 = num1AndNum2(num1, num2)
}

// 将内联函数中的全部代码替换到调用它的地方
fun main() {
    val num1 = 100
    val num2 = 80
    val result1 = num1 + num2
}

```

就这样消除了 Lambda 表达式带来的开销

## noinline && crossinline

这里讨论一些特殊情况

一个高阶函数如果接收了两个或以上的函数类型的参数，添加了 inline 关键字后，kotlin 会将所有 lambda 表达式都进行内联

- 如果我们只希望其中一个内联，这时就可以使用 noinline 关键字

```kotlin
inline fun inlineTest(block1: () -> Unit, noinline block2: () -> Unit) {}
```

内联函数有可以减少开销的好处，那为什么又要提供一个 noinline 关键字呢？

- 内联函数在编译时进行代码替换，因此它没有真正的参数属性

  - 非内联函数的函数参数类型可以自由地传递给其他任何函数，因为它是一个真实的参数，而内联函数类型只允许传递给另外一个内联函数，这也是最大的局限性

区别：内联函数所引用的 Lambda 表达式中是可以使用 return 关键字来进行函数返回的，而非内联函数只能进行局部返回，以下示例说明

```kotlin
fun printString(str: String, block: (String) -> Unit) {
    println("printString begin")
    block(str)
    println("printString end")
}

fun main() {
    println("main start")
    val str = ""
    printString(str) { s ->
        println("lambda start")
        // 局部返回，后面的代码不会执行
        if(s.isEmpty()) return@printString
        println(s)
        println("lambda end")
    }
    println("main end")
}

```

- 内联函数：可以局部返回 return@printString 也可以函数返回 return

- 非内联函数：只能局部返回 return@printString

### 特殊不能使用 inline 情况

```kotlin
inline fun runRunnable(block: () -> Unit) {
    // 这里实际上会创建一个匿名函数，也就是 block 的代码实际上是在匿名函数中调用的
    // 而内联函数是允许使用 return 关键字进行函数返回的，而这里最多只能对匿名类中的函数调用进行返回(没办法满足内联函数的函数返回)
    val runnable = Runnable {
        block()
    }
    runnable.run()
}
```

> 在高阶函数中创建了另外的 Lambda 或者匿名函数的实现，并且在这些实现中调用函数参数类型，此时再将高阶函数声明为内联函数，则一定会报错

使用 crossinline 关键字就可以解决这个问题

```kotlin
inline fun runRunnable(crossinline block: () -> Unit) {
    val runnable = Runnable {
        block()
    }
}
```

crossinline 有什么用

- 之所以上面会出现那个错误，是因为内联函数的 Lambda 表达式中允许使用 return 关键字，而高阶函数和匿名函数中不允许使用 return 关键字之间造成的冲突。而 crossinline 就像一个契约，用于保证在内联函数的 Lambda 表达式中一定不会使用 return 关键字，这样就不存在冲突了

声明了 crossinline 后就无法在调用 runnable 函数时的 Lambda 表达式中使用 return 关键字进行函数返回了，但是仍然可以使用 return@runRunnable 进行局部返回
