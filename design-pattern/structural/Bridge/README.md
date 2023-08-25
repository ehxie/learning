# Bridge

抽象公用的部分，然后将实现与抽象通过桥接方法链接在一起，实现解耦

特点：

- 将实现层（如元素绑定事件）与抽象层（如修饰页面 UI 逻辑）解耦分离，使两部分独立变化。避免需求的改变造成对象内部的修改，体现了面向对象对拓展的开放和对修改的关闭。

## 例子

在页面中的一些小小细节的改变常常因逻辑相似导致大片臃肿的代码

需求：在用户信息部分添加一些鼠标滑过的特效，不同的信息特效不一样

```ts
// 获取所有用户信息元素
const spans = document.getElementByTagName('span')
// 为用户名绑定特效
spans[0].onmouseover = function() {
    this.style.color = 'red'
    this.style.background = '#ddd'
}
spans[0].onmouseout = function() {
    this.style.color = '#333'
    this.style.background = '#f5f5f5˛'
}
// 为等级绑定特效
spans[1].onmouseover = function() {
    this.getElementByTagName('strong').style.color = 'red'
    this.getElementByTagName('strong').style.background = '#ddd'
}
spans[0].onmouseout = function() {
    this.getElementByTagName('strong').style.color = '#333'
    this.getElementByTagName('strong').style.background = '#f5f5f5˛'
}
// ...
```

以上代码很冗余，没有对相同的逻辑做抽象提取处理

```ts
// 抽象
// 与事件中的 this 解耦
function changeColor(dom: HTMLElement, color: string, bg: string) {
    dom.style.color = color
    dom.style.background = background 
}

```

完成抽象后剩下的就是对元素的事件绑定了，仅仅知道元素事件绑定与抽象提取的设置样式方法 changeColor 还是不够的，需要用一个方法把他们连接起来

- 这个方法就是桥接模式

  - 就像从北京开往沈阳，需要找到一条连接北京与朝阳的公路

对于事件的桥接方法，我们可以用一个匿名函数来代替，否则直接将 changeColor 作为事件的回调函数，那刚才的解耦就白做了，例如以下示例

- changeColor 中的 dom 实质上是事件回调函数中的 this

```ts
const spans = document.getElementByTagName('span')
spans[0].onmouseover = function() {
    // 通过这个回调函数。我们将获取到的 this 传递到 changeColor 函数中，即可完成需求 
    changeColor(this, 'red', '#ddd')
}
// 其他的也一样
```

## 例子：多元化对象

写一个 canvas 跑步游戏，对于游戏中的人、小精灵、小球等一系列实物都有动作单元，而他们每个动作实现起来方式都是统一的

- 人、精灵和球的运动其实就是位置坐标 x 和 y 的变化
- 球的颜色与精灵的色彩的绘制方式都相似
- ...

我们可以将这些多维变化部分，提取出来作为一个抽象运动单元进行保存，而当我们创建实体时，将需要的每个抽象动作单元通过桥接，链接在一起运作

- 这样它们之间不会互相影响且该方式降低了它们之间的耦合

```ts
// 多维变量类
// 运动单元
function Speed(x: number, y: number) {
    this.x = x
    this.y = y
}

// 着色单元
function Color(cl: string) {
    this.color = cl
}
Color.prototype.draw = function() {
    console.log('绘制色彩')
}

// 变形单元
function Shape(sp: string) {
    this.shape = sp
}
Shape.prototype.change = function() {
    console.log('改变形状')
}

// 说话单元
function Speak(wd: string) {
    this.word = wd
}
Speak.prototype.say = function() {
    console.log('书写字体')
}
// 抽象部分已经完成

// 创建一个球类，可以运动和染色
function Ball(x: number, y: number, c: string) {
    // 实现运动单元
    this.speed = new Speed(x, y)
    // 实现着色单元
    this.color = new Color(c)
}
Ball.prototype.init = function() {
    // 实现运动
    this.speed.run()
    // 实现着色
    this.color.draw()
}

// 创建一个人物类，可以运动和说话
function Person(x: number, y: number, word: string) {
    this.speed = new Speed(x, y)
    this.font = new Speak(word)
}
Person.prototype.init = function() {
    this.speed.run()
    this.font.say()
}

// 创建一个精灵类，可以运动、着色和改变形状
function Elf(x: number, y: number, shape: string, color: string) {
    this.speed = new Speed(x, y)
    this.color = new Color(color)
    this.shape = new Shape(shape)
}
Elf.prototype.init = function() {
    this.speed.run()
    this.color.draw()
    this.shape.change()
}

// 实例化一个人
const p = new Person(10, 12, 16)
p.init()
```