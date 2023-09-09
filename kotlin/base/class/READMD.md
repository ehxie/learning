# class

## 基本使用

```kotlin
fun main() {
    val a = A(1)
    a.print()
}

class A(p: Int) {
    var a = 1
        // 自带 get set
        get() = field -2
        set(value) {
            field = value
        }
    // 稍后初始化
    lateinit var b: String
    // 构造函数
    init {
        a = p
    }
    fun print() {
        println("hello$a")
    }
}
```

## 构造函数

```kotlin
// 多级构造函数
class B(var a:Int) {
    var b: Int = 0
    init {
        b = a
    }
    // 次构造函数，如果类的定义有`()`, 需要代理构造次构造函数
    constructor(a: Int, b: Int): this(a) 
    constructor(a: Int, b: Int, c: Int): this(a) 
}

// 不需要代理的情况, 没有主构造函数
class B1 {
    val b: Int = 0
    constructor(a: Int, b: Int)
    constructor(a: Int, b: Int, c: Int)
}
```

## 访问和属性修饰符

常规

```kotlin
fun main() {
    Child1("1")
    Child2("1")
}

public final class Base {}
// 默认 是自带 public 和 final 修饰符的
class A {}
// 增加 open 修饰符后这个类就可以被继承了
open class Parent() {}
open class Parent1(name: String) {}
// 继承，需要实现父类
class Child: Parent() {

}
class Child1(name: String): Parent1(name) {

}
class Child2: Parent1 {
    // 次构造函数
    constructor(name: String): super(name)
}

private class B {}

// protected 属性是在继承的时候才有用，需要这个类需要声明为 open
open class C {
    protected fun getName(): String = "hhh"
}
```

特殊

```kotlin
// internal 只在当前模块下可访问
internal class KotlinA {

}

## 重写

```kotlin
fun main() {
    Parent().print1()
    Child().print1()
}

open class Parent {
    // 设置为 open
    open val count1 = 1
    open var count2 = 2
    // 设置为 open
    open fun print1() {
        println("parent print1")
    }
    fun print2() {
        println("parent print2")
    }
}

class Child: Parent() {
    // 重写，编译为 java 代码后可以看出是在子类新定义一个 count1 变量(因为从 val 变成了 var)
    override var count1: Int
        get() = super.count1
    // 编译为 java 后可以看出是重写了变量的 get set 方法
    override val count2: Int
        get() = super.count2
        set(value) {
            filed = value
        }
    // 重写
    override fun print1() {
        // super.print1()
        println("child print1")
    }

}
```

## 抽象、嵌套、内部类

抽象类

```kotlin
fun main() {
    // 不能实例化抽象类
    // Parent()
}
abstract class Parent {
    abstract fun a()
    // 有定义就不是抽象函数了，不需要在子类实现
    fun b() {

    }
}

class Child: Parent() {
    override fun a() {

    }
}
```

嵌套类、外部类

```kotlin
fun main() {
    // 嵌套类不需要实例化外部类
    Parent1.Child().test()
    // 内部类需要先实例化外部类
    Parent1().Child1().test()
}
abstract class Parent1 {
    val a = 1
    // 嵌套类(会被编译为 static)
    class Child {
        fun test() {
            // Java 中通过：Parent1.this.a 可以访问到
        }
    }
    // 内部类
    inner Child1 {
        fun test() {
            this@Parent1.a
        }
    }
}

class Child: Parent() {
    override fun a() {

    }
}
```
