<template>
  <div id="p-faction">
    <PanelHeader title="天下大势" @back="$emit('navigate', 'main')" />
    <div class="list-wrap">
      <template v-if="Object.keys(store.repObj).length > 0">
        <span class="t-section">个人声望</span>
        <div v-for="(v, k) in store.repObj" :key="k" class="card">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px">{{ k }}</span>
            <span class="t-num" :style="{ color: (v ?? 0) > 0 ? 'var(--jade)' : (v ?? 0) < 0 ? 'var(--cinnabar)' : 'var(--paper-dim)' }">{{ (v ?? 0) > 0 ? '+' : '' }}{{ v ?? 0 }}</span>
          </div>
        </div>
      </template>
      <template v-if="Object.keys(store.factionObj).length > 0">
        <span class="t-section">势力关系</span>
        <template v-for="(rels, facA) in store.factionObj" :key="facA">
          <div v-for="(detail, facB) in rels" :key="facA + facB" class="card">
            <div class="card-row">
              <span class="t-val" style="font-size: 13px">{{ facA }} <span class="t-label">对</span> {{ facB }}</span>
              <span class="chip" :class="statusChip(detail.状态)">{{ detail.状态 ?? '中立' }}</span>
            </div>
            <span class="t-label" style="line-height: 1.5">近期：{{ detail.最近事件 ?? '无' }}</span>
          </div>
        </template>
      </template>
      <div v-if="Object.keys(store.repObj).length === 0 && Object.keys(store.factionObj).length === 0" class="loading">江湖未远，声名不显。</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVariablesStore } from '../store';
import PanelHeader from './PanelHeader.vue';
defineEmits<{ navigate: [panel: string] }>();
const store = useVariablesStore();
function statusChip(status?: string) {
  if (status === '交战' || status === '对峙') return 'sha';
  if (status === '友好' || status === '同盟') return 'jade';
  return 'ash';
}
</script>
