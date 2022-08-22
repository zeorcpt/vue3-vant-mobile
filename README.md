vue3.2 + vite + vant + pinia + ts 移动端 h5 项目新手实践

- [前言](#前言)
- [Vite 创建项目](#vite-创建项目)
- [代码规范 (格式化、提示)](#代码规范-格式化提示)
  - [eslint](#eslint)
  - [prettier](#prettier)
  - [husky, lint-stage, commitlint](#husky-lint-stage-commitlint)
  - [保存文件自动格式化](#保存文件自动格式化)
  - [Volar](#volar)
- [配置 tsconfig](#配置-tsconfig)
- [环境变量](#环境变量)
- [CSS 预处理器](#css-预处理器)
- [Vant](#vant)
  - [按需引入](#按需引入)
  - [unplugin-vue-components](#unplugin-vue-components)
  - [定制主题](#定制主题)
- [移动端适配](#移动端适配)
  - [添加 meta 标签](#添加-meta-标签)
  - [PostCSS](#postcss)
  - [vw方案](#vw方案)
  - [rem方案](#rem方案)
- [自动导入API](#自动导入api)
- [vue-router](#vue-router)
- [layout布局](#layout布局)
- [Pinia 🍍](#pinia-)
- [Axios](#axios)
- [移动端调试](#移动端调试)
- [Hooks](#hooks)
- [关于可选链(Optional chaining)(?.)的使用问题](#关于可选链optional-chaining的使用问题)
- [Watermark 水印](#watermark-水印)
- [全局禁止复制粘贴](#全局禁止复制粘贴)
- [定位](#定位)
- [图片旋转](#图片旋转)
- [Icon组件](#icon组件)
- [其他](#其他)


# 前言

+ 数月前，公司有个新 H5 (虽然不认同 H5 这个叫法，但是大部分人都这么叫🤷‍♂️)项目给到我，作为一名移动端开发小白，免不了各种搜索&踩坑，过程曲折，于是有了这篇文章，希望对需要帮助的人有些许帮助 (废话文学)。
+ 既然是新项目，那肯定要甩掉历史袱，什么技术新就上什么，vue3，vite，pinia...嘎嘎新✨
+ 本人是小白，这些技术都是第一次使用，很多实现&思路都是参(chāo)考(xí)其他大佬🧍‍♂️的，如有不对的地方，欢迎各位大佬指正🙇
+ 本文写于2022年8月，有些 API 变化迅速，可能你看到的时候已经不适用了，请注意甄别。
+ 项目示例已上传 github，有需要的可以参考 [vue3-vant-mobile](https://github.com/zeorcpt/vue3-vant-mobile)

# Vite 创建项目

交互式：
```sh
$ npm create vite@latest
Need to install the following packages:
  create-vite@latest
Ok to proceed? (y) y
✔ Project name: … vue3-vant-mobile
✔ Select a framework: › vue
✔ Select a variant: › vue-ts
```

或者一步到胃式：
```sh
# npm 7+, extra double-dash is needed:
npm create vite@latest vue3-vant-mobile -- --template vue-ts
```

初始目录结构：
```
.
├── .gitignore
├── .vscode
│   └── extensions.json
├── README.md
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.vue
│   ├── assets
│   │   └── vue.svg
│   ├── components
│   │   └── HelloWorld.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
> 注意：  
> Vite2 需要 Node.js 版本 >= 12.0.0；Vite3 需要 Node.js 版本 14.18+，16+。  
> 我当初创建项目是vite@2.9.5，现在已经3.0.x了🤨

咱就是说，vite在我公司那台15款8g内存🤦‍♂️的mbp上真是快到飞起🚀，终于免去了我在公司老旧项目中不敢随便command+s的痛苦(按一下保存得编译个10s，期间卡到只能双手离开键盘🤷‍♂️)。还没上车vite的xdm还不赶紧冲👊 [vite中文官网: https://cn.vitejs.dev](https://cn.vitejs.dev)

> 补充一点🤏小知识  
> 
> 写文章时发现使用 `npm create vite@latest` 创建的项目(vite@3.0.x)会在 `package.json` 中加入 `"type": "module"` ，而我当初创建项目时使用的vite@2.9.5是没有添加 type 字段的
> 
> type字段用于定义package.json文件和该文件所在目录根目录中 **.js** 文件和 **无拓展名** 文件的模块化处理规范。值为 **module** 则采用ESModule规范；值为 **commonjs** 或 **省略** 则采用commonjs规范
> 
> 不论package.json中的type字段为何值，**.mjs** 的文件都按照es模块来处理，**.cjs** 的文件都按照commonjs模块来处理
> 
> 所以需要注意，根目录下的 **.js** 配置文件一般都是commonjs模块，需要命名为 **.cjs**。如：下面会讲到的eslintrc如果是通过'npx eslint --init'自动生成的，那么其后缀自动为 **.cjs**，prettierrc 和 postcss.config是手动创建的，那么就需要命名为 **.cjs**
> 
> 或者你也可以直接去掉package.json中的"type": "module"项，依旧使用 **.js** 😏

> 再补充一点🤏🤏小知识
> 
> `npm create vite@latest` 这个命令中的create其实就是init的alias，等同于 `npm init vite@latest`
>  
> 执行'npm create vite@latest'其实会去调用create-vite这个包，用@x.x.x指定的不是vite的版本，而是create-vite的版本。
> 
> 所以如果你想用老版本vite创建项目，如执行 `npm create vite@2.9.5` ，并不是表示用vite@2.9.5创建项目，而是用create-vite@2.9.5创建项目，创建后的vite版本并不一定是2.9.5。(事实上没有create-vite@2.9.5这个版本，执行这条命令会报错找不到该版本😁)
> 
> 那么怎么查看create-vite和vite对应的版本号呢？
> 
> 直接去vite仓库看模版文件 `vite/packages/create-vite/package.json` ，切换tag找到对应的版本如: [create-vite@2.9.2](https://github.com/vitejs/vite/blob/create-vite@2.9.2/packages/create-vite/template-vue-ts/package.json)
> 
> 可以看到对应关系为：
> + create-vite@2.9.2 -> vite@2.9.5
> + create-vite@2.9.4 -> vite@2.9.9
> + create-vite@3.0.0 -> vite@3.0.0 // 也就是从这个版本开始，package.json 添加了 "type": "module"

# 代码规范 (格式化、提示)

**代码规范必不可少**

## eslint

```sh
# 自动生成配置文件并安装下面四个依赖
npx eslint --init

# 或者手动创建文件
# npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-vue -D
```
```
$ npx eslint --init
You can also run this command directly using 'npm init @eslint/config'.
✔ How would you like to use ESLint? · problems (选第二个)
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · vue
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser, node
✔ What format do you want your config file to be in? · JavaScript
```

> `@typescript-eslint/parser`: ESLint 默认使用的是 Espree 进行语法解析，所以无法对部分 typescript 语法进行解析，需要替换掉默认的解析器
> 
> `@typescript-eslint/eslint-plugin`: 作为 eslint 默认规则的补充，提供了一些额外的适用于 ts 语法的规则
> 
> `eslint-plugin-vue`: 让 eslint 识别 vue 文件

## prettier

```sh
npm i prettier eslint-config-prettier eslint-plugin-prettier -D
```

+ 创建prettier文件

```js
// prettier.cjs

module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false, // 是否使用tab进行缩进，默认为false
  singleQuote: true, // 是否使用单引号代替双引号，默认为false
  semi: true, // 行尾是否使用分号，默认为true
  arrowParens: 'always',
  endOfLine: 'auto',
  vueIndentScriptAndStyle: true,
  htmlWhitespaceSensitivity: 'strict',
};
```

+ 配置eslintrc

```js
// eslintrc.cjs

module.exports = {
  root: true, // 停止向上查找父级目录中的配置文件
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier', // eslint-config-prettier 的缩写
  ],
  parser: 'vue-eslint-parser', // 指定要使用的解析器
  // 给解析器传入一些其他的配置参数
  parserOptions: {
    ecmaVersion: 'latest', // 支持的es版本
    parser: '@typescript-eslint/parser',
    sourceType: 'module', // 模块类型，默认为script，我们设置为module
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'], // eslint-plugin- 可以省略
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};
```

> 注：  
> 需要给vue自动生成的env.d.ts文件添加eslint忽略注释
> ```ts
> // src/env.d.ts
> 
> // eslint-disable-next-line @typescript-eslint/ no-explicit-any, @typescript-eslint/ban-types
> const component: DefineComponent<{}, {}, any>;
> ```

+ 添加lint命令
```json
// package.json

// 可以运行`npm run lint`检查代码
"lint": "eslint --ext .js,.vue,.ts src --fix"
```

## husky, lint-stage, commitlint

我项目中没有安装，需要的小伙伴可自行安装😌

```sh
# 安装husky和lint-stage，并且配置好husky。
npx mrm lint-staged -D

# 安装commitlint校验提交信息格式
npm install @commitlint/cli @commitlint/config-conventional -D
```

## 保存文件自动格式化
```json
// .vscode/settings.json

{
  // 保存时eslint自动修复错误
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  //保存自动格式化
  "editor.formatOnSave": true
}
```
> 建议将.vscode文件夹添加到git记录中

## Volar

使用vscode的小伙伴请注意，vue3项目就不要使用Vetur插件了，它不支持很多vue3特性，会有很多红线警告。
请使用官方推荐插件`Volar`，现已更名为`Vue Language Features`，再搭配`TypeScript Vue Plugin`，开始愉快地敲代码吧👨‍💻

# 配置 tsconfig

```json
// tsconfig.json

{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    // 👆是初始化默认配置
    /*
      在ts中导入js模块会报错找不到类型声明
      解决方法一：
        仅设置 "allowJs": true 即可
        注：allowJs设置true时，下方include不可以加入'src/**\/*.js'，否则报错'无法写入文件xx因为它会覆盖输入文件'
      方法二：
        仅在 env.d.ts 中加入 declare module '*.js'; 模块定义即可

      总结：和 "include": ["src/**\/*.js"] 没有任何关系
    */
    "allowJs": true, // 允许编译器编译JS，JSX文件
    "baseUrl": "./",
    // "typeRoots": [
    //   "node_modules/@types" // 默认会从'node_modules/@types'路径去引入声明文件
    // ],
    // "types": ["node"] // 仅引入'node'模块
    // "paths"是相对于"baseUrl"进行解析
    // 在vite.config里配置了路径别名resolve.alias，为了让编译 ts 时也能够解析对应的路径，我们还需要配置 paths 选项
    "paths": {
      "@/*": ["src/*"],
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  // references属性是 TypeScript 3.0 的新特性，允许将 TypeScript 程序拆分结构化(即拆成多个文件，分别配置不同的部分)。
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

# 环境变量

> vite官方文档: [环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html)

1. 根目录创建.env.[mode]文件

```sh
# base

# env文件中所有值都是字符串
# 对于true/false的变量，拿到的是'true'/'false'，并不是boolean，不能直接使用，需要判断VITE_KEY === 'true'
# 或者将变量定义为boolean，用'true'表示true，''表示false，使用的时候再用Boolean()转换

# 页面标题
VITE_APP_TITLE = vue3-vant-mobile
# 接口请求地址，会设置到 axios 的 baseURL 参数上
VITE_APP_API_BASE_URL = /api


# .env.development

# 开发环境
NODE_ENV = development

VITE_APP_API_BASE_URL = /api-dev

# 是否在打包时生成 sourcemap
VITE_BUILD_SOURCEMAP = true
# 是否在打包时删除 console 代码
VITE_BUILD_DROP_CONSOLE = false
# 是否开启调试工具 vconsole
VITE_BUILD_VCONSOLE = true

# .env.test
# .env.production
...
```
> .env.[mode]文件中的mode可自定义，如`.env.development`对应package.json脚本中的`--mode development`  
> 只有以 VITE_ 为前缀的变量才会暴露给经过 vite 处理的代码

2. 为 import.meta.env 提供额外的类型定义

```ts
// src/vite-env.d.ts

// vite2为src/env.d.ts，vite3已改为src/vite-env.d.ts

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_API_BASE_URL: string;
  readonly VITE_BUILD_SOURCEMAP: string;
  readonly VITE_BUILD_DROP_CONSOLE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

3. 将src/vite-env.d.ts添加到tsconfig中

```json
// tsconfig.node.json

{
  // 只有同时加入 "src/vite-env.d.ts" 才能使vite.config.ts中能使用src/vite-env.d.ts中的全局类型
  "include": ["vite.config.ts", "src/vite-env.d.ts"]
}
```

4. 定义process.env

> 未添加`@types/node`类型定义的请先添加：  
> ```sh
> npm i @types/node -D
> ```

```ts
// vite.config.ts

import { defineConfig, loadEnv } from 'vite';

export default ({ command, mode }) => {
  // 获取环境变量
  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());
  return defineConfig({
    define: {
      'process.env': env,
    },
  });
};
```

5. 使用环境变量

+ vite.config 中通过 `loadEnv`加载
```ts
// vite.config.ts

build: {
  outDir: 'dist', // 指定打包路径，默认为项目根目录下的 dist 目录
  sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
  // minify默认esbuild，esbuild模式下terserOptions将失效
  // vite3变化：Terser 现在是一个可选依赖，如果你使用的是 build.minify: 'terser'，你需要手动安装它 `npm add -D terser`
  minify: 'terser',
  terserOptions: {
    compress: {
      keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
      drop_console: env.VITE_BUILD_DROP_CONSOLE === 'true', // 去除 console
      drop_debugger: true, // 去除 debugger
    },
  },
  chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
},
```

+ index.html 中通过`vite-plugin-html`加载
```sh
npm i vite-plugin-html -D
```
```ts
// vite.config.ts

import { createHtmlPlugin } from 'vite-plugin-html';

plugins: [
  // 默认会向 index.html 注入 .env 文件的内容，类似 vite 的 loadEnv函数
  // 还可配置entry入口文件， inject自定义注入数据等
  createHtmlPlugin(),
]
```
```html
<!-- index.html -->

<title><%- VITE_APP_TITLE %></title>
```
+ 其他js,ts,vue文件中可使用`import.meta.env`获取环境变量

# CSS 预处理器

> [vite官方文档：css](https://cn.vitejs.dev/guide/features.html#css)

> Vite 提供了对 .scss, .sass, .less, .styl 和 .stylus 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖

我喜欢用不花里胡哨的less😏
```sh
npm i less -D
```

+ 组织样式文件

  1. 创建src/styles文件夹
     - index.less
     - common.less - 公共样式
     - variables.less - 自定义变量  
     ...
  2. 全局引入样式
    ```ts
    // src/main.ts

    import '@/styles/index.less';
    ```

+ 全局使用自定义变量
```ts
// vite.config.ts

css: {
  preprocessorOptions: {
    less: {
      javascriptEnabled: true,
      additionalData: `@import "${resolve(__dirname,'src/styles/index.less')}";`,
    },
  },
},
```

# Vant

> [vant-ui官方文档](https://vant-ui.github.io/vant/#/zh-CN/home)

> 我使用的是vant3，当前vant4尚未发布正式版，v3和v4不兼容

```sh
# 安装

npm i vant
```

## 按需引入

+ 早期官方提供的按需引入：  
只是通过`vite-plugin-style-import`插件按需引入样式，组件还是需要手动按需或全量引入，已废弃
```sh
# v2.0.0会报没有导出styleImport，v1.4.1正常
npm i vite-plugin-style-import@1.4.1 -D 
```
```ts
// vite.config.ts

import styleImport, { VantResolve } from 'vite-plugin-style-import';

plugins: [
  styleImport({
    resolves: [VantResolve()],
  }),
]
```

+ 当前官方提供的按需引入：  
通过`unplugin-vue-components`插件自动按需引入组件和样式
```sh
npm i unplugin-vue-components -D
```
```ts
// vite.config.ts

import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

plugins: [
  Components({
    resolvers: [VantResolver()],
  }),
]
```

+ 使用

通过`unplugin-vue-components`按需引入后，可以直接在.vue文件模板中使用，并自动生成`components.d.ts`类型声明文件，js中仍然需要手动引入组件
```html
<!-- 直接在template中使用，无需手动import -->
<van-button type="primary">主要按钮</van-button>
```
> van组件需要带上van前缀  
> Vant中有个别组件是以函数的形式提供的，包括 Toast，Dialog，Notify 和 ImagePreview 组件，需手动引入函数组件  
> 在使用函数组件时，unplugin-vue-components 无法自动引入对应的样式，因此需要手动引入样式

## unplugin-vue-components

自动引入自定义组件

`unplugin-vue-components` 插件除了会自动引入配置了的ui组件库，还会默认引入 `src/compoents` 下的组件，也可通过 `dirs` 选项指定其他路径

> 自定义组件没有类型提示问题：在tsconfig的include中加入"./components.d.ts"即可解决

但是unplugin-vue-components会将src/compoents下所有的.vue组件都写入components.d.ts类型声明中(deep默认为true)，如果使用 `globs: ['src/components/**/index.vue']` 去匹配部分组件的话，会导致该组件生成的类型为 `Undefined` ，需要自己实现一个 resolvers (自己实现应该能解决，虽然我没试😏)

## 定制主题

> [vant官方文档：ConfigProvider 全局配置](https://vant-ui.github.io/vant/#/zh-CN/config-provider#jie-shao)

> 基础变量  
> Vant 中的 CSS 变量分为 `基础变量` 和 `组件变量`。组件变量会继承基础变量，因此在修改基础变量后，会影响所有相关的组件。

> 修改变量  
> 由于 CSS 变量继承机制的原因，两者的修改方式有一定差异：  
> + 基础变量只能通过 root 选择器 修改，不能通过 ConfigProvider 组件 修改。(1)  
> + 组件变量可以通过 root 选择器 和 ConfigProvider 组件 修改。  

这里我选择 `:root` 选择器，在`src/styles/theme.less`中统一修改vant样式

但是由于样式引用顺序问题：  
不管使用 'vite-plugin-style-import' 还是 'unplugin-vue-components/vite' 插件，都是按需引入组件/样式  
导致引用顺序为：  
基础样式 -> theme.less -> 组件样式 (最先引入基础样式是通过theme.less中 :root 可覆盖基础变量推断而来)  
所以 **theme.less中使用`:root选择器`不能覆盖组件变量**

解决：    
+ 方案一：使用 #app 代替 :root 选择器，通过提高选择器的权重来覆盖组件变量

+ 方案二：  
  1. 在 vite.config.ts 中通过 'VantResolver({ importStyle: false })' 关闭自动按需引入样式
  2. 在 main.ts 中全量引入组件样式: import 'vant/lib/index.css' // 必须在 theme.less 之前
  3. 在theme.less中可以正常使用 :root 选择器覆盖基础/组件变量了

缺点：  
全量引入组件样式会导致打包后体积变大(我实测大了大概100k，非权威非标准非官方数据🙅🏻‍♂️)

但是：  
> Vant 中有个别组件是以函数的形式提供的，包括 Toast，Dialog，Notify 和 ImagePreview 组件。在使用函数组件时，unplugin-vue-components 无法自动引入对应的样式，因此需要手动引入样式。

手动引入单独的样式: import 'vant/es/toast/style' 等非常麻烦   
不如直接全量引入所有组件样式: import 'vant/lib/index.css'😏

综上：  
如使用 'vite-plugin-style-import' 插件按需引入，则可直接采用方案一
如使用 'unplugin-vue-components/vite' 插件按需引入，则采用方案二

'unplugin-vue-components/vite' 插件虽然要全量引入样式文件导致 build 体积变大(没有大太多)，但是可自动导入组件，免去手动导入的麻烦
对包体积大小没有特殊要求的话，建议选择 'unplugin-vue-components/vite'

> 现在vant官方已经推荐使用 'unplugin-vue-components/vite' 了，最新文档中已没有 'vite-plugin-style-import' 的使用方法

# 移动端适配

*好家伙，终于讲到移动端了🥵*

背景原理等我就不讲了，具体可以去看大佬们的讲解。这里我就讲 `vw` 和 `rem` 这两种方案的实现

## 添加 meta 标签

```html
<!-- index.html -->

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
```
## PostCSS

不管哪种方案，都免不了 PostCSS 的支持，由于 vite 已经内置 PostCSS ，所以只需要在根目录创建一个 postcss.config.cjs 配置文件即可。

## vw方案

vw方案使用 `postcss-px-to-viewport` 插件将 px 单位转化为 vw/vh 单位

```sh
npm i postcss-px-to-viewport -D
```
```js
// postcss.config.cjs

module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375,
    },
  },
};
```

别急，你以为就这样完事了吗，并没有。上面只是对设计稿尺寸为 375 的进行转换( vant 设计稿尺寸是 375 🤦‍♂️)，但是我们大部分设计稿尺寸都是 750 ，所以需要额外对 750 尺寸的进行处理。

那么问题来了，怎么配置多个尺寸呢，postcss-px-to-viewport 文档并没有指明，自己尝试解决吧🤷‍♂️

由于 postcss-px-to-viewport 没有提供类似 postcss-pxtorem 中 `rootValue({ file }) {}` 的方法，即便使用 `module.exports = (param) => {}` 这种方式导出postcss配置，也拿不到当前转换文件的信息，所以无法根据文件路径动态设置 viewportWidth，

有一种hack方式：通过多次 `px2viewport()` 处理不同文件来设置viewportWidth😎

```js
// postcss.config.cjs

const px2viewport = require('postcss-px-to-viewport');

plugins: [
  px2viewport({
    // vant
    viewportWidth: 375,
    exclude: [/^(?!.*node_modules\/vant)/],
    // include: [/node_modules\/vant/],
  }),
  px2viewport({
    // 非vant
    viewportWidth: 750,
    exclude: [/node_modules\/vant/],
  }),
],
```

第一个处理 vant 的 px2viewport 为什么不用include选项呢？

因为 `postcss-px-to-viewport v1.1.1` **不支持 include** 配置项，`v1.2.0` 开始加入include，但是并没有发布到npm仓库🤦‍♂️

并且由于 postcss-px-to-viewport **不支持 postcss 8.x** ，而vite内置postcss 8.x，所以使用postcss-px-to-viewport会抛出警告🤦‍♂️

改用 `postcss-px-to-viewport-8-plugin` 替代，既支持 include 配置项，也支持postcss 8.x

我太难了兄弟萌😭

最终完整的postcss.config代码为：
```js
// postcss.config.cjs

const autoprefixer = require('autoprefixer');
const px2viewport = require('postcss-px-to-viewport-8-plugin');

const basePx2viewport = {
  unitToConvert: 'px', // 需要转换的单位，默认为 px
  // viewportWidth: 750, // 设计稿的视口宽度
  unitPrecision: 3, // 单位转换后保留的精度（很多时候无法整除）
  propList: [
    '*',
    //  '!font-size'
  ], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
  viewportUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
  fontViewportUnit: 'vw', // 字体使用的视口单位
  // 指定不转换为视口单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
  // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
  // 下面配置表示类名中含有'keep-px'以及'.ignore'类都不会被转换
  selectorBlackList: ['.ignore', 'keep-px'],
  minPixelValue: 1, // 设置最小的转换数值，这里小于或等于 1px 不转换为视口单位
  mediaQuery: false, // 媒体查询里的单位是否需要转换单位
  // exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件
  // include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
};

module.exports = {
  plugins: [
    autoprefixer(),
    // vant
    px2viewport({
      ...basePx2viewport,
      viewportWidth: 375,
      exclude: [/^(?!.*node_modules\/vant)/],
      // include: [/node_modules\/vant/],
    }),
    // 非vant
    px2viewport({
      ...basePx2viewport,
      viewportWidth: 750,
      exclude: [/node_modules\/vant/],
    }),
  ],
};
```

## rem方案

rem方案使用 `postcss-pxtorem` 插件将 px 单位转化为 rem 单位，并且用 `lib-flexible` 设置rem基准值

尽管连 lib-flexible 自己都建议使用vw方案：
> 由于viewport单位得到众多浏览器的兼容，lib-flexible这个过渡方案已经可以放弃使用，不管是现在的版本还是以前的版本，都存有一定的问题。建议大家开始使用viewport来替代此方案。

但 vw 方案 还是有缺点的。如 vw 方案**不适合大屏**，因为 vw 是一个比例单位，随着屏幕尺寸变大，使用vw单位的元素、字体也越来越大。但我们肯定是希望在大屏上展示更多的内容，而不是更大的文字、图标。

由于我们的产品使用场景包括手机和平板等设备，所以必须考虑大屏的适配。我曾经尝试过使用 `scale` 和 `zoom` 的方式，将大屏上的元素按比例缩小，但是效果都不太理想。最后还是选择 `rem方案`，因为 rem方案 可以通过媒体查询来限制基准值(根字体)大小。

配置rem方案就简单多了😅

1. 引入 lib-flexible

```sh
npm i amfe-flexible
```
```js
// src/main.ts

import 'amfe-flexible';
```

2. 引入 postcss-pxtorem

```sh
npm i postcss-pxtorem -D
```
```js
// postcss.config.cjs

const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    autoprefixer(),
    pxtorem({
      rootValue({ file }) {
        return file.indexOf('node_modules/vant') !== -1 ? 37.5 : 75;
      },
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.ignore', 'keep-px'],
      minPixelValue: 1,
      mediaQuery: false,
    }),
  ],
};
```

> 特别注意：

> 如果用vant官网示例 `file.indexOf('vant')` 来匹配文件，请确保你的项目名或文件名没有包含'vant'  
> 建议改为 `file.indexOf('node_modules/vant')`

> 一开始写这篇文章时写的demo项目我没注意，用的vant官网示例 `file.indexOf('vant')` 匹配文件，后来发现怎么转换 rem 单位不对劲，找了半天才发现原来我项目命名为 `vue3-vant-mobile`，导致 **rootValue** 一直为 **37.5** 😓

3. 创建 response.less 文件，限制根字体最大值
```less
// src/styles/response.less

// prettier-ignore 忽略prettier对 PX 的自动格式化
// !important 提高权重，使其覆盖 lib-flexible 设置的font-size

@media screen and (min-width: 768px) {
  html {
    /* prettier-ignore */
    font-size: 50PX !important;
  }
}
```

这里只是由于插件问题导致vw方案比rem方案配置起来麻烦许多，本身vw、rem方案没有偶孰强孰弱之分，大家看自己需求选择即可✌️

# 自动导入API

前面介绍了一个自动按需引入组件的插件 `unplugin-auto-import` ，秉着能少写一行代码就少写一行代码的精神，再介绍一个自动导入api的插件 `unplugin-auto-import` 😌

[github: unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)

```sh
npm i unplugin-auto-import -D
```
```ts
// vite.config.ts

import AutoImport from 'unplugin-auto-import/vite';

plugins: [
  AutoImport({
    imports: ['vue', 'vue-router'],
    // 设置为在'src/'目录下生成解决ts报错，默认是当前目录('./'，即根目录)
    dts: 'src/auto-import.d.ts',
    // 自动生成'eslintrc-auto-import.json'文件，在'.eslintrc.cjs'的'extends'中引入解决报错
    // 'vue-global-api'这个插件仅仅解决vue3 hook报错
    eslintrc: {
      enabled: true,
    },
  }),
]
```
```js
// .eslintrc.cjs

extends: [
  // 解决使用自动导入api报错
  './.eslintrc-auto-import.json',
  // 单独解决使用vue api时报错
  // 'vue-global-api',
],
```

接下来就可以全局使用 vue、vue-router 相关 api，不用一个个手动导入了。哪些 api 可用请参考生成的 `src/auto-import.d.ts` 类型声明文件。

插一个小方法：  
vue3 组合式 api 使用 ref 定义一个响应式变量，用 reactive 定义一个响应式对象，
当变量较多使用 ref 一个个定义麻烦时，可以用 reactive 定义一个 **state** 对象，将其他变量收入 state 中，既方便管理，又省略了使用 ref 变量时的 .value 😌
```ts
const state = reactive({
  num: 1,
  bool: true,
  user: {
    name: '张三',
    nick: '法外狂徒'
  }
})
```

# vue-router

[vue-router官方文档](https://router.vuejs.org/zh/)

1. 安装
```sh
npm i vue-router@4
```

2. 创建路由
```ts
// src/router/index.ts

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'app',
    meta: {
      title: 'app',
    },
    component: () => import('@/App.vue'),
  },
  // 替代vue2中的'*'通配符路径
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  routes,
});
export default router;
```

3. 挂载路由
```ts
// src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';

const app = createApp(App);
app.use(store);
app.mount('#app');
```

4. 使用

> router-view 将显示与 url 对应的组件。你可以把它放在任何地方，以适应你的布局。

```html
<template>
  <router-view />
</template>
```

# layout布局

可以创建一个 layout 基础布局页面，将公共部分如页首、页脚都包裹进来，需要 layout 的页面则作为这个 layout 的子路由。

1. 创建 src/layout 文件夹
```html
<!-- src/layout/index.vue -->

<template>
  <div class="layout">
    <Header />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Header from './Header/index.vue';
</script>
```

2. 修改路由
```ts
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/index',
    children: [
      // 需要layout的页面
      {
        path: 'index',
        name: 'index',
        meta: {
          title: 'index',
        },
        component: () => import('@/pages/index.vue'),
      },
    ],
  },
  // 不需要layout的页面
  // 替代vue2中的'*'通配符路径
  { path: '/:pathMatch(.*)*', redirect: '/' },
];
```

# Pinia 🍍

[pinia官方文档](https://pinia.vuejs.org/)

[pinia非官方中文文档](https://pinia.web3doc.top/)

> Pinia 最初是为了探索 Vuex 的下一次迭代会是什么样子，结合了 Vuex 5 核心团队讨论中的许多想法。最终，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分内容，并决定实现它 取而代之的是新的建议。  
> 与 Vuex 相比，Pinia 提供了一个更简单的 API，具有更少的规范，提供了 Composition-API 风格的 API，最重要的是，在与 TypeScript 一起使用时具有可靠的类型推断支持。

> Pinia API 与 Vuex ≤4 有很大不同，即：  
> + mutations 不再存在。他们经常被认为是 非常 冗长。他们最初带来了 devtools 集成，但这不再是问题。
> + 无需创建自定义复杂包装器来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能利用 TS 类型推断。
> + 不再需要注入、导入函数、调用函数、享受自动完成功能！
> + 无需动态添加 Store，默认情况下它们都是动态的，您甚至都不会注意到。请注意，您仍然可以随时手动使用 Store 进行注册，但因为它是自动的，您无需担心。
> + 不再有 modules 的嵌套结构。您仍然可以通过在另一个 Store 中导入和 使用 来隐式嵌套 Store，但 Pinia 通过设计提供平面结构，同时仍然支持 Store 之间的交叉组合方式。 **您甚至可以拥有 Store 的循环依赖关系**。
> + 没有 命名空间模块。鉴于 Store 的扁平架构，“命名空间” Store 是其定义方式所固有的，您可以说所有 Store 都是命名空间的。

1. 安装
```sh
npm i pinia
```

2. 创建store
```ts
// src/store/index.ts

import { createPinia } from 'pinia';

const pinia = createPinia();

export default pinia;
```

3. 挂载store
```ts
// src/main.ts

import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';

const app = createApp(App);
app.use(store);
app.mount('#app');
```

4. 创建useUserStore
```ts
// src/store/modules/user/index.ts

import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  // id: 'user', // id必填，且需要唯一。两种写法
  state: () => {
    return {
      name: '张三',
    };
  },
  getters: {
    nameLength: (state) => state.name.length,
  },
  actions: {
    updateName(name: string) {
      this.name = name;
    },
  },
});
```

5. 使用useUserStore
   
```html
<!-- src/pages/pinia/index.vue -->

<template>
  <div class="pinia">
    <div class="name">用户名:{{ userStore.name }}</div>
    <div class="length">长度:{{ userStore.nameLength }}</div>
    <van-button type="primary" @click="updateName(true)">action修改store中的name</van-button>
    <van-button @click="updateName(false)">patch修改store中的name</van-button>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';

  const userStore = useUserStore();

  const updateName = (isAction: boolean) => {
    if (isAction) {
      // action 修改 store 中的数据
      userStore.updateName('userStore.updateName方式');
    } else {
      // 未定义 action 时可以用 $patch 方法直接更改状态属性
      // $patch 修改 store 中的数据
      userStore.$patch({
        name: 'userStore.$patch方式',
      });
    }
  };
</script>
```

# Axios

[Axios官方文档](https://axios-http.com/zh/)

1. 安装
```sh
npm i axios
```
2. 新建 src/utils/http 文件夹

+ 封装axios

```ts
// src/utils/http/axios.ts

import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import type { Response } from './types';
// import { auth } from '@/utils';
import { Toast } from 'vant';
import router from '@/router';

axios.defaults.timeout = 1000 * 60;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 创建axios实例
const service = axios.create({
  // 根据不同env设置不同的baseURL
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

// axios实例拦截请求
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers = {
      ...config.headers,
      // ...auth.headers(), // 你的自定义headers，如token等
    };
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// axios实例拦截响应
service.interceptors.response.use(
  // 2xx时触发
  (response: AxiosResponse<Response>) => {
    // response.data就是后端返回的数据，结构根据你们的约定来定义
    const { code, message } = response.data;
    let errMessage = '';
    switch (code) {
      case 0:
        break;
      case 1: // token过期
        errMessage = 'Token expired';
        router.push('/login');
        break;
      case 2: // 无权限
        errMessage = 'No permission';
        break;
      default:
        errMessage = message;
        break;
    }
    if (errMessage) Toast.fail(errMessage);
    return response;
  },
  // 非2xx时触发
  (error: AxiosError) => {
    Toast.fail('Network Error...');
    return Promise.reject(error);
  }
);

export type { AxiosResponse, AxiosRequestConfig };

export default service;
```
```ts
// src/utils/http/types.ts

// 和后端约定好接口返回的数据结构
export interface Response<T = any> {
  code: number | string;
  message: string;
  result: T;
}
```

+ 封装请求方法

```ts
// src/utils/http/index.ts

import service, { AxiosRequestConfig } from './axios';
export * from './types';

export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    service
      .request(config)
      .then((res) => {
        // 一些业务处理
        resolve(res.data);
      })
      .catch((err) => {
        console.log('request fail:', err);
      });
  });
};

const http = {
  get<T = any>(url: string, params = {}, config?: AxiosRequestConfig): Promise<T> {
    return request({ url, params, ...config, method: 'GET' });
  },
  post<T = any>(url: string, data = {}, config?: AxiosRequestConfig): Promise<T> {
    return request({ url, data, ...config, method: 'POST' });
  },
  put<T = any>(url: string, data = {}, config?: AxiosRequestConfig): Promise<T> {
    return request({ url, data, ...config, method: 'PUT' });
  },
  delete<T = any>(url: string, data = {}, config?: AxiosRequestConfig): Promise<T> {
    return request({ url, data, ...config, method: 'DELETE' });
  },
  // 上传文件，指定 'Content-Type': 'multipart/form-data'
  upload<T = any>(url: string, data = {}, config?: AxiosRequestConfig): Promise<T> {
    return request({
      url,
      data,
      ...config,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default http;
```

封装axios的方式多种多样，根据自己喜欢的方式实现就好，还可以根据需求增加重试或者取消请求等方法😌

3. 创建api文件夹

```ts
// src/api/user/index.ts

import http, { Response } from '@/utils/http';

export interface LoginParams {
  username: string;
  password: string;
}

interface UserInfo {
  id: number;
  username: string;
  mobile: number;
  email: string;
}

export default {
  async login(params: LoginParams) {
    return await http.post<Response<UserInfo>>('/user/login', params);
  },
};
```

4. 调用api

```ts
import Api from '@/api/user';

const login = async () => {
    const { code, result, message } = await Api.login(loginInfo);
    // do something
};
```

# 移动端调试

[github: vConsole](https://github.com/Tencent/vConsole)

> 一个轻量、可拓展、针对手机网页的前端开发者调试面板。  
> vConsole 是框架无关的，可以在 Vue、React 或其他任何框架中使用。  
> 现在 vConsole 是微信小程序的官方调试工具。  

在vite中，我们需要配合 `vite-plugin-vconsole` 插件来使用

[github: vite-plugin-vconsole](https://github.com/vadxq/vite-plugin-vconsole)

> 一个适用于Vite的插件，帮助开发者在各个环境下方便使用VConsole的功能。可以方便配置区分环境，根据环境动态加载VConsole，支持多页面配置。


1. 安装

```sh
npm i vconsole 
```
```sh
npm i vite-plugin-vconsole -D
```

2. 配置
```ts
// vite.config.ts

plugin: [
  viteVConsole({
    entry: pathResolve('src/main.ts'),
    localEnabled: true,
    enabled: env.VITE_BUILD_VCONSOLE === 'true',
    config: {
      maxLogNumber: 1000,
      theme: 'dark',
    },
  }),
]
```

3. 添加隐藏开关

虽然通过 `env.VITE_BUILD_VCONSOLE` 可以根据环境变量是开启 vconsole ，但是有时候只让某个环境的部分人能使用，这个时候，可以添加一个隐藏开关，默认不显示 vconsole ，只有手动打开隐藏开关才显示。

```
思路：
    1. env.VITE_BUILD_VCONSOLE 设置为true，开启 vconsole 功能
    2. 通过 css 默认隐藏 vconsole
    3. 在登录页url中添加一个参数 'debug'，登录时如果检测到 debug === 1，则不隐藏 vconsole
```

3.1 提供一个debug工具方法

```ts
// src/utils/debug.ts

import { storage } from './storage';

// MODE，即env[MODE]文件的环境名称(应用运行的模式)
const { MODE, VITE_BUILD_VCONSOLE } = import.meta.env;

// 传入debug参数，将debug存入/移除localStorage
const config = (debug: any) => {
  if (debug === '1') {
    storage.setItem('debug', debug);
  } else {
    storage.removeItem('debug');
  }
  init();
};

// 初始化 vconsole，控制隐藏/显示
const init = () => {
  const vc = <HTMLElement>document.querySelector('#__vconsole');
  const debug = storage.getItem('debug');
  if (VITE_BUILD_VCONSOLE === 'true' && MODE === 'test' && vc) {
    vc.style.display = debug === '1' ? '' : 'none';
  }
};

export default { init, config };
```

3.2 在登录页获取参数

```js
// src/pages/login/index.vue

import debug from '@/utils/debug';

const router = useRouter();

// 进入登录页时获取debug参数
onMounted(() => {
  debug.config(route.query.debug);
});
```

3.3 在app.vue中初始化

```js
// src/App.vue

import debug from '@/utils/debug';

// 因为debug是存入localStorage中的，刷新页面会从localStorage取出，根据debug控制是否隐藏
onMounted(() => {
  debug.init();
});
```

3.4 使用

登录时在url中添加参数 `debug=1` 即可开启
> http://localhost:5173/#/login?debug=1

该隐藏开关只能在 **login** 页手动开启，debug 的值存储在 **localStorage** 中确保刷新页面不会丢失，回到 login 页 **debug 被清除**，需重新添加 **debug=1** 参数才能开启

# Hooks

+ Hooks 不是全新的技术，它是一种开发思想

+ vue中一般称为 `组合式API`

+ 可以把 hooks 理解为 vue2 中 mixin 的升级版

+ 一个比较优秀的库：[VueUse
](https://vueuse.org/)

+ vant中也有一些常用的hooks [vant: 组合式API](https://vant-ui.github.io/vant/#/zh-CN/vant-use-intro)

自定义hooks

下面以自定义一个 loading hooks 示例：

```ts
// src/hooks/useLoading.ts

import { Toast } from 'vant';

export function useLoading() {
  let toast: any = null;

  const startLoading = () => {
    toast = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: 'Loading...',
    });
  };
  const stopLoading = () => {
    toast && toast.clear();
  };

  onBeforeUnmount(stopLoading);

  return { startLoading, stopLoading };
}
```

使用

```ts
import { useLoading } from '@/hooks';

const { startLoading, stopLoading } = useLoading();

const onSubmit = async () => {
  startLoading();
  const { code, result, message } = await Api.login(loginInfo);
  stopLoading();
  // do something
};
```

---

到这里项目的一些基本配置就结束了

下面是一些封装的业务组件或者小功能，不感兴趣的可以止步于此了😁

---

# 关于可选链(Optional chaining)(?.)的使用问题

这个问题对大部分人在大部分场景下并无影响，感兴趣的可以看看 😏

首先看 [caniuse](https://caniuse.com/?search=%3F.) 上关于 `Optional chaining operator` 的兼容性表  
可以看到 可选链 需要 `Chrome >= 80`

所以当使用了可选链的时候，在 Chrome < 80 的浏览器上就会看到如下报错 (本地serve环境时，具体原因下方会解释)
```
[Vue Router warn]: uncaught error during route navigation:
SyntaxError {}
  message: "Unexpected token '.'"
  stack: "SyntaxError: Unexpected token '.'"
  __proto__: SyntaxError {}
Uncaught (in promise) 
  Object {name: "SyntaxError", message: "Unex...
  message: "Unexpected token '.'"
  name: "SyntaxError"
  stack: "SyntaxError: Unexpected token '.'"
  __proto__: Object {}
```

乍一看以为是 Vue Router 的问题，其实重点在下方，`Unexpected token '.'` ，这是浏览器不识别可选链 `.?` 

这个问题在vite的issues下有激烈的讨论：
> [Unable to support functions such as "optional chain" in QQ browser 10 or chrome 70](https://github.com/vitejs/vite/issues/5222)  
> 这个问题是说 dev 时无法在 Chrome 70 下使用 optional chaining 语法？build 后没问题  
> vite 在 dev 模式下转译 sfc 时没有为 esbuild 指定输出目标，导致始终被输出为 esnext  
> Vite 默认的假设就是 dev 环境是跑在最新的浏览器上的，esbuild 只是拿来处理非标准的语法

根据issues，我们采用vite开发人员 [@sodatea](https://github.com/sodatea) 大佬提出的 `rollup-plugin-esbuild` 插件的方法
```ts
// vite.config.ts

import esbuild from 'rollup-plugin-esbuild';

plugins: [
  {
    ...esbuild({
      target: 'chrome70',
      // 如有需要可以在这里加 js ts 之类的其他后缀
      include: /\.(vue|ts|js)$/,
      loaders: {
        '.vue': 'js',
      },
    }),
    enforce: 'post',
  },
]
```

这确实能解决可选链的使用问题，但是，新的问题又出现了😅：  
**使用 rollup-plugin-esbuild 插件方法，会导致sourcemap错乱，无法在devtool里正常debug**

issues里有提到另一个插件 `@rollup/plugin-babel`，通过babel的方式来解决，根据文档尝试进行各种配置都不行，最后找到了另一位大佬 [@hamflx](https://www.hamflx.cn/index.html) 的文章：
> [vite 兼容性踩坑记录](https://www.hamflx.cn/posts/2021/11/23/vite-compatibility.html)  
> 对于 ts 项目，需要配置 extensions 才行  
> 不过，扩展名里加 .vue 的话会报错，一般来说 .vue 文件编译之后会是 js，但是 .vue 里面如果包含了样式，会单独提取出来作为一个虚拟的文件，通过查询参数 type=style 来读取，这里以 babel 来转译样式文件当然报错  
> filter 选项与扩展名之间是且的关系，通过其限定一下，只转义以 .vue 为后缀的文件就行了  

```ts
// vite.config.ts

import babel from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: [ '@babel/plugin-proposal-optional-chaining' ]
      include: include: [/\.vue$/, /\.ts$/],
      extensions: ['.vue', '.ts'],
    })
  ]
})
```

到这里以为就结束了吗，不，没有😢

虽然 `@rollup/plugin-babel` 解决了可选链问题，sourcemap也看似正常，但实际上只是ts文件sourcemap正常，source面板里vue原文件会无法添加断点

尝试解决：在babel配置里增加 `sourceMaps: false` ，关闭babel自己的sourcemap后，可以添加断点，但是会和 `rollup-plugin-esbuild` 插件的方式一样导致断点错乱😥

暂时没有找到更好的解决办法，只能摆烂了：  
在 serve 环境时，如果需要解决低版本chrome可选链报错问题，就打开上面的 babel 配置；如果需要 debug ，则注释掉 babel 配置  
build 时 vite 会对文件进行转译以支持低版本浏览器，不影响

如果大佬有完美解决办法，请不吝赐教🙏

# Watermark 水印

前端水印的实现原理等我就不献丑了，我也是从大佬那里扒来的然后自己稍微修饰了一下🤏，可以去看大佬的讲解：
[掘金@microzz: 前端水印生成方案(网页水印+图片水印)](https://juejin.cn/post/6844903645155164174)

或者看这位大佬的更深入的讲解：
[掘金@程序员秋风: 从破解某设计网站谈前端水印(详细教程)](https://juejin.cn/post/6900713052270755847)

这里我用到的仅是网页水印，没有用到图片水印哦  
一开始我用的是canvas生成水印，但是有一个问题，canvas生成的水印总是看起来有点模糊，各种调整缩放比例都还是模糊，后来改为svg生成水印，就非常清晰了  
下面是svg水印方案具体实现：
```js
// src/utils/lib/watermark.js

let mo = null;

// 添加水印
function add({
  container = document.body,
  width = '200',
  height = '200',
  rotate = -20,
  style = 'font-family: Arial; font-weight: bold',
  fontSize = '16px',
  opacity = 0.12,
  content = '内部资料，禁止外传',
  zIndex = 1000,
} = {}) {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                    <text x="10" y="50%"
                      transform="rotate(${rotate}, ${width / 2} ${height / 2})"
                      style="${style}; font-size: ${fontSize}; opacity: ${opacity}">
                      ${content}
                    </text>
                  </svg>`;
  const base64Url = `data:image/svg+xml;base64,${window.btoa(
    unescape(encodeURIComponent(svgStr))
  )}`;

  const __wm = document.querySelector('.__wm');
  const watermarkDiv = __wm || document.createElement('div');
  const styleStr = `
    position:absolute;
    top:0px;
    left:0px;
    width:100%;
    height:100%;
    z-index:${zIndex};
    pointer-events:none;
    background-repeat:repeat;
    background-image:url('${base64Url}')`;

  watermarkDiv.setAttribute('style', styleStr);
  watermarkDiv.classList.add('__wm');

  container.style.position = 'relative';
  if (!__wm) {
    container.appendChild(watermarkDiv);
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  if (MutationObserver) {
    const args = arguments[0];
    mo = new MutationObserver(function () {
      const __wm = document.querySelector('.__wm');
      if (
        (__wm && __wm.getAttribute('style') !== styleStr) ||
        !__wm ||
        container.style.position !== 'relative'
      ) {
        mo.disconnect();
        mo = null;
        add(args);
      }
    });
    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}

// 移除水印
function remove() {
  const __wm = document.querySelector('.__wm');
  if (__wm) {
    mo.disconnect();
    mo = null;
    document.body.removeChild(__wm);
  }
}

export default { add, remove };
```
```js
// src/App.vue

import watermark from '@/utils/lib/watermark';

onMounted(() => {
  const { username = '', mobile = '' } = auth.getUser();
  watermark.add({ content: username + ' ' + mobile });
});

onBeforeUnmount(() => {
  watermark.remove();
});
```

在登录页时还没有用户信息，所以不需要水印，你也可以省略在登录页先移除水印再添加水印的操作，只要确保进入登录页时你存储的用户信息为空，那水印的内容就为空了
```js
// src/pages/login/index.vue

import watermark from '@/utils/lib/watermark';

onMounted(() => {
  watermark.remove();
});

onBeforeUnmount(() => {
  // const { username = '', mobile = '' } = auth.getUser();
  watermark.add({
    // content: username + ' ' + mobile,
  });
});
```

# 全局禁止复制粘贴

```js
// src/utils/lib/copy-paste.js

function copyPaste(bool) {
  // 右键菜单
  document.oncontextmenu = function () {
    return bool;
  };

  // 文字选择
  document.onselectstart = function () {
    return bool;
  };

  // 复制
  document.oncopy = function () {
    return bool;
  };

  // 剪切
  document.oncut = function () {
    return bool;
  };

  // 粘贴
  document.onpaste = function () {
    return bool;
  };
}

function enable() {
  copyPaste(true);
}

function disable() {
  copyPaste(false);
}

export default { enable, disable };
```

```js
// src/App.vue

import copyPaste from '@/utils/lib/copy-paste';

onMounted(() => {
 copyPaste.disable();
});

onBeforeUnmount(() => {
  copyPaste.enable();
});
```

允许登录页复制粘贴 😌
```js
// src/pages/login/index.vue

import copyPaste from '@/utils/lib/copy-paste';

onMounted(() => {
  copyPaste.enable();
});

onBeforeUnmount(() => {
  copyPaste.disable();
});
```

# 定位

这里采用的是浏览器API：`navigator.geolocation`

> [mdn: Navigator.geolocation](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/geolocation)  
> 安全上下文: 此项功能仅在一些支持的浏览器的安全上下文（HTTPS）中可用。  
> 出于安全考虑，当网页请求获取用户位置信息时，用户会被提示进行授权。注意不同浏览器在请求权限时有不同的策略和方式。  

geolocation 定位依赖于浏览器，也不能直接控制用户打开设备的 GPS 功能，仅能通过浏览器向用户请求获取定位权限，而且如果用户拒绝授权，将无法再次向用户发起权限请求。

此方法限制太多，权当图一乐 😁

```ts
// src/utils/geo.ts

export const geo = {
  // 获取定位
  getLocation(): Promise<Partial<GeolocationCoordinates>> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (err) => {
            console.log(`getPosError:${err.code},${navigator.geolocation},${err.message}`);
          }
        );
      } else {
        console.log('This browser does not support getting geolocation');
      }
    });
  },

  // 根据定位打开google地图
  openMap({ latitude, longitude }: Record<string, string | number>) {
    if (latitude && longitude) {
      const href = `https://www.google.com/maps/place/${Number.parseFloat(
        <string>latitude
      )},${Number.parseFloat(<string>longitude)}`;
      window.open(href, '_blank');
    }
  },
};
```
```html
<!-- src/pages/geo/index.vue -->

<template>
  <div class="geo">
    <van-button type="primary" @click="getGeo">获取定位</van-button>
    <div>当前经纬度： {{ state.position }}</div>
    <van-button type="primary" @click="geo.openMap(state.position)">打开地图</van-button>
  </div>
</template>

<script setup lang="ts">
  import { geo } from '@/utils';

  const state = reactive({
    position: {},
  });

  const getGeo = async () => {
    state.position = await geo.getLocation();
  };
</script>
```

# 图片旋转

有两种方式实现在vant组件 `ImagePreview 图片预览` 中点击旋转图片

1. v-bind 方式：

[vue官方文档: CSS 中的 v-bind()](https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css)

在 style 标签中通过 v-bind 绑定一个 rotate 变量，然后点击按钮改变 rotate 值达到旋转

当在 css 中使用 v-bind 时，vue会在该组件的根元素(所有根元素，因为vue3允许组件有多个根元素)上添加一个css局部变量，如 `style="--e31f55e6-state_rotate:0deg;"` ，然后 v-bind 会被编译为 `var(--e31f55e6-state_rotate)`，其实就是利用的css变量来实现的

```html
<!-- src/pages/image-rotate/index.vue -->

<template>
  <div class="image-preview-rotate-bind">
    <p>v-bind方式</p>
    <van-image width="100" height="100" :src="img" @click="onPreviewBind" />
    <van-image-preview v-model:show="state.showPreviewBind" :images="[img]">
      <template #cover><van-icon name="replay" @click="setRotateBind" /></template>
    </van-image-preview>
  </div>
</template>

<script setup lang="ts">
  import { ImagePreview } from 'vant';

  // ImagePreview 是一个函数，ImagePreview.Component才是组件
  const VanImagePreview = ImagePreview.Component;

  const img = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';

  const state = reactive({
    showPreviewBind: false,
    rotate: '0deg',
  });

  const onPreviewBind = () => {
    state.showPreviewBind = true;
    state.rotate = '0deg';
  };
  const setRotateBind = () => {
    state.rotate = parseInt(state.rotate) + 90 + 'deg';
  };
</script>

<style lang="less">
  .van-image-preview__cover {
    font-size: 40px;
    color: #fff;
    left: 50%;
    top: auto;
    bottom: var(--van-padding-md);
    transform: translate(-50%);
    &:active {
      opacity: 0.4;
    }
  }

  .image-preview-rotate-bind .van-image-preview__image .van-image__img {
    transform: rotate(v-bind('state.rotate'));
  }
</style>
```

2. css 全局变量方式

假如因为某种原因，你不得不将 ImagePreview 这个组件挂载的节点指定为 body ，那么，上面 v-bind 的方式就无效了，因为 v-bind 生成的是 css 局部变量，而组件已被挂载在 body 节点

我们可以如法炮制，自定义 css 全局变量来实现

```ts
// src/utils/util.ts

/**
 * 动态设置css全局变量实现旋转
 * transform: rotate(var(--image-rotate))
 * @param deg 旋转角度
 * @param prop css变量, 默认'--image-rotate'
 */
export const setRotate = (deg: string, prop = '--image-rotate') => {
  let rotate = document.documentElement.style.getPropertyValue(prop) || '0deg';
  if (typeof deg === 'string') {
    rotate = deg;
  } else {
    rotate = parseInt(rotate) + 90 + 'deg';
  }
  document.documentElement.style.setProperty(prop, rotate);
};
```

```html
<!-- 改动点： -->

<van-image-preview
  v-model:show="state.showPreview"
  :images="[img]"
  teleport="body"
  class-name="image-preview-rotate"
>
  <template #cover><van-icon name="replay" @click="setRotate" /></template>
</van-image-preview>

<script setup lang="ts">
import { setRotate } from '@/utils';

const onPreview = () => {
  state.showPreview = true;
  setRotate('0deg');
};
</script>

<style lang="less">
  .image-preview-rotate .van-image-preview__image .van-image__img {
    transform: rotate(var(--image-rotate));
  }
</style>
```

预览图片旋转就讲完了。顺便一提，要实现点击图片预览这个功能需要 vant 的 Image 和 ImagePreview 两个组件配合使用，再加上旋转的话，代码就稍稍繁琐了，我们可以自己封装一个 ImagePreview 组件，将这些功能打包起来，方便使用。由于实现比较简单，我就不献丑了 😌

# Icon组件

有时候项目中有一些图标，一个一个导入比较麻烦，想和 vant 的 Icon 组件一样传入一个 name 就可使用，就可以自己封装一个 Icon 组件

实现自动导入图片主要依靠 `new URL` 这个 API
> [vite: new URL(url, import.meta.url)](https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url)  
> import.meta.url 是一个 ESM 的原生功能，会暴露当前模块的 URL。将它与原生的 URL 构造器 组合使用，在一个 JavaScript 模块中，通过相对路径我们就能得到一个被完整解析的静态资源 URL：  
> ```js
> const imgUrl = new URL('./img.png', import.meta.url).href
> document.getElementById('hero-img').src = imgUrl
> ```
> 这在现代浏览器中能够原生使用 - 实际上，Vite 并不需要在开发阶段处理这些代码！  
> 这个模式同样还可以通过字符串模板支持动态 URL：  
> ```js
> function getImageUrl(name) {
>   return new URL(`./dir/${name}.png`, import.meta.url).href
> }
> ```

具体实现：
```html
<!-- src/components/AppIcon/index.vue -->

<template>
  <i class="icon" :style="{ 'background-image': `url(${iconUrl})` }" />
</template>

<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
  });

  const iconUrl = computed(() => {
    return new URL(`/src/assets/icons/${props.name}.png`, import.meta.url).href;
  });
</script>

<style lang="less" scoped>
  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: center / contain;
    vertical-align: middle;
  }
</style>
```
使用：
```html
<AppIcon name="logo" />
```

# 其他

由于ui设计问题，我项目中还需要 web 端如 antd、element 上面那种 menu 和 table 组件，正常的移动端项目是肯定不需要这种组件的，迫于无奈还是自己封装了这俩组件 🤷🏻‍♂️

menu 组件是基于 van-collapse 组件封装，集合了点击展开子菜单，路由跳转，当前路径高亮，侧边收缩等功能  
table 组件是基于原生 table 元素封装，集合了展开子行，勾选行，翻页，传入 columns 列时支持 render 和 slot 两种写法等。

具体实现就不写了，一般人也不需要这类奇葩组件，源码我放 [github](https://github.com/zeorcpt/vue3-vant-mobile/tree/main/src/components) 上了，希望大家用不上😅