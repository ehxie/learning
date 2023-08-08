# simple factory(简单工厂模式, 又叫静态工厂方法)

- 由工厂对象决定某一类产品对象类的实例，主要用来创建同一类对象的实例
- 就像是一位魔术师，可以变出你想要的礼物，至于怎么变，用户无须知道

## 场景

1.登录模块

- 当用户输入不符合规范就自定义个警示框警示一句：“用户名不能多于16个数字或字母”

```ts
const LoginAlert = function(text: string) {
    this.content = text
}
LoginAlert.prototype.show = function(){
    // 显示警示框
}
const uerNameAlert = new LoginAlert("用户名不能多于16个数字或字母")
```

需求变动

- 当用户输入密码错误时也提示：“输入的密码不正确”, 但需要在警示框中添加一个注册按钮

```ts
// 得重新创建一个类了(不同的类型多了个按钮)
const loginConfirm = function (text: string) {
    this.content = text
}
loginConfirm.prototype.show = function () {
    // 显示确认框
}
const loginFailConfirm = new loginConfirm ("输入的密码不正确")
```

需求变动

- 登录成功后弹出一个自定义提示框，除了有确定和取消按钮外，还需要提示“欢迎回来，请输入您今天的心情吧！”

```ts
// 又是一个新的类
const LoginPrompt = function(text: string){
    this.content = text
}

LoginPrompt.prototype.show = function(){
     // 显示提示框
}
```

重点：当其他人想复用你的提示框功能时

- 直接提供三个类别人在使用时还得去找一下是哪个，最好就是封装到一个函数里，别人用时只需要记住该函数，如何通过该函数创建所需要的对象即可，这就是简单工厂模式。

> 像是魔术师为你变礼物，你不需要魔术师是怎么变的，你只需要有这位魔术师即可，如何找到他就可以帮你变出你想要的东西

```ts
// 简单工厂
const PopFactory = function(name: string, text: string){
    switch(name){
        case 'alert':
            return new LoginAlert(text);
        case 'confirm':
            return new LoginConfirm(text);
        case 'prompt':
            return new LoginPrompt(text);
    }
}
```

类相同的地方可以提取出来共用，允许有不同（创建相似的对象

- 通过创建一个简单对象后对对象进行拓展，不相似处做针对性处理即可

```ts
const PopFactory = function(name: string, text: string){
    const o = new Object()
    // 公共
    o.content = text
    o.show = function (){
        // 显示方法
    }
    // 不同
    if(type === 'alert'){
        // 警示框差异部分
    }
    if(type === 'prompt'){
        // 提示框差异部分
    }
    if(type === 'confirm'){
        // 确认框差异部分
    }
}
```

以上两种简单工厂的实现各有优缺点，第一种是通过类实例化对象来实现的，第二种是通过创建一个新对象然后包装增强其属性和功能来实现的。

- 如果这些类都继承于同一个父类，那么第一种方式创建的对象可以使用父类上的公共方法，而第二种创建的方式类似于寄生，创建的是一个新的个体，使用父类方法就不能复用了
如何使用还是具体问题具体分析，简单工厂只是提供了一个魔术师，至于如何变魔术，那完全取决于你
