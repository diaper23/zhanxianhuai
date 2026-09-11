<template>
  <div class="heroine-panel">
    <div class="panel-header">
      <span class="char-name">{{ name || '？？？' }}</span>
      <span class="cognition-text">{{ cognition }}</span>
    </div>

    <div class="stats-grid">
      <StatBar label="悔恨值" :value="regret" />
      <StatBar label="执着度" :value="determination" />
      <StatBar label="尊严值" :value="dignity" />
    </div>

    <div class="emotion-row" v-if="emotion">
      <span class="emotion-dot"></span>
      <span class="emotion-text">{{ emotion }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatBar from './StatBar.vue';

defineProps<{
  name: string;
  regret: number;
  determination: number;
  dignity: number;
  cognition: string;
  emotion: string;
}>();
</script>

<style lang="scss" scoped>
.heroine-panel {
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* 人名 —— 冷白，无光晕 */
.char-name {
  font-family: var(--font-title);
  font-size: 17px;
  color: var(--text-primary);
  letter-spacing: 4px;
  font-weight: 600;
}

/* 认知 —— 纯文本次色 */
.cognition-text {
  font-family: var(--font-text);
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.emotion-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
}

/* 情绪 —— 暖点 + 文字（唯一暖色，极小面积） */
.emotion-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--ember);
  box-shadow: 0 0 5px var(--ember-glow);
  flex-shrink: 0;
}

.emotion-text {
  font-family: var(--font-text);
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
}
</style>
