<template>
  <div class="pinia">
    <div class="name">用户名:{{ userStore.name }}</div>
    <div class="length">长度:{{ userStore.nameLength }}</div>
    <van-button type="primary" @click="updateName(true)">action修改store中的name</van-button>
    <van-button @click="updateName(false)">patch修改store中的name</van-button>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';

  const userStore = useUserStore();

  const updateName = (isAction: boolean) => {
    if (isAction) {
      // action 修改 store 中的数据
      userStore.updateName('userStore.updateName方式');
    } else {
      // 未定义 action 时可以用 $patch 方法直接更改状态属性
      // $patch 修改 store 中的数据
      userStore.$patch({
        name: 'userStore.$patch方式',
      });
    }
  };

  // // 演示可选链问题
  // const obj = { a: 1 };
  // console.log(obj?.a);
</script>

<style></style>
