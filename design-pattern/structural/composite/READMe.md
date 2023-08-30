# composite

组合模式（又称部分-整体模式）：将对象组合成树形结构以表示「部分整体」的层次结构

- 组合模式使得用户对单个对象和组合对象的使用具有一致性

## 特点

- 表示 “部分-整体” 的层次结构，生成 "树叶型" 结构；
- 一致操作性，树叶对象对外接口保存一致（操作与数据结构一致）；
- 自上而下的的请求流向，从树对象传递给叶对象；
- 调用顶层对象，会自行遍历其下的叶对象执行

![Alt text](/design-pattern/structural/composite/assets/image.png)

## 例子

为了强化首页用户体验，经理准备在用户首页添加一个新闻模块

- 新闻内容根据用户平时关注的内容挖掘的
  - 有的人是文字新闻
  - 有的人是图片新闻
  - 有的人是一个直播链接
  - ...

这么多需求盲目去写代码是不可取的，否则可能需要陷入代码重构

对以上需求分析可以发现，需求中的新闻大致可以分为互相独立的几种类型，而对某类新闻做修改又不会影响到其他类新闻，所以可以将每一类新闻抽象成面向对象中的一个类，这样就不需要担心后续修改会影响到其他类了

- 这就需要用到组合模式

组合模式要求接口要统一，在 JavaScript 中可以通过继承同一个虚拟类来实现

```ts
// 虚拟类
const News = function() {
    // 子组件容器
    this.children = []
    // 当前组件元素
    this.element = null
}
News.prototype = {
    init: function() {
        throw new Error('请重写你的方法')
    },
    add: function() {
        throw new Error('请重写你的方法')
    },
    getElement: function() {
        throw new Error('请重写你的方法')
    },
}
```

为什么要在虚拟父类中声明一些特权变量?

- 虚拟类通常是定义但不实现的，但是我们在虚拟类的构造函数定义两个变量是因为后面的所有继承子类都需要声明这两个变量，为简化子类我们可以将这两个变量提前声明在父类中

组合模式还需要注意层级的问题，不仅仅是单层级的，例如

- 需求中将图片新闻和文字新闻放在一行就是需要将组合后的整体作为一个部分继续组合
- 在拆分整体后还需要确定他们的层级关系，例如最顶层是一个新闻模块的容器，再往下是每一行新闻成员集合，每一行还可能有新闻的组合体，最后一层里面的成员就是新闻对象

新闻容器

```ts
// 容器类构造函数
const Container = function(id: string, parent: any){
    // 构造函数继承父类
    News.call(this)
    // 模块 id
    this.id = id
    // 模块的父容器
    this.parent = parent
    // 构建方法
    this.init()
}

// 寄生式继承父类原型方法
inheritPrototype(Container, News)
// 构造方法
Container.prototype.init = function() {
    this,element = document.createElement('ul')
    this,element.id = this.id
    this.element.className = 'new-container'
}
// 添加子元素方法
Container.prototype.add = function(child: any) {
    // 在子元素容器中插入子元素
    this.children.push(child)
    // 插入当前组件元素树中
    this.element.appendChild(child.getElement())
    return this
}
// 获取当前元素方法
Container.prototype.getElement = function() {
    return this.element
}

// 下一层级的行成员集合类以及后面的新闻组合体的实现也类似
const Item = function(className = ''){
    // 构造函数继承父类
    News.call(this)
    this.className = className
    // 构建方法
    this.init()
}

// 寄生式继承父类原型方法
inheritPrototype(Item, News)
// 构造方法
Item.prototype.init = function() {
    this,element = document.createElement('li')
    this.element.className = this.className
}
// 添加子元素方法
Item.prototype.add = function(child: any) {
    // 在子元素容器中插入子元素
    this.children.push(child)
    // 插入当前组件元素树中
    this.element.appendChild(child.getElement())
    return this
}
// 获取当前元素方法
Item.prototype.getElement = function() {
    return this.element
}

const NewsGroup = function(className = ''){
    // 构造函数继承父类
    News.call(this)
    this.className = className
    // 构建方法
    this.init()
}

// 寄生式继承父类原型方法
inheritPrototype(NewsGroup, News)
// 构造方法
NewsGroup.prototype.init = function() {
    this,element = document.createElement('div')
    this.element.className = this.className
}
// 添加子元素方法
NewsGroup.prototype.add = function(child: any) {
    // 在子元素容器中插入子元素
    this.children.push(child)
    // 插入当前组件元素树中
    this.element.appendChild(child.getElement())
    return this
}
// 获取当前元素方法
NewsGroup.prototype.getElement = function() {
    return this.element
}
```

新闻类

- 不能拥有子类

```ts
const ImageNews = function(url: string, href: string, className:string) {
    // 构造函数继承父类
    News.call(this)
    this.url = url
    this.href = href    
    this.className = className
    // 构建方法
    this.init()
}

// 寄生式继承父类原型方法
inheritPrototype(ImageNews, News)
// 构造方法
ImageNews.prototype.init = function() {
    this,element = document.createElement('a')
    const img = new Image()
    img.src = this.url
    this.element.appendChild(img)
    this.element.className = `image-news ${this.className}` 
    this.element.href = this.href
}
// 空实现
NewsGroup.prototype.add = function(child: any) {}
// 获取当前元素方法
NewsGroup.prototype.getElement = function() {
    return this.element
}

// 其他新闻类也类似
// ... 

```

创建新闻模块

```ts
const news1 = new Container('news', document.body)
news1.add(
    new Item('normal').add(
        new IconNews('梅西不拿金球也伟大', '#', 'video')
    ).add(
        new Item('normal').add(
            new NewsGroup('has-img').add(
                new ImageNews('img/1.jpg', '#', 'small')
            ).add(
                new EasyNews('从 240 斤胖子变成型男', '#')
            )
        )
    )
    // ... 继续搭建树形结构即可
)
```
