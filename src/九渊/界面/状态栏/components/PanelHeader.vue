<template>
  <div class="sub-header">
    <div class="btn-back" @click="$emit('back')">◂ 归返</div>
    <span class="t-section" style="flex: 1; font-size: 15px; color: var(--paper)">{{ title }}</span>
    <div style="width: 56px"></div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string }>();
defineEmits<{ back: [] }>();
</script>
