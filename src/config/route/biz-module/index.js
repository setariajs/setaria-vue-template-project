// 招采模块路由
const Template = () => import(/* webpackChunkName: "biz-module-common" */ '@/page/biz-module/index.vue');

export default [
  {
    path: '',
    name: 'bizModule',
    meta: { title: '业务模块1', category: true },
    component: Template,
    children: [
    ],
  },
];
