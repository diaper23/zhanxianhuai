<template>
  <div class="wizard-root zx-theme">
    <!-- ═══ Header ═══ -->
    <header class="wizard-header">
      <div class="header-center">
        <h2 class="wizard-title"><span class="title-seal">密</span> 斩仙槐卷</h2>
        <div class="title-accent"></div>
        <p class="wizard-subtitle">苍家文官 · {{ 显示名 }} · 录宗待命</p>
      </div>
    </header>

    <!-- ═══ 固定身份档案 ═══ -->
    <section class="档案卡">
      <div class="档案行">
        <span class="档案键">姓名</span><span class="档案值">{{ 显示名 }}</span>
        <span class="档案键">身份</span><span class="档案值">{{ 固定档案.身份 }}</span>
        <span class="档案键">年龄</span><span class="档案值">{{ 固定档案.年龄 }}</span>
      </div>
      <div class="档案行 出身行">
        <span class="档案键">出身</span><span class="档案值 出身">{{ 固定档案.出身 }}</span>
      </div>
      <div class="档案注">身份、技能与行装皆为既定命数，不可更易；唯一可左右的是你的骨血——八大属性与幸运。</div>
    </section>

    <!-- ═══ 属性配置（唯一可配置项）═══ -->
    <section class="step-card">
      <h3 class="step-heading">命理骨血</h3>

      <div class="method-bar">
        <button
          v-for="m in methods"
          :key="m.key"
          class="method-btn"
          :class="{ active: store.method === m.key }"
          @click="store.method = m.key"
        >{{ m.label }}</button>
      </div>

      <div class="attr-grid">
        <div v-for="attr in attrs" :key="attr.key" class="attr-row">
          <span class="attr-label">{{ attr.label }}</span>
          <input
            v-model.number="store.attrs[attr.key]"
            class="attr-input"
            type="number"
            :min="store.method === 'B' ? 15 : 0"
            :max="store.method === 'B' ? 80 : 99"
            :disabled="store.method === 'A'"
          />
          <div class="attr-bar-track">
            <div
              class="attr-bar-fill"
              :style="{ width: (store.attrs[attr.key] || 0) + '%' }"
              :class="{ low: store.attrs[attr.key] < 35, high: store.attrs[attr.key] >= 65 }"
            ></div>
          </div>
        </div>
      </div>

      <div class="points-remaining" :class="{ warn: store.remaining < 5, over: store.remaining < 0 }">
        剩余点数：{{ store.remaining }} / 320
      </div>

      <div class="bonus-box">
        <p class="bonus-title">既定加成</p>
        <span v-for="b in 固定档案.特长与加成" :key="b" class="bonus-tag">{{ b }}</span>
      </div>

      <div class="step-footer">
        <button
          class="btn-advance 出仕"
          :disabled="store.method === 'B' && store.remaining < 0"
          @click="handleSubmit"
        >领旨出仕 →</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useCreateStore, 固定档案 } from './store';

const store = useCreateStore();

const attrs = [
  { key: '力量', label: '力量 STR' },
  { key: '敏捷', label: '敏捷 DEX' },
  { key: '体质', label: '体质 CON' },
  { key: '外貌', label: '外貌 APP' },
  { key: '智力', label: '智力 INT' },
  { key: '意志', label: '意志 WIL' },
  { key: '教育', label: '教育 EDU' },
  { key: '体型', label: '体型 SIZ' },
  { key: '幸运', label: '幸运 LUK' },
] as const;

const methods = [
  { key: 'A', label: '标准A' },
  { key: 'B', label: '点购B' },
] as const;

/* <user> 为酒馆宏：显示时替换为玩家角色名 */
const 显示名 = computed(() => {
  try {
    const name = substitudeMacros('{{user}}');
    return name || '<user>';
  } catch {
    return '<user>';
  }
});

onMounted(() => {
  store.init();
});

async function handleSubmit() {
  await store.submitCreate();
}
</script>

<style lang="scss" scoped>
.wizard-root {
  position: relative;
  padding-bottom: 8px;
  &::before {
    content: '';
    position: absolute;
    top: -20px; left: -16px; right: -16px; bottom: -32px;
    background: radial-gradient(circle at center, rgba(42, 34, 22, 0.2) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }
}

/* ═══ Header ═══ */
.wizard-header {
  text-align: center;
  margin-bottom: 20px;
}

.wizard-title {
  font-family: var(--font-title);
  font-size: 28px;
  color: var(--zx-text);
  letter-spacing: 8px;
  margin-right: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  background: var(--zx-red);
  color: #111;
  font-size: 22px;
  border-radius: 4px;
  letter-spacing: 0;
  margin-right: 12px;
  transform: rotate(-6deg);
  box-shadow: 0 0 16px var(--zx-red-glow);
}

.title-accent {
  width: 60px; height: 1px;
  margin: 12px auto 8px;
  background: linear-gradient(90deg, transparent, var(--zx-red), transparent);
}

.wizard-subtitle {
  font-size: 11px;
  color: var(--zx-text-muted);
  letter-spacing: 3px;
}

/* ═══ 固定档案卡 ═══ */
.档案卡 {
  padding: 12px 16px;
  border: 1px solid var(--zx-border);
  background: rgba(158, 42, 43, 0.03);
  margin-bottom: 20px;
}

.档案行 {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;

  &:last-of-type { margin-bottom: 0; }
  &.出身行 { display: flex; }
}

.档案键 {
  font-size: 10px;
  font-family: var(--font-title);
  color: var(--zx-red);
  letter-spacing: 2px;
  flex-shrink: 0;
}

.档案值 {
  font-size: 13px;
  font-family: var(--font-title);
  color: var(--zx-text);
  letter-spacing: 1px;

  &.出身 { font-size: 11px; color: var(--zx-text-sub); letter-spacing: 0.5px; }
}

.档案注 {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed var(--zx-border-light);
  font-size: 10.5px;
  color: var(--zx-text-muted);
  line-height: 1.7;
}

/* ═══ 属性配置 ═══ */
.step-card {
  animation: cardIn 0.3s ease both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

.step-heading {
  font-family: var(--font-title);
  font-size: 20px;
  color: var(--zx-text);
  letter-spacing: 4px;
  font-weight: normal;
  margin-bottom: 12px;
}

.method-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.method-btn {
  flex: 1;
  padding: 8px 0;
  border: 1px solid var(--zx-border);
  border-radius: 0;
  background: transparent;
  color: var(--zx-text-muted);
  font-family: var(--font-title);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 2px;

  &.active {
    border-color: var(--zx-red);
    color: var(--zx-red);
    background: rgba(158, 42, 43, 0.05);
    box-shadow: inset 0 0 10px rgba(158, 42, 43, 0.1);
  }

  &:hover:not(.active) {
    border-color: var(--zx-text-muted);
    color: var(--zx-text-sub);
  }
}

.attr-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.attr-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.attr-label {
  width: 90px;
  font-size: 13px;
  font-family: var(--font-title);
  color: var(--zx-text-sub);
  letter-spacing: 1px;
  flex-shrink: 0;
}

.attr-input {
  width: 48px;
  padding: 4px 0;
  border: none;
  border-bottom: 1px solid var(--zx-border);
  background: transparent;
  color: var(--zx-text);
  font-family: var(--font-title);
  font-size: 16px;
  text-align: center;
  outline: none;
  flex-shrink: 0;

  &:focus { border-bottom-color: var(--zx-red); }
  &:disabled { opacity: 0.6; }
}

.attr-bar-track {
  flex: 1;
  height: 2px;
  background: var(--zx-border);
  border-radius: 0;
  overflow: hidden;
}

.attr-bar-fill {
  height: 100%;
  background: var(--zx-gold-dim);
  border-radius: 0;
  transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);

  &.low { background: rgba(140, 38, 38, 0.3); }
  &.high { background: var(--zx-red); box-shadow: 0 0 8px var(--zx-red-glow); }
}

.points-remaining {
  font-size: 13px;
  font-family: var(--font-title);
  color: var(--zx-text-sub);
  margin-bottom: 12px;
  letter-spacing: 1px;

  &.warn { color: var(--zx-gold); }
  &.over { color: var(--zx-red); }
}

.bonus-box {
  padding: 12px 16px;
  border: 1px solid var(--zx-border);
  border-radius: 0;
  background: rgba(158, 42, 43, 0.03);
  margin-bottom: 16px;
}

.bonus-title {
  font-size: 11px;
  font-family: var(--font-title);
  color: var(--zx-red);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.bonus-tag {
  display: inline-block;
  font-size: 11px;
  padding: 4px 10px;
  margin: 4px 6px 4px 0;
  border: 1px solid var(--zx-red);
  background: rgba(158, 42, 43, 0.05);
  color: var(--zx-text);
  font-family: var(--font-title);
}

.step-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.btn-advance {
  padding: 10px 28px;
  border: 1px solid var(--zx-border);
  border-radius: 6px;
  background: rgba(201, 168, 76, 0.08);
  color: var(--zx-text);
  font-family: var(--font-title);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover:not(:disabled) {
    border-color: var(--zx-gold);
    background: rgba(201, 168, 76, 0.15);
    box-shadow: 0 0 12px rgba(201, 168, 76, 0.15);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}
</style>
