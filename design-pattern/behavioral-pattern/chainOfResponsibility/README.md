# Chain Of Responsibility

责任链模式：解决请求的发送者与接受者之间的耦合，通过责任链上的多个对象对分解请求流程，实现请求在多个对象之间传递，知道最后一个对象完成请求的处理

## 适用场景

- 当程序需要使用不同方式处理不同种类请求， 而且请求类型和顺序预先未知时， 可以使用责任链模式。
  - 该模式能将多个处理者连接成一条链。 接收到请求后， 它会 “询问” 每个处理者是否能够对其进行处理。 这样所有处理者都有机会来处理请求。

## 结构

![Alt text](/design-pattern/behavioral-pattern/chainOfResponsibility/assets/image.png)

```ts
/**
 * The Handler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
interface Handler {
    setNext(handler: Handler): Handler;

    handle(request: string): string;
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
abstract class AbstractHandler implements Handler
{
    private nextHandler: Handler;

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        // Returning a handler from here will let us link handlers in a
        // convenient way like this:
        // monkey.setNext(squirrel).setNext(dog);
        return handler;
    }

    public handle(request: string): string {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return null;
    }
}

/**
 * All Concrete Handlers either handle a request or pass it to the next handler
 * in the chain.
 */
class MonkeyHandler extends AbstractHandler {
    public handle(request: string): string {
        if (request === 'Banana') {
            return `Monkey: I'll eat the ${request}.`;
        }
        return super.handle(request);

    }
}

class SquirrelHandler extends AbstractHandler {
    public handle(request: string): string {
        if (request === 'Nut') {
            return `Squirrel: I'll eat the ${request}.`;
        }
        return super.handle(request);
    }
}

class DogHandler extends AbstractHandler {
    public handle(request: string): string {
        if (request === 'MeatBall') {
            return `Dog: I'll eat the ${request}.`;
        }
        return super.handle(request);
    }
}

/**
 * The client code is usually suited to work with a single handler. In most
 * cases, it is not even aware that the handler is part of a chain.
 */
function clientCode(handler: Handler) {
    const foods = ['Nut', 'Banana', 'Cup of coffee'];

    for (const food of foods) {
        console.log(`Client: Who wants a ${food}?`);

        const result = handler.handle(food);
        if (result) {
            console.log(`  ${result}`);
        } else {
            console.log(`  ${food} was left untouched.`);
        }
    }
}

/**
 * The other part of the client code constructs the actual chain.
 */
const monkey = new MonkeyHandler();
const squirrel = new SquirrelHandler();
const dog = new DogHandler();

monkey.setNext(squirrel).setNext(dog);

/**
 * The client should be able to send a request to any handler, not just the
 * first one in the chain.
 */
console.log('Chain: Monkey > Squirrel > Dog\n');
clientCode(monkey);
console.log('');

console.log('Subchain: Squirrel > Dog\n');
clientCode(squirrel);
```

## 例子

交互体验优化：用户在输入框输入信息后，在输入框的下面提示出一些备选项，当用户输入完成后，则要对用户输入的信息进行验证等。页面中有很多模块需要用户提交信息，为了增强用户体验，这些输入框大部分需要具备上面两种功能

需求：表单输入框添加事件，做输入提示和输入验证处理，完成后要想服务端发送请求还要在原有页面中创建其他组件，但是具体有哪些输入框还不确定

### 需求分解

完成一个需求要做许多件事，那么可以吧每件事件独立出一个模块对象去处理，这样完整的需求就被分解成一部分一部分独立的模块需求，通过这些对象的分工协作，每个对象只做自己份内的事，无关的事件传到下一个对象去做，直到需求完成

- 这样还可以对每一部分进行单元测试，保证组件对象的处理逻辑的安全性

可以分解为

1. 有的输入框需要绑定 keyup 事件，有的输入框需要绑定 change 事件，即绑定事件是第一部分
2. 创建 XHR 进行异步请求获取数据
3. 对响应数据进行适配，将接受到的数据格式化成可处理的形式
4. 向组件创建器中传入相应数据生成组件

```ts
// 请求模块
const sendData = function(data: SendData, dealType: DealType, dom: HTMLElement) {
    const xhr = new XMLHttpRequest()
    let url = 'v1/getData?mod=userInfo'

    xhr.onload = function(event) {
        // 请求成功
        if(xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304) {
            dealData(xhr.responseText, dealType, dom)
        } else{
            // 请求叔伯
        }
        // 拼接请求
        for(const i in data) {
            url += `&${i}=${data[i]}`
        }
        // 发送请求
        xhr.open('get', url, true)
        xhr.send(null)
    }
}

// 响应数据适配模块
const dealData = function(data: DealData, dealType: DealType, dom: HTMLElement) {
    switch(dealType) {
        case 'sug':
            // 如果数据为数组
            if(Array.isArray(data)){
                // 创建提示框组件
                return createSug(data, dom)
            }
            if(typeof data === 'object' && data !== null) {
                // 将对象转换为数组
                const newData = []
                for(const i in data) newData.push(data[i])
                return createSug(newData, dom)
            }
            return createSug([data], dom)
            break;
        case 'validate':
            // 创建校验组件
            return createValidateResult(data, dom)
            break;
    }
}

// 创建组件模块
const createSub = function(data: CreateSubData, dom: HTMLElement) {
    // 拼接提示语
    const html = data.reduce((p,c)=>{
        return `<li>${c}</li>`
    }, '')
    // 显示提示框
    dom.parentNode.getElementByTagName('ul')[0].innerHTML = html
}

const createValidateResult = function(data:Data, dom: HTMLElement) {
    dom.parentNode.getElementByTagName('span')[0].innerHTML = data
}
```

## 参考

<https://refactoringguru.cn/design-patterns/chain-of-responsibility/typescript/example>
