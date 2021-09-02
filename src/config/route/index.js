import Framework from 'skyrunner-web-framework';
import bizModule from './biz-module';

const {
  VUE_APP_SITE_ID,
  VUE_APP_CLIENT_BASE_URL,
  VUE_APP_CLIENT_MODULE_BASE_URL,
  VUE_APP_SYSTEM_MODE,
} = process.env;

const DevMain = () => import(/* webpackChunkName: "common" */ '@/page/dev-main.vue');
const mainComponent = VUE_APP_SYSTEM_MODE === 'dev' ? DevMain : Framework.AppMain;

export default {
  mode: 'history',
  base: `/${VUE_APP_SITE_ID}/${VUE_APP_CLIENT_BASE_URL}`,
  routes: [
    {
      path: `/${VUE_APP_CLIENT_MODULE_BASE_URL}`,
      name: 'Main',
      meta: { title: '首页' },
      component: mainComponent,
      children: [
        // 业务模块1
        ...bizModule,
      ],
    },
  ],
};
