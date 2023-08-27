const { marked } = require('marked')

module.exports = (source) => {
    // 加载到模块的内容
    console.log(`[markdown-loader]:
                \n/*********/\n
                ${source}
                \n/*********/`);

    // 1.将 markdown 转换为 html 字符串
    const html = marked(source);

    // 2.将 html 字符串转换为 js 代码
    // 使用 JSON.stringify 保证换行符和引号会被转义，这样就不会有问题
    const code = `module.exports = ${JSON.stringify(html)}`;
    // 也可以使用 ESM 导出
    // const code = `export default ${JSON.stringify(html)}`;

    return code
}