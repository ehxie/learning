# build

## Overview

### Structure

只列出和 build 相关的目录结构

```txt
core
├─ package.json
├─ packages
│  ├─ compiler-core
│  ├─ compiler-dom
│  ├─ compiler-sfc
│  ├─ compiler-ssr
│  ├─ dts-built-test
│  ├─ dts-test
│  ├─ reactivity
│  ├─ reactivity-transform
│  ├─ runtime-core
│  ├─ runtime-dom
│  ├─ runtime-test
│  ├─ server-renderer
│  ├─ sfc-playground
│  ├─ shared
│  └─ vue-compat
├─ pnpm-workspace.yaml
├─ rollup.config.js
├─ rollup.dts.config.js
├─ scripts
│  ├─ aliases.js
│  ├─ build.js
│  ├─ const-enum.js
│  ├─ dev.js
│  ├─ pre-dev-sfc.js
│  ├─ release.js
│  ├─ setupVitest.ts
│  ├─ size-report.ts
│  ├─ usage-size.ts
│  ├─ utils.js
│  └─ verifyCommit.js
├─ tsconfig.build.json
├─ tsconfig.json

```

### 都有哪些包？

Vue3 的仓库是基于 pnpm 的 monorepo

仓库中的所有的包都可以在根目录下的 `pnpm-workspace.yaml` 中找到

```yaml
packages:
  - "packages/*"
```

所以项目中的所有包都可以在 `packages` 目录下

### 如何打包

package.json 中有 `build` 命令，所以我们克隆仓库后可以执行

```bash
pnpm install
pnpm build
```

## 打包流程

1.执行 `pnpm build`

执行 pnpm build 后，会执行 `package.json` 中的 `build` 命令

- 可以看到会执行 `node scripts/build.js`

```json
{
  // ...
  "scripts": {
    // ...
    "build": "node scripts/build.js"
  }
}
```

2.执行 `node scripts/build.js`

- 只写核心的打包流程，不写其他功能

① 执行 run() 函数，获取所有需要构建的包以及一些其他的操作
② 执行 buildAll() 函数，调用 runParallel() 进行并发构建
③runParallel() 中会调用 build() 函数处理一些环境变量后调用 rollup 进行构建

```js
// 用于将字节数转换为可读字符串
import prettyBytes from "pretty-bytes";
// 解析命令行参数：把前两个都去掉了
const args = minimist(process.argv.slice(2));
// 获取了除了以 - 或者 -- 开头以外的参数
const targets = args._;
// 这个是获取 --formats 或者 -f 的值
const formats = args.formats || args.f;
// 其他的参数省略

// 执行 build 其实就是执行 run
run();

async function run() {
  // 是否需要把打包后文件的大小写入到临时文件中
  if (writeSize) await fs.mkdir(sizeDir, { recursive: true });

  // 扫码所有的 enum 并存在 temp/enum.json 中，返回一个函数用于将这个文件删除
  const removeCache = scanEnums();

  try {
    // 命令行参数传递不带 -- 的都是 targets
    // 当 targets 长度不为零时会去匹配 packages 下的所有包，匹配的就会返回（如果 buildAllMatching 为 false，那么只会返回第一个）
    // 当长度为零时，会返回所有包
    const resolvedTargets = targets.length
      ? fuzzyMatchTarget(targets, buildAllMatching) // 模糊匹配
      : allTargets; // 这里的值来自 scripts/utils.js 中的 targets(即会获取所有的需要打包的包)

    // 传入所有要构建的包
    await buildAll(resolvedTargets);

    // 会把 global 相关的产物大小计算并输出出来(执行 pnpm build 最后输出的 `compiler-dom.global.prod.js min:58 kB / gzip:21.9 kB / brotli:19.6 kB` 就是了)
    // 如果 writeSize 参数为 true 则最后把每个文件的大小都写入到 temp/size/${fileName}.json 中
    await checkAllSizes(resolvedTargets);

    // 构建 d.ts
    // 使用的 rollup 构建配置是 rollup.dts.config.js
    if (buildTypes) {
      await execa(
        "pnpm",
        [
          "run",
          "build-dts",
          ...(targets.length
            ? ["--environment", `TARGETS:${resolvedTargets.join(",")}`]
            : []),
        ],
        {
          stdio: "inherit",
        }
      );
    }
  } finally {
    // 删除 enum 缓存
    removeCache();
  }
}

async function buildAll(targets) {
  // 并行构建
  // cpus().length 获取当前机器的 CPU 核心数
  await runParallel(cpus().length, targets, build);
}

// 并行构建，控制并发数
async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of source) {
    // 将 build 函数转换成 Promise
    const p = Promise.resolve().then(() => iteratorFn(item, source));
    ret.push(p);

    if (maxConcurrency <= source.length) {
      // build 执行完后，会从 executing 中移除
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      // 把正在执行的 Promise 放到 executing 中
      executing.push(e);
      // 如果正在执行的 build 数量达到最大数
      if (executing.length >= maxConcurrency) {
        // 等待一个 build 执行完后，再继续循环
        await Promise.race(executing);
      }
    }
  }
  // 等待所有构建完毕
  return Promise.all(ret);
}

// 构建的核心
async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`);
  const pkg = require(`${pkgDir}/package.json`);

  // if this is a full build (no specific targets), ignore private packages
  if ((isRelease || !targets.length) && pkg.private) {
    return;
  }

  // 删除删一次缓存的 dist 文件
  // if building a specific format, do not remove dist.
  if (!formats && existsSync(`${pkgDir}/dist`)) {
    await fs.rm(`${pkgDir}/dist`, { recursive: true });
  }

  const env =
    (pkg.buildOptions && pkg.buildOptions.env) ||
    (devOnly ? "development" : "production");

  // 执行 rollup 构建
  await execa(
    "rollup",
    [
      "-c",
      "--environment", // 这里可以在 rollup.config.js 中通过 process.env.{key} 获取到
      [
        `COMMIT:${commit}`, // e.g.：process.env.COMMIT
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        formats ? `FORMATS:${formats}` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``,
      ]
        .filter(Boolean)
        .join(","),
    ],
    { stdio: "inherit" }
  );
}
```

3.rollup.config.js 文件

- 最终会导出一个构建的配置 `export default packageConfigs`

先看最终导出这一块

```js
// 这一个 map，用于统一相同 format 产物的名称
// 例如 csj 的构建产物的 format 就是 cjs，文件名就是 dist/${name}.cjs.js
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },
  // runtime-only builds, for main "vue" package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es'
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: 'iife'
  }
}

// 兜底的 format
const defaultFormats = ['esm-bundler', 'cjs']
// 命令行中传入的 format
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
// packageOptions 是每个项目的 package.json 中的 buildOptions 字段
// 最终的 format
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats

// 构建的配置(具体函数做了什么下面说明)
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

// NODE_ENV = (pkg.buildOptions && pkg.buildOptions.env) || (devOnly ? 'development' : 'production')
if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (packageOptions.prod === false) {
      return
    }
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (/^(global|esm-browser)(-runtime)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

export default packageConfigs
```

构建函数

- 这个函数很长，可以直接从最后 return 的对象开始看

e.g.: 属性 input: resolve(entryFile),

```js
function createConfig(format, output, plugins = []) {
    // ...
    // 获取目录名
    const packagesDir = path.resolve(__dirname, 'packages')
    const packageDir = path.resolve(packagesDir, process.env.TARGET)

    // 获取目录下的文件
    const resolve = p => path.resolve(packageDir, p)

    // 入口文件
    let entryFile = /runtime$/.test(format) ? `src/runtime.ts` : `src/index.ts`

    return {
        // 打包入口
        input: resolve(entryFile),
        // ...
    }
}

```

其他的属性也可以按照什么的思路去看

- 下面的比较完整的代码还有我个人添加的一些注释

```js
// 最终都会调用这个方法返回一个构建对象
function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(pico.yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  // 初始化一些值
  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isBundlerESMBuild = /esm-bundler/.test(format)
  const isBrowserESMBuild = /esm-browser/.test(format)
  const isServerRenderer = name === 'server-renderer'
  const isNodeBuild = format === 'cjs'
  const isGlobalBuild = /global/.test(format)
  const isCompatPackage =
    pkg.name === '@vue/compat' || pkg.name === '@vue/compat-canary'
  const isCompatBuild = !!packageOptions.compat
  const isBrowserBuild =
    (isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild) &&
    !packageOptions.enableNonBrowserBranches

  output.exports = isCompatPackage ? 'auto' : 'named'
  if (isNodeBuild) {
    output.esModule = true
  }
  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false

  if (isGlobalBuild) {
    output.name = packageOptions.name
  }

  let entryFile = /runtime$/.test(format) ? `src/runtime.ts` : `src/index.ts`

  // the compat build needs both default AND named exports. This will cause
  // Rollup to complain for non-ESM targets, so we use separate entries for
  // esm vs. non-esm builds.
  if (isCompatPackage && (isBrowserESMBuild || isBundlerESMBuild)) {
    entryFile = /runtime$/.test(format)
      ? `src/esm-runtime.ts`
      : `src/esm-index.ts`
  }

  function resolveDefine() {
    const replacements = {
      __COMMIT__: `"${process.env.COMMIT}"`,
      __VERSION__: `"${masterVersion}"`,
      // this is only used during Vue's internal tests
      __TEST__: `false`,
      // If the build is expected to run directly in the browser (global / esm builds)
      __BROWSER__: String(isBrowserBuild),
      __GLOBAL__: String(isGlobalBuild),
      __ESM_BUNDLER__: String(isBundlerESMBuild),
      __ESM_BROWSER__: String(isBrowserESMBuild),
      // is targeting Node (SSR)?
      __NODE_JS__: String(isNodeBuild),
      // need SSR-specific branches?
      __SSR__: String(isNodeBuild || isBundlerESMBuild || isServerRenderer),

      // 2.x compat build
      __COMPAT__: String(isCompatBuild),

      // feature flags
      __FEATURE_SUSPENSE__: `true`,
      __FEATURE_OPTIONS_API__: isBundlerESMBuild
        ? `__VUE_OPTIONS_API__`
        : `true`,
      __FEATURE_PROD_DEVTOOLS__: isBundlerESMBuild
        ? `__VUE_PROD_DEVTOOLS__`
        : `false`
    }

    if (!isBundlerESMBuild) {
      // hard coded dev/prod builds
      // @ts-ignore
      replacements.__DEV__ = String(!isProductionBuild)
    }

    // allow inline overrides like
    //__RUNTIME_COMPILE__=true pnpm build runtime-core
    Object.keys(replacements).forEach(key => {
      if (key in process.env) {
        replacements[key] = process.env[key]
      }
    })
    return replacements
  }

  // esbuild define is a bit strict and only allows literal json or identifiers
  // so we still need replace plugin in some cases
  function resolveReplace() {
    const replacements = { ...enumDefines }

    if (isProductionBuild && isBrowserBuild) {
      Object.assign(replacements, {
        'context.onError(': `/*#__PURE__*/ context.onError(`,
        'emitError(': `/*#__PURE__*/ emitError(`,
        'createCompilerError(': `/*#__PURE__*/ createCompilerError(`,
        'createDOMCompilerError(': `/*#__PURE__*/ createDOMCompilerError(`
      })
    }

    if (isBundlerESMBuild) {
      Object.assign(replacements, {
        // preserve to be handled by bundlers
        __DEV__: `!!(process.env.NODE_ENV !== 'production')`
      })
    }

    // for compiler-sfc browser build inlined deps
    if (isBrowserESMBuild) {
      Object.assign(replacements, {
        'process.env': '({})',
        'process.platform': '""',
        'process.stdout': 'null'
      })
    }

    if (Object.keys(replacements).length) {
      // @ts-ignore
      return [replace({ values: replacements, preventAssignment: true })]
    } else {
      return []
    }
  }

  // 打包优化，将不需要打包进去的依赖排除，可以加快打包速度减少打包体积
  function resolveExternal() {
    const treeShakenDeps = ['source-map-js', '@babel/parser', 'estree-walker']

    // 如果需要单独运行的则需要把一些依赖都打包进去
    if (isGlobalBuild || isBrowserESMBuild || isCompatPackage) {
      if (!packageOptions.enableNonBrowserBranches) {
        // normal browser builds - non-browser only imports are tree-shaken,
        // they are only listed here to suppress warnings.
        return treeShakenDeps
      }
    } else {
      // Node / esm-bundler builds.
      // externalize all direct deps unless it's the compat build.
      return [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        // for @vue/compiler-sfc / server-renderer
        ...['path', 'url', 'stream'],
        // somehow these throw warnings for runtime-* package builds
        ...treeShakenDeps
      ]
    }
  }

  function resolveNodePlugins() {
    // we are bundling forked consolidate.js in compiler-sfc which dynamically
    // requires a ton of template engines which should be ignored.
    let cjsIgnores = []
    if (
      pkg.name === '@vue/compiler-sfc' ||
      pkg.name === '@vue/compiler-sfc-canary'
    ) {
      cjsIgnores = [
        ...Object.keys(consolidatePkg.devDependencies),
        'vm',
        'crypto',
        'react-dom/server',
        'teacup/lib/express',
        'arc-templates/dist/es5',
        'then-pug',
        'then-jade'
      ]
    }

    const nodePlugins =
      (format === 'cjs' && Object.keys(pkg.devDependencies || {}).length) ||
      packageOptions.enableNonBrowserBranches
        ? [
            commonJS({
              sourceMap: false,
              ignore: cjsIgnores
            }),
            ...(format === 'cjs' ? [] : [polyfillNode()]),
            nodeResolve()
          ]
        : []

    return nodePlugins
  }

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external: resolveExternal(),
    plugins: [
      json({
        namedExports: false
      }),
      alias({
        entries
      }),
      enumPlugin,
      ...resolveReplace(),
      // 更快的构建速度和更高效的代码压缩。它可以替代 Rollup 默认的 JavaScript 构建过程，将构建任务委托给 esbuild 引擎来处理
      esbuild({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        sourceMap: output.sourcemap,
        minify: false,
        target: isServerRenderer || isNodeBuild ? 'es2019' : 'es2015',
        define: resolveDefine()
      }),
      ...resolveNodePlugins(),
      ...plugins
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format) {
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true
        },
        safari10: true
      })
    ]
  )
}

```
