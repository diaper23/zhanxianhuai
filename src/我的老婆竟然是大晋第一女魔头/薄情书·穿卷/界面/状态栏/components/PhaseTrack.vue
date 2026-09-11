<template>
  <div class="phase-track">
    <div class="track-header">
      <span class="script-mark">卷</span>
      <span class="script-name">{{ script || '未启卷' }}</span>
    </div>

    <div class="track-rail">
      <div class="rail-line"></div>
      <div class="rail-fill" :style="{ width: 'calc(' + (currentIndex / (stages.length - 1)) * 100 + '% - 0px)' }"></div>
      <div
        v-for="(step, i) in stages"
        :key="step"
        class="node"
        :class="{ active: i === currentIndex, passed: i < currentIndex, future: i > currentIndex }"
      >
        <span class="node-dot"></span>
        <span class="node-ring" v-if="i === currentIndex"></span>
        <span class="node-label">{{ step }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ stage: string; script: string }>();

const stages = ['未觉醒', '动摇', '醒悟', '自我审视'];
const currentIndex = computed(() => {
  const idx = stages.indexOf(props.stage);
  return idx >= 0 ? idx : 0;
});
</script>

<style lang="scss" scoped>
.phase-track {
  margin-bottom: 16px;
}

.track-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 18px;
}

/* "卷"字 —— 冷青光小字，无框 */
.script-mark {
  font-family: var(--font-title);
  font-size: 11px;
  color: var(--aqua);
  letter-spacing: 2px;
  flex-shrink: 0;
  text-shadow: 0 0 6px var(--aqua-glow);
}

.script-name {
  font-family: var(--font-title);
  font-size: 15px;
  color: var(--text-primary);
  letter-spacing: 3px;
}

.track-rail {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 6px;
}

/* 贯穿细线 —— 冷灰底 */
.rail-line {
  position: absolute;
  top: 4px;
  left: 14px;
  right: 14px;
  height: 1px;
  background: var(--line);
}

/* 已走过填光段 —— 暖金渐变，随 currentIndex 平滑延展（width 走合成 transition） */
.rail-fill {
  position: absolute;
  top: 4px;
  left: 14px;
  height: 1px;
  background: linear-gradient(90deg, var(--aqua), var(--aqua-bright));
  box-shadow: 0 0 5px var(--aqua-glow);
  opacity: 0.65;
  transition: width 0.6s var(--ease-out-expo);
  z-index: 1;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
  min-width: 56px;
}

/* 节点小圆点 —— 玻璃质感 */
.node-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--glass-deep);
  border: 1px solid var(--edge-dim);
  transition: all 0.5s var(--ease-out-expo);
}

/* 过去阶段：冷青填光 */
.node.passed .node-dot {
  background: var(--aqua);
  border-color: var(--aqua);
  opacity: 0.5;
}

/* 当前阶段：冷青光点（静态发光，呼吸交给独立的 ring 元素做，避免每帧重绘 box-shadow） */
.node.active .node-dot {
  width: 11px;
  height: 11px;
  margin-top: -1px;
  background: var(--aqua-bright);
  border-color: var(--aqua-bright);
  box-shadow:
    0 0 0 3px rgba(214, 160, 100, 0.14),
    0 0 10px var(--aqua-glow);
}

/* 当前阶段外扩光波 —— 从节点向外扩散消失（仅 transform+opacity 合成动画） */
.node-ring {
  position: absolute;
  top: 4px;
  left: 50%;
  width: 11px;
  height: 11px;
  margin-left: -5.5px;
  border-radius: 50%;
  border: 1px solid var(--aqua-bright);
  animation: ringPulse 3.6s var(--ease-out-expo) infinite;
  pointer-events: none;
}

@keyframes ringPulse {
  0% { transform: scale(1); opacity: 0.55; }
  100% { transform: scale(3.2); opacity: 0; }
}

.node-label {
  font-family: var(--font-title);
  font-size: 11px;
  letter-spacing: 1.5px;
  white-space: nowrap;
  transition: color 0.4s var(--ease-out-expo);
}

.node.active .node-label {
  color: var(--text-primary);
  font-weight: 600;
}

.node.passed .node-label {
  color: var(--text-secondary);
}

.node.future .node-label {
  color: var(--text-faint);
}
</style>
