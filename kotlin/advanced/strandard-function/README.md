# 标准函数

Kotlin 的标准函数指的是 Standard.kt 中定义的函数，在任何 Kotlin 代码中都能随时随地的调用

## let

let 通过对象进行调用，接收一个 lambda 表达式作为参数，最后一行代码作为返回值

- 可以用于判断对象是否为空，不用写很多判断语句和 `?.`

```kotlin
// 对于可能为空的对象，需要进行判空操作
// 方法一
fun daStudy(study: Study?) {
    study?.readBooks()
    study?.doHomework()
}

// 方法二：
fun daStudy(study: Study?) {
    if (study != null) {
        study.readBooks()
        study.doHomework()
    }
}

// 方法三：使用 let 函数
fun daStudy(study: Study?) {
    // 对象为空时什么都不做
    study?.let {
        it.readBooks()
        it.doHomework()
    }
}
```

## with

with 函数接收两个参数

- 第一个：任意类型的对象
- 第二个：一个 lambda 表达式

with 函数的作用是：

- 在 Lambda 表达式中提供第一个参数的对象的上下文，并使用 Lambda 表达式中的最后一行代码作为返回值返回

```kotlin
val result = with(someObject) {
    // 这里是 someObject 的上下文
    // 最后一行代码作为返回值
}
```

有什么用？

- 在连续调用同一个对象的多个方法时让代码变得更加精简

例如有一个水果列表，现在我们想吃完所有水果，并将结果打印出来，可以这样写

```kotlin
val list = listOf("Apple", "Banana", "Orange")
val builder = StringBuilder()
builder.append("Start eating fruits:\n")
for (fruit in list) {
    builder.append(" $fruit").append("\n")
}
builder.append("Ate all fruits")
val result = builder.toString()
println(result)
```

使用 with 函数可以这样写

```kotlin
val list = listOf("Apple", "Banana", "Orange")
val result = with(StringBuilder()) {
    // lambda 表达式的上下文就是 StringBuilder 对象，所以可以直接使用 append 方法
    append("Start eating fruits:\n")
    for (fruit in list) {
        append(" $fruit").append("\n")
    }
    append("Ate all fruits")
    toString()
}
println(result)
```

## run

run 和 with 类似，只是语法稍微变动，run 函数通常不会直接调用

- run 函数接收一个 lambda 表达式，并且在 lambda 表达式中提供上下文，并使用 lambda 表达式中的最后一行代码作为返回值

```kotlin
val result = obj.run {
    // 这里是 obj 的上下文
    // 最后一行代码作为返回值
}
```

使用 run 函数修改上面的例子

```kotlin
val list = listOf("Apple", "Banana", "Orange")
val result = StringBuilder().run {
    // lambda 表达式的上下文就是 StringBuilder 对象，所以可以直接使用 append 方法
    append("Start eating fruits:\n")
    for (fruit in list) {
        append(" $fruit").append("\n")
    }
    append("Ate all fruits")
    toString()
}
println(result)
```

只不过将 with 第一个参数换成了调用

e.g.：[简化代码](/kotlin/advanced/strandard-function/example/run-example.kt)

## apply

和 run 类似，都是在某个对象上调用，并且接收一个 lambda 表达式，但是 apply 函数会返回对象本身，所以可以链式调用

```kotlin
val list = listOf("Apple", "Banana", "Orange")
val result = StringBuilder().apply {
    // lambda 表达式的上下文就是 StringBuilder 对象，所以可以直接使用 append 方法
    append("Start eating fruits:\n")
    for (fruit in list) {
        append(" $fruit").append("\n")
    }
    append("Ate all fruits")
}
// 这里的 result 是一个 StringBuilder 对象，所以最后打印时需要调用 toString 方法
println(result.toString())
```

## also

also 和 apply 相似，不同的是，also 在函数块中使用it指代该对象，而 apply 在函数块中使用 this 指代该对象

```kotlin
val list = listOf("Apple", "Banana", "Orange")
val result = StringBuilder().also {
    it.append("Start eating fruits:\n")
    for (fruit in list) {
        it.append(" $fruit").append("\n")
    }
    it.append("Ate all fruits")
    it.toString()
}
println(result)
```

## 区别

![Alt text](/kotlin/advanced/strandard-function/assets/image.png)
