module.exports = class RemoveCommentsPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
            for (const name in compilation.assets) {
                // 只处理 js 文化
                if (name.endsWith('.js')) {
                    // 文件内容
                    const content = compilation.assets[name].source();
                    // 去除注释
                    const noComments = content.replace(/\/\*{2,}\/\s?/g, "")
                    // 修改产物
                    compilation.assets[name] = {
                        source: () => noComments,
                        size: () => noComments.length
                    }
                }
            }
        })
    }
}