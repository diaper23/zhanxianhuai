<template>
  <div class="gauge">
    <div class="gauge-head">
      <span class="t-section">{{ title }}</span>
      <span class="gauge-val" :class="variant">{{ display }}</span>
    </div>
    <div class="gauge-track">
      <div class="gauge-fill" :class="variant" :style="{ width: pct + '%' }"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ title: string; value: number; max: number; variant?: string; display?: string }>();
const pct = computed(() => Math.max(0, Math.min(100, (props.value / props.max) * 100)));
const display = computed(() => props.display ?? `${Math.round(pct.value)}%`);
</script>
<style>
.gauge { display: flex; flex-direction: column; gap: 4px; }
.gauge-head { display: flex; justify-content: space-between; align-items: baseline; }
.gauge-val { font-family: var(--f-num); font-size: 12px; font-weight: bold; color: var(--jade); }
.gauge-val.seal { color: var(--gold); }
.gauge-track { height: 5px; background: rgba(0, 0, 0, 0.55); border-radius: 3px; position: relative; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(216, 207, 191, 0.04); }
.gauge-fill { height: 100%; border-radius: 3px; background: var(--jade-deep); transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); position: relative; }
.gauge-fill::after { content: ''; position: absolute; right: 0; top: -2px; width: 1px; height: 7px; background: var(--jade); }
.gauge-fill.seal { background: #8a6f42; }
.gauge-fill.seal::after { background: var(--gold); }
</style>
