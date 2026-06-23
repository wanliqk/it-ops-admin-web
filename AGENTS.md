## 原则

### 1. 编码前思考

**不要假设，不要隐藏困惑，呈现权衡**

在实现之前：

- 明确陈述你的假设，如果不确定，请提问
- 如果存在多种解读，把它们都列出来，不要默默选择其一
- 如果有更简单的方案，就指出来，在必要时提出反对意见
- 如果有不清楚的地方，停下来，说出哪里让你困惑，然后提问

### 2. 简洁优先

**用最少的代码解决问题，不要过度推测**

- 不要添加要求之外的功能
- 不要为一次性代码创建抽象
- 不要添加未要求的 "灵活性" 或 "可配置性"
- 不要为不可能发生的场景做错误处理
- 如果 200 行代码可以写成 50 行，重写它

**检验标准：** 资深工程师会觉得这过于复杂吗？如果是，简化

### 3. 精准修改

**只碰必须碰的，只清理自己造成的混乱**

编辑现有代码时：

- 不要 "改进" 相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，即使你更倾向于不同的写法
- 如果注意到无关的死代码，提一下，不要删除它

当你的改动产生孤儿代码时：

- 删除因你的改动而变得无用的导入、变量或函数
- 不要删除预先存在的死代码，除非被要求

**检验标准：** 每一行修改都应该能直接追溯到用户的请求

### 4. 目标驱动执行

**定义成功标准，循环验证直到达成**

将指令式任务转化为可验证的目标：

"添加验证" → "为无效输入编写测试，然后让它们通过"
"修复 bug" → "编写重现 bug 的测试，然后让它通过"
"重构 X" → "确保重构前后测试都能通过"

对于多步骤任务，说明一个简短的计划：

```
1. [步骤] → 验证: [检查]
2. [步骤] → 验证: [检查]
3. [步骤] → 验证: [检查]
```

明确有力的成功标准能让你独立循环推进，模糊的标准（"让它工作"）只会不断需要澄清

## 命令

```bash
pnpm i # 安装依赖
pnpm dev # 启动服务
pnpm build:test # 打包构建预发布环境
pnpm build # 打包构建生产环境
pnpm preview # 先执行打包构建命令生成 dist 目录后再执行以下预览命令
pnpm lint # 代码校验与格式化
pnpm test # 单元测试
```

## 架构

### 技术栈

- 框架: Vue 3.5
- 打包构建工具: Vite 7
- 路由管理: Vue Router 5
- 状态管理: Pinia 3
- UI 组件库: Element Plus
- CSS 预处理器: Scss
- 代码校验与格式化: ESLint
- 开发语言: TypeScript
- 包管理工具: pnpm
- 网络请求: Axios

### 目录结构

```sh
it-ops-admin-web
├── .vscode                        //vscode插件和设置
│   ├── extensions.json            //vscode推荐的插件
│   ├── launch.json                //debug配置文件(debug Vue 和 TS)
│   └── settings.json              //vscode配置(在该项目中生效，可以复制到用户配置文件中)
├── build                          //vite构建相关配置和插件
│   ├── config                     //构建打包配置
│   │   └── proxy.ts               //网络请求代理
│   └── plugins                    //构建插件
│       ├── index.ts               //插件汇总
│       ├── router.ts              //elegant-router插件
│       ├── unocss.ts              //unocss插件
│       └── unplugin.ts            //自动导入UI组件、自动解析iconify图标、自动解析本地svg作为图标
├── packages                       //子项目
│   ├── axios                      //网络请求封装
│   ├── color-palette              //颜色调色板
│   ├── hooks                      //组合式函数hooks
│   ├── materials                  //组件物料
│   ├── ofetch                     //网络请求封装
│   ├── scripts                    //脚本
│   ├── uno-preset                 //uno-preset配置
│   └── utils                      //工具函数
├── public                         //公共目录(文件夹里面的资源打包后会在根目录下)
│   └── favicon.svg                //网站标签图标
├── src
│   ├── assets                     //静态资源
│   │   ├── imgs                   //图片
│   │   └── svg-icon               //本地svg图标
│   ├── components                 //全局组件
│   │   ├── advanced               //高级组件
│   │   ├── common                 //公共组件
│   │   └── custom                 //自定义组件
│   ├── constants                  //常量
│   │   ├── app.ts                 //app常量
│   │   ├── business.ts            //业务常量
│   │   ├── common.ts              //通用常量
│   │   └── reg.ts                 //正则常量
│   ├── enums                      //枚举
│   ├── hooks                      //组合式的函数hooks
│   │   ├── business               //业务hooks
│   │   │   ├── auth               //用户权限
│   │   │   └── captcha            //验证码
│   │   └── common                 //通用hooks
│   │       ├── echarts            //echarts
│   │       ├── form               //表单
│   │       ├── icon               //图标
│   │       ├── router             //路由
│   │       └── table              //表格
│   ├── layouts                    //布局组件
│   │   ├── base-layout            //基本布局(包含全局头部、多页签、侧边栏、底部等公共部分)
│   │   ├── blank-layout           //空白布局组件(单个页面)
│   │   ├── context                //布局组件的上下文状态
│   │   ├── hooks                  //布局组件的hooks
│   │   └── modules                //布局组件模块
│   │       ├── global-breadcrumb  //全局面包屑
│   │       ├── global-content     //全局主体内容
│   │       ├── global-footer      //全局底部
│   │       ├── global-header      //全局头部
│   │       ├── global-logo        //全局Logo
│   │       ├── global-menu        //全局菜单
│   │       ├── global-search      //全局搜索
│   │       ├── global-sider       //全局侧边栏
│   │       ├── global-tab         //全局标签页
│   │       └── theme-drawer       //主题抽屉
│   ├── locales                //国际化配置
│   │   ├── langs              //语言文件
│   │   ├── dayjs.ts           //dayjs的国际化配置
│   │   ├── locale.ts          //语言文件汇总
│   │   └── naive.ts           //NaiveUI的国际化配置
│   ├── plugins                //插件
│   │   ├── assets.ts          //各种依赖的静态资源导入(css、scss等)
│   │   ├── dayjs.ts           //dayjs插件
│   │   ├── iconify.ts         //iconify插件
│   │   ├── loading.ts         //全局初始化时的加载插件
│   │   └── nprogress.ts       //顶部加载条nprogress插件
│   ├── router                 //vue路由
│   │   ├── elegant            //elegant-router插件生成的路由声明、导入和转换等文件
│   │   ├── guard              //路由守卫
│   │   ├── routes             //路由声明入口
│   │   │   ├── builtin        //系统内置路由 根路由和未找到路由
│   │   │   └── index          //前端静态路由创建的入口
│   │   └── index.ts           //路由插件入口
│   ├── service                //网络请求
│   │   ├── api                //接口api
│   │   └── request            //封装的请求函数
│   ├── store                  //pinia状态管理
│   │   ├── modules            //状态管理划分的模块
│   │   │   ├── app            //app状态(页面重载、菜单折叠、项目配置的抽屉)
│   │   │   ├── auth           //auth状态(用户信息、用户权益)
│   │   │   ├── route          //route状态(动态路由、菜单、路由缓存)
│   │   │   ├── tab            //tab状态(多页签、缓存页面的滚动位置)
│   │   │   └── theme          //theme状态(项目主题配置)
│   │   └── plugins            //状态管理插件
│   ├── styles                 //全局样式
│   │   ├── css                //css
│   │   └── scss               //scss
│   ├── theme                  //主题配置
│   │   ├── settings.ts        //主题默认配置及覆盖配置
│   │   └── vars.ts            //主题token对应的css变量
│   ├── typings                //TS类型声明文件(*.d.ts)
│   │   ├── api.d.ts           //请求接口返回的数据的类型声明
│   │   ├── app.d.ts           //应用相关的类型声明
│   │   ├── common.d.ts        //通用类型声明
│   │   ├── components.d.ts    //自动导入的组件的类型声明
│   │   ├── elegant-router.d.ts//插件elegant-router生成的路由声明
│   │   ├── env.d.ts           //vue路由描述和请求环境相关的类型声明
│   │   ├── global.d.ts        //全局通用类型
│   │   ├── naive-ui.d.ts      //NaiveUI类型
│   │   ├── router.d.ts        //Vue的路由描述的类型声明
│   │   ├── storage.d.ts       //本地缓存的数据类型
│   │   └── union-key.d.ts     //联合类型
│   ├── utils                  //全局工具函数(纯函数，不含状态)
│   │   ├── common             //通用工具函数
│   │   ├── icon               //图标相关工具函数
│   │   ├── service            //请求服务配置相关的工具函数
│   │   └── storage            //存储相关工具函数
│   ├── views                  //页面
│   │   ├── _builtin           //系统内置页面：登录、异常页等
│   │   ├── about              //关于
│   │   ├── function           //功能
│   │   ├── home               //首页
│   │   ├── manage             //系统管理
│   │   ├── multi-menu         //多级菜单
│   │   └── user-center        //用户中心
│   ├── App.vue                //Vue文件入口
│   └── main.ts                //项目入口TS文件
├── .editorconfig              //统一编辑器配置
├── .env                       //环境文件
├── .env.prod                  //生产环境的环境文件
├── .env.test                  //测试环境的环境文件
├── .gitattributes             //git属性配置
├── .gitignore                 //忽略git提交的配置文件
├── .npmrc                     //npm配置
├── CHANGELOG.md               //项目更新日志
├── eslint.config.js           //eslint flat配置文件
├── index.html                 //html文件
├── package.json               //npm依赖描述文件
├── pnpm-lock.yaml             //npm包管理器pnpm依赖锁定文件
├── README.md                  //项目介绍文档
├── tsconfig.json              //TS配置
├── uno.config.ts              //原子css框架unocss配置
└── vite.config.ts             //vite配置
```

- 保持目录结构清晰，遵循现有目录规范
- 同一个业务逻辑的代码和资源应当被收拢到了一起，避免在不同的目录间来回跳跃

## 约定

- 任何时候都禁止主动删除文件，必须经过同意
