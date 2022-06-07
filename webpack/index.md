# webpack

1. [理解](#1)
2. [构建流程](#2)

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
* 