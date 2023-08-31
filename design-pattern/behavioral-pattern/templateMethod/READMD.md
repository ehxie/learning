# Template Method

模板方法：父类中定义一组操作算法骨架，而将一些实现的步骤延迟到子类中，使得子类可以不该父类算法结构的同时可以重新定义算法中某些实现步骤

## 例子

目前项目中的提示框样式各异，样式、高度、字体等都不太一致，现在希望把他们统一一下。

- 提示框包含：标题弹出框、左侧确定按钮弹出框、右侧确定按钮弹出框、带有取消按钮弹出框、右侧取消按钮弹出框

解法1：将之前的所有弹出框一个个修改

- 这种方法是最暴力的，但不可靠，工作量大还不好修改

解法2：模板模式

- 写一个弹出框插件，将这些类弹出框封装好，然后在各个页面重新调用就可以了，以后有什么需求变动只需要修改这个插件就可以了

> 模板模式是将多个模型抽象归一化，从中提取抽象出来一个最基本的模板，当然这个模板可作为实体对象也可以作为抽象对象(根据具体需求而定)，然后其他模板只需要继承这个模板方法，也可拓展某些方法。

所以我们要做的就是创建一个基本的提示框类，然后其他提示框类在此基础上拓展即可

```ts
const Alert = function(data: Object) {
    if(!data) return
    // 设置内容
    this.content = data.content
    // 创建提示框面板
    this.panel = document.createElement('div')
    // 创建提示内容组件
    this.contentNode = document.createElement('p') 
    // 创建确定按钮组件
    this.confirmBtn = document.createElement('span')
    // 创建取消按钮组件
    this.closeBtn = document.createElement('b')
    // 为提示框面板添加类
    this.panel.className = 'alert'
    // 为确定按钮添加类
    this.confirmBtn.className = 'a-confirm'
    // 为取消按钮加类
    this.closeBtn.className = 'a-close'
    // 为确定按钮添加文案
    this.confirmBtn.innerHTML = data.confirm || '确定'
    // 为提示内容添加文案
    this.contentNode.innerHTML = data.content 
    // 绑定事件
    this.success = data.success || function() {}
    this.fail = data.fail || function() {}
}

Alert.prototype = {
    init: function() {
        // 生成提示框
        this.panel.appendChild(this.closeBtn)
        this.panel.appendChild(this.contentNode)
        this.panel.appendChild(this.confirmBtn)
        // 插入页面中
        document.body.appendChild(this.panel)
        // 绑定事件
        this.bindEvent()
        // 显示提示框
        this.show()
    },
    bindEvent: function() {
        this.closeBtn.onclick = () => {
            this.fail()
            this.hide()
        }
        this.confirm.onclick = () => {
            this.success()
            this.hide()
        },
    },
    hide: function() {
        this.panel.style.display = 'none'
    },
    show: function() {
        this.panel.style.display = 'block'
    }
}
```

根据模板类创建一个右侧按钮提示框

```ts
const RightAlert = function(data: Object) {
    // 继承基本提示框构造函数
    Alert.call(this, data)
    // 为确认按钮添加 right 类设置位置居右
    this,confirmBtn.className = `${this.confirmBtn.className} right`
}
// 继承基本提示框方法
RightAlert.prototype = new Alert()
```

根据模板类创建一个标题提示框

```ts
const TitleAlert = function(data: Object) {
    Alert.call(this, data)
    // 设置标题内容
    this.title = data.title
    // 创建标题组件
    this.titleNode = document.createElement('h3')
    // 设置标题内容
    this.titleNode.innerHTML = this.title
}

TitleAlert.prototype = new Alert()
// 对基本方法的拓展
TitleAlert.prototype.init = function() {
    // 插入标题
    this.panel.insertBefore(this.titleNode, this.panel.firstChild)
    // 继承基本提示框 init 方法
    Alert.prototype.init.call(this)
}

```

继承类也可以作为模板类：创建带有取消按钮的标题提示框

```ts
const CancelAlert = function(data: Object) {
    TitleAlert.call(this, data)
    this.cancel = data.cancel
    this.cancelBtn = document.createElement('span')
    this.cancelBtn.className = 'cancel'
    this.cancelBtn.innerHTML = this.cancel || '取消'
}
CancelAlert.prototype = new Alert()
CancelAlert.prototype.init = function() {
    TitleAlert.prototype.init.call(this)

}
CancelAlert.prototype.bindEvent = function() {
    TitleAlert.prototype.bindEvent.call(this)
    this.cancelBtn.onclick = () => {
        this.fail()
        this.hide()
    }
}
```

创建提示框

```ts
new CancelAlert({
    title: '提示标题',
    content: '提示内容',
    success: function() {
        console.log('ok')
    },
    fail: function() {
        console.log('cancel')
    }
}).init()
```

## 总结

模板方法的核心在于对方法的重用，将核心方法封装在基类中，让子类继承基类的方法，实现共享。

- 子类必须遵守某些法则，这是对行为的约束，让行为更可靠

模板方法也有缺点，当基类修改时所有子类也会受到影响
