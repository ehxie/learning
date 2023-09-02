# 增强使用 webpack 的开发体验

需求：

1.必须能够使用 HTTP 服务运行而不是文件形式预览

- 更接近生产环境
- 可能会使用到 AJAX 之类的 API，以文件形式访问会出现一些问题

2.修改完代码后，Webpack 能够自动完成构建，然后在浏览器上即可显示最新的结果

- 大大减少了开发过程中重复操作，让我们更加专注，效率自然提升

3.提供 Source Map 支持，方便定位在运行中出现的错误而不是打包后的结果

## watch

webpack 完成首次构建后，项目中的源文件会被监视。一旦发生任何改动，webpack 就会自动重新运行打包任务

- 启动 webpack 时，添加一个 `--watch` 的 CLI 参数

## 自动刷新浏览器

```shell
# 监听 dist 目录
npm install browser-sync --global
```

## webpack-dev-server

watch + browser-sync 效率较低，所以有了新工具

- watch 执行打包后写入磁盘，browser-sync 再从磁盘读取后进行热更新

```shell
npm install webpack-dev-server --save-dev
npx webpack-dev-server
```

流程：

- 开始 --> 启动 HTTP 服务 --> webpack 构建 --> 监听文件变化
- webpack 构建 --> 内存 --> HTTP server

```js
// webpack.config.js
module.exports = {
    // ...
    devServer: {

        // 不在产物中，但是也是需要访问的资源，需要告诉 server
        contentBase: 'public', // 也可以是数组

        // 本地代理，解决跨域问题
        proxy: {
            // http://localhost:8080/api/user --> https://api.github.com/users
            '/api': {
                // 代理到的目标服务器
                target: 'https://api.github.com',
                // 路径替换
                pathRewrite: {
                    '^/api': ''
                },
                // 确保请求 Github 的主机名就是 api.github.com
                changeOrigin: true
            }
        }
    }
}
```
