<template>
  <div id="p-main" class="panel active" ref="panelRef">
    <div v-if="alerting" class="alert-line"></div>
    <QiCanvas />
    <div class="hero">
      <div class="hero-left">
        <span class="hero-seal">渊</span>
        <div class="hero-text">
          <span class="t-label hero-loc">{{ locText }}</span>
          <div class="hero-realm" :title="`点击切换为${showCommon ? '途径' : '通用'}境界`" @click="showCommon = !showCommon">
            {{ showCommon ? store.realmCommon : store.realmPath }}
          </div>
          <div class="hero-sub">
            <span>{{ store.subRealm }}</span>
            <span v-if="store.school !== '无'" class="hero-school">{{ store.school }}<template v-if="store.school === '气脉'"> · {{ store.linggen }} 品灵根</template></span>
          </div>
        </div>
      </div>
      <SealRing :value="store.sealTension" :size="112" />
    </div>
    <div class="hero-meta">
      <span class="hero-time">{{ store.time }}</span>
      <div class="hero-meta-right">
        <span class="t-label">{{ store.yuanhou }}</span>
        <span v-if="store.isDual" class="chip jade">双息</span>
        <span v-if="store.isQiong" class="chip sha">穷日</span>
      </div>
    </div>

    <div v-if="phaseAlert" class="phase-row">
      <span class="stamp" :class="{ combat: store.combatState === '战斗中' }">{{ store.combatState === '战斗中' ? '战斗中' : store.phase }}</span>
      <span v-if="store.cooldown" class="t-label">{{ store.cooldown }}</span>
    </div>

    <div class="vitals">
      <AuraTrack title="灵气浓度" :value="Math.min(100, Math.max(0, store.aura * 100))" :max="100" :display="display.aura.toFixed(2)" />
      <AuraTrack title="封印松紧" :value="store.sealTension" :max="100" variant="seal" :display="Math.round(display.seal) + '%'" />
      <div class="row"><span class="t-label">修行</span><span class="t-num">{{ store.progress }}%</span></div>
      <div class="bar"><div class="bar-fill" style="background: var(--jade-deep)" :style="{ width: store.progress + '%' }"></div></div>
      <div class="row"><span class="t-label">灵力</span><span class="t-num" style="color: var(--jade)">{{ Math.round(display.mp) }}/{{ store.mpMax }}</span></div>
      <div class="bar"><div class="bar-fill" style="background: var(--jade)" :style="{ width: (store.mpMax > 0 ? Math.min(100, (store.mpCurr / store.mpMax) * 100) : 0) + '%' }"></div></div>
    </div>

    <div class="fact-grid">
      <div class="fact-cell"><span class="t-label">寿元</span><span class="fact-num">{{ store.life.当前寿元 }}<i>/ {{ store.life.寿元上限 }}</i></span></div>
      <div class="fact-cell"><span class="t-label">灵石</span><span class="fact-num gold">{{ Math.round(display.stone) }}<i>枚</i></span></div>
      <div class="fact-cell"><span class="t-label">银两</span><span class="fact-num">{{ store.coin }}<i>两</i></span></div>
    </div>

    <div v-if="bodyNote" class="card" style="gap: 2px">
      <span class="t-label">躯体状态</span>
      <span class="t-val" style="font-size: 12px" :class="bodyNote.danger ? 'hurt' : 'safe'">{{ bodyNote.text }}</span>
    </div>

    <div v-if="store.coreRes.名称 !== '无'" class="card" style="gap: 5px">
      <div class="card-row">
        <span class="t-label">本源印记 · {{ store.coreRes.名称 }}</span>
        <span class="t-num">{{ store.coreRes.当前值 ?? 0 }}/{{ store.coreRes.上限 ?? 100 }}</span>
      </div>
      <div class="bar">
        <div class="bar-fill" :class="{ danger: (store.coreRes.当前值 ?? 0) >= (store.coreRes.危险阈值 ?? 9999) }" :style="{ width: ((store.coreRes.上限 ?? 100) > 0 ? Math.min(100, ((store.coreRes.当前值 ?? 0) / (store.coreRes.上限 ?? 100)) * 100) : 0) + '%' }"></div>
      </div>
    </div>

    <div v-if="store.spirit.契灵名 && store.spirit.契灵名 !== '无'" class="card" style="gap: 5px">
      <div class="card-row">
        <span class="t-label">缔约冥灵</span>
        <span class="t-val" style="font-size: 13px; color: var(--gold)">{{ store.spirit.契灵名 }}</span>
      </div>
      <div class="card-row">
        <span class="t-label">契约深度 {{ store.spirit.契约深度 ?? 0 }}%</span>
        <span class="t-label">本月借力 {{ store.spirit.本月借力次数 ?? 0 }} 次</span>
      </div>
      <div class="bar"><div class="bar-fill" style="background: var(--gold)" :style="{ width: Math.min(100, store.spirit.契约深度 ?? 0) + '%' }"></div></div>
    </div>

    <div v-if="Object.keys(store.skillObj).length > 0" style="display: flex; flex-direction: column; gap: 6px">
      <span class="t-section">运转功法</span>
      <div style="display: flex; gap: 6px; flex-wrap: wrap">
        <span v-for="k in Object.keys(store.skillObj)" :key="k" class="skill-chip" @click="openSkill(k)">{{ k }}</span>
      </div>
    </div>

    <div v-if="Object.keys(store.specialState).length > 0" style="display: flex; flex-direction: column; gap: 6px">
      <span class="t-section">秘流状态</span>
      <div style="display: flex; gap: 6px; flex-wrap: wrap">
        <span v-for="k in Object.keys(store.specialState)" :key="k" class="chip gold" style="font-size: 11px">{{ k }} {{ store.specialState[k] }}</span>
      </div>
    </div>

    <div v-if="store.dongfu.开启状态" class="card" style="cursor: pointer; gap: 5px" @click="openDongfu">
      <div class="card-row">
        <span class="t-label">随身洞府 · 防 {{ store.dongfu.防御阵法 }}%</span>
        <span class="t-val" style="font-size: 13px; color: var(--gold)">{{ store.dongfu.名称 }} <span class="t-label">Lv.{{ store.dongfu.等级 }}</span></span>
      </div>
      <div class="bar"><div class="bar-fill" style="background: var(--gold)" :style="{ width: Math.min(100, store.dongfu.灵气充裕度) + '%' }"></div></div>
      <span v-if="store.dongfu.当前告警 !== '无'" class="t-label" style="color: var(--cinnabar)">⚠ {{ store.dongfu.当前告警 }}</span>
    </div>

    <div v-if="store.life.延寿记录?.length > 0" class="card" style="gap: 3px">
      <span class="t-label" style="color: var(--gold)">延寿之契</span>
      <span v-for="(rec, i) in store.life.延寿记录.slice(-3)" :key="i" class="t-label" style="line-height: 1.5">{{ rec }}</span>
    </div>

    <div class="divider"></div>
    <div class="nav-grid">
      <div class="nav-btn" @click="$emit('navigate', 'bag')"><svg viewBox="0 0 16 16"><path d="M4 6 Q8 2 12 6 L13 13 Q8 15 3 13 Z" /><path d="M5 6 L11 6 M8 6 L8 9" /></svg>行囊</div>
      <div class="nav-btn" @click="$emit('navigate', 'bond')"><svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" stroke-dasharray="2.5 2" /><path d="M8 6 L10.5 10 L5.5 10 Z" /></svg>羁绊</div>
      <div class="nav-btn" @click="$emit('navigate', 'faction')"><svg viewBox="0 0 16 16"><path d="M8 1 L14 4.5 L14 11 L8 14.5 L2 11 L2 4.5 Z" /><circle cx="8" cy="8" r="2" /></svg>大势</div>
      <div class="nav-btn" @click="$emit('navigate', 'task')"><svg viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" /><path d="M5.5 6 L10.5 6 M5.5 8.5 L9 8.5" /></svg>天机</div>
      <div class="nav-btn" @click="$emit('navigate', 'map')"><svg viewBox="0 0 16 16"><path d="M1.5 4 L5.5 2 L10.5 4 L14.5 2 L14.5 12 L10.5 14 L5.5 12 L1.5 14 Z" /><path d="M5.5 2 L5.5 12 M10.5 4 L10.5 14" /></svg>舆图</div>
    </div>

    <InfoModal :open="modalOpen" :title="modalTitle" :body="modalDesc" @close="modalOpen = false" />
    <span class="watermark">九渊</span>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import gsap from 'gsap';
import { useVariablesStore } from '../store';
import AuraTrack from './AuraTrack.vue';
import SealRing from './SealRing.vue';
import InfoModal from './InfoModal.vue';
import QiCanvas from './QiCanvas.vue';

defineEmits<{ navigate: [panel: string] }>();
const store = useVariablesStore();
const showCommon = ref(false);
const modalOpen = ref(false);
const modalTitle = ref('');
const modalDesc = ref('');
const panelRef = ref<HTMLElement | null>(null);

const locText = computed(() => (store.town && store.town !== store.nation ? `${store.nation} · ${store.town}` : store.nation));
const alerting = computed(() => store.isQiong || store.sealTension >= 60);

const display = reactive({ aura: 0, seal: 0, mp: 0, stone: 0 });
watch(
  () => [store.aura, store.sealTension, store.mpCurr, store.stone] as const,
  ([aura, seal, mp, stone]) => {
    gsap.to(display, { aura, seal, mp, stone, duration: 0.9, ease: 'power2.out', overwrite: true });
  },
  { immediate: true },
);

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const kids = panelRef.value?.querySelectorAll(':scope > *:not(.watermark)') ?? [];
  gsap.from(kids, { opacity: 0, y: 14, duration: 0.45, stagger: 0.055, ease: 'power2.out', clearProps: 'all' });
});

const phaseAlert = computed(() => store.phase !== '闲逛/探索' || store.combatState === '战斗中');

const bodyNote = computed(() => {
  const ext = store.injuryExt, int = store.injuryInt;
  if ((ext === '无' || !ext) && (int === '无' || !int)) return { text: '气血充盈，法体无恙', danger: false };
  const parts: string[] = [];
  if (ext !== '无' && ext) parts.push(`外伤：${ext}`);
  if (int !== '无' && int) parts.push(`内伤：${int}`);
  if (store.life.夺舍次数 > 0) parts.push(`夺舍 ${store.life.夺舍次数} 次（${store.life.当前身躯}）`);
  return { text: parts.join(' · '), danger: true };
});

function openSkill(name: string) {
  const d = store.skillObj[name] || {};
  modalTitle.value = d.类型 ? `${name} [${d.类型}]` : name;
  modalDesc.value = d.描述 || '此功法暂无注述。';
  modalOpen.value = true;
}
function openDongfu() {
  const d = store.dongfu;
  modalTitle.value = `${d.名称} [Lv.${d.等级}]`;
  let desc = `灵气充裕度: ${d.灵气充裕度}%\n防御阵法: ${d.防御阵法}%\n上次结算: ${d.上次结算时间 || '无'}\n`;
  if (d.当前告警 !== '无') desc += `⚠ 告警: ${d.当前告警}\n`;
  desc += `\n设施:\n`;
  const facilites = Object.entries(d.设施 || {});
  if (facilites.length === 0) desc += '暂无设施\n';
  for (const [k, v] of facilites) {
    desc += `- ${k} Lv.${(v as any).等级 ?? 1} [${(v as any).状态}]`;
    if ((v as any).产出) desc += ` 产出:${(v as any).产出}`;
    if ((v as any).指派人员) desc += ` 人员:${(v as any).指派人员}`;
    desc += '\n';
  }
  desc += `\n驻留人员: ${d.驻留人员?.length ? d.驻留人员.map(p => (typeof p === 'string' ? p : (p as any).名字 ?? JSON.stringify(p))).join('、') : '无'}`;
  if (d.入侵记录?.length > 0) desc += `\n\n入侵记录:\n${d.入侵记录.map(r => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n')}`;
  if (d.洞府日志?.length > 0) desc += `\n\n洞府日志:\n${d.洞府日志.slice(-5).join('\n')}`;
  modalDesc.value = desc;
  modalOpen.value = true;
}
</script>
<style>
/* 英雄区 header：大字境界 + 大号封印罗盘 */
.hero { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 2px 2px 0; }
.hero-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.hero-seal {
  width: 40px; height: 40px; flex-shrink: 0;
  border: 1.5px solid rgba(210, 104, 104, 0.85);
  color: #e0b5b5; font-family: var(--f-title); font-size: 22px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(145deg, rgba(194, 94, 94, 0.32), rgba(194, 94, 94, 0.14));
  transform: rotate(-4deg);
  box-shadow: inset 0 0 8px rgba(194, 94, 94, 0.35), 0 1px 3px rgba(0, 0, 0, 0.4);
  border-radius: 1px;
}
.hero-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.hero-loc { letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.hero-realm {
  font-family: var(--f-title); font-size: 34px; line-height: 1.2; font-weight: bold; letter-spacing: 4px;
  background: linear-gradient(180deg, #f0e8d8 15%, #c9a86a 70%, #a8894e 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.55));
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 218px;
}
.hero-sub { display: flex; gap: 8px; align-items: baseline; font-family: var(--f-title); font-size: 12px; letter-spacing: 2px; color: var(--gold); }
.hero-school { font-size: 10px; color: var(--paper-dim); letter-spacing: 1px; }
.hero-meta { display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 7px 2px 0; border-top: 1px solid rgba(201, 168, 106, 0.28); }
.hero-time { font-family: var(--f-num); font-size: 12.5px; color: var(--paper); font-variant-numeric: tabular-nums; }
.hero-meta-right { display: flex; gap: 5px; align-items: center; }
.phase-row { display: flex; justify-content: center; align-items: center; gap: 10px; }
/* 朱砂印章：阶段/战斗状态 */
.stamp {
  display: inline-block; font-family: var(--f-title); font-size: 13px; letter-spacing: 4px;
  padding: 4px 10px 4px 14px; color: #f6e8e4;
  background: linear-gradient(158deg, #a84a4a, #8e3a3a);
  border: 1px solid rgba(255, 224, 224, 0.4); border-radius: 2px;
  transform: rotate(-2deg);
  box-shadow: 0 0 0 1px rgba(194, 94, 94, 0.28), 0 2px 10px rgba(150, 60, 60, 0.45), inset 0 0 12px rgba(60, 10, 10, 0.35);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
.stamp.combat { animation: stampPulse 1.8s ease-in-out infinite; }
@keyframes stampPulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(194, 94, 94, 0.28), 0 2px 10px rgba(150, 60, 60, 0.45), inset 0 0 12px rgba(60, 10, 10, 0.35); }
  50% { box-shadow: 0 0 0 1px rgba(194, 94, 94, 0.5), 0 2px 18px rgba(194, 94, 94, 0.65), inset 0 0 12px rgba(60, 10, 10, 0.35); }
}
.vitals { display: flex; flex-direction: column; gap: 9px; }
/* 数值速览：三大数字 */
.fact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.fact-cell {
  display: flex; flex-direction: column; gap: 3px; align-items: center;
  padding: 9px 6px 7px;
  background: linear-gradient(180deg, rgba(56, 62, 72, 0.75), rgba(44, 49, 58, 0.65));
  border: 1px solid rgba(201, 168, 106, 0.4); border-radius: 2px;
}
.fact-num { font-family: var(--f-num); font-size: 17px; font-weight: bold; color: var(--paper); font-variant-numeric: tabular-nums; }
.fact-num i { font-style: normal; font-size: 11px; color: var(--paper-dim); font-weight: normal; margin-left: 2px; }
.fact-num.gold { color: var(--gold); }
.skill-chip {
  padding: 3px 10px; font-size: 12px; cursor: pointer;
  color: var(--jade); border: 1px solid rgba(127, 184, 164, 0.5); border-radius: 2px;
  background: rgba(127, 184, 164, 0.08); transition: all 0.2s; letter-spacing: 1px;
}
.skill-chip:hover { background: rgba(127, 184, 164, 0.18); border-color: var(--jade); color: var(--paper); }
.hurt { color: var(--cinnabar); }
.safe { color: var(--jade); }
.bar-fill.danger { background: var(--cinnabar); }
/* 手机窄屏：压缩英雄区与数值格 */
@media (max-width: 480px) {
  .hero { gap: 8px; }
  .hero-left { gap: 9px; flex: 1; min-width: 0; }
  .hero-text { flex: 1; min-width: 0; }
  .hero-loc { max-width: none; }
  .hero-seal { width: 32px; height: 32px; font-size: 17px; }
  .hero-realm { font-size: 24px; letter-spacing: 2px; max-width: none; }
  .hero-sub { font-size: 11px; letter-spacing: 1px; }
  .hero .ring-stage { width: 86px !important; height: 86px !important; }
  .fact-grid { gap: 5px; }
  .fact-cell { padding: 7px 4px 6px; }
  .fact-num { font-size: 15px; }
  .stamp { font-size: 12px; letter-spacing: 3px; padding: 3px 8px 3px 11px; }
}
</style>
