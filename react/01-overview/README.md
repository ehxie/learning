# 概览

## 认识前端框架

> 库和框架的区别？
>
> - 其实严格意义上讲 Vue 和 React 都只是库(构建 UI 的库)而不是框架
> - 框架除了包含库之外还能看会有构建分支、数据流方案、文档工具等
>
> 当现在习惯性的都成 Vue 和 React 为框架

前端框架都可以概括为：UI = f(state)

- UI: 宿主环境试图
- f: 框架内部运行机制
- state: 当前视图状态

## 如何描述 UI

> UI 的核心就是描述 UI 和逻辑

目前主流的两种

- jsx：类 xml 语法的 ECMAScript 语法糖(在 js 中去扩展描述 UI 的能力, 能够更加灵活的与 ES 代码配合使用)
  - 在 if 和 for 语句中使用 jsx
  - 将 jsx 赋值给变量
  - 将 jsx 作为参数传入，以及从函数中返回 jsx
- 模板语法：扩展描述 UI 的能力，将逻辑嵌入 UI(例如 php)
  - 虽然功能比较强大，但是当页面结构复杂时，逻辑(PHP 代码)会不可避免的与 UI(HTML)代码结合起来应用，为了更好的展示 UI，Github 的联合创始人 Chris Wanstrath 开发了 Mustache，这是一款“重 UI 而轻逻辑”的模板解析引擎

> React 团队认为 UI 本质上与逻辑存在耦合部分
>
> - 在 UI 上绑定事件
> - 在状态变化后改变 UI 的样式或结构
>
> 这种轻松描述复杂的 UI 变化使得 React 社区在早期用户就可以快速实现各种复杂的基础库，丰富了社区生态

## 前端框架分类依据

根据与自变量建立对应关系的抽象层级，可以分为

- 应用级框架，e.g.: React
- 组件级框架，e.g.：Vue
- 元素级框架，e.g.：Solid.js

## 实现一个细粒度更新的 React

- 无需显示声明依赖
- 由于可以自动追踪依赖，因此不受 React Hooks 不能在条件语句中声明 Hooks 的限制

> 实现代码 [core.js](/react/01-overview/core.js)、测试代码 [test.js](/react/01-overview/test.js)

为什么 React 不采用细粒度更新？

- React 属于框架级应用，从关注“自变量与应用的对应关系”的角度看，其更新粒度不需要很细
- 作为代价，React 则是有以上两个限制