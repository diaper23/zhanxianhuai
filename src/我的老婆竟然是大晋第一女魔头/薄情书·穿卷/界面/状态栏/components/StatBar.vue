<template>
  <div class="stat-row">
    <span class="stat-label">{{ label }}</span>
    <div class="bar-wrap">
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: pct + '%' }"></div>
        <div class="bar-sheen" :style="{ width: pct + '%' }"></div>
        <div class="bar-tip" :style="{ '--tip-x': pct + '%' }" v-if="pct > 0"></div>
      </div>
      <span class="stat-num">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; value: number; max?: number }>();
const pct = computed(() => Math.min(100, Math.max(0, (props.value / (props.max ?? 100)) * 100)));
</script>

<style lang="scss" scoped>
.stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 全称标签 —— 冷灰，两端对齐 */
.stat-label {
  font-family: var(--font-title);
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 52px;
  text-align: justify;
  text-align-last: justify;
  flex-shrink: 0;
  letter-spacing: 1px;
}

.bar-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 11px;
}

.bar-track {
  flex: 1;
  height: 4px;
  background: rgba(255, 222, 180, 0.06);
  border-radius: 2px;
  position: relative;
  overflow: visible;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);
}

/* 冷青光填充 —— 注入动效 */
.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--aqua) 0%, var(--aqua-bright) 100%);
  box-shadow: 0 0 6px var(--aqua-glow);
  animation: fillPour 0.9s var(--ease-out-expo) both;
}

@keyframes fillPour {
  from { width: 0 !important; }
}

/* 流光扫过 —— 高光带在填充内循环流动（改用 transform 平移，避免 left 触发 layout） */
.bar-sheen {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  overflow: hidden;
  pointer-events: none;
}

.bar-sheen::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  transform: translateX(-120%);
  background: linear-gradient(90deg, transparent, rgba(255, 240, 210, 0.45), transparent);
  animation: sheen 3.4s var(--ease-in-out-quart) infinite;
}

@keyframes sheen {
  0% { transform: translateX(-120%); }
  60%, 100% { transform: translateX(260%); }
}

/* 末端冷青竖标 —— 用 transform 定位，transition 走合成层 */
.bar-tip {
  position: absolute;
  top: 50%;
  left: 0;
  width: 1px;
  height: 10px;
  background: var(--aqua-bright);
  box-shadow: 0 0 4px var(--aqua-glow);
  transform: translate(calc(var(--tip-x) - 50%), -50%);
  transition: transform 0.6s var(--ease-out-expo);
}

.stat-num {
  font-family: var(--font-num);
  font-size: 12px;
  min-width: 28px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}
</style>
