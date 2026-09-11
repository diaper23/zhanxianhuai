<template>
  <div class="relation-panel">
    <h3 class="section-title" @click="toggleExpand" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
      <span>核心人物网</span>
      <span class="expand-icon" :class="{ collapsed: !isExpanded }">▼</span>
    </h3>
    <div v-show="isExpanded">
      <div v-if="filteredRelations.length === 0" class="empty-state">
        暂无关键人物信息
      </div>
      <div class="npc-list" v-else>
        <div v-for="npc in filteredRelations" :key="npc.name" class="npc-card">
          <div class="npc-header">
            <span class="npc-name">{{ npc.name }}</span>
            <span class="npc-stance" :class="getStanceClass(npc.stance)">{{ npc.stance }}</span>
          </div>
          <div class="npc-stats">
            <div class="n-stat">
              <span class="n-label">好感</span>
              <div class="n-bar-wrap favor-wrap">
                <div class="center-mark"></div>
                <div v-if="npc.favor >= 0" class="n-bar favor pos" :style="{ left: '50%', width: (npc.favor / 2) + '%', background: getFavorColor(npc.favor) }"></div>
                <div v-else class="n-bar favor neg" :style="{ right: '50%', width: (Math.abs(npc.favor) / 2) + '%', background: getFavorColor(npc.favor) }"></div>
              </div>
              <span class="n-val" :class="{ neg: npc.favor < 0 }">{{ npc.favor }}</span>
            </div>
            <div class="n-stat">
              <span class="n-label">信任</span>
              <div class="n-bar-wrap">
                <div class="n-bar trust" :style="{ width: npc.trust + '%' }"></div>
              </div>
              <span class="n-val">{{ npc.trust }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  relations: Record<string, { 好感度: number; 信任度: number; 立场: string }>;
}>();

const isExpanded = ref(true);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

// Filter and sort relations to show top 4 most important ones
// Priority: non-neutral stance, then absolute favor value
const filteredRelations = computed(() => {
  if (!props.relations) return [];

  const list = Object.keys(props.relations).map(key => ({
    name: key,
    favor: props.relations[key].好感度 || 0,
    trust: props.relations[key].信任度 || 50,
    stance: props.relations[key].立场 || '中立',
  }));

  list.sort((a, b) => {
    // Non-neutral stances get higher priority
    const aIsNeutral = a.stance === '中立';
    const bIsNeutral = b.stance === '中立';
    if (aIsNeutral !== bIsNeutral) return aIsNeutral ? 1 : -1;

    // Then sort by absolute favor value (how "intense" the relationship is)
    return Math.abs(b.favor) - Math.abs(a.favor);
  });

  return list.slice(0, 4); // Only show top 4
});

function getStanceClass(stance: string) {
  const map: Record<string, string> = {
    '效忠': 'loyal',
    '支持': 'support',
    '中立': 'neutral',
    '警惕': 'warn',
    '敌对': 'fatal',
  };
  return map[stance] || 'neutral';
}

function getFavorWidth(favor: number) {
  // Map -100~100 to 0~100 width
  return `${Math.abs(favor)}%`;
}

function getFavorColor(favor: number) {
  if (favor >= 0) return 'linear-gradient(90deg, #2e8b57, #00fa9a)';
  return 'linear-gradient(90deg, #8b0000, #ff4500)';
}
</script>

<style scoped>
.section-title {
  font-family: var(--font-title);
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 10px 0;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.expand-icon {
  font-size: 10px;
  transition: transform 0.3s;
}

.expand-icon.collapsed {
  transform: rotate(-90deg);
}

.empty-state {
  font-size: 11.5px;
  color: var(--text-dim);
  text-align: center;
  padding: 10px 0;
}

.npc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.npc-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  padding: 8px 10px;
}

.npc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.npc-name {
  font-size: 12px;
  color: var(--text-bright);
}

.npc-stance {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
}

.loyal { color: #00fa9a; border: 1px solid rgba(0, 250, 154, 0.3); }
.support { color: #87cefa; border: 1px solid rgba(135, 206, 250, 0.3); }
.neutral { color: #aaaaaa; }
.warn { color: #ffeb3b; border: 1px solid rgba(255, 235, 59, 0.3); }
.fatal { color: #f44336; border: 1px solid rgba(244, 67, 54, 0.3); }

.npc-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.n-stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.n-label {
  font-size: 9.5px;
  color: var(--text-dim);
  width: 22px;
}

.n-bar-wrap {
  flex-grow: 1;
  height: 3px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1.5px;
  display: flex;
  align-items: center;
}

.favor-wrap {
  position: relative;
}

.n-bar {
  height: 100%;
  border-radius: 1.5px;
  transition: width 0.5s ease;
}

.n-bar.favor {
  position: absolute;
  top: 0;
}

.center-mark {
  position: absolute;
  left: 50%;
  top: -1px;
  bottom: -1px;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.n-bar.trust {
  background: linear-gradient(90deg, #4682b4, #1e90ff);
}

.n-val {
  font-size: 9.5px;
  font-family: monospace;
  color: var(--text-muted);
  width: 20px;
  text-align: right;
}

.n-val.neg {
  color: #ff8a80;
}
</style>