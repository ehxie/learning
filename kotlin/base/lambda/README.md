# lambda

集合的函数式 API 是用来入门 lambda 编程的绝佳示例

- 集合：List、Set 再广泛一点可以把 Map 包含在内

需求：创建一个包含许多水果名称的集合

- java 中先创建一个 ArrayList，然后再往里面添加元素
- kotlin 也可以这样做

```kotlin
fun main() {
    val list = ArrayList<String>()
    list.add("apple")
    list.add("banana")
    list.add("orange")
    list.add("watermelon")
    list.add("pear")
    list.add("grape")
}
```

上面的方式比较繁琐，kotlin 提供了内置的 listOf 来创建一个`不可变`的集合

```kotlin
fun main() {
    val list = listOf("apple", "banana", "orange", "watermelon", "pear", "grape")
    // 遍历
    for (fruit in list) {
        println(fruit)
    }
}
```

不可变的集合即是一个可读的集合，但是不能进行修改，若要创建一个可变的集合，可以使用 mutableListOf

需求：如何找到单词最长的水果

传统的写法

```kotlin
fun main() {
    val list = mutableListOf("apple", "banana", "orange", "watermelon", "pear", "grape")
    val maxLengthFruit = findLongest(list)
    println(maxLengthFruit)
}
fun findLongest(list: List<String>): String {
    var maxLengthFruit = ""
    for(fruit in list) {
        if(fruit.length > maxLengthFruit.length) {
            maxLengthFruit = fruit
        }
    }
    maxLengthFruit
}
```

集合的函数式 API 写法

```kotlin
fun main() {
    val list = mutableListOf("apple", "banana", "orange", "watermelon", "pear", "grape")
    val maxLengthFruit = list.maxBy { it.length }
    println(maxLengthFruit)
}
```

lambda 其实就是一小段可以传递参数的代码，通常情况下，我们向函数传递的只能是一个变量，而 lambda 表达式可以传递一个代码块

- 语法：{参数列表 -> 代码块}
  - 参数列表：如果只有一个参数，可以省略参数名和箭头(默认的参数名是 it)，多个参数使用逗号分隔
  - 最后一行是返回值

上面的 maxBy 就是一个普通的函数，接收一个 lambda 表达式作为参数，在每次遍历时，都会将当前元素作为参数传递给 lambda 表达式

- 工作原理：根据传入的条件来遍历集合，从而找到该条件下的最大值，比如我们要找到单词最长的水果，那么条件自然就是单词的长度

既然上面的 maxBy 是一个函数，那为什么没有`maxBy()`这种写法？

- 当函数只有一个参数且是 lambda 表达式时，可以将花括号写在外面，且省略小括号
- 同时当函数最后一个参数是 lambda 表达式时，可以将花括号写在外面

常用的集合 API（和 JavaScript 中的用法很相似）

- map：将集合中的每个元素进行转换
- filter：过滤集合中的元素，返回一个新集合

## Java 函数式 API 的使用

在 kotlin 中调用 Java 方法也可以使用 lambda 表达式，但有一定限制，该 Java 方法接收一个 Java 单抽象方法接口

- Java 单抽象方法接口：只有一个抽象方法的接口

e.g.

```java
public interface Runnable {
    void run();
}
```

java 中的写法

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("hello java run");
    }
}).start();
```

kotlin 中的写法

```kotlin
// 使用 object 创建匿名类
Thread(object: Runnable {
    override fun run() {
        println("hello kotlin run")
    }
}).start()

// 省略 object 和 override(因为只有一个需要重写)
Thread(Runnable {
    println("hello kotlin run")
}).start()

// 如果 Java 方法的参数列表中有且仅有一个 Java 单抽象方法接口参数，还可以将接口名省略
Thread({
    println("hello kotlin run")
}).start()

// 当只有一个参数时，lambda 表达式可以移到外面，并把小括号省略掉
Thread {
    println("hello kotlin run")
}.start()
```

## 其他例子

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
