<template>
  <div class="memory-panel" v-if="memories && Object.keys(memories).length > 0">
    <div class="memory-header">
      <span class="memory-title">关键记忆</span>
    </div>
    <div class="memory-sep"></div>
    <ul class="memory-list">
      <li
        v-for="(desc, name) in memories"
        :key="name"
        class="memory-item"
        :style="{ animationDelay: 0.5 + idx(name) * 0.12 + 's' }"
      >
        <span class="memory-dot"></span>
        <span class="memory-name">{{ name }}</span>
        <span class="memory-desc">{{ desc }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  memories: Record<string, string>;
}>();

// 稳定的索引（按 key 出现顺序），用于错落动效延迟
const _order: Record<string, number> = {};
function idx(name: string): number {
  if (!(name in _order)) _order[name] = Object.keys(_order).length;
  return _order[name];
}
</script>

<style lang="scss" scoped>
.memory-panel {
  margin-top: 14px;
  animation: memIn 0.6s 0.4s var(--ease-out-expo) both;
}

@keyframes memIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

.memory-header {
  margin-bottom: 7px;
}

.memory-title {
  font-family: var(--font-title);
  font-size: 12px;
  color: var(--aqua);
  letter-spacing: 3px;
  text-shadow: 0 0 5px var(--aqua-glow);
}

.memory-sep {
  height: 1px;
  margin-bottom: 9px;
  background: linear-gradient(90deg, var(--line), transparent);
}

.memory-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 2px;
}

.memory-item {
  display: flex;
  align-items: baseline;
  gap: 7px;
  line-height: 1.5;
  opacity: 0;
  animation: itemIn 0.5s var(--ease-out-expo) both;
}

@keyframes itemIn {
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: none; }
}

.memory-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--ember);
  box-shadow: 0 0 4px var(--ember-glow);
  flex-shrink: 0;
  margin-top: 6px;
}

.memory-name {
  font-family: var(--font-title);
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 1px;
}

.memory-desc {
  font-family: var(--font-text);
  font-size: 11px;
  color: var(--text-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
