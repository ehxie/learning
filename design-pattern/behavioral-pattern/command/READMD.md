# Command

命令模式: 将请求与实现解耦并封装成独立对象，从而使不同的请求对客户端实现参数化

- 根据不同的请求将方法参数化、延迟请求执行或将其放入队列中，且能实现可撤销操作

## 解决问题

在软件系统中，行为的请求者和实现者通常是一种紧耦合的关系，但在某些场合，比如需要对行为进行记录、撤销、重做或者事物等处理时，这种无法抵御变化的紧耦合的设计就不太合适，就需要使用命令模式将行为的请求者和实现者解耦

从 `行为请求者 ---> 实现者` 到 `行为请求者 ---> 命对象 ---> 实现者`

## 角色

1.发送者(Sender)或称触发者(Invoker)类：负责对请求进行初始化，其中必须包含一个成员变量来存储对于命令对象的引用

- 发送者触发命令，而不想接受者直接发送请求
- 发送者并不负责创建命令对象，通常会通过构造函数从客户端获取预先生成的命令

2.命令(Command)接口：通常仅声明一个执行命令的方法

3.具体命令(Concrete Command): 实现各种类型的请求

- 具体命令自身并不完成工作，而是将调用委派给一个业务逻辑对象（但为了简化代码，这些类可以合并）
- 接收对象执行方法所需参数可以声明为具体命令的成员变量，可以将命令对象设为不可变，仅允许通过构造函数对这些成员变量进行初始化

4.接收者(Receiver)类: 包含部分业务逻辑

- 几乎任何对象都可以作为接收者类
- 绝大部分命令只处理如何将请求传递到接收者的细节，接收者自己会完成实际的工作

5.客户端(Client): 会创建并配置具体命令对象

- 客户端必须将包括接收者实体在内的所有请求参数传递给命令的构造函数，此后生成的命令就可以与一个或者多个发送者相关联了

![Alt text](/design-pattern/behavioral-pattern/command/assets/image.png)

## 例子

有一个文本编辑器(Editor)，支持对文本内容进行复制、剪切或粘贴，并且支持撤销操作

- 支持通过菜单栏按钮点击或者快捷键进行操作

![Alt text](/design-pattern/behavioral-pattern/command/assets/image1.png)

有些命令会改变编辑器的状态（例如剪切和粘贴），可以在它们执行相关操作前对编辑器的状态进行备份。命令执行后会和当前点备份的编辑器状态一起被放入命令历史(命令对象栈)

- 当需要进行回滚时，程序可从历史记录中取出最近的命令，读取相应的编辑器备份状态，然后进行恢复

客户端代码(GUI 元素和命令历史等)没有和具体命令类相耦合，因为它通过命令接口来使用命令

- 使得你可以在无需修改已有代码的情况下在程序中增加新的命令

```ts
// 命令基类会为所有具体命令定义通用接口
abstract class Command {
    protected app: Application
    protected editor: Editor
    protected backup: text

    constructor(app: Application, editor: Editor) {
        this.app = app
        this.editor = editor
    }

    // 备份编辑器状态
    saveBackUp() {
        this.backup = editor.text
    }

    // 恢复编辑器状态
    undo() {
        editor.text = this.backup
    }

    // 执行方法被声明为抽象以强制所有具体命令提供自己的实现
    // 该方法必须根据命令是否改变编辑器的状态返回 true 或者 false
    abstract execute(): boolean
}

// 具体命令实现
class CopyCommand extends Command {
    execute() {
        // 获取 editor 选中的内容到剪切板上
        app.clipboard = editor.getSelection()
        return false
    }
}

class CutCommand extends Command {
    execute() {
        this.saveBackUp()
        app.clipboard = editor.getSelection()
        editor.deleteSelection()
        return true
    }
}

class PasteCommand extends Command {
    execute() {
        this.saveBackUp()
        editor.replaceSelection(app.clipboard)
        return true
    }
}

class UndoCommand extends Command {
    execute() {
        this.app.undo()
        return false
    }
}

// 全局命令历史记录就是一个堆栈
class CommandHistory {
    private history: Command[]
    
    // 前进
    push(c: Command) {
        // 压栈
        this.history.push(c)
    }

    // 出栈
    pop() {
        // 取出最近的命令
        return this.history.pop()
    }
}

// 编辑器类包含实际的文本编辑操作。
// 会担任接收者的角色: 最后所有命令都会将执行工作委派给编辑器的方法
class Editor {
    text: string

    getSelection() {
        // 返回选中的文字
    }

    deleteSelection() {
        // 删除选中的文字
    }

    replaceSelection(test: string) {
        // 在当前位置插入剪切板中的内容
    }
}

// 应用程序类会设置对象之间的关系
// 担任发送者的角色：当需要完成某些工作时，它会创建并执行一个命令对象
class Application {
    clipboard: string
    editors: Editor[]
    activeEditor: Editor
    history: CommandHistory

    // 将命令分派给 UI 对象
    createUI() {
        // ...
        // 复制
        const copy = this.executeCommand(new CopyCommand(activeEditor))
        copyButton.setCommand(copy)
        shortcuts.onKeyPress("Ctrl+C", copy)

        // 剪切
        const cut = this.executeCommand(new CutCommand(activeEditor))
        cutButton.setCommand(cut)
        shortcuts.onKeyPress("Ctrl+X", cut)

        // 粘贴
        const paste = this.executeCommand(new PasteCommand(activeEditor))
        pasteButton.setCommand(paste)
        shortcuts.onKeyPress("Ctrl+V", paste)

        // 撤销
        const undo = this.executeCommand(new UndoCommand(activeEditor))
        undoCommand.setCommand(undo)
        shortcuts.onKeyPress("Ctrl+Z", undo)

    }

    // 执行一个命令并检查它是否需要被添加到历史记录中
    executeCommand(command: Command) {
        if(command.execute()) {
            this.history.push(command)
        }
    }

    // 从历史记录中取出最近的命令并运行其 undo 方法
    // 无需知道如何 undo，命令自己会知道如何撤销其操作
    undo() {
        command = this.history.pop()
        if(command instanceof Command) {
            command.undo()
        }
    }
}
```

## 参考

<https://refactoringguru.cn/design-patterns/command>
