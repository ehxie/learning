# Factory method

别名：虚构造器（Virtual Constructor）

## 意图

定义一个用于创建对象的接口，让子类决定实例化哪一个类

- 使一个类的实例化延迟到其子类

## 适用性

1. 一个类不知道它所必须创建的对象的类的时候
2. 当一个类希望由它的子类来指定它所创建的对象时
3. 当类将创建对象的职责委托给多个帮助子类中的某一个，并且你希望将哪一个子类是代理者这一信息局部化的时候。

## 使用场景

老板跟你说：小h，我们要做一批广告投放的需求，关于计算机培训的。

- 一批是 Java 的，用绿色字体
- 一批是 PHP 的，用黄色字体

于是便写下了以下代码

```ts
// Java
const Java = (el: HTMLElement, content: string) => {
  const div = document.createElement('div')
  div.innerHTML = content
  div.style.color = 'green'
  el.appendChild(div)
}

// PHO
const PHP = (el: HTMLElement, content: string) => {
  const div = document.createElement('div')
  div.innerHTML = content
  div.style.color = 'yellow'
  el.appendChild(div)
}
```

过了一会老板又说：小h ，之前广告效果不错，我们有来了新的业务需求，这次是关于 JavaScript 的，要求背景色是粉色

于是又写下以下代码...

```ts
// JavaScript
const JavaScript = (el: HTMLElement, content: string) => {
  const div = document.createElement('div')
  div.innerHTML = content
  div.style.background = 'pink'
  el.appendChild(div)
}
```

写到这里，对于代码质量有一定追求的小h 认为这样写下去无法应对业务不断扩张的问题，会越来越难以维护。

- 于是便想起了以前学到的简单工厂模式，这样以后做创建广告时只需要记住工厂，而不需要记住实际的类

```ts
type JobType = 'Java' | 'PHP' | 'JavaScript'
function JobFactory(type: JobType,el: HTMLElement, content: string) {
  switch(type) {
    case 'Java':
      return new Java(content)
    case 'PHP':
      return new PHP(content)
    case 'JavaScript':
      return new JavaScript(content)
  }
}

// 测试
const container = document.getElementById('container')
JobFactory('JavaScript', container, 'JavaScript 天下第一')
```

刚写完简单工厂的小h 获得了满满的成就感，此时耳边又响起：小h 又来了一批 UI 学科，红色边框...

此时大H 见状过来问小h 怎么了，小h 说：需求总是不断变更，一开始需求简单直接创建对象即可，后来需求多了用简单工厂方法重构，现在又变了，不仅仅要添加类，还需要修改工厂函数。

大H 会心一笑说道：需求变更是正常的，我们有更好的模式可以来应付，你可以试试工厂方法，这样以后需要一个类，只需要添加这个类就行了，其他的不用担心

## 工厂方法

### 是什么？

工厂方法将创建对象的工作推迟到子类中，这样核心类就成了抽象类。不过在 JavaScript 中并没有抽象类这一说，我们只需要关注该模式的核心思想就好了

- 为了安全起见，我们才用安全模式类，将创建对象的基类放在工厂方法类的原型中即可

### 安全模式类

安全模式类是为了屏蔽对这些类的错误使用造成的错误（有点绕，举个例子）

```ts
// 一个 Demo 类
const Demo = function(){}
Demo.prototype.show = () => {
  console.log('show')
}
// 正常使用
const d1 = new Demo()
d1.show() // > show
// 错误使用
const d2 = Demo()
d2.show() // Uncaught TypeError: Cannot read property 'show' of undefined
```

> 当其他人不知道这个一个类事可能就会犯该错误

使用安全模式

```ts
const Demo = function(){
  // 如果不是通过 new 执行的，通常情况下都是在全局作用域中执行，那么 this 就会指向 window（通常在浏览器环境的情况下）
  if(!(this instanceof Demo )){
    return new Demo()
  }
}
```

## 安全的工厂方法

```ts
type JobType = 'Java' | 'PHP' | 'JavaScript'
const Factory = function(type: JobType, el: HTMLElement, content: string){
  if(this instanceof Factory) {
    return new this[type](el, content)
  }else{
    return new Factory(type, el, content)
  }
}

Factory.prototype = {
  Java: function(el: HTMLElement, content: string) {
    // ...
  },
  PHP: function(el: HTMLElement, content: string) {
    // ...
  },
  JavaScript: function(el: HTMLElement, content: string) {
    // ...
  },
  UI: function(el: HTMLElement, content: string) {
    // ...
  },
}
```

之后每添加一个新的需求，只需要往原型上添加一个类即可
