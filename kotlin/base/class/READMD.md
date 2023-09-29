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

在构造函数中使用 val、var 修饰的属性会成为类的属性，在构造函数中初始化

- 所以如果是继承的类，子类中不能使用 val 修饰的属性，因为这样就和父类的属性冲突了

构造函数中没有用 val、var 修饰的属性，作用域只会在构造函数中

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

## 数据类

MVC、MVVM、MVP 模式中的 M 指的就是数据类

- 数据类通常需要重写 equals、hashCode、toString
  - equals 用于比较两个对象是否相等
  - hashCode 用于计算哈希值
  - toString 用于打印对象信息

java 中实现需要自己重写，而 kotlin 中使用 data 关键字，会自动增加 copy、equals、hashCode、toString 等方法

### 和 java 对比

创建一个 Cellphone 的手机数据类，只有品牌和价格这两个字段

```java
public class CellPhone {
    private String brand;
    private double price;

    public CellPhone(String brand, double price) {
        this.brand = brand;
        this.price = price;
    }

    @Override
    public boolean equals(Object o) {
        if(o instanceof CellPhone) {
            CellPhone cellPhone = (CellPhone) o;
            return cellPhone.brand.equals(brand) && cellPhone.price.equals(price);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return brand.hashCode() + (int) price;
    }

    @Override
    public String toString() {
        return "CellPhone{" +
        "brand='" + brand + '\'' +
        ", price=" + price +
        '}';
    }
}
```

kotlin 中使用 data 关键字，实现起来就很简单了

- 尾部没有代码时还可以把大括号省略了

```kotlin
data class CellPhone(val brand: String, val price: Double)
```

### 其他例子

```kotlin
// 使用 data  关键字声明
// 必须要有成员变量
data class A (
    val name: String,
    val age: Int
) {
    fun a() {

    }
}

// 使用
fun main() {
    val a = A("hh", 20)
    // copy 并修改部分成员变量
    const a1 = a.copy("xx")
}
```

## 伴生对象

kotlin 中没有 static 关键字

- 使用伴生对象来处理

```kotlin
class NumberTest {
    // 伴生对象, 一个类最多只有一个伴生对象，可以把名字省略了
    companion object Obj {
        var flag = false
        fun plus(num1: Int, num2: Int): Int {
            return num1 + num2
        }
    }
}

// 使用
fun main() {
    println(NumberTest.plus(1, 2))
    println(NumberTest.false)
}
```

Java 中如何调用伴生对象

- 伴生对象有名称时
  - 类名.伴生对象名.方法名()
  - 类名.半生对象名.属性的setter,getter方法
- 伴生对象没有名称时，名称就用 `Companion` 关键字

```java
public class NumberJavaTest {
    public static void main(String[] args) {
        System.out.println(NumberTest.Obj.plus(2, 3))
        // 或者：System.out.println(NumberTest.Companion.plus(2, 3))
        NumberTest.Obj.setFlag(true)
    }
}

```

上面的伴生对象其实就是在类中声明了一个对象，而不是真正的 static，如果要声明为static，需要使用注解`@JvmStatic`、`@JvmField`

```kotlin

class NumberTest {
    // 伴生对象, 一个类最多只有一个伴生对象，可以把名字省略了
    companion object Obj {
        // 等价于 Java 中 static final
        // 属性的两种声明方式
        @JvmField
        var flag = false
        // 静态常量
        const val m =1 

        @JvmStatic
        fun plus(num1: Int, num2: Int): Int {
            return num1 + num2
        }
    }
}
```

使用

```java
public class NumberJavaTest {
    public static void main(String[] args) {
        System.out.println(NumberTest.plus(2, 3))
        NumberTest.setFlag(true)
    }
}
```

## 枚举

```kotlin
enum class A {
    TEST1,
    TEST2
}

// kotlin 中的成员变量其实都是对象，而这些对象都是继承于 enum 声明的类
enum class B(val key: String) {
    TEST1("test1"),
    TEST2("test2")
}

// 也可以继承接口
enum class C(val key: String): Inf {
    TEST1("test1") {
        override fun hello() {
            // 需要实现
        }
    }
}
interface Inf {
    fun hello()
}

fun main() {
   println(A.TEST1)  // 0
   println(B.TEST1.key)  // test1
}
```

- 可以理解为一个类里面写了很多静态类，这些静态类都继承了外面的枚举类

## object 关键字

### 单例

Java 中定义工具类中方法都是使用 static 修饰，而 Kotlin 中没有 static 关键字，可以使用 object 关键字来定义单例

```kotlin
fun main() {
    A.test()
}

object A: B{
    fun test() {

    }
    override fun print() {
        // ...
    }
}

interface B {
    fun print()
}
```

### 对象表达式

用于创建接口

```kotlin
fun main() {
    // 创建接口
    var cb = object: Callback {
        // ...
    }
    request(object: Callback {
        override fun loading() {
            // 需要实现
        }
    })
}
interface Callback {
    fun loading()
}

fun request(callback: JavaInterface) {
    callback.loading()
}
```

## 密封类

密封类 = 抽象类 + 枚举
密封接口 = 接口 + 枚举

e.g.: MVI 架构（登录退出）

- 不同类型的架构可以[参考](https://juejin.cn/post/702262419172360192)

```kotlin
// 定义事件
sealed class MainIntent {
    data class Login(val act:String, val pwd: String): MainIntent()
    object Logout: MainIntent()
}

fun main() {
    handlerMainIntent(MainIntent.Login("hh", "123455"))

}

// 对于 model 的操作
fun handlerMainIntent(mainIntent: MainIntent) {
    when(mainIntent) {
        is MainIntent.Login -> userLoginRequest(mainIntent.act, mainIntent.pwd)
        MainIntent.Logout -> println("退出")
    }
}

// 处理事件
fun userLoginRequest(act: String, pwd: String) {
    println("用户登录${act} ${pwd}")
}
```

密封接口例子

```kotlin
fun main() {

}

// 这里继承普通的接口也是可以的, 但是如果继承的对象很多的话，密封接口可以快速的知道有谁继承了他（枚举出来）
fun handlerHealth(role: Weapon) {
    when(role) {
        is Player1 -> TODO()
        is Player2 -> TODO()
        is Player3 -> TODO()
        is Enemy1 -> TODO()
        is Enemy2 -> TODO()
    }
}

// 密封接口可以多实现，但是密封类只能单继承
sealed interface Health {}
sealed interface Weapon {}

class Player1: Health, Weapon
class Player2: Health, Weapon
class Player3: Health, Weapon
class Enemy1: Health, Weapon
class Enemy2: Health, Weapon
```
