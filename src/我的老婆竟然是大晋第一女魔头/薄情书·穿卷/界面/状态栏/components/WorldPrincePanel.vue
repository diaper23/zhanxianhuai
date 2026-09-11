<template>
  <div class="world-prince">
    <div class="personal-header">
      <div class="avatar-frame">
        <!-- 默认使用通用头像位 -->
        <img :src="store.avatarUrl" alt="Avatar" class="avatar" v-if="store.avatarUrl" />
        <div class="avatar-placeholder" v-else></div>
      </div>
      <div class="title-group">
        <h2 class="name">{{ store.userName || '你' }}</h2>
        <div class="reputation-tag">{{ personal.声名标签 }}</div>
      </div>
      <div class="personal-stats">
        <div class="p-stat"><span class="p-icon">⚔️</span>武力 {{ personal.武力 }}<span class="max-val-p">/100</span></div>
        <div class="p-stat" v-if="store.data?.纨绔世子?.剧情记录?.['天一决']"><span class="p-icon">☯️</span>天一决 {{ personal.天一决进度 }}<span class="max-val-p">/100</span></div>
      </div>
    </div>

    <h3 class="section-title">势力版图</h3>
    <div class="power-grid">
      <div class="power-item">
        <div class="power-header">
          <span class="power-icon">🛡️</span>
          <span class="power-name">军力</span>
          <span class="power-val">{{ stats.军力 }}<span class="max-val">/100</span></span>
        </div>
        <div class="power-bar-bg">
          <div class="power-bar-fill military" :style="{ width: stats.军力 + '%' }"></div>
        </div>
      </div>

      <div class="power-item">
        <div class="power-header">
          <span class="power-icon">💰</span>
          <span class="power-name">财力</span>
          <span class="power-val">{{ stats.财力 }}<span class="max-val">/100</span></span>
        </div>
        <div class="power-bar-bg">
          <div class="power-bar-fill wealth" :style="{ width: stats.财力 + '%' }"></div>
        </div>
      </div>

      <div class="power-item">
        <div class="power-header">
          <span class="power-icon">📜</span>
          <span class="power-name">朝堂权势</span>
          <span class="power-val">{{ stats.朝堂权势 }}<span class="max-val">/100</span></span>
        </div>
        <div class="power-bar-bg">
          <div class="power-bar-fill politics" :style="{ width: stats.朝堂权势 + '%' }"></div>
        </div>
      </div>

      <div class="power-item">
        <div class="power-header">
          <span class="power-icon">🌾</span>
          <span class="power-name">民间声望</span>
          <span class="power-val">{{ stats.民间声望 }}<span class="max-val">/100</span></span>
        </div>
        <div class="power-bar-bg">
          <div class="power-bar-fill people" :style="{ width: stats.民间声望 + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

defineProps<{
  stats: { 军力: number; 财力: number; 朝堂权势: number; 民间声望: number };
  personal: { 武力: number; 天一决进度: number; 声名标签: string };
}>();

const store = useDataStore();
</script>

<style scoped>
.world-prince {
  margin-bottom: 16px;
}

.personal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-frame {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, var(--gold-bright), transparent);
  border: 1px solid rgba(255, 215, 0, 0.3);
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
}

.title-group {
  flex-grow: 1;
}

.name {
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--text-bright);
  margin: 0 0 4px 0;
}

.username {
  font-size: 12px;
  color: var(--text-dim);
  font-family: var(--font-text);
}

.reputation-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 215, 0, 0.1);
  color: var(--gold-bright);
  font-size: 10.5px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.personal-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.p-stat {
  font-size: 11.5px;
  color: var(--text-muted);
}

.p-icon {
  margin-right: 4px;
  opacity: 0.8;
}

.section-title {
  font-family: var(--font-title);
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 10px 0;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.power-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.power-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.power-header {
  display: flex;
  align-items: center;
  font-size: 11.5px;
}

.power-name {
  color: var(--text-muted);
  margin-left: 4px;
  flex-grow: 1;
}

.power-val {
  color: var(--text-bright);
  font-family: monospace;
  font-size: 12px;
}

.power-bar-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.power-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease-out;
}

.military { background: linear-gradient(90deg, #8b0000, #ff4500); }
.wealth { background: linear-gradient(90deg, #b8860b, #ffd700); }
.politics { background: linear-gradient(90deg, #483d8b, #9370db); }
.people { background: linear-gradient(90deg, #2e8b57, #00fa9a); }

.max-val {
  font-size: 9px;
  color: var(--text-dim);
  margin-left: 1px;
}

.max-val-p {
  font-size: 9px;
  color: var(--text-dim);
  margin-left: 1px;
}
</style>