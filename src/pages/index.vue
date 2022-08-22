<template>
  <div class="index">
    <van-cell
      v-for="item in list"
      :key="item.path"
      :title="(item.name as string)"
      :to="item.path"
      class="link"
    ></van-cell>
  </div>
</template>

<script setup lang="ts">
  import { layoutRoutes } from '@/router';

  const list = layoutRoutes.filter((item) => item.name && item.name !== 'index');
</script>

<style lang="less" scoped>
  .index {
    :deep(.van-cell) {
      background-color: #ddd;
      margin-top: 16px;
    }
  }
</style>
