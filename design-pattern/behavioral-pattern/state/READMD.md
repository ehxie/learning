# State

状态模式：当一个对象的内部状态发生改变时，会导致其行为发生改变，这看起来像是改变了对象

## 例子

要开展一个最美图片评选活动，需要进行投票征集，根据网友的投票，每张图片有以下几种效果

- 要实现这样的需求要写很多分支判断，如果后期要增删什么内容，那将很难进行

```ts
function showResult(result: number) {
    if(result === 0) {
        // result 0
    } else if(result === 1) {
        // result 1
    } else if(result === 2) {
        // result 2
    } else if(result === 3) {
        // result 3
    }
}
```

需要一种方法来减少代码中的条件判断语句，并且使每种判断情况独立存在，更加方便管理

- 状态模式就很适合这种情况：对于分支条件内部独立结果的管理，每一种条件昨作为内部的一种状态，面对不同判断结果，其实就是选择对象内的一种状态

## 状态对象的实现

将不同的判断结果封装在状态对象内，然后该状态对象返回一个可被调用的接口，用于调用状态对象内部某种方法

```ts
const ResultState = function() {
    const States = {
        state0: function() {
            // 处理结果0
        },
        state1: function() {
            // 处理结果1
        },
        state2: function() {
            // 处理结果2
        },
        state3: function() {
            // 处理结果3
        },
        state4: function() {
            // 处理结果4
        },
    }
    function show(state: StateType) {
        States[state] && States[state]()
    }
    return {
        show
    }
}

```

> 状态模式主要是将条件判断的不同结果转化为状态内部的状态，既然是状态对象内部状态，所一般作为状态对象内部状态的私有变量，然后提供一个能够调用状态对象内部状态的接口方法对象

## 例2：超级玛丽

超级玛丽要吃蘑菇，就需要会跳起，顶出墙壁里面的蘑菇; 想跳到悬崖的另一边，就需要跳起; 想避免被前面的乌龟咬到，就需要开枪将其打掉; 想躲过炮弹，就需要蹲下; 时间不够了就需要加速奔跑...

- 开枪、跳跃、蹲下、奔跑都是一个个的状态，如果用 if 或者 switch 判断语句写代码这将会很难维护，有时候需要跳跃开枪、蹲下开枪，这些组合的状态用 if 或者 switch 去实现将会在无形中增加成本

如果是用 if 语句实现

```ts
// 单动作条件判断，没增加一个动作就需要增加一个判断
let lastAction = ''
function changeMarry(action: Action) {
    if(action === 'jump') {
        // 跳跃
    }else if(action === 'move') {
        // 移动
    }else {
        // 默认情况
    }
    lastAction = action
}

// 复合东多，对条件判断的开销是翻倍的
let lastAction1 = ''
let lastAction2 = ''
function changeMarry(action1: Action, action1: Action) {
    if(action1 === 'move' && action2 === 'shoot'){
        // 移动中射击
    }else if(action1 === 'jump' && action2 === 'shoot'){
        // 跳跃中射击
    }else if(action === 'jump') {
        // 跳跃
    }else if(action === 'move') {
        // 移动
    }else {
        // 默认情况
    } 
    lastAction1 = action1
    lastAction2 = action2
}
```

用状态模式实现

```ts
const MarryState = function() {
    // 内部状态私有变量
    const _currentState = {}
    // 动作与状态方法映射
    const states = {
        jump: function() {
            // 跳跃
        },
        move: function() {
            // 移动
        },
        shoot: function() {
            // 射击
        },
        squat: function() {
            // 蹲下
        },
    }
    // 动作控制类
    const Action = {
        // 改变状态方法
        changeState: function(...actions: State[]) { // 组合动作通过传递多个参数实现
            // 重置内部状态
            _currentState = {}
            // 如果有动作则添加动作
            actions.forEach(action => {
                _currentState[action] = true
            })
            return this
        },
        // 执行动作
        executeAction: function() {
            Object.keys(_currentState).forEach(state => {
                states[state] && states[state]()
            })
        }
    }

    return {
        change: Action.changeState,
        executeAction: Action.executeAction
    }
}


// 使用
MarryState()
    .change('jump', 'shoot') // 添加跳跃和射击的动作
    .executeAction()         // 执行动作
    .change('shoot')         // 添加射击动作
    .executeAction()         // 执行动作

// 为了更加安全我们还是实例化一下这个状态类，这样我们使用的就是对状态类的复制品
const marry = new MarryState()
marry
    .change('jump', 'shoot') // 添加跳跃和射击的动作
    .executeAction()         // 执行动作
    .change('shoot')         // 添加射击动作
    .executeAction()         // 执行动作
```

## 总结

通过状态模式，可以对条件判断中的每一种情况独立管理，解决条件分支之间的耦合问题