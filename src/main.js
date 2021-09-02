// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import _ from 'lodash';
import Vue from 'vue';
import Framework from 'setaria-vue-component-library';
import Setaria from 'setaria';
import 'setaria-vue-component-library/style/common/var.scss';
import 'setaria-vue-component-library/style/index.scss';
import config from '@/config';
import UI from '@/component';
import '@/style/app.scss';
import App from './App.vue';

const entry = {
  el: '#app',
  render: (h) => h(App),
};

config.entry = entry;

// 实例化项目Framework
// eslint-disable-next-line no-new
new Framework(config, { env: process.env });
// ! FIXME 解决打包后class extend没有生效的问题
_.merge(Setaria, Framework);
// 安装业务模块自定义公共组件1
Vue.use(UI);
// 混入全局Vue公共处理
Vue.mixin(Framework.mixin);
