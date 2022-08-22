<template>
  <div class="geo">
    <van-button type="primary" @click="getGeo">获取定位</van-button>
    <div>当前经纬度： {{ state.position }}</div>
    <van-button type="primary" @click="geo.openMap(state.position)">打开地图</van-button>
  </div>
</template>

<script setup lang="ts">
  import { geo } from '@/utils';

  const state = reactive({
    position: {},
  });

  const getGeo = async () => {
    state.position = await geo.getLocation();
  };
</script>
