# observer

观察者模式：定义了一种依赖关系，解决了主体对象与观察者之间功能的耦合

- 对象间一对多的关系：当目标对象 Subject 的状态发送改变时，所有依赖他的对象 Observer 都会得到通知

## 特征

- 一个目标者对象 Subject，游泳方法：添加/删除/通知 Observer
- 多个观察者对象 Observer，拥有方法：接收 Subject 状态变更通知并处理
- 目标对象 Subject 状态变更时，通知所有 Observer

## 代码

```ts
// 目标者
class Subject {
    constructor() {
        this.observers = []
    },
    add(observer: Observer) {
        this.observers.push(observer)
    },
    remover(observer: Observer) {
        this.observers = this.observers.filter(o => o !== observer)
    },
    notify() {
        for(let observer of this.observers) {
            observer.update()
        }
    }
}
// 观察者
class Observer {
    constructor(name) {
        this.name = name 
    },
    update() {
        console.log('更新')
    }
}

// 使用
const subject = new Subject()

const obs1 = new Observer('观察者1')
const obs2 = new Observer('观察者2')

subject.add(obs1)
subject.add(obs2)

// 状态更新时
subject.notify()
```

## 缺点

虽然解耦了对象间的依赖关系，但是不能对事件的通知进行细分管控

- 发布-订阅 模式可以（可以看成进阶版的观察者模式）

## 参考

<https://segmentfault.com/a/1190000019722065>
