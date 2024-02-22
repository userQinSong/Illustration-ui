export default {
    routes: [
        {
            path: '/',
            redirect:'/personalPage_loginUser'
        },
        {
          path: '/mainPage',
          name: 'MainPage',
          component: () => import('@/views/rightViews/mainPage/MainPage'),
          meta:{
            title:'插画主页'
          },
        },
        {
          path: '/picoltDetailPage',
          name: 'PicoltDetailPage',
          component: () => import('@/views/rightViews/picoltDetailPage/PicoltDetailPage'),
          meta:{
            title:'插画集详细页面'
          },
        },
        {
          path: '/personalPage',
          name: 'PersonalPage',
          component: () => import('@/views/rightViews/personalPage/PersonalPage'),
          meta:{
            title:'用户信息页面'
          },
        },
        {
          path: '/personalPage_loginUser',
          name: 'PersonalPage',
          component: () => import('@/views/rightViews/personalPage/PersonalPage'),
          meta:{
            title:'用户信息页面'
          },
        },
        {
          path: '/adminPage',
          component: () => import('@/views/rightViews/adminPage/AdminPage'),
          meta:{
            title:'管理员页面'
          },
          children:[
            {
              path: 'dataCenter',
              name: 'DataCenter',
              component: () => import('@/views/rightViews/adminPage/DataCenter'),
              meta:{
                title:'数据中心页面'
              },
            },
            {
              path: 'userCenter',
              name: 'UserCenter',
              component: () => import('@/views/rightViews/adminPage/UserCenter'),
              meta:{
                title:'用户中心页面'
              },
            },
          ]
        },
    ],
    mode: 'history',
}
