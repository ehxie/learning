# function

使用 fun 关键字进行定义

- 需要返回值类型，没写默认是 Unit

```kotlin
fun main() {

}

fun sum(a:Int, b:Int):Int {
    return a + b
}
// 可以指定参数名传参
sum(b = 1, a = 2)

// 只有一句时可以省略，且返回值类型可以自动推导
fun sum1(a:Int, b:Int) = a + b

// 泛型
fun <T> add(a:T, b:T) = a + b

// 多参数
fun sum(vararg list:String) {
    
}
val arr = arrayOf("1", "2", "3")
// * 相当于 js 中的 `...` 扩展运算符
sum(*arr)
```

infix 关键字

```kotlin
main() {
    println(1.sum(2))

    println(1 add 2)
    println(1.2f add 2)    
}

// 扩展函数
fun Int.sum(a: Int) = this + a

// infix
infix fun Int.add(a: Int) = this + a
// 重载
infix fun Float.add(a: Float) = this + a

```
