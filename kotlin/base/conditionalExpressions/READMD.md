# Conditional expressions

## if

```kotlin
main() {
    val a = 1
    // 常规的条件判断语句
    if(a == 1) {
        // ...
    } else if(a == 2) {
        // ..
    } else {

    }

    // kotlin 还可以接收条件判断语句的返回值
    // 所有条件必须是完整的，返回值写在最后一行即可
    // 没有返回值时返回类型就是 Unit (即 Java 中的 void)
    val res:Int = if(a == 1){
        // ...
        4
    } else {
        // ...
        6
    }
    // 没有三元表达式
}
```

## when

```kotlin
main() {
    // kotlin 中没有 switch，而是 when
    // 不需要写 break，默认都会有的
    // 和 if 一样可以有返回值，写法是一样的
    val b: Any = 1
    when(b) {
        1 -> {
            // ...
        },
        // b == 2 || b == 3
        2,3 -> {

        }
        // 类型判断
        is Int -> {

        }
        is String -> {

        }
        // 区间判断(1..10)
        in 1 <= .. <= 10 -> {

        }
        // 相当于 switch 中的 default
        else -> {

        }
    }
}

```

## in 和区间

```kotlin
main() {
    // [1, 10]
    // 语法①: 1..10
    1 <= .. <= 10
    // 语法②: downTo
    10 >= downTo >= 1


    // [1, 10)
    1 until 10
    // 1.8.2 不建议使用 until 了，而是 ..<
    1 ..< 10

    // 递增单位默认是 1，需要修改为 2
    (1 <= .. <= 10 step 2)
}
```

## loop

kotlin 中循环不是通过下标，而是通过迭代器，如果对象有迭代器则说明可以进行遍历

```kotlin
main() {
    val list: List<Int> = (1 <= .. <= 20).toList()
    // 迭代器
    println(list.listIterator().hasNext())
    println(list.listIterator().next())

    // 遍历
    for (i:Int in list) {
        println(i)
    }

    // 访问下标
    for(i: IndexedValue<Int> in list.withIndex()) {
        println("${i.index} ${i.value}")
    }
    // 可以进行解构
    for((index: Index , value: Int) in list.withIndex()) {
        println("${index} ${value}")
    }
    // 扩展函数(对原有对象进行扩展的函数)：forEach
    list.forEach { it: Int
        println(it)
    } 
    // 自定义参数名字
    list.forEach { value ->
        println(it)
    }
    list.forEachIndexed {index, value ->
        println("${index} ${value}")
    }
}
```

## while

```kotlin
main() {
    var i = 0
    
    // 方式一
    while(i < 5) {
        i++
        println(i)
    }

    // 方式二
    do {
        i++
        println(i)
    } while(i < 5)
}
```

break、continue、标签

```kotlin
main() {
    a@ for(i: Int in 1 <= ... <= 5) {
        for(j:Int in 1 <= ... <=5) {
            if(i == 2 && j == 3) {
                // 跳出当前循环
                break
            }
            if(i ==3 && j==3) {
                // 跳出标签所定义的循环(即外层循环)
                break@a
            }
            // continue 也是一样的
        }
    }
}
```

forEach 不可以这样用，因为是一个函数

- 需要定义一个 lambda 表达式

```kotlin
main() {
    run {
        (1 <= .. <= 10).forEach {it: Int
            if(it == 2) {
                return@run
            }
            println(it)
        }
    }

    run a@ {
        (1 <= .. <= 10).forEach {it: Int
            if(it == 2) {
                return@a
            }
            println(it)
        }
    }
}
```
