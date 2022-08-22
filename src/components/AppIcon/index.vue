<template>
  <i class="icon" :style="{ 'background-image': `url(${iconUrl})` }" />
</template>

<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
  });

  const iconUrl = computed(() => {
    return new URL(`/src/assets/icons/${props.name}.png`, import.meta.url).href;
  });
</script>

<style lang="less" scoped>
  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: center / contain;
    vertical-align: middle;
  }
</style>
