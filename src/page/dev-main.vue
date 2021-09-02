<template>
  <el-container class="main">
    <el-aside :width="asideWidth" class="aside">
      <div class="brand" :class="{
        collapse: isMenuCollapse
      }">
        <template>
          <div>
            <img :src="logoUrl" />
            <h1 v-if="!isMenuCollapse">{{ systemTitle }}</h1>
          </div>
        </template>
      </div>
      <el-menu
        class="nav-menu"
        :style="{
          width: asideWidth
        }"
        :collapse="isMenuCollapse"
        :default-active="activeMenu"
        background-color="#001529"
        text-color="rgba(255, 255, 255, 0.65)"
        active-text-color="#fff"
        :unique-opened="true"
        @select="handleMenuSelect">
        <el-submenu v-for="(subMenu, index) in menuList" :key="index" :index="`${index}`">
          <template slot="title">
            <i class="menu-icon fa"
               :class="subMenu.icon ? subMenu.icon : 'el-icon-menu'"
               aria-hidden="true"></i>
            <span>{{ subMenu.name }}</span>
          </template>
          <template v-if="subMenu.children">
            <template
              v-for="( secondMenu, secondIndex ) in subMenu.children">
              <template
                v-if="secondMenu.children.length > 0">
                <el-submenu
                  :key="`${index}-${secondIndex}`"
                  :index="`${index}-${secondIndex}`">
                  <template slot="title">
                    {{ secondMenu.name }}
                  </template>
                  <template
                    v-for="( thirdMenu, thirdIndex ) in secondMenu.children"
                  >
                    <template
                      v-if="thirdMenu.children.length>0">
                      <el-submenu
                        :key="`${index}-${secondIndex}-${thirdIndex}`"
                        :index="thirdMenu.link">
                        <template slot="title">
                          {{ thirdMenu.name }}
                        </template>
                        <el-menu-item
                          v-for="( fourthMenu, fourthIndex ) in thirdMenu.children"
                          class="nav-menu-item"
                          :key="`${index}-${secondIndex}-${thirdIndex}-${fourthIndex}`"
                          :index="fourthMenu.link">
                          <span slot="title">{{ fourthMenu.name }}</span>
                        </el-menu-item>
                      </el-submenu>
                    </template>
                    <el-menu-item
                      v-else
                      class="nav-menu-item"
                      :key="`${index}-${secondIndex}-${thirdIndex}`"
                      :index="thirdMenu.link">
                      <span slot="title">{{ thirdMenu.name }}</span>
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <el-menu-item
                class="nav-menu-item"
                :index="secondMenu.link"
                v-else
                :key="secondMenu.link">
                <span slot="title">{{ secondMenu.name }}</span>
              </el-menu-item>
            </template>
          </template>
          <el-menu-item
            class="nav-menu-item"
            :index="subMenu.link"
            v-else
            :key="subMenu.link">
            <span slot="title">{{ subMenu.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container class="container">
      <el-header>
        <div class="action menu-fold" @click="handleMenuFold">
          <i
            :class="{
              'el-icon-d-arrow-left': !isMenuCollapse,
              'el-icon-d-arrow-right': isMenuCollapse,
            }"
          ></i>
        </div>
        <div style="float:right;margin-right: 20px;">
          <el-button type="text" @click="onClearAllEntityCache">清空全部Entity缓存</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- <el-footer height="48px">
        <span class="copyright">
          Setaria UI Pro ©2018 Created by Ray Han
        </span>
      </el-footer> -->
    </el-container>
  </el-container>
</template>
<script>
import _ from 'lodash';
import { constants } from 'setaria';
import { Loading } from 'setaria-ui';
import { addResizeListener, removeResizeListener } from 'setaria-ui/src/utils/resize-event';
import route from '@/config/route';
import Framework from 'setaria-vue-component-library';
import { MODULE } from '@/constant/common';
import { findResourceByRoute, getPublicResourceUrl } from '@/util';

let loadingInstance;

function convertRouteToMenuItem({
  children,
  meta,
  name,
}, parentName) {
  const targetName = parentName
    ? `${parentName}.${name}`
    : '';
  const retChildren = [];
  if (children && children.length > 0 && _.get(meta, 'hideChildrenInMenu', false) !== true) {
    children.forEach((item) => {
      if (_.get(item, 'meta.menu', null) !== false) {
        retChildren.push(convertRouteToMenuItem(item, targetName));
      }
    });
  }
  return {
    name: meta.title,
    link: targetName,
    icon: meta.icon || '',
    children: retChildren,
  };
}

export default {
  name: 'Main',
  data() {
    return {
      activeMenu: '',
      logoUrl: getPublicResourceUrl('logo.png'),
      remindUnReadCount: 8,
      isMenuCollapse: false,
      lastestPath: null,
      systemTitle: process.env.VUE_APP_TITLE,
    };
  },
  computed: {
    asideWidth() {
      return this.isMenuCollapse ? '80px' : '260px';
    },
    menuList() {
      const mainRoute = route.routes[0];
      const ret = [];
      mainRoute.children.forEach((item) => {
        if (_.get(item, 'meta.menu', null) !== false) {
          ret.push(convertRouteToMenuItem(item, mainRoute.name));
        }
      });
      return ret;
    },
    loadingState() {
      return _.get(this.$store, 'getters')[constants.STORE_KEY.GET_IS_LOADING];
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        const menuResource = findResourceByRoute(this.menuList, val, 2);
        this.activeMenu = _.get(menuResource, 'link', '');
      },
    },
    loadingState: {
      immediate: true,
      handler(val) {
        if (val) {
          loadingInstance = Loading.service({
            fullscreen: true,
            text: process.env.VUE_APP_SERVICE_LOADING_TEXT,
          });
        } else {
          this.$nextTick(() => {
            if (loadingInstance) {
              loadingInstance.close();
            }
          });
        }
      },
    },
  },
  mounted() {
    addResizeListener(this.$el, this.handleResize);
    this.lastestPath = window.location.pathname;
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) {
      removeResizeListener(this.$el, this.handleResize);
    }
  },
  methods: {
    onClearAllEntityCache() {
      this.$store.commit(Framework.config.storeType[MODULE.COMMON].MUTATION.CLEAR_ENTITY);
      this.$showMessage('SYCOM010S');
    },
    /**
     * 菜单展开/收起事件处理
     * @event
     */
    handleMenuFold() {
      this.isMenuCollapse = !this.isMenuCollapse;
    },
    handleMenuSelect(index) {
      if (index && index.indexOf('.') !== -1) {
        const indexArray = index.split('.');
        const targetName = indexArray[indexArray.length - 1];
        // 同一菜单不能重复点击
        if (targetName !== this.lastestPath) {
          this.$store.commit(constants.STORE_KEY.CLEAR_ROUTE_HISTORY);
          this.$router.push({ name: targetName });
          this.lastestPath = targetName;
        }
      }
    },
    /**
     * 根据窗口宽度自动折叠/展开左侧菜单
     */
    handleResize() {
      if (this.$el.clientWidth <= 992) {
        this.isMenuCollapse = true;
      } else {
        this.isMenuCollapse = false;
      }
    },
  },
  components: {},
};
</script>

<style lang="scss">
.remind-popover {
  padding: 0 !important;
  width: 327px;
}
</style>
<style lang="scss" scoped>
$--app-brand-height: 64px;

.main {
  width: 100%;
  height: 100%;

  .brand {
    height: $--app-brand-height;
    line-height: $--app-brand-height;
    background: #001529;
    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
    padding-left: 24px;

    h1 {
      font-size: 20px;
      color: #bfcbd9;
      display: inline-block;
      vertical-align: middle;
      margin-top: 0;
      margin-bottom: 0;
    }

    img {
      display: inline-block;
      height: 16px;
      margin-right: 16px;
      vertical-align: middle;
    }

    &.collapse {
      padding-left: 5px;

      img {
        height: 10px;
      }
    }
  }

  .aside {
    transition: width 0.2s;

    .nav-menu {
      height: calc(100% - #{$--app-brand-height});
      border-right-width: 0;

      &.el-menu {
        .el-submenu.is-active {
          .el-submenu__title {
            i,
            span {
              color: #fff;
            }
          }
        }
      }

      ::v-deep {
        &.el-menu--collapse {
          .el-submenu__title {
            text-align: center;
            font-size: 18px;
            .menu-icon {
              margin-right: 0;
            }
          }
        }
      }

      .el-menu-item.is-active {
        background-color: #E50039 !important;
      }

      .menu-icon {
        margin-right: 10px;
      }
    }
  }

  .container {
    background-color: #f0f2f5;

    .el-header {
      height: 60px;
      line-height: 60px;
      padding: 0 12px 0 0;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      background-color: #fff;

      .action {
        display: inline-block;
        height: 100%;
        cursor: pointer;
        padding: 0 12px;

        &:hover {
          // background-color: $--color-primary-light-8;
        }

        .remind {
          display: inline;
        }

        .el-dropdown-link {
          .fa {
            font-size: 18px;
          }
        }
      }

      .menu-fold {
        display: inline-block;
        padding: 0 20px;
      }

      .header-right {
        float: right;
        height: 100%;
      }
    }

    .el-main {
      padding: 0;
    }

    .el-footer {
      line-height: 48px;
      text-align: center;

      .copyright {
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}
</style>
