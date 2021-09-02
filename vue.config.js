const path = require('path');

const {
  VUE_APP_SITE_ID,
  VUE_APP_CLIENT_BASE_URL,
  VUE_APP_CLIENT_MODULE_BASE_URL,
} = process.env;

const config = {
  publicPath: `/${VUE_APP_SITE_ID}/${VUE_APP_CLIENT_BASE_URL}/${VUE_APP_CLIENT_MODULE_BASE_URL}`,
  lintOnSave: false,
  productionSourceMap: false,
  pages: {
    index: process.env.VUE_APP_ENTRY_PAGE_FILE || 'src/main.js',
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
    entry: {
      // framework: ['setaria'],
      vendors: ['vue', 'vuex', 'vue-router', 'moment', 'numeral', 'ramda'],
    },
    resolve: {
      alias: {
        'sr-component': path.resolve(__dirname, './src/common/component'),
        'sr-service': path.resolve(__dirname, './src/common/service'),
        'sr-util-common': 'skyrunner-web-framework/src/util/common',
        'sr-util-odata': 'skyrunner-web-framework/src/util/odata',
      },
    },
  },
  devServer: {
    // 前端开发服务器端口号
    port: 7001,
    // 远程服务代理设置
    proxy: {},
  },
};
const {
  VUE_APP_API_BASE_URL,
  VUE_APP_SERVICE_HOST,
  VUE_APP_SYSTEM_MODE,
  VUE_APP_DOC_API_URL,
  VUE_APP_FILE_UPLOAD_URL,
  VUE_APP_MINGYUAN_API_URL,
  VUE_APP_MINGYUAN_FILE_SERVER_URL,
} = process.env;
const proxyPrefixUrl = `/${VUE_APP_SITE_ID}/${VUE_APP_API_BASE_URL}`;
const docApiPrefixUrl = `/${VUE_APP_DOC_API_URL}`;
const mingyuanApiPrefixUrl = `/${VUE_APP_MINGYUAN_API_URL}`;
// dev模式代理设置
if (VUE_APP_SYSTEM_MODE === 'dev') {
  config.devServer.proxy[proxyPrefixUrl] = {
    pathRewrite: {
      [proxyPrefixUrl]: '/sap/opu/odata/sap',
    },
    // 远程服务地址
    target: VUE_APP_SERVICE_HOST,
    secure: false,
    changeOrigin: true,
  };
  config.devServer.proxy[docApiPrefixUrl] = {
    // 远程服务地址
    target: VUE_APP_FILE_UPLOAD_URL,
    secure: false,
    changeOrigin: true,
  };
  config.devServer.proxy[mingyuanApiPrefixUrl] = {
    pathRewrite: {
      [mingyuanApiPrefixUrl]: '/api',
    },
    // 远程服务地址
    target: VUE_APP_MINGYUAN_FILE_SERVER_URL,
    secure: false,
    changeOrigin: true,
  };
}
module.exports = config;
