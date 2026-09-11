<template>
  <div class="court-panel">
    <div class="court-header">
      <span class="court-title">朝堂态势</span>
      <span class="emperor-stance">帝王态度: <span :class="attitudeClass">{{ court.帝王态度 }}</span></span>
    </div>

    <div class="faction-bars">
      <div class="faction-item">
        <div class="f-label">
          <span>雪党势力</span>
          <span>{{ court.雪党势力 }}%</span>
        </div>
        <div class="f-bar-bg">
          <div class="f-bar-fill xuedang" :style="{ width: court.雪党势力 + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  court: { 帝王态度: string; 雪党势力: number };
}>();

const attitudeClass = computed(() => {
  const map: Record<string, string> = {
    '猜忌': 'warn',
    '中立': 'neutral',
    '忌惮': 'danger',
    '敌对': 'fatal',
  };
  return map[props.court.帝王态度] || 'neutral';
});
</script>

<style scoped>
.court-panel {
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 10px 12px;
}

.court-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.court-title {
  font-family: var(--font-title);
  font-size: 13px;
  color: var(--text-muted);
}

.emperor-stance {
  font-size: 11.5px;
  color: var(--text-dim);
}

.emperor-stance span {
  font-weight: bold;
}

.warn { color: #ffeb3b; }
.neutral { color: #aaaaaa; }
.danger { color: #ff9800; }
.fatal { color: #f44336; }

.faction-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.f-label {
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.f-bar-bg {
  height: 3px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1.5px;
}

.f-bar-fill {
  height: 100%;
  border-radius: 1.5px;
  transition: width 0.5s ease;
}

.xuedang { background: linear-gradient(90deg, #5b8dd9, #87cefa); }
.feidi { background: linear-gradient(90deg, #800080, #da70d6); }
</style>