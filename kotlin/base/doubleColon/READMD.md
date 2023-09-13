# double colon

双冒号语法

- 引用属性、属性、类，无法引用变量
- 可以当做反射来用，获取类的信息

## 函数

```kotlin
import kotlin.reflect.KFunction
fun main() {
    val a: KFunction<Unit> = ::test
    
    // 使用 lambda 表达式
    test1 {

    }
    // 通过反射拿到函数对象
    test1(::test)

}

fun test() {

}

fun test1(callback: () -> Unit) {
    callback()
}
```

## 类

基本使用

```kotlin
fun main() {
    // 拿到构造函数
    val kFunction0 = ::A
    val kFunction1 = A::fn
    val kProperty1<Unit> = A::a1

    // 需要把对象传给它
    kFunction1(A())

    // 查看是否可继承
    kFunction1.isOpen
}

class A {
    val a1 = 1
    fun fn() {
        println("a")
    }
}
```

::class 和 ::class.java

```kotlin
fun main() {
    val kClass = A::class
    // 判断是否是数据类
    kClass.isData 

    // 兼容 java 生态
    // - 有时候调用 java 的方法需要传类引用，而 kotlin 中的类引用和 java 中的类引用类型不一致，就需要用这个 
    val java = A::class.java
}

class A {

}
```
