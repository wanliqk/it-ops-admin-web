const local: App.I18n.Schema = {
  system: {
    title: 'SoybeanAdmin',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    add: 'Add',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    cancel: 'Cancel',
    close: 'Close',
    check: 'Check',
    expandColumn: 'Expand Column',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    createTime: 'Created At',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    confirmDelete: 'Are you sure you want to delete?',
    detail: 'Detail',
    edit: 'Edit',
    warning: 'Warning',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    noData: 'No Data',
    operate: 'Operate',
    password: 'Password',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    userCenter: 'User Center',
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    }
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    grayscale: 'Grayscale',
    colourWeakness: 'Colour Weakness',
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode',
      reverseHorizontalMix: 'Reverse first level menus and child level menus position'
    },
    recommendColor: 'Apply Recommended Color Algorithm',
    recommendColorDesc: 'The recommended color algorithm refers to',
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      },
      multilingual: {
        visible: 'Display multilingual button'
      },
      globalSearch: {
        visible: 'Display global search button'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tag Bar Info Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    watermark: {
      visible: 'Watermark Full Screen Visible',
      text: 'Watermark Text',
      enableUserName: 'Enable User Name Watermark'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    'iframe-page': 'Iframe',
    home: 'Home',
    document: 'Document',
    document_project: 'Project Document',
    'document_project-link': 'Project Document(External Link)',
    document_vue: 'Vue Document',
    document_vite: 'Vite Document',
    document_unocss: 'UnoCSS Document',
    document_naive: 'Naive UI Document',
    document_antd: 'Ant Design Vue Document',
    'document_element-plus': 'Element Plus Document',
    document_alova: 'Alova Document',
    'user-center': 'User Center',
    about: 'About',
    function: 'System Function',
    alova: 'Alova Example',
    alova_request: 'Alova Request',
    alova_user: 'User List',
    alova_scenes: 'Scenario Request',
    function_tab: 'Tab',
    'function_multi-tab': 'Multi Tab',
    'function_hide-child': 'Hide Child',
    'function_hide-child_one': 'Hide Child',
    'function_hide-child_two': 'Two',
    'function_hide-child_three': 'Three',
    function_request: 'Request',
    'function_toggle-auth': 'Toggle Auth',
    'function_super-page': 'Super Admin Visible',
    manage: 'System Manage',
    manage_user: 'User Manage',
    'manage_user-detail': 'User Detail',
    manage_role: 'Role Manage',
    manage_menu: 'Menu Manage',
    'manage_operation-log': 'Operation Logs',
    'ticket-manage': 'Ticket Manage',
    'ticket-manage_list': 'Ticket List',
    'ticket-manage_my': 'My Tickets',
    'ticket-manage_category': 'Ticket Categories',
    'ticket-manage_work-group': 'Work Group Management',
    'ticket-manage_ticket-assignment-rule': 'Auto-assignment Rules',
    'ticket-manage_sla-rule': 'SLA Rules',
    'ticket-manage_statistics': 'Ticket Statistics',
    'ticket-detail': 'Ticket Detail',
    faq: 'FAQ',
    notification: 'Notification Center',
    todo: 'Todo Center',
    'todo_my-todo': 'My Todos',
    todo_manage: 'Todo Management',
    'asset-manage': 'Asset Manage',
    'asset-manage_asset': 'Asset List',
    'asset-manage_asset-category': 'Asset Category',
    'asset-manage_repair-record': 'Repair Records',
    'multi-menu': 'Multi Menu',
    'multi-menu_first': 'Menu One',
    'multi-menu_first_child': 'Menu One Child',
    'multi-menu_second': 'Menu Two',
    'multi-menu_second_child': 'Menu Two Child',
    'multi-menu_second_child_home': 'Menu Two Child Home',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    plugin: 'Plugin',
    plugin_copy: 'Copy',
    plugin_charts: 'Charts',
    plugin_charts_echarts: 'ECharts',
    plugin_charts_antv: 'AntV',
    plugin_charts_vchart: 'VChart',
    plugin_editor: 'Editor',
    plugin_editor_quill: 'Quill',
    plugin_editor_markdown: 'Markdown',
    plugin_icon: 'Icon',
    plugin_map: 'Map',
    plugin_print: 'Print',
    plugin_swiper: 'Swiper',
    plugin_video: 'Video',
    plugin_barcode: 'Barcode',
    plugin_pinyin: 'pinyin',
    plugin_excel: 'Excel',
    plugin_pdf: 'PDF preview',
    plugin_gantt: 'Gantt Chart',
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    plugin_gantt_vtable: 'VTableGantt',
    plugin_typeit: 'Typeit',
    plugin_tables: 'Tables',
    plugin_tables_vtable: 'VTable'
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {userName} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        reGetCode: 'Reacquire after {time}s',
        sendCodeSuccess: 'Verification code sent successfully',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    about: {
      title: 'About',
      introduction: `SoybeanAdmin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. SoybeanAdmin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      branchDesc:
        'For the convenience of everyone in developing and updating the merge, we have streamlined the code of the main branch, only retaining the homepage menu, and the rest of the content has been moved to the example branch for maintenance. The preview address displays the content of the example branch.',
      greeting: 'Good morning, {userName}, today is another day full of vitality!',
      weatherDesc: 'Today is cloudy to clear, 20℃ - 25℃!',
      projectCount: 'Project Count',
      todo: 'Todo',
      message: 'Message',
      ticketTotal: 'Total Tickets',
      ticketPending: 'Pending Tickets',
      assetTotal: 'Total Assets',
      assetRepairing: 'Assets In Repair',
      ticketTrend: 'Ticket Trend (Last 7 Days)',
      ticketCount: 'Ticket Count',
      ticketCategoryDistribution: 'Ticket Category Distribution',
      todoStatistics: 'My Todo Statistics',
      todoPendingCount: 'Pending',
      todoProcessingCount: 'Processing',
      todoExpiredCount: 'Expired',
      todoTodayDeadlineCount: 'Due Today',
      todoUrgentCount: 'Urgent',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'Soybean created the open source project soybean-admin on May 28, 2021!',
        desc2: 'Yanbowe submitted a bug to soybean-admin, the multi-tab bar will not adapt.',
        desc3: 'Soybean is ready to do sufficient preparation for the release of soybean-admin!',
        desc4: 'Soybean is busy writing project documentation for soybean-admin!',
        desc5: 'Soybean just wrote some of the workbench pages casually, and it was enough to see!'
      },
      creativity: 'Creativity'
    },
    function: {
      tab: {
        tabOperate: {
          title: 'Tab Operation',
          addTab: 'Add Tab',
          addTabDesc: 'To about page',
          closeTab: 'Close Tab',
          closeCurrentTab: 'Close Current Tab',
          closeAboutTab: 'Close "About" Tab',
          addMultiTab: 'Add Multi Tab',
          addMultiTabDesc1: 'To MultiTab page',
          addMultiTabDesc2: 'To MultiTab page(with query params)'
        },
        tabTitle: {
          title: 'Tab Title',
          changeTitle: 'Change Title',
          change: 'Change',
          resetTitle: 'Reset Title',
          reset: 'Reset'
        }
      },
      multiTab: {
        routeParam: 'Route Param',
        backTab: 'Back function_tab'
      },
      toggleAuth: {
        toggleAccount: 'Toggle Account',
        authHook: 'Auth Hook Function `hasAuth`',
        superAdminVisible: 'Super Admin Visible',
        adminVisible: 'Admin Visible',
        adminOrUserVisible: 'Admin and User Visible'
      },
      request: {
        repeatedErrorOccurOnce: 'Repeated Request Error Occurs Once',
        repeatedError: 'Repeated Request Error',
        repeatedErrorMsg1: 'Custom Request Error 1',
        repeatedErrorMsg2: 'Custom Request Error 2'
      }
    },
    alova: {
      scenes: {
        captchaSend: 'Captcha Send',
        autoRequest: 'Auto Request',
        visibilityRequestTips: 'Automatically request when switching browser window',
        pollingRequestTips: 'It will request every 3 seconds',
        networkRequestTips: 'Automatically request after network reconnecting',
        refreshTime: 'Refresh Time',
        startRequest: 'Start Request',
        stopRequest: 'Stop Request',
        requestCrossComponent: 'Request Cross Component',
        triggerAllRequest: 'Manually Trigger All Automated Requests'
      }
    },
    manage: {
      common: {
        status: {
          title: 'Status',
          enable: 'Enable',
          disable: 'Disable'
        }
      },
      role: {
        title: 'Role List',
        keyword: 'Keyword',
        roleName: 'Role Name',
        roleCode: 'Role Code',
        roleStatus: 'Role Status',
        roleDesc: 'Role Description',
        permissionAuth: 'Assign Permissions',
        form: {
          keyword: 'Please enter role name or code',
          roleName: 'Please enter role name',
          roleCode: 'Please enter role code',
          roleStatus: 'Please select role status',
          roleDesc: 'Please enter role description'
        },
        addRole: 'Add Role',
        editRole: 'Edit Role'
      },
      user: {
        title: 'User List',
        keyword: 'Keyword',
        userName: 'User Name',
        userGender: 'Gender',
        nickName: 'Nick Name',
        realName: 'Real Name',
        department: 'Department',
        userPhone: 'Phone Number',
        userEmail: 'Email',
        userStatus: 'User Status',
        userRole: 'User Role',
        form: {
          keyword: 'Please enter username, real name or phone',
          userName: 'Please enter user name',
          userGender: 'Please select gender',
          nickName: 'Please enter nick name',
          realName: 'Please enter real name',
          department: 'Please enter department',
          userPhone: 'Please enter phone number',
          userEmail: 'Please enter email',
          userStatus: 'Please select user status',
          userRole: 'Please select user role'
        },
        addUser: 'Add User',
        editUser: 'Edit User',
        resetPassword: 'Reset Password',
        batchDeleteResult: 'Batch delete completed: {success} succeeded, {fail} failed',
        gender: {
          male: 'Male',
          female: 'Female'
        },
        roleType: {
          admin: 'Admin',
          itStaff: 'IT Staff',
          employee: 'Employee'
        }
      },
      menu: {
        home: 'Home',
        title: 'Menu List',
        id: 'ID',
        parentId: 'Parent ID',
        menuType: 'Menu Type',
        menuName: 'Menu Name',
        routeName: 'Route Name',
        routePath: 'Route Path',
        pathParam: 'Path Param',
        layout: 'Layout Component',
        page: 'Page Component',
        i18nKey: 'I18n Key',
        icon: 'Icon',
        localIcon: 'Local Icon',
        iconTypeTitle: 'Icon Type',
        order: 'Order',
        constant: 'Constant',
        keepAlive: 'Keep Alive',
        href: 'Href',
        hideInMenu: 'Hide In Menu',
        activeMenu: 'Active Menu',
        multiTab: 'Multi Tab',
        fixedIndexInTab: 'Fixed Index In Tab',
        query: 'Query Params',
        button: 'Button',
        buttonCode: 'Button Code',
        buttonDesc: 'Button Desc',
        menuStatus: 'Menu Status',
        form: {
          home: 'Please select home',
          menuType: 'Please select menu type',
          menuName: 'Please enter menu name',
          routeName: 'Please enter route name',
          routePath: 'Please enter route path',
          pathParam: 'Please enter path param',
          page: 'Please select page component',
          layout: 'Please select layout component',
          i18nKey: 'Please enter i18n key',
          icon: 'Please enter iconify name',
          localIcon: 'Please enter local icon name',
          order: 'Please enter order',
          keepAlive: 'Please select whether to cache route',
          href: 'Please enter href',
          hideInMenu: 'Please select whether to hide menu',
          activeMenu: 'Please select route name of the highlighted menu',
          multiTab: 'Please select whether to support multiple tabs',
          fixedInTab: 'Please select whether to fix in the tab',
          fixedIndexInTab: 'Please enter the index fixed in the tab',
          queryKey: 'Please enter route parameter Key',
          queryValue: 'Please enter route parameter Value',
          button: 'Please select whether it is a button',
          buttonCode: 'Please enter button code',
          buttonDesc: 'Please enter button description',
          menuStatus: 'Please select menu status'
        },
        addMenu: 'Add Menu',
        editMenu: 'Edit Menu',
        addChildMenu: 'Add Child Menu',
        type: {
          directory: 'Directory',
          menu: 'Menu'
        },
        iconType: {
          iconify: 'Iconify Icon',
          local: 'Local Icon'
        }
      },
      operationLog: {
        title: 'Operation Logs',
        userName: 'Operator',
        moduleName: 'Module',
        operationType: 'Operation Type',
        requestMethod: 'Request Method',
        requestUrl: 'Request URL',
        requestIp: 'Request IP',
        operationResult: 'Result',
        errorMessage: 'Error Message',
        createTime: 'Operated At',
        result: {
          success: 'Success',
          fail: 'Fail'
        }
      },
      slaRule: {
        title: 'SLA Rule List',
        name: 'Rule Name',
        allCategories: 'All',
        priority: 'Priority',
        responseMinutes: 'Response Time',
        resolveMinutes: 'Resolve Time',
        minutes: 'min',
        sortOrder: 'Sort Order',
        addRule: 'Add SLA Rule',
        editRule: 'Edit SLA Rule',
        form: {
          name: 'Please enter rule name',
          category: 'Leave empty for a generic rule',
          priority: 'Please select priority',
          responseMinutesInvalid: 'Response time must be greater than 0',
          resolveMinutesInvalid: 'Resolve time must be greater than 0',
          resolveMinutesTooSmall: 'Resolve time must be greater than or equal to response time'
        },
        priorityType: {
          medium: 'Medium'
        }
      },
      workGroup: {
        title: 'Work Group List',
        keyword: 'Keyword',
        groupName: 'Group Name',
        groupCode: 'Group Code',
        leader: 'Leader',
        memberCount: 'Member Count',
        sortOrder: 'Sort Order',
        updateTime: 'Updated At',
        addGroup: 'Add Work Group',
        editGroup: 'Edit Work Group',
        description: 'Description',
        memberManage: 'Members',
        confirmDelete: 'Are you sure you want to delete this work group? Its members will also be disabled.',
        form: {
          keyword: 'Please enter group name or code',
          groupName: 'Please enter group name',
          groupCode: 'Please enter group code',
          groupCodeInvalid: 'Letters, numbers, underscores and hyphens only',
          leader: 'Please select a leader, remote search supported'
        },
        member: {
          title: 'Work Group Members - {groupName}',
          listTitle: 'Member List',
          keyword: 'Keyword',
          username: 'Username',
          realName: 'Real Name',
          phone: 'Phone',
          memberRole: 'Role',
          joinedAt: 'Joined At',
          addMember: 'Add Member',
          editMember: 'Edit Member',
          remove: 'Remove',
          confirmRemove: 'Are you sure you want to remove this member from the work group?',
          user: 'User',
          roleType: {
            leader: 'Leader',
            member: 'Member'
          },
          form: {
            keyword: 'Please enter username, real name or phone',
            user: 'Please select a user, remote search supported'
          }
        }
      },
      assignmentRule: {
        title: 'Auto-assignment Rule List',
        name: 'Rule Name',
        opsGroup: 'Ops Group',
        targetUser: 'Fixed Handler',
        assignStrategy: 'Assign Strategy',
        sortOrder: 'Sort Order',
        remark: 'Remark',
        updateTime: 'Updated At',
        addRule: 'Add Rule',
        editRule: 'Edit Rule',
        anyCategory: 'Any Category',
        anyPriority: 'Any Priority',
        confirmDisable: 'Are you sure you want to disable this rule?',
        leastWorkloadHint: 'The system will pick the member in this group with the fewest open tickets.',
        fixedUserHint: 'Matched tickets will always be assigned to the specified handler.',
        form: {
          name: 'Please enter rule name',
          category: 'Leave empty for any category',
          priority: 'Leave empty for any priority',
          opsGroup: 'Please select an ops group',
          opsGroupOptional: 'Leave empty to not restrict by ops group',
          opsGroupRequired: 'An ops group is required for the least-workload strategy',
          targetUser: 'Please select a fixed handler',
          targetUserRequired: 'A fixed handler is required for the fixed-user strategy'
        }
      },
      ticketCategory: {
        title: 'Ticket Category List',
        keyword: 'Keyword',
        parentCategory: 'Parent Category',
        name: 'Category Name',
        code: 'Category Code',
        description: 'Description',
        defaultPriority: 'Default Priority',
        defaultGroup: 'Default Ops Group',
        requireAsset: 'Requires Asset',
        sortOrder: 'Sort Order',
        addCategory: 'Add Category',
        editCategory: 'Edit Category',
        confirmEnable: 'Are you sure you want to enable this ticket category?',
        confirmDisable:
          'Are you sure you want to disable this ticket category? Users will no longer be able to select it.',
        confirmDelete:
          'Are you sure you want to delete this ticket category? The backend will reject it if tickets still use it.',
        form: {
          keyword: 'Please enter category name or code',
          parentCategory: 'Leave empty for a top-level category',
          name: 'Please enter category name',
          code: 'Please enter category code'
        }
      }
    },
    assetManage: {
      assetCategory: {
        title: 'Asset Category List',
        keyword: 'Keyword',
        categoryName: 'Category Name',
        categoryCode: 'Category Code',
        description: 'Description',
        form: {
          keyword: 'Please enter category name or code',
          categoryName: 'Please enter category name',
          categoryCode: 'Please enter category code',
          description: 'Please enter description'
        },
        addCategory: 'Add Category',
        editCategory: 'Edit Category'
      },
      asset: {
        title: 'Asset List',
        keyword: 'Keyword',
        assetNo: 'Asset No.',
        assetName: 'Asset Name',
        category: 'Category',
        brand: 'Brand',
        model: 'Model',
        serialNo: 'Serial No.',
        assignee: 'Assignee',
        department: 'Department',
        location: 'Location',
        status: 'Status',
        purchaseDate: 'Purchase Date',
        warrantyExpireDate: 'Warranty Expires',
        remark: 'Remark',
        form: {
          keyword: 'Please enter asset no., name, brand or serial no.',
          assetNo: 'Please enter asset no.',
          assetName: 'Please enter asset name',
          category: 'Please select category',
          brand: 'Please enter brand',
          model: 'Please enter model',
          serialNo: 'Please enter serial no.',
          assignee: 'Please select assignee',
          department: 'Please enter department',
          location: 'Please enter location',
          status: 'Please select status',
          purchaseDate: 'Please select purchase date',
          warrantyExpireDate: 'Please select warranty expiry date',
          remark: 'Please enter remark'
        },
        addAsset: 'Add Asset',
        editAsset: 'Edit Asset',
        detail: 'Asset Detail',
        repairHistory: 'Repair History',
        statusType: {
          inUse: 'In Use',
          idle: 'Idle',
          repairing: 'Repairing',
          scrapped: 'Scrapped'
        }
      },
      repairRecord: {
        title: 'Repair Record List',
        ticketNo: 'Ticket No.',
        ticketTitle: 'Ticket Title',
        assetNo: 'Asset No.',
        assetName: 'Asset Name',
        repairUser: 'Repaired By',
        faultReason: 'Fault Reason',
        repairMethod: 'Repair Method',
        repairResult: 'Repair Result',
        repairCost: 'Repair Cost',
        repairedAt: 'Repaired At',
        editRecord: 'Edit Repair Record',
        resultType: {
          fixed: 'Fixed',
          replaceRepair: 'Fixed After Replacement',
          scrapped: 'Recommend Scrapping',
          unresolved: 'Unresolved'
        }
      }
    },
    ticket: {
      title: 'Ticket List',
      keyword: 'Keyword',
      ticketNo: 'Ticket No.',
      ticketTitle: 'Title',
      description: 'Description',
      category: 'Category',
      priority: 'Priority',
      status: 'Status',
      reporter: 'Reporter',
      handler: 'Handler',
      relatedAsset: 'Related Asset',
      result: 'Result',
      addTicket: 'New Ticket',
      editTicket: 'Edit Ticket',
      detail: 'Ticket Detail',
      form: {
        keyword: 'Please enter ticket no., title or description',
        title: 'Please enter ticket title',
        description: 'Please describe the issue',
        category: 'Please select a ticket category',
        relatedAsset: 'Please select related asset (optional)',
        relatedAssetRequired: 'This category requires a related asset'
      },
      statusType: {
        pendingAccept: 'Pending Acceptance',
        pending: 'Pending Assignment',
        assigned: 'Assigned',
        processing: 'Processing',
        pendingConfirm: 'Pending User Confirmation',
        completed: 'Completed',
        closed: 'Closed',
        cancelled: 'Cancelled'
      },
      priorityType: {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        urgent: 'Urgent'
      },
      statisticsType: {
        all: 'All Tickets',
        overdue: 'Overdue'
      },
      statistics: {
        title: 'Ticket Statistics',
        description: 'Counts of all tickets in the system by status',
        chartTitle: 'Ticket Status Distribution'
      },
      action: {
        assign: 'Assign',
        start: 'Start Processing',
        complete: 'Complete',
        cancel: 'Cancel'
      },
      record: {
        title: 'Processing Records',
        create: 'Ticket Created',
        assign: 'Assigned',
        start: 'Started Processing',
        finish: 'Completed',
        cancel: 'Cancelled'
      },
      completeForm: {
        result: 'Result Description',
        faultReason: 'Fault Reason',
        repairMethod: 'Repair Method',
        repairResult: 'Repair Result',
        repairCost: 'Repair Cost',
        assetStatusAfterRepair: 'Asset Status After Repair',
        remark: 'Remark'
      },
      assignForm: {
        handler: 'Handler',
        remark: 'Remark'
      },
      cancelForm: {
        reason: 'Cancellation Reason'
      },
      slaInfo: 'SLA Information',
      slaResponseDeadline: 'Response Deadline',
      slaResolveDeadline: 'Resolve Deadline',
      firstResponseAt: 'First Response At',
      resolvedAt: 'Resolved At',
      slaStatus: 'SLA Status',
      slaStatusType: {
        normal: 'Normal',
        responseOverdue: 'Response Overdue',
        resolveOverdue: 'Resolve Overdue'
      },
      responseStatus: 'Response Status',
      resolveStatus: 'Resolve Status',
      responseStatusType: {
        responded: 'Responded',
        unresponded: 'Not Responded',
        overdue: 'Response Overdue'
      },
      resolveStatusType: {
        resolved: 'Resolved',
        unresolved: 'Unresolved',
        overdue: 'Resolve Overdue'
      },
      assignmentInfo: 'Assignment Info',
      assignee: 'Current Handler',
      assignType: 'Assign Type',
      assignedAt: 'Assigned At',
      acceptedAt: 'Accepted At',
      noAssignee: 'No handler yet',
      assignedNotStarted: 'Ticket assigned, waiting for the assignee to start processing.',
      pendingAcceptHint: 'No handler yet. An IT staff member can claim it, or an admin can assign it manually.',
      assignStrategyType: {
        leastWorkload: 'Least Workload',
        fixedUser: 'Fixed User'
      },
      assignTypeType: {
        manual: 'Manually Assigned',
        auto: 'Auto-assigned',
        claim: 'Self-claimed',
        unassigned: 'Unassigned'
      },
      autoAssign: 'Auto-assign',
      reAutoAssign: 'Re-auto-assign',
      confirmReAutoAssign:
        'This ticket already has a handler. Force re-auto-assignment? This may change the current handler.',
      autoAssignSuccess: 'Auto-assignment succeeded, assigned to: ',
      autoAssignFail: 'Auto-assignment failed: ',
      addSuccessAssigned: 'Ticket created successfully, automatically assigned to: ',
      addSuccessPendingAccept: 'Ticket created successfully, no handler yet, pending acceptance'
    },
    faq: {
      title: 'FAQ List',
      keyword: 'Keyword',
      faqTitle: 'Title',
      category: 'Category',
      summary: 'Summary',
      content: 'Content',
      sortOrder: 'Sort Order',
      viewCount: 'Views',
      addFaq: 'Add FAQ',
      editFaq: 'Edit FAQ',
      form: {
        keyword: 'Please enter title, summary or content keyword',
        title: 'Please enter question title',
        category: 'Please select category',
        summary: 'Please enter summary',
        content: 'Please enter detailed content'
      },
      categoryType: {
        computer: 'Computer',
        network: 'Network',
        printer: 'Printer',
        account: 'Account',
        other: 'Other'
      }
    },
    notification: {
      title: 'Notification Center',
      keyword: 'Keyword',
      notificationTitle: 'Title',
      content: 'Content',
      bizType: 'Business Type',
      bizId: 'Business ID',
      readStatus: 'Read Status',
      readAt: 'Read At',
      detail: 'Notification Detail',
      markRead: 'Mark as Read',
      batchMarkRead: 'Batch Mark as Read',
      readAll: 'Mark All as Read',
      goToBusiness: 'Go to',
      pleaseSelect: 'Please select at least one item',
      viewMore: 'View More',
      emptyUnread: 'No unread notifications',
      emptyRead: 'No read notifications',
      form: {
        keyword: 'Please enter title or content keyword',
        readStatus: 'Please select read status',
        bizType: 'Please select business type'
      },
      readStatusType: {
        unread: 'Unread',
        read: 'Read'
      },
      bizTypeType: {
        ticket: 'Ticket Notification',
        asset: 'Asset Notification',
        sla: 'SLA Alert',
        system: 'System Notification'
      }
    },
    todo: {
      todoNo: 'Todo No.',
      todoTitle: 'Todo Title',
      content: 'Content',
      todoType: 'Todo Type',
      bizType: 'Business Type',
      bizId: 'Business ID',
      bizTitle: 'Related Business',
      bizStatus: 'Business Status',
      assignee: 'Assignee',
      status: 'Status',
      priority: 'Priority',
      deadlineAt: 'Deadline',
      completedAt: 'Completed At',
      cancelledAt: 'Cancelled At',
      updateTime: 'Updated At',
      remark: 'Remark',
      detail: 'Todo Detail',
      goProcess: 'Process',
      startProcessing: 'Start',
      cancel: 'Cancel',
      confirmCancel: 'Are you sure you want to cancel this todo?',
      approvalNotImplemented: 'The approval detail page is not implemented yet',
      statusType: {
        pending: 'Pending',
        processing: 'Processing',
        completed: 'Completed',
        cancelled: 'Cancelled',
        expired: 'Expired'
      },
      priorityType: {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        urgent: 'Urgent'
      },
      bizTypeType: {
        ticket: 'Ticket',
        asset: 'Asset',
        approval: 'Approval'
      },
      todoTypeType: {
        ticketAssign: 'Pending Assignment',
        ticketAccept: 'Pending Acceptance',
        ticketProcess: 'Pending Processing',
        ticketConfirm: 'Pending Confirmation',
        assetApproval: 'Asset Approval',
        assetInventory: 'Asset Inventory'
      },
      myTodo: {
        title: 'My Todos',
        keyword: 'Keyword',
        form: {
          keyword: 'Please enter title, content or related business keyword'
        }
      },
      manage: {
        title: 'Todo Management',
        assigneeId: 'Assignee',
        form: {
          assignee: 'Please select assignee'
        }
      }
    }
  },
  form: {
    required: 'Cannot be empty',
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and underscores'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin',
    notification: 'Notification Center'
  },
  datatable: {
    itemCount: 'Total {total} items'
  }
};

export default local;
