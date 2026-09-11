<template>
  <div class="phase-track">
    <div class="track-line">
      <div class="track-fill" :style="{ width: getFillWidth() }"></div>
    </div>
    <div class="phase-nodes">
      <div
        v-for="(p, i) in phases"
        :key="p"
        class="node"
        :class="{ active: currentPhaseIdx >= i, current: currentPhaseIdx === i }"
      >
        <div class="node-dot"></div>
        <div class="node-label">{{ p }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  phase: string;
}>();

const phases = ['热搜点燃', '重逢试探', '记忆反噬', '和解推拉', '放手或回头'];
const currentPhaseIdx = computed(() => Math.max(0, phases.indexOf(props.phase)));

function getFillWidth() {
  const segment = 100 / (phases.length - 1);
  return `${currentPhaseIdx.value * segment}%`;
}
</script>

<style scoped>
.phase-track {
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 8px;
}

.track-line {
  position: absolute;
  top: 6px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
}

.track-fill {
  height: 100%;
  background: var(--aqua-bright);
  border-radius: 1px;
  transition: width 0.8s ease-out;
  box-shadow: 0 0 6px var(--aqua-glow);
}

.phase-nodes {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 20%;
  opacity: 0.4;
  transition: opacity 0.4s;
}

.node.active {
  opacity: 1;
}

.node.current .node-dot {
  transform: scale(1.4);
  box-shadow: 0 0 8px var(--aqua-glow);
  background: var(--aqua-bright);
  border-color: transparent;
}

.node.current .node-label {
  color: var(--text-bright);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.node-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bg-dark);
  border: 1px solid var(--text-dim);
  z-index: 1;
  transition: all 0.3s;
}

.node.active .node-dot {
  background: var(--aqua-muted);
  border-color: var(--aqua-bright);
}

.node-label {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-title);
  letter-spacing: 1px;
}
</style>