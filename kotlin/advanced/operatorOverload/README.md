# operator overload

运算符重载是 Kotlin 中比较有趣的语法糖，运算符重载允许我们让任意两个对象相加，或者其他运算操作。

- 实际编程时也需要思考逻辑的合理性，例如让两个 Student 对象相加好像没有什么意义，但是让两个 Money 对象相加，则还是有点用的

## 语法

重载运算符用的是 operator 关键字，加号对应的重载函数是 plus()

```kotlin
class Obj {
    operator fun plus(other: Obj): Obj {
        // 处理相加的逻辑
    }
}

fun main() {
    val obj1 = Obj()
    val obj2 = Obj()
    val obj3 = obj1 + obj2
}
```

[更多可重载的运算符](https://kotlinlang.org/docs/operator-overloading.html#equality-and-inequality-operators)

## 例子

e.g. 两个 Money 对象相加，返回一个新的 Money 对象

```kotlin
class Money(val amount: Int) {
    operator fun plus(other: Money): Money {
        return Money(this.amount + other.amount)
    }
    // 也可以直接与数字相加
    operator fun plus(other: Int): Money {
        return Money(this.amount + other)
    }
}

fun main() {
    val money1 = Money(10)
    val money2 = Money(10)
    val money3 = money1 + money2

    val money4 = money1 + 5
}
```
