<template>
  <div
    v-show="!menuStore.isCollapse"
    class="menu-mask menu-fixed"
    @click.self="menuStore.updateCollapse"
  ></div>
  <transition name="van-slide-left">
    <div v-show="!menuStore.isCollapse" class="menu menu-fixed">
      <van-collapse v-model="activeNames">
        <template v-for="route in layoutRoutes" :key="route.name">
          <van-collapse-item v-if="route.children?.length" :name="(route.name as string)">
            <template #title>
              <div class="menu-item">
                <AppIcon :name="(route?.meta?.icon as string)" />
                <span class="title">{{ route?.meta?.title }}</span>
              </div>
            </template>
            <template v-if="route.children?.length">
              <van-cell
                v-for="child in route.children"
                :key="child.name"
                @click="onMenuItem(child)"
              >
                <template #title>
                  <div class="menu-item" :class="{ active: child.name === curRoute.name }">
                    <AppIcon :name="getIconName(child)" />
                    <span class="sub">{{ child?.meta?.title }}</span>
                  </div>
                </template>
              </van-cell>
            </template>
          </van-collapse-item>
          <van-cell v-else @click="onMenuItem(route)">
            <template #title>
              <div class="menu-item" :class="{ active: route.name === curRoute.name }">
                <AppIcon :name="getIconName(route)" />
                <span>{{ route?.meta?.title }}</span>
              </div>
            </template>
          </van-cell>
        </template>
      </van-collapse>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { RouteRecordRaw } from 'vue-router';
  import { layoutRoutes } from '@/router';
  import { useMenuStore } from '@/store';

  const router = useRouter();
  const curRoute = useRoute();
  const menuStore = useMenuStore();

  const activeNames = ref([curRoute.matched[1].name as string]);

  const getIconName = (route: RouteRecordRaw) => {
    return (
      route.name === curRoute.name && route?.meta?.iconActive
        ? route?.meta?.iconActive
        : route?.meta?.icon
    ) as string;
  };
  const onMenuItem = (route: RouteRecordRaw) => {
    router.push({ name: route.name });
    menuStore.updateCollapse();
  };
</script>

<style lang="less" scoped>
  @menu-width: 340px;
  .menu-fixed {
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
  }
  .menu-mask {
    width: 100%;
    height: 100%;
  }
  .menu {
    width: @menu-width;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.24);
    overflow: auto;
    .menu-title {
      height: 116px;
      line-height: 116px;
      padding-left: 49px;
      border-bottom: @border;
      font-size: 30px;
      font-weight: 600;
    }
    .menu-item {
      &:extend(.flex-ac);
      span {
        margin-left: 28px;
        line-height: 30px;
        font-size: 24px;
        &.sub {
          margin-left: 18px;
        }
      }
      &.active span {
        color: @light-blue;
      }
    }
    :deep(.van-collapse) {
      &::after {
        border: none;
      }
      .van-cell::after {
        border: none;
      }
      & > .van-cell {
        padding: 30px 44px;
      }
      .van-collapse-item {
        & > .van-cell {
          padding: 24px 44px;
          .van-cell__title {
            display: flex;
          }
          .van-badge__wrapper.van-icon {
            color: @font-color;
          }
        }
        .van-collapse-item__wrapper .van-collapse-item__content {
          padding: 0;
          .van-cell {
            padding: 24px 96px;
          }
        }
      }
    }
  }
</style>
