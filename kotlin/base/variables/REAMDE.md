# Variables

Kotlin 中的变量

- 需要用 var 进行定义
  - 所有类型都是对象
- 定义常量用 val

```kotlin
main() {
    // 不需要分号结尾
    var name: String = "hh"
    // 自动推导类型
    var age = 20
    // 定义常量
    val ID = 1
}
```

kotlin 中的基类是 Any

## 基本数据类型

## 复杂数据类型

```kotlin
main() {
    // 数组
    val arr: Array<Int> = arrayOf<Int>()
    val arr1: IntArray = intArrayOf()

    // list(不可变)
    val list: List<Int> = listOf<Int>()
    // mutableList(可变)
    val mList: MutableList<Int> = mutableList<Int>()

    // set(不可变)
    val set: Set<Int> = setOf<Int>()
    // mutableSet(可变)
    val mSet: MutableSet<Int> = mutableSet<Int>(1, 2, 3, 3)
    mSet.forEach {it:Int
        println(it)
    }

    // map
    val map: Map<String, Int> = mapOf("1" to 3, "2" to 3 )
    val mMap: mutableMap<String, Int> = mutableMap("2" to 2)
}
```

kotlin 特有

```kotlin
main() {
    // Pair：二元组
    Pair(1, 2)
    // Triple: 三元组
    Triple(1, 2, 3 )

    // Any 类似于
     
    // Noting
    var b: Int? = 3
    // 和 ts 中的 ? 语法一样
    b?.plus(2)
    // 和 ts 中的 ! 一样进行断言
    b!!.plus(2)
}

class A {
    var a: Int? = null
    // 告诉编译器等一下会进行初始化，在使用时不需要认为可能是 null （使用时不需要用 ?. 语法）
    lateinit var b: String = null

    fun soutA() {
        println(a?.toString())
    }

    fun sourB() {
        // 不需要 ?. 也不会提示错误
        println(b.toString())
    }
}
```
