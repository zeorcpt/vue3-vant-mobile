<template>
  <div class="layout">
    <Header />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Header from './Header/index.vue';
</script>

<style lang="less" scoped>
  .layout {
    position: absolute;
    width: 100%;
    height: 100%;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: @header-height;
      z-index: 1;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
    }
    .content {
      padding: 16px;
      margin-top: @header-height;
      height: calc(100% - @header-height);
      overflow: auto;
    }
  }
</style>
