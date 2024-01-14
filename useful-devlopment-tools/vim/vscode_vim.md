# 键盘侠养成攻略(VSCode & Vim)

> 问题：如何生成一段真随机数？
> 答：让一个没有使用过 Vim 的新手退出 Vim 🤣

本文讲述如何在 VSCode 里使用 Vim，将 VSCode 和 Vim 搭配起来使用，达到不用触控板(鼠标)就可以完成绝大部分工作

## 安装

1.cmd + shift + x 打开插件页，搜索 vim 并安装，将配置复制到 settings.json 中

- 打开 settings.json：cmd + shift + p 然后输出 usersettings 回车

这里是配置的部分说明，[我的配置](/useful-devlopment-tools/vscode/conf/settings.json)

```json
{
  // 默认使用了 easymotion 插件
  "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  // 当 vscode 快捷键与 vim 冲突时优先使用 vim
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  // 键位映射：使用 jj 代替 Esc
  "vim.insertModeKeyBindings": [
    {
      "before": ["j", "j"],
      "after": ["<Esc>"]
    }
  ],
  // 键位映射：使用 空格d 代替 dd（<leader> 是一个前缀键，在下面配置中可以看到其为空格）
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["K"],
      "commands": ["lineBreakInsert"],
      "silent": true
    }
  ],
  // 将 <leader> 键设置为空格
  "vim.leader": "<space>",

  "vim.handleKeys": {
    // 禁用掉与 vscode 冲突的键
    // ctrl - a：vim 中是数值+1，VSCode 中是跳到行首
    "<C-a>": false,
    // ctrl - a：vim 中是向下翻页，VSCode 中是搜索
    "<C-f>": false
  }
}
```

2.重启 vscode

- cmd + shift + p 然后输入 reload window 回车

## 基本使用

本文不对 vim 的基础使用做介绍，如果完全不懂可以参考：[Vim 快捷键](/useful-devlopment-tools/vim/快捷键.md)

- 也可以安装插件 [Learn-Vim](https://github.com/iggredible/Learn-Vim) 去学习
- 需注意原生 vim 中有一些快捷键冲突了无法在 VSCode 中使用，例如上面 settings.json 中提到的两个

## 重要概念

operator：c(change)、d(delete)、y(yank)

motion：$(移动到行尾)、^(移动到行首)、0(移动到本行第一个字符)、gg(移动到文件开头)、G(移动到文件结尾)...

leader：前缀键，本文中设置为空格

## 常用命令

### VSCode 中 Vim 默认配置的命令

跳转到声明(definition)处：gd

- 跳转回来：ctrl + o
  查看声明：gh
- 与鼠标悬浮在上面的效果是一样的
  代码块的折叠与展开
- 折叠：zc
- 展开：zo
  代码块分屏后不同窗口的跳转
- ctrl + hjkl(四选一，表示方向)

### Vim 通用

重复上一次的命令：;
往下翻半屏：ctrl + d
跳到本行的某个字符，可以配合;使用

- f \<char\>：往右跳到该字符上
  - F \<char\>：往左跳到该字符上
- t \<char\>：往右跳到该字符的左边的第一个字符
  - T：往左跳到该字符的右边的第一个字符

### VSCode 命令

打开/关闭终端：cmd + j（这个命令会打开之前默认打开的面板，所以显示的可能不是 terminal，如果要直接打开 terminal 可以使用 ctrl + `）

- 最大化：cmd + m
- terminal 清屏：cmd + k
  打开关闭目录(光标不会移动)：cmd + b
- cmd + shift + e 则会把光标移动到侧边目录上
- 使用 vim 插件后可以使用 hjkl 在文件目录上移动
  关闭文件
- 关闭当前文件：cmd + w
- 关闭所有文件：cmd + k + w
- 关闭所有已保存的文件：cmd + k + u
- 关闭其他文件：option + cmd + t

搜索

- 全局搜文本：cmd + shift + f
- 在某个文件夹下搜文本：光标移动到对应的文件夹，cmd + option + f
- 当前文件夹下搜索函数/变量：cmd + shift + o
- 搜文件：cmd + p
- 搜命令：cmd + shift + p

分屏

- 左右：cmd + \
- 上下：先 cmd + k，松开后按 cmd + \
  代码变更：shift + option + g
- 提交部分代码到暂存区(Change ---> Stage Change)：在代码变更中打开文件，此时可以看到文件有个(Working Tree)，使用 jk 进行上下移动，找到对应的文件使用 l 进入，按 v 进入 visual 模式后选中对应的代码，按 cmd + k 然后松开，按下 cmd + option + s 即可
  - 将提交到暂存区的代码撤销到工作区(Stage Change ---> Change)：与上面步骤一致，只是进入 visual 模式选中后，按 cmd + k 然后在按 cmd + n 即可
  - 将工作区的修改撤销(revert)：与上面步骤一致，只是进入 visual 模式选中后，按 cmd + k 然后在按 cmd + r 即可

### 改键

#### 修改 VSCode 快捷键绑定

目的：当光标在左侧文件夹目录时可以使用以下快捷键

- a：新建文件
- A：新建文件夹
- r：重命名文件/文件夹
- d：删除文件/文件夹
- y：复制文件/文件夹
- p：粘贴文件/文件夹
- x：剪切文件/文件夹

  1.cmd + shift + p 输入 keyboardjson 并打开

  2.往数组中添加一下元素

```json
[
  // 新建文件
  {
    "key": "a",
    "command": "explorer.newFile",
    "when": "filesExplorerFocus && !inputFocus"
  },
  // 新建文件夹
  {
    "key": "shift+a",
    "command": "explorer.newFolder",
    "when": "filesExplorerFocus && !inputFocus"
  },
  // 重命名
  {
    "key": "r",
    "command": "renameFile",
    "when": "explorerViewletVisible && filesExplorerFocus && !explorerResourceIsRoot && !explorerResourceReadonly && !inputFocus"
  },
  // 删除文件
  {
    "key": "d",
    "command": "deleteFile",
    "when": "explorerViewletVisible && filesExplorerFocus && !explorerResourceIsRoot && !explorerResourceReadonly && !inputFocus"
  },
  // 剪切文件或目录
  {
    "key": "x",
    "command": "filesExplorer.cut",
    "when": "explorerViewletVisible && filesExplorerFocus && !explorerResourceIsRoot && !explorerResourceReadonly && !inputFocus"
  },
  // 复制文件或目录
  {
    "key": "y",
    "command": "filesExplorer.copy",
    "when": "explorerViewletVisible && filesExplorerFocus && !explorerResourceIsRoot && !inputFocus"
  },
  // 粘贴文件或目录
  {
    "key": "p",
    "command": "filesExplorer.paste",
    "when": "explorerViewletVisible && filesExplorerFocus && !explorerResourceReadonly && !inputFocus"
  }
]
```

#### 修改 Vim 配置

目的：更舒服的使用快捷键，怎么舒服怎么配

- 修改 settings.json

```json
{
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["K"],
      "commands": ["lineBreakInsert"],
      "silent": true
    },
    // 行首
    {
      "before": ["L"],
      "after": ["$"]
    },
    // 行尾
    {
      "before": ["H"],
      "after": ["^"]
    },
    // 跳转到 terminal
    {
      "before": ["<leader>", "t"],
      "commands": ["workbench.action.terminal.focus"]
    },
    // 返回
    {
      "before": ["g", "j"],
      "commands": ["workbench.action.navigateBack"]
    },
    // 切换到左边的tab
    {
      "before": ["<leader>", "h"],
      "commands": [":tabp"]
    },
    // 切换到右边的tab
    {
      "before": ["<leader>", "l"],
      "commands": [":tabn"]
    }
  ]
}
```

#### 其他配置

```json
{
  // ...
  "workbench.colorCustomizations": {
    // 光标颜色
    "editorCursor.foreground": "#16C60C",
    // 光标所在行颜色
    "editor.lineHighlightBackground": "#292E42"
  },
  // 光标移动更加丝滑
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  // 控制光标经过折叠代码区域时，代码是否会自动展开，true 表示不自动展开
  "vim.foldfix": true
  // ...
}
```

## 插件

这里是介绍 VSCode Vim 插件自带的插件的使用

注意：本文的 \<leader\> 键设置为空格

### Vim Sneak

需要去 settings.json 开启

```json
{
  // ...
  "vim.sneak": true
}
```

功能：光标跳转（与 easy motion 功能很像）

[官方文档说明](https://github.com/VSCodeVim/Vim/blob/ee4888ab3b18f11baf60e6ee44db84f2ba52c6f6/README.md#vim-sneak)

1.向下跳转：s\<char\>\<char\>

- 向上则是大写的 S
  e.g.：跳转到 world 的位置，输入 swo 跳转到了第二行的 w 的位置，按;重复上一次操作跳转到第三行的 w 的位置
- 3;：重复三次

![Alt text](/useful-devlopment-tools/vim/assets/image6.png)

## Idea 配置可以参考

https://einverne.github.io/post/2020/12/my-idea-vimrc-config.html
