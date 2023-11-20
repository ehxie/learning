# Delegate

委托是一种设计模式: 操作对象自己不会去处理某段逻辑，而是会把工作委托给另外一个辅助对象去处理

- 分为类委托和委托属性

## 类委托

核心思想：将一个类的具体实现委托给另外一个类去完成

e.g.: Set 和 List 的数据结构类似，只是它们存储数据的方式不同，Set 是一个接口，要使用它的话需要使用它的具体实现类，例如 HashSet。而借助与委托模式，我们可以轻松实现一个自己的实现类

- 构造函数中接收一个 HashSet 参数，这就相当于一个辅助对象。然后在 Set 接口所有的实现方法中我们都没有自己进行实现，而是调用辅助对象中相应的方法实现，这其实就是一种委托

```kotlin
class MySet<T>(val helperSet: HashSet<T>) : Set<T> {

  override val size: Int
    get() = helperSet.size

  override fun contains(element：T) = helperSet.contains(element)

  override fun containsAll(elements: Collection<T>) = helperSet.containsAll(elements)

  override fun isEmpty() = helperSet.isEmpty()

  override fun iterator() = helperSet.iterator()
}
```

这样写有什么好处呢？

- 既然都是调用辅助对象的方法实现，那还不如直接使用辅助对象得了。如果是所有都是这样那确实没错，但如果大部分方法都是调用辅助对象中的方法，而少部分方法实现由自己来重写，甚至加入一些自己独有的方法，那么 MySet 就会变成一个全新的数据结构

但这种写法也有弊端，如果接口中待实现的方法少还好，要是有几十上百个，这样一个个调用辅助方法去实现的话那就得写哭了。在 Java 中没有解决方案，但在 kotlin 中有，可以通过类委托来实现

```kotlin
// 可以使用 by 关键字来实现类委托
class MySet<T>(val helperSet: HashSet<T>) : Set<T> by helperSet {
  // 可以省略掉所有接口中的方法，因为 helperSet 已经实现了
  // 要对某个方法重新实现只需要重写就好了
}

```

## 委托属性

基本理念很容易理解，但是如何灵活应用是个难点

委托属性的核心思想：将一个属性(字段)的具体实现委托给了 Delegate 类去完成

```kotlin
class MyClass {
  // 当访问 p 属性时，会调用 Delegate 的 getValue 方法
  // 当设置 p 属性时，会调用 Delegate 的 setValue 方法
  var p by Delegate()
}

// 实现 Delegate 类
class Delegate {
  val propValue: Any? = null

  // 第一个参数用于声明该类委托功能可以在什么类中使用
  // 第二个参数是 Kotlin 中的一个属性操作类，用于获取各种属性相关的值
  //  - <*> 这种泛型的写法表示你不知道或者不关心泛型的具体类型，只是为了通过编译的写法而已，类似于 Java 中的 <?>
  operator fun getValue(myClass: MyClass, prop: KProperty<*>): Any? {
    return propValue
  }

  // 不一定需要实现这个方法，如果上面的 propValue 是可变的，那么就需要实现这个方法，否则不需要
  operator fun setValue(myClass: MyClass, prop: KProperty<*>, value: Any?) {
    propValue = value
  }
}
```

## 应用：实现一个自己的 lazy 函数

`lazy` 函数是 Kotlin 标准库中提供的延迟加载函数，当第一次用到该属性时才会去执行初始化逻辑

基本语法如下

```kotlin
// 实际上只有 by 是关键字，lazy 只是一个高阶函数
// lazy 中会创建并返回一个 Delegate 对象，当我们调用 p 时，会调用 Delegate 的 getValue 方法
//   然后 getValue() 又会调用 lazy 函数传入的 lambda 表达式，这样表达式中的代码就得到执行了
//   并且调用 p 属性后得到的值就是 Lambda 表达式中最后一行代码的返回值
val p by lazy {}
```

实现

```kotlin
class Later<T>(val block: () -> T) {
  var value: Any? = null

  operator fun getValue(thisRef: Any?, property: KProperty<*>): T {
    if (value == null) {
      value = block()
    }
    return value as T
  }
}

// 为了让用法更加类似于 lazy，最好再定义一个顶层函数
fun <T> later(block: () -> T) = Later(block)
```

使用

```kotlin
val uriMatcher by later {
  val matcher = UriMatcher(UriMatcher.NO_MATCH)
  // ...

  matcher
}
```