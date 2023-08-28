# webpack 核心原理

将所有资源打包到模块中

![Alt text](/webpack-learning/06-core/asserts/image.png)

## 原理解剖

查阅源码的思路

1. Webpack CLI 启动打包流程
2. 载入 Webpack 核心模块，创建 Compiler 对象
3. 使用 Compiler 对象开始编译整个项目
4. 从入口文件开始，解析模块依赖，形成依赖关系树
5. 递归依赖树，将每个模块交给对应的 Loader 处理
6. 合并 Loader 处理完的结果，将打包结果输出到 dist 目录

[基于 v3.3.11 版本分析](https://github.com/webpack/webpack-cli/tree/v3.3.11)

作用：

- 将 CLI 参数和 Webpack 配置文件中的配置整合得到一个完整的配置对象

[核心代码 bin/cli.js](https://github.com/webpack/webpack-cli/blob/v3.3.11/bin/cli.js)

```js
(function() {
    // 49 行
    // 通过 yargs 解析命令行参数
    yargs.parse(process.argv.slice(2), (err, argv, output) => {

        // ...

        // 
        let options
        try{
            // 使用 convert-argv 模块将命令行参数转换为 webpack 配置选项对象
            options = require("./utils/convert-argv")(argv);
        }catch(e) {
            // ...
        }

        function processOptions(options) {
            let compiler
            try {
                // 调用 webpack 核心模块
                compiler = webpack(options)
            }catch (e){
                // ...
            }
        }

        processOptions(options);

        // 是否需要 watch
        if (firstOptions.watch || options.watch) {
            const watchOptions =
                firstOptions.watchOptions || options.watchOptions || firstOptions.watch || options.watch || {};
            if (watchOptions.stdin) {
                process.stdin.on("end", function(_) {
                    process.exit(); // eslint-disable-line
                });
                process.stdin.resume();
            }
            // 以监视模式启动构建
            compiler.watch(watchOptions, compilerCallback);
            if (outputOptions.infoVerbosity !== "none") console.error("\nwebpack is watching the files…\n");
        } else {
            // 开始构建
            compiler.run((err, stats) => {
                if (compiler.close) {
                    compiler.close(err2 => {
                        compilerCallback(err || err2, stats);
                    });
                } else {
                    compilerCallback(err, stats);
                }
            });
        }

    })
})()

```

[webpack 代码 lib/webpack.js](https://github.com/webpack/webpack/blob/v4.30.1/lib/webpack.js)

```js
const webpack = (options, callback) => {
    // 校验 options
    const webpackOptionsValidationErrors = validateSchema(
        webpackOptionsSchema,
        options
    );
    if (webpackOptionsValidationErrors.length) {
        throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
    }

    let compiler;
    if (Array.isArray(options)) {
        // 多路编译
        compiler = new MultiCompiler(options.map(options => webpack(options)));
    } else if (typeof options === "object") {
        // 单路编译
        compiler = new Compiler(options.context);

        // 注册插件
        new NodeEnvironmentPlugin().apply(compiler);
        if (options.plugins && Array.isArray(options.plugins)) {
            for (const plugin of options.plugins) {
                if (typeof plugin === "function") {
                    plugin.call(compiler, compiler);
                } else {
                    plugin.apply(compiler);
                }
            }
        }

        // 触发特定 hook
        compiler.hooks.environment.call();
        compiler.hooks.afterEnvironment.call();

    } else {
        throw new Error("Invalid argument: options");
    }
}
```

[Compiler](https://github.com/webpack/webpack/blob/main/lib/Compiler.js)

```js
class Compiler {
    constructor(){
        // 初始化钩子
        this.hooks = Object.freeze({
            // ...
        })
    }
    run(callback) {
        const run = () => {
            // 触发钩子
            this.hooks.beforeRun.callAsync(this, err => {
                if (err) return finalCallback(err);

                this.hooks.run.callAsync(this, err => {
                    if (err) return finalCallback(err);

                    this.readRecords(err => {
                        if (err) return finalCallback(err);
                        // 编译
                        this.compile(onCompiled);
                    });
                });
            });
        }

        run()
    }
    compile(callback) {
        // 省略 beforeCompile 钩子
        // 调用 compile
        this.hooks.compile.call(params);
        // 调用 make
        // 根据 entry 配置找到入口模块，开始依次递归出所有依赖，形成依赖树，然后递归到每个模块交给不同的 Loader 处理
        this.hooks.make.callAsync(compilation, err => {
            // ...
        })
    }
}
```

make 事件

- 这里采用的是事件触发的方法，所以找代码会比较困难，直接全局搜索 `make.tap`
  - 找到注册这个事件的地方
  - 事件机制基于 Tapable 库实现

```js
// https://github.com/webpack/webpack/blob/main/lib/webpack.js#L83
// 在创建 compiler 对象时注册的内置插件
new WebpackOptionsApply().process(options, compiler)
```

make 阶段

1. SingleEntryPlugin 中调用了 Compilation 对象的 addEntry 方法，开始解析入口
2. addEntry 中调用 _addModuleChain 方法，将入口模块添加到模块依赖列表中
3. 通过 Compilation 对象的 buildModule 方法进行模块构建
4. buildModule 方法中执行具体的 Loader，处理特殊资源加载
5. build 完成后，通过 acorn 库生成模块代码的 AST 语法树
6. 根据语法树分析这个模块是否还有依赖的模块，如果有继续循环 build 每个依赖
7. 所有依赖解析完成， build 阶段结束
8. 最后合并生成所需要输出的 bundle.js 写入 dist 目录
