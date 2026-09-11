<template>
  <div class="scene-info" v-if="scene || time">
    <div class="scene-row">
      <span class="scene-icon"></span>
      <span class="scene-text">{{ scene || '——' }}</span>
      <span class="scene-time" v-if="time">{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scene: string;
  time: string;
}>();
</script>

<style lang="scss" scoped>
.scene-info {
  animation: sceneIn 0.6s 0.15s var(--ease-out-expo) both;
}

@keyframes sceneIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.scene-row {
  display: flex;
  align-items: center;
  gap: 9px;
}

/* 冷青小圆点（替代金菱） */
.scene-icon {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--aqua);
  box-shadow: 0 0 4px var(--aqua-glow);
  flex-shrink: 0;
}

.scene-text {
  font-family: var(--font-title);
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 2px;
}

.scene-time {
  margin-left: auto;
  font-family: var(--font-num);
  font-size: 11px;
  color: var(--text-faint);
  letter-spacing: 0.5px;
  font-style: italic;
}
</style>
