<template>
  <div id="p-bag">
    <PanelHeader title="行囊装备" @back="$emit('navigate', 'main')" />
    <span class="t-section">身披法器</span>
    <div class="equip-grid">
      <div v-for="s in ['武器', '防具', '饰品', '核心造物']" :key="s" class="card" style="gap: 2px">
        <span class="t-label">{{ s }}</span>
        <span class="t-val" style="font-size: 13px">{{ store.equip[s] ?? '无' }}</span>
      </div>
    </div>
    <div class="divider"></div>
    <span class="t-section">芥子行囊</span>
    <template v-if="Object.keys(store.bagObj).length === 0">
      <div class="loading">须弥芥子，空无一物。</div>
    </template>
    <div v-else class="list-wrap">
      <div v-for="(v, k) in store.bagObj" :key="k" class="card">
        <div class="card-row">
          <span class="t-val" style="font-size: 13px">{{ k }}</span>
          <span class="t-num">×{{ v.数量 ?? 1 }}</span>
        </div>
        <span v-if="v.描述" class="t-label" style="line-height: 1.5">{{ v.描述.length > 40 ? v.描述.substring(0, 40) + '…' : v.描述 }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVariablesStore } from '../store';
import PanelHeader from './PanelHeader.vue';
defineEmits<{ navigate: [panel: string] }>();
const store = useVariablesStore();
</script>
<style>
.equip-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
</style>
