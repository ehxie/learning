# initial

本文研究一下 Vue3 初始化时做了什么

Vue3 的入口函数在 `src/main.ts`

- 因为最终打包输出的 HTML 文件是以下文件
- 在浏览器中执行，执行到 `<script>` 标签时，会执行 main.ts

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- 在初始化时调用了 createApp 函数初始化一个 Vue 实例，然后调用 mount 挂载到 DOM 上

```ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.mount("#app");
```

## 步骤 1：createApp

点击 createApp 函数，会进入到 `node_modules/@vue/runtime-dom/dist/runtime-dom.d.ts` 文件

- 根据之前所学的 [build](/vue/core/build/README.md) 相关的知识可知这里的代码就在 `packages/runtime-dom` 目录下

```ts
// 函数定义
export type CreateAppFunction<HostElement> = (
  rootComponent: Component,
  rootProps?: Data | null
) => App<HostElement>;

export const createApp = ((...args) => {
  // 1.创建 app 实例
  const app = ensureRenderer().createApp(...args)

  // 2.改写 mount 方法
  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // ...
    mount(/** ... */)
  }

  return app
}
```

总的来说这个函数还是比较简单的

- 创建 app 的逻辑是在 `ensureRenderer().createApp(...args)`
- `__DEV__` 那行先不可，我们看生产环境下的流程
- 给 aoo.mount 赋值一个函数，这个函数在挂载时执行
- 最后把 app 实例返回

![Alt text](/vue/core/initial/assets/image.png)

先看第一步

```ts
// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
// 懒创建渲染器，因为有些情况用户只导入响应式工具，所以这个渲染器是可以被 tree-shaking 优化掉的（创建渲染器还是挺重的逻辑）
let renderer: Renderer<Element | ShadowRoot> | HydrationRenderer;

// 执行这个方法才会去创建渲染器
function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  );
}

// renderer 相关的 api
// - patchPrp 就是 dom 元素 props 相关的方法（当有新的 props 或者 props 修改时调用）
// - nodeOps 就是 dom 元素操作相关的方法（比如 createElement）
const rendererOptions = /*#__PURE__*/ extend({ patchProp }, nodeOps);

export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args);
}) as CreateAppFunction<Element>;

export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options);
}

function baseCreateRenderer() (
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions
): any {
  // 这个函数特别长(如下图)，省略一些代码
  const target = getGlobalThis()

  // 这里的 options 就是上面提到的 rendererOptions
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options

  // 必须以 `const xxx = () => {}` 的风格
  // 防止被压缩工具进行内联化(确保函数在压缩过程中保持不变，并保留其原有的行为和作用域。)
  const patch: PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    isSVG = false,
    slotScopeIds = null,
    optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren
  ) => {
    // 看过 Vue diff 原理的对 patch 应该不陌生，这里就是 Vue diff 原理的代码，暂时先忽略
  }

  /**
   * 中间有很多定义的函数都是 patch 中用到的，暂时忽略
   */

  // 创建 render 函数
  const render: RootRenderFunction = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG)
    }
    flushPreFlushCbs()
    flushPostFlushCbs()
    container._vnode = vnode
  }

  // ...

  // 最后会返回这个对象
  return {
    render,
    // 这个是跟服务端渲染有关的，先忽略
    hydrate,
    // createAppAPI 说明在下面
    createApp: createAppAPI(render, hydrate),
  };
}
```

- 我用的是 vim，而且开启了相对行号，可以看到这个函数有 2032 行

![Alt text](/vue/core/initial/assets/image1.png)

```ts
// 上面创建 renderer 后最后会调用 createApp，也就是会调用到这个函数
// 这个函数会返回一个 createApp 的函数
export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  // 这个函数会创建 App 实例并返回
  // 传进来的参数是 import App from './App.vue' 的 App
  return function createApp(rootComponent, rootProps = null) {
    // 创建 app 上下文，这个对象会存 app 实例、mixins、components 和 directives 等等
    const context = createAppContext()

    const installedPlugins = new WeakSet()

    let isMounted = false

    const app: App = (context.app = {
      _uid: uid++,
      _component: rootComponent as ConcreteComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,

      version,

      get config() {
        return context.config
      },

      set config(v) {
        if (__DEV__) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          )
        }
      },
      use(plugin: Plugin, ...options: any[]) {}
      mixin(mixin: ComponentOptions) {}
      component(name: string, component?: Component): any {}
      directive(name: string, directive?: Directive) {}
      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        isSVG?: boolean
      ): any {}
      unmount() {}
      provide(key, value) {}
      runWithContext(fn) {}
    })

    return app
  }
}
```

到此为止 app 的创建就已经结束了

## 步骤 2: app.mount("#app")

由步骤 1 可知在 createAppAPI 返回的 createApp 函数中创建 app 实例，所以可以找到 app 创建时 mount 函数

- 同时在一开始看的时候也发现了 createApp 方法会改写 mount 函数

```ts
// 这个是 runtime-core 中的
export function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    // ...
    const app: App = (context.app = {
      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        isSVG?: boolean
      ): any {
        if (!isMounted) {
          // 创建 root VNode
          const vnode = createVNode(rootComponent, rootProps);
          // store app context on the root VNode.
          // this will be set on the root instance on initial mount.
          vnode.appContext = context;

          if (isHydrate && hydrate) {
            // 服务端渲染相关可以先忽略
            hydrate(vnode as VNode<Node, Element>, rootContainer as any);
          } else {
            // 最终会调用 renderer 中的 render 进行渲染
            // 第一个参数是要渲染的 vnode, 第二个参数是挂载的容器(由此可知就是 app.mount("#app") 中的 #app 元素)
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app._container = rootContainer;
          // for devtools and telemetry
          (rootContainer as any).__vue_app__ = app;

          return getExposeProxy(vnode.component!) || vnode.component!.proxy;
        } else if (__DEV__) {
          // 打印 warn
        }
      },
    });
    // ...
  };
}

// 这个是 runtime-dom 也就是一开始看的 createApp
export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args);

  if (__DEV__) {
    injectNativeTagCheck(app);
    injectCompilerOptionsCheck(app);
  }

  // 这里解析出来了 runtime-core 中的 mount
  const { mount } = app;
  // 重写了 runtime-core 中的 mount
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // 标准化 container
    // app.mount("#app") 就转换成 document.querySelector("#app")
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;

    // 这个对应的是 createApp(App) 传的 App
    const component = app._component;
    // createApp 传的参数不是函数且没有 render 和 template 属性时J
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML;

      // 2.x 兼容性相关
      if (__COMPAT__ && __DEV__) {
        // ...
      }
    }

    // clear content before mounting
    container.innerHTML = "";
    // 调用 runtime-core 中定义的 mount 方法
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      // 这个属性是解决初始加载时显示{{}}表达式的问题的指令
      // - 当Vue实例挂载到DOM上时，会先进行编译和渲染，但是这个过程可能需要一些时间，如果在此过程中出现了未编译完成的{{}}表达式，用户可能会看到原始的{{}}表达式，而不是渲染后的结果
      // - v-cloak指令是一个在Vue实例渲染完成之前隐藏元素的指令
      container.removeAttribute("v-cloak");
      // 用于标识应用程序根节点
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };

  return app;
}) as CreateAppFunction<Element>;
```
