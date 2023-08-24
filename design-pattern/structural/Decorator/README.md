# Decorator

装饰者模式是在不改变原对象的基础上，通过对其进行包装拓展（添加属性或者方法）使原对象可以满足用户更复杂的需求

## 例子

有一个表单，表单有姓名，地址、年龄等等输入框，当用户点击输入框时，如果输入框输入的内容有限制，则会在其后面提示

现在有了新的需求，默认输入框上显示一行提示文案，当用户点击输入框时文案消失

```ts
// 输入框
const telInput = document.getElementById('tel_input')
// 内容有限制提示文案元素
const telWarnText = document.getElementById('tel_warn_text')
// 提示输入元素
const telDemoText = document.getElementById('tel_demo_text')
// 点击输入框时隐藏提示文案
telInput.onclick = function() {
    // 如果输入框输入的内容有限制，则会在其后面提示
    telWarnText.style.display = 'inline-block'
    // 隐藏提示文案
    telDemoText.style.display = 'none'
}
```

如果照着上面的方法一个个改那是一件很可怕的事情，此时我们就需要用到装饰者模式

- 原有的功能已经不能满足用户的需求了。需要为原有功能添砖加瓦

```ts
// 装饰者
const decorator = function(id: string, fn: Function) {
    const input = document.getElementById(id)
    // 若已经有绑定事件
    if(input.onclick) {
        // 缓存旧的事件
        const oldClickFn = input.onclick
        input.onclick = function() {
            // 执行原来的回调
            oldClickFn()
            // 执行新的回调
            fn()
        }
    } else {
        input.onclick = fn
    }
}

// 使用
const hiddenElement = (id: string) => {
    document.getElementById(id).style.display = 'none'
}

// 电话输入框功能装饰
decorator('tel_input', hiddenElement('tel_demo_text'))
// 姓名输入框功能装饰
decorator('name_input', hiddenElement('name_demo_text'))
// 电话输入框功能装饰
decorator('address_input', hiddenElement('address_demo_text'))

```

## AOP

AOP 是一种可以通过预编译方式和运行期动态代理实现在不修改源代码的情况下给程序动态统一添加功能的一种技术。

```ts
Function.prototype.before = function(fn) {
    const self = this
    
    return function(...args: any[]) {
        fn.apply(new self(), args)

        return self.apply(new self(), args)
    }
}

Function.prototype.after = function(fn) {
    const self = this

    return function(...args: any[]) {
        self.apply(new self(), args)

        return fn.apply(new self(), args)
    }
}

```

> 装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。

## 插件式表单校验

插件式表单校验，在提交前校验参数

```ts
Function.prototype.before = function(fn: Function) {
    const self = this

    return function(...args: any[]) {
        if(fn.apply(this, args) === false){
            return
        }

        return self.apply(this, args)
    }
}

const validate = function() {
    // 获取参数
    const params = {
        username: 'xxx',
        password: ''
    }

    if(params.username === ''){
        console.log('用户名无效')
        return false
    }
    if(params.password === ''){
        console.log('密码无效')
        return false
    }
}

const submit = function() {
    // 提交参数到后端
}
// 使用装饰器模式为 submit 事件添加前置校验
submit = submit.before(validate)
// 提交表单
submit() // > 密码无效
```

## 总结

一般有两种方式给一个类或对象增加行为

- 继承：静态的，用户无法控制增加行为的方式和时机

- 关联：将一个类的对象嵌入另一个对象，由另一个对象决定是否调用嵌入对象的行为以便于扩展自身的行为，这个嵌入的对象就叫装饰者（Decorator）

[参考](https://tsejx.github.io/javascript-guidebook/design-patterns/structual/decorator)
