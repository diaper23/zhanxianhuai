<template>
  <div id="p-task">
    <PanelHeader title="天机异象" @back="$emit('navigate', 'main')" />
    <div class="list-wrap">
      <template v-if="store.auction.状态 > 0">
        <span class="t-section">隐元阁暗拍 <span class="t-label" v-if="store.auction.状态 === 2">[已结束]</span></span>
        <div class="card" style="border-color: rgba(201, 168, 106, 0.55)">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px; color: var(--gold)">{{ store.auction.举办地 || '未知举办地' }}</span>
            <span class="t-label" v-if="store.auction.最终得主">得主：{{ store.auction.最终得主 }}</span>
          </div>
          <span v-if="store.auction.压轴拍品?.length" class="t-label">压轴：{{ store.auction.压轴拍品.join('、') }}</span>
          <span v-if="store.auction.大客户名单?.length" class="t-label">名录：{{ store.auction.大客户名单.join('、') }}</span>
        </div>
      </template>

      <template v-if="store.danuo.状态 > 0">
        <span class="t-section">大傩阴墟 <span class="t-label" v-if="store.danuo.状态 === 2">[脱出]</span></span>
        <div class="card" style="border-color: rgba(127, 184, 164, 0.35); gap: 5px">
          <div class="card-row">
            <span class="t-label">探索进度</span>
            <span class="t-num" style="color: var(--jade)">{{ store.danuo.探索进度 }}%</span>
          </div>
          <div class="bar"><div class="bar-fill" style="background: var(--jade)" :style="{ width: store.danuo.探索进度 + '%' }"></div></div>
          <span v-if="store.danuo.死亡次数 > 0" class="t-label" style="color: var(--cinnabar)">死劫：{{ store.danuo.死亡次数 }} 次</span>
        </div>
      </template>

      <template v-if="Object.keys(store.tasksObj).length > 0">
        <span class="t-section">当前任务</span>
        <div v-for="(t, k) in store.tasksObj" :key="k" class="card">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px; color: var(--jade)">{{ k }}</span>
            <span class="chip ash">{{ t.类型 ?? '杂务' }}</span>
          </div>
          <span class="t-label" style="color: var(--paper); line-height: 1.5">{{ t.简述 ?? '无' }}</span>
          <span class="t-label">地点：{{ t.地点 ?? '未知' }} · 目标：{{ t.目标 ?? '无' }}</span>
          <span v-if="t.奖励" class="t-label" style="color: var(--gold)">奖励：{{ t.奖励 }}</span>
          <span v-if="t.时限" class="t-label" style="color: var(--cinnabar)">时限：{{ t.时限 }}</span>
        </div>
      </template>

      <template v-if="Object.keys(store.eventsObj).length > 0">
        <span class="t-section">世相纷变</span>
        <div v-for="(e, k) in store.eventsObj" :key="k" class="card" style="border-color: rgba(194, 94, 94, 0.25)">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px; color: var(--cinnabar)">{{ k }}</span>
            <span class="chip ash">{{ e.玩家介入度 ?? '未涉及' }}</span>
          </div>
          <span class="t-label" style="color: var(--paper); line-height: 1.5">{{ e.简述 ?? '无' }}</span>
          <span class="t-label">阶段：{{ e.当前阶段 ?? '' }} · 涉及：{{ e.涉及势力?.join('、') ?? '无' }}</span>
        </div>
      </template>

      <template v-if="Object.keys(store.intelObj).length > 0">
        <span class="t-section">已知情报</span>
        <div v-for="(it, k) in store.intelObj" :key="k" class="card">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px">{{ k }}</span>
            <div style="display: flex; gap: 4px; align-items: center">
              <span class="chip" :class="credChip(it.可信度)">{{ it.可信度 ?? '传闻' }}</span>
              <span v-if="it.是否已使用" class="t-label" style="font-size: 10px">已用</span>
            </div>
          </div>
          <span class="t-label" style="color: var(--paper); line-height: 1.5">{{ it.内容 ?? '无' }}</span>
          <span class="t-label">来源：{{ it.来源 ?? '未知' }}</span>
        </div>
      </template>

      <template v-if="store.rumors.length > 0">
        <span class="t-section">修仙界传闻</span>
        <div v-for="(r, i) in store.rumors" :key="i" class="card">
          <div class="card-row">
            <span class="t-val" style="font-size: 13px">{{ r.原始事件 }}</span>
            <span class="chip" :class="credChip(r.热度)">{{ r.热度 }}</span>
          </div>
          <span class="t-label" style="color: var(--gold); line-height: 1.5">{{ r.演化版本 }}</span>
        </div>
      </template>

      <div v-if="empty" class="loading">天机隐晦，暂无异动。</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useVariablesStore } from '../store';
import PanelHeader from './PanelHeader.vue';
defineEmits<{ navigate: [panel: string] }>();
const store = useVariablesStore();
const empty = computed(
  () =>
    Object.keys(store.tasksObj).length === 0 &&
    Object.keys(store.eventsObj).length === 0 &&
    Object.keys(store.intelObj).length === 0 &&
    store.auction.状态 === 0 &&
    store.danuo.状态 === 0 &&
    store.rumors.length === 0,
);
function credChip(level?: string) {
  if (level === '确证' || level === '可靠' || level === '满城风雨' || level === '天下皆知') return 'jade';
  if (level === '可疑') return 'sha';
  return 'ash';
}
</script>
