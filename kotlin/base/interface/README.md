# interface

```kotlin
fun main() {

}

// 单继承，多实现
class Parent: Base, A, B () {
    override fun a() {
        // ...
    }
    override fun test() {
        super.test()
   }
   /// 需要重写
    override fun foo() {
        // 需要用泛型指定是哪个接口的方法
        super<A>.foo()
    }
}

abstract class Base {

}

interface A {
    fun a()
    fun test() {
        // 可以有函数体，意味着不要求必须实现
        // 语法糖，底层实际上是定义一个静态类请实现的
    }
    fun foo () {}
}
interface B {
    fun foo() {}

}
```

```kotlin
fun main() {

}

// 在主构造函数中重写
class Parent(override val a: Int): A, B {
    // 可以在类中重写
    override val a: Int
        get() = 1
    override var same: Int
        get() = 1
        set(value) {}

}
interface A {
    val a: Int
    val b: Int
    // 不可变
    val same: Int
}
interface B {
    // 可变
    var same: Int
}
```

## 面向接口编程

面向接口编程也可以称为多态

```kotlin
open class Person(val name: String, val age: Int) {}

interface Study {
    fun readBooks()
    fun doHomework()
}

class Student(name: String, age: Int): Person(name, age), Study {
    override fun readBooks() {
        println("${name} read books")
    }
    override fun doHomework() {
        println("${name} do homework")
    }
}

fun doStudy(study: Study) {
    study.readBooks()
    study.doHomework()
}

fun main() {
    val student = Student("Tom", 18)
    // 本来可以直接使用实例请调用对应的方法，但是这里没有这样做，而是使用接口来调用
    doStudy(student)
}
```
