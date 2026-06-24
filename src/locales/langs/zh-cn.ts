const local: App.I18n.Schema = {
  system: {
    title: 'ITObs 管理系统',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    cancel: '取消',
    close: '关闭',
    check: '勾选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    createTime: '创建时间',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除吗？',
    detail: '详情',
    edit: '编辑',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '无数据',
    operate: '操作',
    password: '密码',
    pleaseCheckValue: '请检查输入的值是否合法',
    refresh: '刷新',
    reset: '重置',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    userCenter: '个人中心',
    yesOrNo: {
      yes: '是',
      no: '否'
    }
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    layoutMode: {
      title: '布局模式',
      vertical: '左侧菜单模式',
      'vertical-mix': '左侧菜单混合模式',
      horizontal: '顶部菜单模式',
      'horizontal-mix': '顶部菜单混合模式',
      reverseHorizontalMix: '一级菜单与子级菜单位置反转'
    },
    recommendColor: '应用推荐算法的颜色',
    recommendColorDesc: '推荐颜色的算法参照',
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      followPrimary: '跟随主色'
    },
    scrollMode: {
      title: '滚动模式',
      wrapper: '外层滚动',
      content: '主体滚动'
    },
    page: {
      animate: '页面切换动画',
      mode: {
        title: '页面切换动画类型',
        'fade-slide': '滑动',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '缩放消退',
        'zoom-fade': '渐变',
        'zoom-out': '闪现',
        none: '无'
      }
    },
    fixedHeaderAndTab: '固定头部和标签栏',
    header: {
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      },
      multilingual: {
        visible: '显示多语言按钮'
      },
      globalSearch: {
        visible: '显示全局搜索按钮'
      }
    },
    tab: {
      visible: '显示标签栏',
      cache: '标签栏信息缓存',
      height: '标签栏高度',
      mode: {
        title: '标签栏风格',
        chrome: '谷歌风格',
        button: '按钮风格'
      }
    },
    sider: {
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合布局侧边栏宽度',
      mixCollapsedWidth: '混合布局侧边栏折叠宽度',
      mixChildMenuWidth: '混合布局子菜单宽度'
    },
    footer: {
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    watermark: {
      visible: '显示全屏水印',
      text: '水印文本',
      enableUserName: '启用用户名水印'
    },
    themeDrawerTitle: '主题配置',
    pageFunTitle: '页面功能',
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    'iframe-page': '外链页面',
    home: '首页',
    document: '文档',
    document_project: '项目文档',
    'document_project-link': '项目文档(外链)',
    document_vue: 'Vue文档',
    document_vite: 'Vite文档',
    document_unocss: 'UnoCSS文档',
    document_naive: 'Naive UI文档',
    document_antd: 'Ant Design Vue文档',
    'document_element-plus': 'Element Plus文档',
    document_alova: 'Alova文档',
    'user-center': '个人中心',
    about: '关于',
    function: '系统功能',
    alova: 'alova示例',
    alova_request: 'alova请求',
    alova_user: '用户列表',
    alova_scenes: '场景化请求',
    function_tab: '标签页',
    'function_multi-tab': '多标签页',
    'function_hide-child': '隐藏子菜单',
    'function_hide-child_one': '隐藏子菜单',
    'function_hide-child_two': '菜单二',
    'function_hide-child_three': '菜单三',
    function_request: '请求',
    'function_toggle-auth': '切换权限',
    'function_super-page': '超级管理员可见',
    manage: '系统管理',
    manage_user: '用户管理',
    'manage_user-detail': '用户详情',
    manage_role: '角色管理',
    manage_menu: '菜单管理',
    'manage_operation-log': '操作日志',
    ticket: '工单管理',
    'ticket-detail': '工单详情',
    faq: '常见问题',
    'asset-manage': '资产管理',
    'asset-manage_asset': '资产清单',
    'asset-manage_asset-category': '资产分类',
    'asset-manage_repair-record': '维修记录',
    'multi-menu': '多级菜单',
    'multi-menu_first': '菜单一',
    'multi-menu_first_child': '菜单一子菜单',
    'multi-menu_second': '菜单二',
    'multi-menu_second_child': '菜单二子菜单',
    'multi-menu_second_child_home': '菜单二子菜单首页',
    exception: '异常页',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    plugin: '插件示例',
    plugin_copy: '剪贴板',
    plugin_charts: '图表',
    plugin_charts_echarts: 'ECharts',
    plugin_charts_antv: 'AntV',
    plugin_charts_vchart: 'VChart',
    plugin_editor: '编辑器',
    plugin_editor_quill: '富文本编辑器',
    plugin_editor_markdown: 'MD 编辑器',
    plugin_icon: '图标',
    plugin_map: '地图',
    plugin_print: '打印',
    plugin_swiper: 'Swiper',
    plugin_video: '视频',
    plugin_barcode: '条形码',
    plugin_pinyin: '拼音',
    plugin_excel: 'Excel',
    plugin_pdf: 'PDF 预览',
    plugin_gantt: '甘特图',
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    plugin_gantt_vtable: 'VTableGantt',
    plugin_typeit: '打字机',
    plugin_tables: '表格',
    plugin_tables_vtable: 'VTable'
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        reGetCode: '{time}秒后重新获取',
        sendCodeSuccess: '验证码发送成功',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    },
    about: {
      title: '关于',
      introduction: `SoybeanAdmin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。SoybeanAdmin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。`,
      projectInfo: {
        title: '项目信息',
        version: '版本',
        latestBuildTime: '最新构建时间',
        githubLink: 'Github 地址',
        previewLink: '预览地址'
      },
      prdDep: '生产依赖',
      devDep: '开发依赖'
    },
    home: {
      branchDesc:
        '为了方便大家开发和更新合并，我们对main分支的代码进行了精简，只保留了首页菜单，其余内容已移至example分支进行维护。预览地址显示的内容即为example分支的内容。',
      greeting: '早安，{userName}, 今天又是充满活力的一天!',
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      projectCount: '项目数',
      todo: '待办',
      message: '消息',
      ticketTotal: '工单总数',
      ticketPending: '待处理工单',
      assetTotal: '资产总数',
      assetRepairing: '维修中资产',
      ticketTrend: '最近7天工单趋势',
      ticketCount: '工单数',
      faultTypeDistribution: '工单故障类型分布',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!',
        desc2: 'Yanbowe 向 soybean-admin 提交了一个bug，多标签栏不会自适应。',
        desc3: 'Soybean 准备为 soybean-admin 的发布做充分的准备工作!',
        desc4: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        desc5: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！'
      },
      creativity: '创意'
    },
    function: {
      tab: {
        tabOperate: {
          title: '标签页操作',
          addTab: '添加标签页',
          addTabDesc: '跳转到关于页面',
          closeTab: '关闭标签页',
          closeCurrentTab: '关闭当前标签页',
          closeAboutTab: '关闭"关于"标签页',
          addMultiTab: '添加多标签页',
          addMultiTabDesc1: '跳转到多标签页页面',
          addMultiTabDesc2: '跳转到多标签页页面(带有查询参数)'
        },
        tabTitle: {
          title: '标签页标题',
          changeTitle: '修改标题',
          change: '修改',
          resetTitle: '重置标题',
          reset: '重置'
        }
      },
      multiTab: {
        routeParam: '路由参数',
        backTab: '返回 function_tab'
      },
      toggleAuth: {
        toggleAccount: '切换账号',
        authHook: '权限钩子函数 `hasAuth`',
        superAdminVisible: '超级管理员可见',
        adminVisible: '管理员可见',
        adminOrUserVisible: '管理员和用户可见'
      },
      request: {
        repeatedErrorOccurOnce: '重复请求错误只出现一次',
        repeatedError: '重复请求错误',
        repeatedErrorMsg1: '自定义请求错误 1',
        repeatedErrorMsg2: '自定义请求错误 2'
      }
    },
    alova: {
      scenes: {
        captchaSend: '发送验证码',
        autoRequest: '自动请求',
        visibilityRequestTips: '浏览器窗口切换自动请求数据',
        pollingRequestTips: '每3秒自动请求一次',
        networkRequestTips: '网络重连后自动请求',
        refreshTime: '更新时间',
        startRequest: '开始请求',
        stopRequest: '停止请求',
        requestCrossComponent: '跨组件触发请求',
        triggerAllRequest: '手动触发所有自动请求'
      }
    },
    manage: {
      common: {
        status: {
          title: '状态',
          enable: '启用',
          disable: '禁用'
        }
      },
      role: {
        title: '角色列表',
        keyword: '关键字',
        roleName: '角色名称',
        roleCode: '角色编码',
        roleStatus: '角色状态',
        roleDesc: '角色描述',
        permissionAuth: '分配权限',
        form: {
          keyword: '请输入角色名称或编码',
          roleName: '请输入角色名称',
          roleCode: '请输入角色编码',
          roleStatus: '请选择角色状态',
          roleDesc: '请输入角色描述'
        },
        addRole: '新增角色',
        editRole: '编辑角色'
      },
      user: {
        title: '用户列表',
        keyword: '关键字',
        userName: '用户名',
        userGender: '性别',
        nickName: '昵称',
        realName: '真实姓名',
        department: '部门',
        userPhone: '手机号',
        userEmail: '邮箱',
        userStatus: '用户状态',
        userRole: '用户角色',
        form: {
          keyword: '请输入用户名、姓名或手机号',
          userName: '请输入用户名',
          userGender: '请选择性别',
          nickName: '请输入昵称',
          realName: '请输入真实姓名',
          department: '请输入部门',
          userPhone: '请输入手机号',
          userEmail: '请输入邮箱',
          userStatus: '请选择用户状态',
          userRole: '请选择用户角色'
        },
        addUser: '新增用户',
        editUser: '编辑用户',
        resetPassword: '重置密码',
        batchDeleteResult: '批量删除完成，成功 {success} 个，失败 {fail} 个',
        gender: {
          male: '男',
          female: '女'
        },
        roleType: {
          admin: '管理员',
          itStaff: 'IT 运维',
          employee: '普通员工'
        }
      },
      menu: {
        home: '首页',
        title: '菜单列表',
        id: 'ID',
        parentId: '父级菜单ID',
        menuType: '菜单类型',
        menuName: '菜单名称',
        routeName: '路由名称',
        routePath: '路由路径',
        pathParam: '路径参数',
        layout: '布局',
        page: '页面组件',
        i18nKey: '国际化key',
        icon: '图标',
        localIcon: '本地图标',
        iconTypeTitle: '图标类型',
        order: '排序',
        constant: '常量路由',
        keepAlive: '缓存路由',
        href: '外链',
        hideInMenu: '隐藏菜单',
        activeMenu: '高亮的菜单',
        multiTab: '支持多页签',
        fixedIndexInTab: '固定在页签中的序号',
        query: '路由参数',
        button: '按钮',
        buttonCode: '按钮编码',
        buttonDesc: '按钮描述',
        menuStatus: '菜单状态',
        form: {
          home: '请选择首页',
          menuType: '请选择菜单类型',
          menuName: '请输入菜单名称',
          routeName: '请输入路由名称',
          routePath: '请输入路由路径',
          pathParam: '请输入路径参数',
          page: '请选择页面组件',
          layout: '请选择布局组件',
          i18nKey: '请输入国际化key',
          icon: '请输入图标',
          localIcon: '请选择本地图标',
          order: '请输入排序',
          keepAlive: '请选择是否缓存路由',
          href: '请输入外链',
          hideInMenu: '请选择是否隐藏菜单',
          activeMenu: '请选择高亮的菜单的路由名称',
          multiTab: '请选择是否支持多标签',
          fixedInTab: '请选择是否固定在页签中',
          fixedIndexInTab: '请输入固定在页签中的序号',
          queryKey: '请输入路由参数Key',
          queryValue: '请输入路由参数Value',
          button: '请选择是否按钮',
          buttonCode: '请输入按钮编码',
          buttonDesc: '请输入按钮描述',
          menuStatus: '请选择菜单状态'
        },
        addMenu: '新增菜单',
        editMenu: '编辑菜单',
        addChildMenu: '新增子菜单',
        type: {
          directory: '目录',
          menu: '菜单'
        },
        iconType: {
          iconify: 'iconify图标',
          local: '本地图标'
        }
      },
      operationLog: {
        title: '操作日志',
        userName: '操作用户',
        moduleName: '操作模块',
        operationType: '操作类型',
        requestMethod: '请求方式',
        requestUrl: '请求地址',
        requestIp: '请求IP',
        operationResult: '操作结果',
        errorMessage: '错误信息',
        createTime: '操作时间',
        result: {
          success: '成功',
          fail: '失败'
        }
      }
    },
    assetManage: {
      assetCategory: {
        title: '资产分类列表',
        keyword: '关键字',
        categoryName: '分类名称',
        categoryCode: '分类编码',
        description: '分类描述',
        form: {
          keyword: '请输入分类名称或编码',
          categoryName: '请输入分类名称',
          categoryCode: '请输入分类编码',
          description: '请输入分类描述'
        },
        addCategory: '新增分类',
        editCategory: '编辑分类'
      },
      asset: {
        title: '资产列表',
        keyword: '关键字',
        assetNo: '资产编号',
        assetName: '资产名称',
        category: '资产分类',
        brand: '品牌',
        model: '型号',
        serialNo: '序列号',
        assignee: '使用人',
        department: '所属部门',
        location: '存放位置',
        status: '资产状态',
        purchaseDate: '采购日期',
        warrantyExpireDate: '保修截止日期',
        remark: '备注',
        form: {
          keyword: '请输入资产编号、名称、品牌或序列号',
          assetNo: '请输入资产编号',
          assetName: '请输入资产名称',
          category: '请选择资产分类',
          brand: '请输入品牌',
          model: '请输入型号',
          serialNo: '请输入序列号',
          assignee: '请选择使用人',
          department: '请输入所属部门',
          location: '请输入存放位置',
          status: '请选择资产状态',
          purchaseDate: '请选择采购日期',
          warrantyExpireDate: '请选择保修截止日期',
          remark: '请输入备注'
        },
        addAsset: '新增资产',
        editAsset: '编辑资产',
        detail: '资产详情',
        repairHistory: '维修历史',
        statusType: {
          inUse: '在用',
          idle: '闲置',
          repairing: '维修中',
          scrapped: '已报废'
        }
      },
      repairRecord: {
        title: '维修记录列表',
        ticketNo: '工单编号',
        ticketTitle: '工单标题',
        assetNo: '资产编号',
        assetName: '资产名称',
        repairUser: '维修人',
        faultReason: '故障原因',
        repairMethod: '维修方法',
        repairResult: '维修结果',
        repairCost: '维修费用',
        repairedAt: '维修时间',
        editRecord: '编辑维修记录',
        resultType: {
          fixed: '已修复',
          replaceRepair: '更换部件后修复',
          scrapped: '建议报废',
          unresolved: '未解决'
        }
      }
    },
    ticket: {
      title: '工单列表',
      keyword: '关键字',
      ticketNo: '工单编号',
      ticketTitle: '工单标题',
      description: '故障描述',
      faultType: '故障类型',
      priority: '优先级',
      status: '工单状态',
      reporter: '报修人',
      handler: '处理人',
      relatedAsset: '关联资产',
      result: '处理结果',
      addTicket: '新建工单',
      editTicket: '编辑工单',
      detail: '工单详情',
      form: {
        keyword: '请输入工单编号、标题或描述',
        title: '请输入工单标题',
        description: '请输入故障描述',
        faultType: '请选择故障类型',
        relatedAsset: '请选择关联资产（可不选）'
      },
      statusType: {
        pending: '待分派',
        assigned: '已分派',
        processing: '处理中',
        completed: '已完成',
        cancelled: '已取消'
      },
      priorityType: {
        low: '低',
        normal: '普通',
        high: '高',
        urgent: '紧急'
      },
      faultTypeType: {
        hardware: '硬件故障',
        software: '软件故障',
        network: '网络故障',
        printer: '打印机故障',
        account: '账号权限问题',
        other: '其他'
      },
      action: {
        assign: '分派',
        start: '开始处理',
        complete: '完成工单',
        cancel: '取消工单'
      },
      record: {
        title: '处理记录',
        create: '提交工单',
        assign: '分派工单',
        start: '开始处理',
        finish: '完成工单',
        cancel: '取消工单'
      },
      completeForm: {
        result: '处理结果说明',
        faultReason: '故障原因',
        repairMethod: '维修方法',
        repairResult: '维修结果',
        repairCost: '维修费用',
        assetStatusAfterRepair: '维修后资产状态',
        remark: '备注'
      },
      assignForm: {
        handler: '处理人',
        remark: '备注'
      },
      cancelForm: {
        reason: '取消原因'
      }
    },
    faq: {
      title: 'FAQ 列表',
      keyword: '关键字',
      faqTitle: '标题',
      category: '分类',
      summary: '摘要',
      content: '详细内容',
      sortOrder: '排序',
      viewCount: '浏览次数',
      addFaq: '新增 FAQ',
      editFaq: '编辑 FAQ',
      form: {
        keyword: '请输入标题、摘要或内容关键字',
        title: '请输入问题标题',
        category: '请选择分类',
        summary: '请输入问题摘要',
        content: '请输入问题详细内容'
      },
      categoryType: {
        computer: '电脑问题',
        network: '网络问题',
        printer: '打印机问题',
        account: '账号系统问题',
        other: '其他问题'
      }
    }
  },
  form: {
    required: '不能为空',
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码不一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 条'
  }
};

export default local;
