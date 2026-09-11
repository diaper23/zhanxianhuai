<template>
  <div class="qingshen-panel">
    <h3 class="section-title">羁绊与状态</h3>
    <div class="stats-grid">
      <StatBar label="真相已知度" :value="truth" />
      <StatBar label="羁绊值" :value="bond" />
      <StatBar label="她的体面值" :value="dignity" />
    </div>

    <div class="gossip-row" v-if="gossip > 0">
      <div class="gossip-header">
        <span class="gossip-icon">🔥</span>
        <span class="gossip-label">热搜余温</span>
        <span class="gossip-val">{{ gossip }}<span class="max-val">/100</span></span>
      </div>
      <div class="gossip-bar-bg">
        <div class="gossip-bar-fill" :style="{ width: gossip + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatBar from './StatBar.vue';

defineProps<{
  truth: number;
  bond: number;
  dignity: number;
  gossip: number;
}>();
</script>

<style scoped>
.qingshen-panel {
  margin-bottom: 16px;
}
.section-title {
  font-family: var(--font-title);
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 10px 0;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-bottom: 15px;
}
.gossip-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gossip-header {
  display: flex;
  align-items: center;
  font-size: 11.5px;
}
.gossip-label {
  color: var(--text-muted);
  margin-left: 4px;
  flex-grow: 1;
}
.gossip-val {
  color: #ff9800;
  font-family: monospace;
  font-size: 12px;
}
.max-val {
  font-size: 9px;
  color: var(--text-dim);
  margin-left: 1px;
}
.gossip-bar-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}
.gossip-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #f44336, #ff9800);
  transition: width 0.5s ease-out;
  box-shadow: 0 0 5px rgba(255, 152, 0, 0.5);
}
</style>
