<template>
  <div id="p-map">
    <PanelHeader title="堪舆阵图" @back="$emit('navigate', 'main')" />
    <div class="map-viewport" ref="viewportRef">
      <div class="map-content" ref="contentRef">
        <img v-show="!mapFailed" src="https://imgbed.hssgmd-edt.workers.dev/img/quWyV_fN" class="map-image" alt="堪舆阵图" @error="mapFailed = true" />
        <div v-if="mapFailed" class="map-fallback"></div>
        <div v-for="(pos, key) in MAP_DATA" :key="key" class="hotspot" :style="{ left: pos.x + '%', top: pos.y + '%' }" @click.stop="openModal(key, pos)"></div>
      </div>
      <div class="map-info-modal" :class="{ show: modalOpen }">
        <div class="map-modal-head">
          <span>{{ modalName }}</span>
          <span class="modal-close" @click.stop="modalOpen = false">✕</span>
        </div>
        <div class="map-modal-desc">{{ modalDesc }}</div>
        <div v-if="modalTowns" class="map-modal-towns">{{ modalTowns }}</div>
      </div>
    </div>
    <div class="map-hint">拖拽平移 · 滚轮或双指缩放 · 点击光点查探</div>
  </div>
</template>
<script setup lang="ts">
import { MAP_DATA } from '../data/map';
import { useMapInteraction } from '../composables/useMapInteraction';
import PanelHeader from './PanelHeader.vue';
defineEmits<{ navigate: [panel: string] }>();
const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
useMapInteraction(() => viewportRef.value, () => contentRef.value);
const modalOpen = ref(false);
const mapFailed = ref(false);
const modalName = ref('');
const modalDesc = ref('');
const modalTowns = ref('');
function openModal(name: string, pos: { desc: string; towns?: string }) {
  modalName.value = name;
  modalDesc.value = pos.desc;
  modalTowns.value = pos.towns ? pos.towns.split('/').join(' 、 ') : '';
  modalOpen.value = true;
}
</script>
<style>
.map-viewport { width: 100%; aspect-ratio: 1 / 1; background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(201, 168, 106, 0.3); position: relative; overflow: hidden; touch-action: none; cursor: grab; }
.map-viewport:active { cursor: grabbing; }
.map-content { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform-origin: 0 0; user-select: none; }
.map-image { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.map-fallback {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at 50% 50%, rgba(127, 184, 164, 0.1), transparent 62%),
    repeating-linear-gradient(0deg, rgba(201, 168, 106, 0.06) 0 1px, transparent 1px 36px),
    repeating-linear-gradient(90deg, rgba(201, 168, 106, 0.06) 0 1px, transparent 1px 36px),
    rgba(14, 16, 20, 0.9);
}
.map-fallback::after { content: '底图未载入 · 光点仍可查探'; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-family: var(--f-title); font-size: 12px; letter-spacing: 2px; color: rgba(194, 184, 166, 0.5); white-space: nowrap; }
.hotspot { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; background: radial-gradient(circle, rgba(127, 184, 164, 0.9) 25%, transparent 75%); border: 1px solid rgba(127, 184, 164, 0.5); border-radius: 50%; cursor: pointer; z-index: 10; opacity: 0.85; pointer-events: auto; transition: transform 0.2s, opacity 0.2s; }
.hotspot:hover { transform: scale(1.5); opacity: 1; }
.map-info-modal { position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(20, 22, 26, 0.95); border: 1px solid rgba(201, 168, 106, 0.4); padding: 10px; display: none; flex-direction: column; gap: 5px; z-index: 20; backdrop-filter: blur(4px); }
.map-info-modal.show { display: flex; animation: mapSlide 0.25s ease; }
@keyframes mapSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.map-modal-head { font-family: var(--f-title); font-size: 14px; color: var(--gold); letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(201, 168, 106, 0.25); padding-bottom: 4px; }
.map-modal-desc { font-size: 12px; color: var(--paper); line-height: 1.6; }
.map-modal-towns { font-size: 11px; color: var(--paper-dim); border-top: 1px solid rgba(201, 168, 106, 0.15); padding-top: 4px; line-height: 1.5; }
.map-hint { text-align: center; font-size: 10px; color: var(--paper-dim); margin-top: 6px; letter-spacing: 1px; }
</style>
