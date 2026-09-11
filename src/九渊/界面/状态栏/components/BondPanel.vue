<template>
  <div id="p-bond">
    <PanelHeader title="因果结缘" @back="$emit('navigate', 'main')" />
    <div class="list-wrap">
      <template v-if="activeBonds.length > 0">
        <span class="t-section">好感羁绊</span>
        <div v-for="[k, v] in activeBonds" :key="k" class="card" style="gap: 5px">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px">{{ k }}</span>
            <span class="t-num" :style="{ color: v >= 60 ? 'var(--jade)' : v <= 20 ? 'var(--cinnabar)' : 'var(--paper-dim)' }">{{ v }}</span>
          </div>
          <div class="bar">
            <div class="bar-fill" :style="{ width: Math.min(100, Math.max(0, v)) + '%', background: v >= 60 ? 'var(--jade)' : v <= 20 ? 'var(--cinnabar)' : '#8a6f42' }"></div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="loading">因果未生，尘缘未染。</div>
      </template>

      <template v-if="metList.length > 0">
        <span class="t-section">已邂逅</span>
        <div style="display: flex; gap: 6px; flex-wrap: wrap">
          <span v-for="n in metList" :key="n" class="chip jade" style="font-size: 11px; padding: 3px 8px">{{ n }}</span>
        </div>
      </template>

      <template v-if="relEntries.length > 0">
        <span class="t-section">情网纠葛</span>
        <div v-for="(r, key) in store.heroineRels" :key="key" class="card">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px; color: var(--gold)">{{ key }}</span>
            <span class="chip gold">{{ r.关系 ?? '陌路' }}</span>
          </div>
          <span v-if="r.导火索" class="t-label">导火索：{{ r.导火索 }}</span>
          <span v-if="r.最近互动" class="t-label" style="color: var(--paper)">近况：{{ r.最近互动 }}</span>
        </div>
      </template>

      <div v-if="store.heroineCooldown > 0" class="card" style="gap: 2px">
        <div class="card-row">
          <span class="t-label">情缘劫数</span>
          <span class="t-num" style="color: var(--cinnabar)">{{ store.heroineCooldown }} 回合</span>
        </div>
        <span class="t-label">女主事件冷却中</span>
      </div>
    </div>

    <template v-if="store.npcList.length > 0">
      <div class="divider"></div>
      <span class="t-section">在场之人</span>
      <div style="display: flex; gap: 6px; flex-wrap: wrap">
        <span v-for="n in store.npcList" :key="n" class="chip ash" style="font-size: 11px; padding: 3px 8px">{{ n }}</span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useVariablesStore } from '../store';
import PanelHeader from './PanelHeader.vue';
defineEmits<{ navigate: [panel: string] }>();
const store = useVariablesStore();
const activeBonds = computed(() => Object.entries(store.favorObj).filter(([, v]) => (v as number) > 0));
const metList = computed(() => store.metHeroines.filter(n => !store.favorObj[n]));
const relEntries = computed(() => Object.entries(store.heroineRels));
</script>
