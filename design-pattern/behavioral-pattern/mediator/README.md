# mediator

中介者模式是一种行为设计模式， 能让你减少对象之间混乱无序的依赖关系。 该模式会限制对象之间的直接交互， 迫使它们通过一个中介者对象进行合作。

## 例子

### 问题

假设有一个修改用户资料的对话框，表单由各种控件组成：文本框(TextField)、复选框(Checkbox)和按钮(Button)等

- 某些表单元素可能会直接进行互动，例如选中「我有一只狗」

![img](/design-pattern/behavioral-pattern/mediator/assets/image.png)

表单元素中如果实现业务逻辑，则很难复用这些表单元素

- 元素间存在许多关联。 因此， 对某些元素进行修改可能会影响其他元素。

![Alt text](/design-pattern/behavioral-pattern/mediator/assets/image1.png)

### 解决

中介者模式建议停止组件间的直接交流并使其互相独立

- 这些组件必须调用特殊的中介者对象，通过中介者对象重定向调用行为，以间接的方式进行合作
- 组件仅依赖于一个中介者类，无需与多个其他组件相耦合

在上面例子中，对话框(Dialog)类本身作为中介者，其很可能已知自己所有的子元素，因此无需在该类中引入新的依赖关系

![Alt text](/design-pattern/behavioral-pattern/mediator/assets/image2.png)

绝大部分主要的修改都在实际表单元素中进行

- 提交按钮
  - 之前当用户点击后，它必须对所有表单元素数值进行校验
  - 现在唯一的工作就是将点击事件通知给对话框，对话框收到通知后就可以自行校验数值或者将任务委派给各元素，这样依赖按钮就不在与多个表单元素相关联，而仅依赖于对话框类
- 还可以为所有类型的对话框抽取通用接口，进一步削弱其依赖性
  - 接口中将声明一个所有表单元素都能使用的通知方法，可用于将元素中发生的事件通知给对话框，这样一来所有实现了该接口的对话框都能使用这个提交按钮了

采用这种方式，中介者模式让你能在单个中介者对象中封装多个对象间的复杂关系网

- 类所拥有的依赖关系越少，就越易于修改、扩展和复用

## 结构

1.组建(Component)：各种包含业务逻辑的类

- 每个组件都有一个指向中介者的引用，该引用被声明为中介者接口类型
- 组件不知道中介者实际所属的类，因此可以通过将其连接到不同的中介者以使其能够在其他程序中复用

2.中介者(Mediator)接口：声明与组件交流的方法，通常仅包括一个通知方法

- 组件可将任意上下文(包括自己的对象)作为该方法的参数，只有这样接收组件和发送者组件之间才不会耦合

3.具体中介者(ConcreteMediator)：封装了多种组件间的关系

- 具体中介者通常会保存所有组件的引用并对其进行管理，甚至有时会对其生命周期进行管理

4.组件并不知道其他组件的情况

- 组件内部发送事件，只能通知中介者，中介者收到通知后能轻易地确定发送者

> 对于组件来说，中介者看上去是个黑箱。
>
> - 发送者不知道最终会由谁来处理自己的请求，接收者也不知道最初是谁发出了请求

![Alt text](/design-pattern/behavioral-pattern/mediator/assets/image3.png)

## 代码示例

![Alt text](/design-pattern/behavioral-pattern/mediator/assets/image4.png)

```ts
// 中介者接口声明了一个能够让组件将各种事件通知给中介者的方法
// 中介者可以对这些事情做出相应并将执行工作传递给其他组件
interface Mediator {
    notify: (sender: Component, event: string)
}

// 具体中介者类可解开各组件之间相互交叉的连接关系并将其转移到中介者中
class AuthenticationDialog implements Mediator {
    private title: string
    private loginOrRegisterCheckbox: Checkbox
    private loginUsername: Textbox
    private loginPassword: Textbox
    private registrationUsername: Textbox
    private registrationPassword: Textbox
    private registrationEmail: Textbox
    private confirmButton: Button
    private cancelButton: Button

    constructor() {
        // 创建所有组件对象并将当前中介者传递给其构造函数以建立连接
    }

    // 当组件中有事件发生时，它会通知中介者
    // 中介者接受到事件后可自行处理也可以将请求传递给另一个组件
    notify(sender, event) {
        if(sender === this.loginOrRegisterCheckbox && event === 'check'){
            if(this.loginOrRegisterCheckbox.checked){
                title = '登录'
                // 显示登录表单组件
                // 隐藏注册表单组件
            } else {
                title = '注册'
                // 显示注册表单组件
                // 隐藏登录表单组件
            }

            if(sender === this.confirmButton && event === 'click') {
                if(this.loginOrRegister.checked) {
                    // 尝试找到使用登录信息的用户
                    if(!found){
                        // 在登录字段上方显示错误信息
                    }
                } else {
                    // 使用注册字段中的数据创建用户账号
                    // 完成用户注册工作
                }
            }
        }
    }
}

// 组件会使用中介者接口与中介者进行交互
// 因此只需要将他们与不同的中介者连接起来，就能在其他情况中使用这些组件了
class Component {
    dialog: Mediator

    constructor(dialog: Mediator) {
        this.dialog = dialog
    }

    click() {
        this.dialog.notify(this, 'click')
    }

    keypress() {
        this.dialog.notify(this, 'keypress')
    }
}


// 具体组件之间无法进行交流
// 它们能做的就是向中介者发送通知
class Button extends Component {
    // ...
}

class Textbox extends Component {
    // ...
}

class Checkbox extends Component {
    // ...
    check() {
        this.dialog.notify(this, 'check')
    }
}
```

## 适用场景

当一些对象和其他对象紧密耦合以致难以对其进行修改时， 可使用中介者模式。

- 该模式让你将对象间的所有关系抽取成为一个单独的类， 以使对于特定组件的修改工作独立于其他组件。

当组件因过于依赖其他组件而无法在不同应用中复用时， 可使用中介者模式。

- 应用中介者模式后， 每个组件不再知晓其他组件的情况。 尽管这些组件无法直接交流， 但它们仍可通过中介者对象进行间接交流。 如果你希望在不同应用中复用一个组件， 则需要为其提供一个新的中介者类。

如果为了能在不同情景下复用一些基本行为， 导致你需要被迫创建大量组件子类时， 可使用中介者模式。

- 由于所有组件间关系都被包含在中介者中， 因此你无需修改组件就能方便地新建中介者类以定义新的组件合作方式。

## 优缺点

优点：

- 单一职责原则。 你可以将多个组件间的交流抽取到同一位置， 使其更易于理解和维护。
- 开闭原则。 你无需修改实际组件就能增加新的中介者。
- 你可以减轻应用中多个组件间的耦合情况。
- 你可以更方便地复用各个组件。

缺点：

- 一段时间后， 中介者可能会演化成为[上帝对象](https://baike.baidu.com/item/%E4%B8%8A%E5%B8%9D%E5%AF%B9%E8%B1%A1)。
  - 上帝对象：一个对象承担了太多职责

## 总结

中介者可以让有相似结构的组件复用起来更简单，主要的做法就是把写在组件中的逻辑都抽取到了一个中介者类中，中介者类请负责这些逻辑的实现，复用组件时可以创建一个新的中介者与组件建立连接，此时就完成了对组件的复用，具体事件的逻辑由具体中介者实现

## 参考

<https://refactoringguru.cn/design-patterns/mediator>
