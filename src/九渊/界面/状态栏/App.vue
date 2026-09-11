<template>
  <div class="frame" :class="{ 'map-active': currentPanel === 'map', alert: store.isQiong || store.sealTension >= 60 }">
    <div class="sheen"></div>
    <div class="corners"><span></span><span></span><span></span><span></span></div>
    <template v-if="ready">
      <MainPanel v-if="currentPanel === 'main'" @navigate="navigate" />
      <BagPanel v-else-if="currentPanel === 'bag'" @navigate="navigate" />
      <BondPanel v-else-if="currentPanel === 'bond'" @navigate="navigate" />
      <FactionPanel v-else-if="currentPanel === 'faction'" @navigate="navigate" />
      <TaskPanel v-else-if="currentPanel === 'task'" @navigate="navigate" />
      <MapPanel v-else-if="currentPanel === 'map'" @navigate="navigate" />
    </template>
    <div v-else class="loading">聚灵布阵中…</div>
    <div v-if="error" class="error-msg">阵纹逆乱：{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { useVariablesStore } from './store';
import MainPanel from './components/MainPanel.vue';
import BagPanel from './components/BagPanel.vue';
import BondPanel from './components/BondPanel.vue';
import FactionPanel from './components/FactionPanel.vue';
import TaskPanel from './components/TaskPanel.vue';
import MapPanel from './components/MapPanel.vue';

const store = useVariablesStore();
const currentPanel = ref('main');
const ready = ref(false);
const error = ref('');

function navigate(panel: string) {
  currentPanel.value = panel;
}

try {
  store.refresh();
  ready.value = true;
  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
    store.refresh();
  });
} catch (e: any) {
  error.value = e.message ?? String(e);
}
</script>
