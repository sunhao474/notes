# webpack

1. [理解](#1)
2. [构建流程](#2)
3. [loader](#3)
4. [plugin](#4)
5. [构建优化](#5)
6. [性能优化](#6)
---

## <a id="1">理解</a>
`webpack` 是一个用于现代 js 应用的静态模块打包工具。  
实现前端项目模块化，统筹构建流程。  
主要解决以下问题：

- 需要用模块化的方式开发
- 使用一些高级的特性来加快我们的开发效率和安全性，如es6、ts、sass、less
- 设置开发模式， 应用热更新。
- 打包为正式环境代码需要压缩、优化等。

`webpack` 是怎么进行打包的呢？首先，他会从给定的入口文件开始，内部构建依赖图，此依赖图对应映射项目中所有引用的模块（js、css等），并根据配置生成一个或者多个 bundle 文件。

---

## <a id="2">构建流程</a>
* 初始化流程：从配置文件和 `shell` 语句中读取与合并参数，得出最终的参数。
关于配置文件：
    - entry：入口文件，模块构建的起点。
    - resolve: 文件路径指向
    - output: 生成文件，是模块构建的终点，包括输入文件与路径。
    - module：配置loader等
    - plugins：配置插件
* 将配置文件的各个配置拷贝到 `options` 对象中，并加载用户配置的plugins
* 初始化 `compiler` 编译对象，该对象掌控 `webpack` 生命周期，不执行具体任务。只负责调度。
    ```js
    class Compiler extends Tapable {
        constructor(context) {
            super();
            this.hooks = {
                beforeCompile: new AsyncSeriesHook(["params"]),
                compile: new SyncHook(["params"]),
                afterCompile: new AsyncSeriesHook(["compilation"]),
                make: new AsyncParallelHook(["compilation"]),
                entryOption: new SyncBailHook(["context", "entry"])
                // 定义了很多不同类型的钩子
            };
            // ...
        }
    }

    function webpack(options) {
    var compiler = new Compiler();
    ...// 检查options,若watch字段为true,则开启watch线程
    return compiler;
    }
    ...
    ```
* 根据配置找到所有入口文件, 调用 `compiler` 中的 `run` 函数来真正启动构建流程。
* `compile` 开始编译， 主要是创建一个 `compilation` 对象, 该对象是编译的主要执行者，会依次执行下述流程：
    - 模块创建
    - 依赖收集
    - 分块
    - 打包主要任务对象
* `make` 从入口分析模块及其依赖的模块，创建这些模块对象。这时候真正从入口文件 `entry` 开始读取, 执行 `_addModuleChain()`函数， 如下：
    ```js
    _addModuleChain(context, dependency, onModule, callback) {
    ...
    // 根据依赖查找对应的工厂函数
    const Dep = /** @type {DepConstructor} */ (dependency.constructor);
    const moduleFactory = this.dependencyFactories.get(Dep);
    
    // 调用工厂函数NormalModuleFactory的create来生成一个空的NormalModule对象
    moduleFactory.create({
        dependencies: [dependency]
        ...
    }, (err, module) => {
        ...
        const afterBuild = () => {
            this.processModuleDependencies(module, err => {
            if (err) return callback(err);
            callback(null, module);
            });
        };
        
        this.buildModule(module, false, null, null, err => {
            ...
            afterBuild();
        })
    })
    }
    ```

* `build-module` 构建模块, 这一步主要调用配置的 `loaders`, 将模块转化为标准 `js` 模块；用对应的 `loader` 转换之后，使用 `acorn` 解析转换后的内容，输出对应的抽象语法树 `AST` 以方便 `webpack` 后面对代码的解析；从配置的 `entry` 开始，分析其 `AST`, 当遇到 `require / import` 等导入其他模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清楚所有模块的依赖关系。
* `seal` 封装构建结果，生成 `chunks` 对 `chunks` 进行一系列优化操作，并生成要输出的代码。根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `chunk`, 再把每个 `chunk` 转换成一个单独的文件加入到输出列表
* `emit` 输出chunk到结果文件

---

## <a id="3">loader</a>

`loader` 用于对模块的源代码进行转换，在 `import` 或加载模块时预处理文件。  
`webpack` 本身能做的事情，是仅仅分析 `js` 文件的依赖。这显然不符合要求。所以，需要加上对应的 `loader` 来解析不同于 `js` 的内容，比如 `css`、 `less` 等。 

 ![](https://static.vue-js.com/9c2c43b0-a6ff-11eb-85f6-6fac77c0c9b3.png)

 所以，当 `webpack` 在加载到非 `js` 依赖时，会在配置中查找相应的 `loader` 找到解析规则。  

### 配置方式

 配置 `loader` 的方式有三种：
 * 配置文件写入
 * 内联写入，即在 import 前显示指定 `loader`
 * cli方式，在 shell 命令中指定。

 这里仅列举一个配置文件的例子：

 ```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};
```

在 `module` 的 `rules` 属性下中配置 `loader` ，`rules` 是一个数组，数组每一项对应一种文件的解析规则。  
以上面的代码举例，`test` 代表匹配到的文件名字类型，遇见符合这种名字的文件，就使用该解析规则，支持正则表达式。
`loader` 支持链式调用，每一个 `loader` 都会拿到之前处理结果。顺序与数组中的顺序是相反的，即先调用 `sass-loader` ，最后调用 `style-loader`

### 常见loader

* style-loader: 将 css 添加到 DOM 的内联样式标签 style 里。
* css-loader：允许 css 文件通过 import 、 require 引入，并返回 css 代码。
* less-loader：处理 less 为 css，并返回 css 文件，这时候可以交由 css-loader 处理。
* sass-loader: 处理sass等，效果同 less-loader。
* postcss-loader: css预处理器，功能有利用 can i use 网站的数据添加特定厂商前缀，避免 css 全局命名冲突，转化最新css语法为大多数浏览器读懂的内容，类似 js 的 babel 。 详情可见 https://www.postcss.com.cn/
* file-loader：分发文件到 output 目录并返回相对路径
* url-loader：将符合设定大小的文件返回一个base64的内嵌
* html-minify-loader: 压缩HTML
* babel-loader: 用 babel 转换最新的语法至大部分浏览器可以理解的语法。

---

## <a id="4">plugin</a>

### 与 loader 的不同
`loader` 仅针对加载资源文件进行处理，而 `plugin` 更加强大，他可以在 `webpack` 的整个周期进行作用，灵活改变构建过程，前提是这个事件周期是 `webpack` 广播的事件。  
`plugin` 会提供打包优化、资源管理、环境变量注入等功能。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {
  ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};
```

### 结构
是一个具有 `apply` 方法的对象。`plugin` 提供的 `apply` 方法会以 `compiler` 为参数，进行调用。 `compiler` 中会提供钩子函数来掌控调用时机。

```javascript
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {

    // pluginName就是这个插件的名称
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建过程开始！');
    });
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;
```

关于 `complier` 提供的钩子, 有如下：
* entry-option： 初始化 option
* run
* compile： 真正开始编译，在创建 `compilation` 对象之前
* compilation： `compilation` 创建完毕
* make： 从 `entry` 开始递归分析依赖，准备对每个模块进行 `build`
* after-complie: 编译 `build` 过程结束
* emit： 内容中的 assets 写到磁盘之前。
* after-emit： emit 之后。
* done： 完成所有编译过程。
* failed：编译失败。

### 常见plugin
![](https://static.vue-js.com/bd749400-a7c2-11eb-85f6-6fac77c0c9b3.png)

其中 extractTextWebpackPlugin， 在webpack4 之后用 mini-css-extract-plugin 替换。

---

## <a id="5">构建优化</a>

常见手段如下：
* 优化 loader 配置
    - 配置 `include` `exclude` `test` 
* 合理使用 resolve.extensions， 尽量不要使用不必要的后缀省略
* 优化 resolve.modules
    - resolve.modules 用于配置 `webpack` 去哪些目录下找第三方模块。
* 优化 resolve.alias
* 使用 dllPlugin 插件
* 使用 cache-loader
* terser 启用多线程
* 合理使用 sourceMap

## <a id="6">性能优化</a>

主要优化手段有：

* js 代码压缩
    - terser 
* css 代码压缩
    - css-minimizer-webpack-plugin
* html 文件代码压缩
    - HtmlWebpackPlugin
* 文件大小压缩
    - compressionPlugin
    ```js
    new ComepressionPlugin({
        test:/\.(css|js)$/,  // 哪些文件需要压缩
        threshold:500, // 设置文件多大开始压缩
        minRatio:0.7, // 至少压缩的比例
        algorithm:"gzip", // 采用的压缩算法
    })
    ```
* 图片压缩
* tree shaking
* 代码分离
* 内联 chunk

