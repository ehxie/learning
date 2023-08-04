## 面向对象

面向对象编程就是将你的需求抽象成一个对象，然后根据这个对象分析其特征(属性)和动作(方法), 这个对象我们称之为类。

- 面向对象的特点：封装、继承、多态

### 封装

- 私有变量
  - 利用块级作用域的特性
  - 利用闭包（静态私有变量）

### 继承

```ts
// 父类
function Super(id){
    this.arr = [1,2,3]
    this.id = id
}
// 子类
function Base(){
}
```

- 类继承
  - 父类中的引用数据类型被所有子类共享

```ts
Base.prototype = new Super(1)
```

- 构造函数继承
  - 父类的所有属性和方法都被复制了一遍, 但父类原型上的方法都没有办法访问到

```ts
function Base(id){
    Super.call(this, id)
}
```

- 组合继承
  - 综合了类继承和构造函数继承的特点, 但父类构造函数执行了两遍

```ts
function Base(){
    Super.call(this)
}
Base.prototype =  new Super();
```

原型继承：

- 与类继承相似

```ts
function inheritObject(o){
    // 声明一个过渡函数对象
    function F(){}
    // 过渡对象的原型继承父对象
    F.prototype = o;
    // 返回过渡对象的一个实例，该实例的原型继承了父对象
    return new F()
}
```

寄生式继承:

- 对原型继承的二次封装

```ts
var book = {
  name: 'js book',
  alikeBook: ['css', 'html']
}
function createBook(obj){
  var o = new inheritObject(obj)
  o.getName = function(){
    console.log(name)
  }
  return o
}
```

寄生组合式继承：

```ts
function inheritPrototype(subClass, superClass){
  // 复制父类的原型
  var p = inheritObject(superClass.prototype)
  // 修正因为重写子类原型导致子类的 constructor 属性被修改
  p.constructor = subClass
  // 设置子类的原型
  subClass.prototype = p
}
```

### 多继承

JS 通过原型链进行继承，但是只有一条原型链，要实现多继承还是有一些局限性的

- 对对象的属性进行复制

```ts
// 多个对象就把 source 改造成 ...sources 稍作修改即可
var extend = function(target, source) {
  for(var property in source){
    // 浅复制，可以借助第三方库实现深复制
    target[property] = source[property]
  }
  return target
}
```
