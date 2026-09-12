<template>
  <div class="stat-root 未建卡框" v-if="!store.char.姓名">
    <div class="未建卡">
      <span class="未建卡题">斩仙槐 · 尚未建卡</span>
      <span class="未建卡注">在上方「调查创建」界面配置属性并领旨出仕后，此处点亮</span>
    </div>
  </div>
  <div class="stat-root" v-if="store.char.姓名">
    <!-- ═══ Top Row: Name + Identity + Chapter ═══ -->
    <div class="top-row">
      <span class="char-name">{{ store.char.姓名 }}</span>
      <span class="char-identity" v-if="store.char.身份">{{ store.char.身份 }}</span>
      <span class="chapter-tag">{{ store.plot.当前章节 || '未入篇' }}</span>
    </div>

    <!-- ═══ Clock: 第 N 日 · 时段 · 日程 ═══ -->
    <div class="时钟行">
      <span class="时钟日">第 {{ store.plot.当前日 }} 日</span>
      <span class="时钟段" :class="{ 夜: 时段夜 }">{{ store.world.时段 }}</span>
      <span class="时段刻度">
        <span v-for="t in 时段序列" :key="t" class="刻度点" :class="{ 亮: t === store.world.时段, '刻夜': ['黄昏','夜晚','深夜'].includes(t) }"></span>
      </span>
      <span class="日程签" v-if="日程签" :class="日程签.急">{{ 日程签.文 }}</span>
    </div>

    <div class="sub-row" v-if="store.char.性别 || store.char.年龄 || store.char.出身">
      <span v-if="store.char.性别" class="sub-item">{{ store.char.性别 }}</span>
      <span v-if="store.char.年龄" class="sub-item">{{ store.char.年龄 }} 岁</span>
      <span v-if="store.char.出身" class="sub-item origin">{{ store.char.出身 }}</span>
    </div>

    <!-- ═══ Vitals: 气血 / 法力 / 心神 / 幸运 ═══ -->
    <div class="vitals">
      <div class="vital hp">
        <span class="vital-label">气血</span>
        <div class="vital-track">
          <div class="vital-fill hp-fill" :style="{ width: hpPct + '%' }" :class="{ low: hpPct < 30, crit: hpPct < 15 }"></div>
        </div>
        <span class="vital-num">{{ store.char.气血.当前 }}/{{ store.char.气血.上限 }}</span>
      </div>
      <div class="vital mp">
        <span class="vital-label">法力</span>
        <div class="vital-track">
          <div class="vital-fill mp-fill" :style="{ width: mpPct + '%' }"></div>
        </div>
        <span class="vital-num">{{ store.char.法力.当前 }}/{{ store.char.法力.上限 }}</span>
      </div>
      <div class="vital san">
        <span class="vital-label">心神</span>
        <div class="vital-track">
          <div class="vital-fill san-fill" :style="{ width: sanPct + '%' }" :class="{ low: sanPct < 40, crit: sanPct < 20 }"></div>
        </div>
        <span class="vital-num">{{ store.char.心神.当前 }}/{{ store.char.心神.上限 }}</span>
      </div>
      <div class="vital luk">
        <span class="vital-label">幸</span>
        <div class="vital-track">
          <div class="vital-fill luk-fill" :style="{ width: lukPct + '%' }" :class="{ low: lukPct < 20 }"></div>
        </div>
        <span class="vital-num">{{ store.char.幸运 }}</span>
      </div>
    </div>

    <!-- 心绪行（非常态才显示） -->
    <div class="心绪行" v-if="精神状态 !== '常态'" :class="心绪类">{{ 精神状态 }}</div>

    <!-- 折叠面板切换 -->
    <div class="折叠条">
      <button
        v-for="t in (['属性','物证','人物','疑云','奉旨','判词','场景'] as const)"
        :key="t"
        class="折叠按钮"
        :class="{ 激活: 展开 === t }"
        @click="展开 = 展开 === t ? null : t"
      >{{ t }}</button>
    </div>

    <!-- ═══ 场景 + 在场 NPC ═══ -->
    <div class="面板 场景" v-if="展开 === '场景'">
      <div class="场景行" v-if="store.world.现实时间 || store.world.天气">
        <template v-if="store.world.现实时间">
          <span class="场景图标">时</span>
          <span class="场景内容">{{ store.world.现实时间 }}</span>
        </template>
        <template v-if="store.world.天气">
          <span class="场景图标" :class="{ '间距': store.world.现实时间 }">天</span>
          <span class="场景内容">{{ store.world.天气 }}</span>
        </template>
      </div>
      <div class="场景行" v-if="store.plot.地点">
        <span class="场景图标">所</span>
        <span class="场景内容">{{ store.plot.地点 }}</span>
      </div>
      <div class="场景行" v-if="store.plot.当前场景">
        <span class="场景图标">节</span>
        <span class="场景内容">{{ store.plot.当前场景 }}</span>
      </div>
      <div class="场景行" v-if="store.plot.在场角色.length">
        <span class="场景图标">人</span>
        <span class="场景内容">
          {{ store.plot.在场角色.slice(0, 5).join(' · ') }}
          <span v-if="store.plot.在场角色.length > 5" class="更多">+{{ store.plot.在场角色.length - 5 }}</span>
        </span>
      </div>
      <div class="场景行 仪式" v-if="四物任一">
        <span class="场景图标">物</span>
        <span class="仪式格">
          <span v-for="o in 四物列表" :key="o.名" class="仪式点" :class="{ 得: o.得 }">{{ o.名 }}</span>
        </span>
      </div>
    </div>

    <!-- ═══ 人物：关系与攻线阶段 ═══ -->
    <div class="面板 人物" v-if="展开 === '人物'">
      <div v-if="!npcList.length" class="空注">尚无相识之人</div>
      <div class="人物列表" v-else>
        <div v-for="n in npcList" :key="n.名" class="人物条" :class="{ 逝: !n.存活 }">
          <div class="人物首行">
            <span class="人物名">{{ n.名 }}</span>
            <span class="阶段签" v-if="n.阶段">{{ n.阶段 }}</span>
            <span class="态度签" :class="态度类(n.态度)">{{ n.态度 }}</span>
          </div>
          <div class="好感轨">
            <div class="好感填充" :style="{ width: n.好感pct + '%' }" :class="{ 负: n.好感 < 0 }"></div>
          </div>
          <div class="人物尾行">
            <span class="好感值">{{ n.好感 > 0 ? '+' : '' }}{{ n.好感 }}</span>
            <span class="警惕值" v-if="n.警惕度 > 0">警惕 {{ n.警惕度 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 疑云：秘密知晓 ═══ -->
    <div class="面板 疑云" v-if="展开 === '疑云'">
      <div v-if="!secretList.length" class="空注">尚无疑云在心</div>
      <div class="疑云列表" v-else>
        <div v-for="s in secretList" :key="s" class="疑云条"><span class="疑云印">◈</span>{{ s }}</div>
      </div>
      <div class="疑云注" v-if="secretList.length">—— 亲历或悟得者，录于此 ——</div>
    </div>

    <!-- ═══ 属性 ═══ -->
    <div class="面板 属性" v-if="展开 === '属性'">
      <div class="属性网格">
        <span v-for="a in attrList" :key="a.key" class="属性片">
          <span class="属性键">{{ a.label }}</span>
          <span class="属性值">{{ store.char[a.key] }}</span>
        </span>
      </div>
      <div class="技能网格" v-if="topSkills.length">
        <span v-for="sk in topSkills" :key="sk.name" class="技能片">
          {{ sk.name }} {{ sk.val }}<span v-if="sk.job" class="本职标">职</span>
        </span>
      </div>
    </div>

    <!-- ═══ 物证 ═══ -->
    <div class="面板 物证" v-if="展开 === '物证'">
      <div v-if="!Object.keys(store.char.物品栏).length" class="空注">囊中空空</div>
      <div class="物证列表" v-else>
        <div v-for="(it, name) in store.char.物品栏" :key="name" class="物证包裹">
          <div class="物证条" @click="toggleItem(name)" :class="{ 激活项: expandedItem === name }">
            <span class="物证名">{{ name }}</span>
            <span class="物证量" v-if="it.数量 > 1">×{{ it.数量 }}</span>
          </div>
          <div class="物证描述板" v-if="expandedItem === name">{{ it.描述 }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ 奉旨 ═══ -->
    <div class="面板 奉旨" v-if="展开 === '奉旨'">
      <div v-if="!Object.keys(store.plot.任务目标).length" class="空注">暂无奉旨查办</div>
      <div class="任务列表" v-else>
        <div v-for="(tk, name) in store.plot.任务目标" :key="name" class="任务条"
             :class="tk.状态 === '已完成' ? '妥' : (tk.状态 === '已失败' ? '废' : '行')">
          <span class="任务标">{{ tk.状态 === '已完成' ? '✓' : (tk.状态 === '已失败' ? '✕' : '◇') }}</span>
          <div class="任务内容">
            <div class="任务名">{{ name }}</div>
            <div class="任务描述">{{ tk.描述 }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 判词 ═══ -->
    <div class="面板 判词" v-if="展开 === '判词'">
      <div v-if="!store.rollLog.length" class="空注">尚未掷骰</div>
      <div class="判词列表" v-else>
        <div v-for="(r, i) in store.rollLog.slice(0, 5)" :key="i" class="判词条" :class="档次(r.结果)">
          <span class="判技能">{{ r.技能 }}</span>
          <span class="判投骰">{{ r.投出 }}/{{ r.目标 }}</span>
          <span v-if="r.奖惩" class="判奖惩">{{ r.奖惩 > 0 ? '奖' + r.奖惩 : '罚' + (-r.奖惩) }}</span>
          <span class="判结果">{{ r.结果 }}</span>
          <span class="判来源" v-if="r.来源">{{ r.来源 }}</span>
        </div>
      </div>
    </div>

    <!-- 底部章节里程 -->
    <div class="里程条" v-if="store.plot.到达章节.length">
      <span class="里程标">已历</span>
      <span class="里程数">{{ store.plot.到达章节.length }} 章</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStatusStore, 时段序列 } from './store';

const store = useStatusStore();

const hpPct = computed(() => store.char.气血.上限 <= 0 ? 0 : Math.round((store.char.气血.当前 / store.char.气血.上限) * 100));
const mpPct = computed(() => store.char.法力.上限 <= 0 ? 0 : Math.round((store.char.法力.当前 / store.char.法力.上限) * 100));
const sanPct = computed(() => store.char.心神.上限 <= 0 ? 0 : Math.round((store.char.心神.当前 / store.char.心神.上限) * 100));
const lukPct = computed(() => Math.max(0, Math.min(100, store.char.幸运)));

const attrList = [
  { key: '力量' as const, label: '力' },
  { key: '敏捷' as const, label: '敏' },
  { key: '体质' as const, label: '体' },
  { key: '外貌' as const, label: '貌' },
  { key: '智力' as const, label: '智' },
  { key: '意志' as const, label: '意' },
  { key: '教育' as const, label: '教' },
  { key: '体型' as const, label: '型' },
  { key: '幸运' as const, label: '幸' },
];

const 四物列表 = computed(() => [
  { 名: '木心', 得: store.plot.仪式四物.向阳木心 },
  { 名: '灯油', 得: store.plot.仪式四物.不灭灯油 },
  { 名: '香灰', 得: store.plot.仪式四物.不落之尘 },
  { 名: '初露', 得: store.plot.仪式四物.清晨初露 },
]);
const 四物任一 = computed(() => 四物列表.value.some(o => o.得));

/* ── 硬时钟 ── */
const 时段夜 = computed(() => ['黄昏', '夜晚', '深夜'].includes(store.world.时段));
const 日程签 = computed<{ 文: string; 急?: string } | null>(() => {
  const 章 = store.plot.当前章节;
  const 场 = store.plot.当前场景;
  if (章.includes('第一章')) {
    const 剩 = Math.max(0, 5 - store.plot.当前日);
    return 剩 > 0 ? { 文: `出京限五日·余 ${剩} 日`, 急: 剩 <= 1 ? '急' : '' } : { 文: '限期届满', 急: '急' };
  }
  if (章.includes('第二章')) {
    if (场.includes('余波') || 场.includes('收尾毕')) return { 文: '余波期·自由探索' };
    for (const [k, v] of [['迎神', '大祭第1日'], ['巡游', '大祭第2日'], ['开江', '大祭第3日'], ['收尾', '收官之夜'], ['初抵', '报到夜']] as const) {
      if (场.includes(k) || store.world.现实时间.includes(k)) return { 文: v };
    }
    return { 文: '三日大祭' };
  }
  return null;
});

const topSkills = computed(() =>
  Object.entries(store.char.技能)
    .sort(([, a], [, b]) => b.等级 - a.等级)
    .slice(0, 9)
    .map(([name, sk]) => ({ name: name.replace(/_/g, '·'), val: sk.等级, job: sk.本职 }))
);

const 展开 = ref<'属性' | '物证' | '人物' | '疑云' | '奉旨' | '判词' | '场景' | null>('场景');
const expandedItem = ref<string | null>(null);
function toggleItem(name: string) {
  expandedItem.value = expandedItem.value === name ? null : name;
}

/* ── 心绪（与 schema 派生口径一致：心神比率）── */
const 精神状态 = computed(() => {
  const r = store.char.心神.当前 / Math.max(1, store.char.心神.上限);
  return r > 0.8 ? '常态' : r > 0.6 ? '焦虑' : r > 0.4 ? '不安' : r > 0.2 ? '失常' : '濒临崩溃';
});
const 心绪类 = computed(() => ({ 焦虑: 精神状态.value === '焦虑', 不安: 精神状态.value === '不安', 失常: ['失常', '濒临崩溃'].includes(精神状态.value) }));

/* ── 人物：攻线阶段 + 好感条 ── */
const 攻线名单: Record<string, string> = { 黄绫: '复仇线', 沈茯苓: '药娘线', 柳拂衣: '掌柜线' };
function 攻线阶段(名: string, 好感: number): string {
  if (好感 >= 80) return '许诺';
  if (好感 >= 60) return '倾心';
  if (好感 >= 40) return '交心';
  if (好感 >= 20) return '相识';
  return 攻线名单[名] ? '初见' : '';
}
const npcList = computed(() => {
  const list = Object.entries(store.npcs).map(([名, n]) => ({
    名,
    态度: n.态度,
    好感: n.好感,
    好感pct: Math.round(((n.好感 + 100) / 200) * 100),
    警惕度: n.警惕度,
    存活: n.存活,
    阶段: 攻线名单[名] ? 攻线阶段(名, n.好感) : '',
  }));
  // 攻线三人置顶，其余按 |好感| 降序
  return list.sort((a, b) => {
    const ga = 攻线名单[a.名] ? 1 : 0;
    const gb = 攻线名单[b.名] ? 1 : 0;
    if (ga !== gb) return gb - ga;
    return Math.abs(b.好感) - Math.abs(a.好感);
  });
});
function 态度类(态度: string): string {
  if (态度.includes('敌')) return '敌';
  if (态度.includes('戒')) return '戒';
  if (态度.includes('友') || 态度.includes('信')) return '友';
  return '中';
}
const secretList = computed(() => Object.keys(store.secrets).sort());

function 档次(结果: string): string {
  if (结果.includes('大成功')) return '大成功';
  if (结果.includes('极难')) return '极难';
  if (结果.includes('困难')) return '困难';
  if (结果.includes('成功')) return '成功';
  if (结果.includes('大失败')) return '大失败';
  return '失败';
}
</script>

<style lang="scss" scoped>
.stat-root {
  background: var(--zx-card);
  border: 1px solid var(--zx-border);
  padding: 12px 14px 10px;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.4s ease both;

  &::before {
    content: '';
    position: absolute;
    top: 3px; left: 3px; right: 3px; bottom: 3px;
    border: 1px solid var(--zx-border-light);
    pointer-events: none;
  }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}

/* ── 顶 ── */
.top-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--zx-border);
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--zx-red) 0%, transparent 60%);
  }
}
.char-name { font-family: var(--font-title); font-size: 17px; color: var(--zx-text); letter-spacing: 2px; }
.char-identity { font-size: 10.5px; color: var(--zx-red); font-family: var(--font-title); letter-spacing: 1px; border: 1px solid rgba(158, 42, 43, 0.4); padding: 1px 5px; background: rgba(158, 42, 43, 0.05); }
.chapter-tag { margin-left: auto; font-size: 9.5px; font-family: var(--font-title); color: var(--zx-text-muted); letter-spacing: 1px; }

.sub-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; font-size: 10px; color: var(--zx-text-sub); }
.sub-item { letter-spacing: 0.5px; }
.sub-item.origin { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── 未建卡占位 ── */
.未建卡框 {
  display: flex; align-items: center; justify-content: center;
  min-height: 96px; padding: 12px;
}
.未建卡 { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
.未建卡题 { font-family: var(--font-title); font-size: 14px; color: var(--zx-text); letter-spacing: 3px; }
.未建卡注 { font-size: 10px; color: var(--zx-text-muted); letter-spacing: 1px; line-height: 1.6; }

/* ── 硬时钟 ── */
.时钟行 { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; padding: 4px 7px; background: rgba(0, 0, 0, 0.25); border: 1px solid var(--zx-border-light); }
.时钟日 { font-family: var(--font-title); font-size: 11px; color: var(--zx-gold); letter-spacing: 1px; }
.时钟段 { font-family: var(--font-title); font-size: 11px; color: var(--zx-text); letter-spacing: 2px; }
.时钟段.夜 { color: var(--zx-san); }
.时段刻度 { display: flex; gap: 3px; flex: 1; align-items: center; }
.刻度点 { width: 10px; height: 2px; background: var(--zx-border); transition: background 0.4s; }
.刻度点.刻夜 { height: 3px; }
.刻度点.亮 { background: var(--zx-red); box-shadow: 0 0 4px rgba(158, 42, 43, 0.8); }
.日程签 { font-family: var(--font-title); font-size: 9.5px; color: var(--zx-text-sub); border: 1px solid var(--zx-border-light); padding: 1px 6px; letter-spacing: 1px; white-space: nowrap; }
.日程签.急 { color: var(--zx-red); border-color: rgba(158, 42, 43, 0.5); background: rgba(158, 42, 43, 0.08); animation: pulse 1.2s ease infinite; }

/* ── 四 Gauge ── */
.vitals { display: flex; gap: 10px; margin-bottom: 8px; }
.vital { flex: 1; display: flex; align-items: center; gap: 4px; }
.vital-label { font-family: var(--font-title); font-size: 9.5px; color: var(--zx-text-muted); letter-spacing: 1px; width: 22px; flex-shrink: 0; }
.vital-track { flex: 1; height: 3px; background: var(--zx-border); overflow: hidden; }
.vital-fill { height: 100%; transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.hp-fill { background: var(--zx-hp); }
.mp-fill { background: var(--zx-mp); }
.san-fill { background: var(--zx-san); }
.luk-fill { background: var(--zx-gold-dim); }
.vital-fill.low { filter: brightness(1.3); }
.vital-fill.crit { animation: pulse 0.7s ease infinite; box-shadow: 0 0 8px currentColor; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.vital-num { font-size: 10.5px; color: var(--zx-text-sub); font-family: var(--font-title); min-width: 36px; text-align: right; flex-shrink: 0; }

/* ── 折叠条 ── */
.折叠条 { display: flex; gap: 4px; margin: 8px 0; }
.折叠按钮 {
  flex: 1; padding: 4px 0; border: 1px solid var(--zx-border-light); background: transparent;
  color: var(--zx-text-muted); font-family: var(--font-title); font-size: 10.5px; cursor: pointer;
  letter-spacing: 1px; transition: all 0.25s;
  &:hover { border-color: var(--zx-text-muted); color: var(--zx-text-sub); }
  &.激活 { border-color: var(--zx-red); color: var(--zx-red); background: rgba(158, 42, 43, 0.08); }
}

.面板 { padding-top: 6px; animation: 淡入 0.3s ease both; }
@keyframes 淡入 { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: none; } }

/* ── 场景 ── */
.场景行 {
  display: flex; align-items: center; gap: 6px; margin-bottom: 6px;
  padding: 5px 6px; background: rgba(0, 0, 0, 0.25); border: 1px solid var(--zx-border-light);
}
.场景图标 { font-size: 10px; color: var(--zx-red); background: rgba(158, 42, 43, 0.1); border: 1px solid rgba(158, 42, 43, 0.3); padding: 0 4px; font-family: var(--font-title); flex-shrink: 0; }
.场景图标.间距 { margin-left: 10px; }
.场景内容 { color: var(--zx-text-sub); font-size: 10.5px; font-family: var(--font-title); }
.更多 { color: var(--zx-red); font-size: 9.5px; }
.仪式格 { display: flex; gap: 6px; }
.仪式点 { font-size: 10px; color: var(--zx-text-muted); padding: 1px 6px; border: 1px solid var(--zx-border-light); font-family: var(--font-title); }
.仪式点.得 { color: var(--zx-gold); border-color: var(--zx-gold-dim); background: rgba(203, 168, 118, 0.1); }

/* ── 属性 ── */
.属性网格 { display: flex; flex-wrap: wrap; gap: 5px; }
.属性片 { display: flex; align-items: center; gap: 3px; padding: 2px 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--zx-border-light); }
.属性键 { font-size: 9px; color: var(--zx-text-muted); letter-spacing: 1px; }
.属性值 { font-size: 11.5px; color: var(--zx-text); font-family: var(--font-title); }
.技能网格 { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.技能片 { font-size: 10.5px; padding: 2px 7px; background: rgba(158, 42, 43, 0.05); border: 1px solid rgba(158, 42, 43, 0.2); color: var(--zx-text); font-family: var(--font-title); }
.本职标 { font-size: 8.5px; color: var(--zx-red); margin-left: 3px; border-left: 1px solid var(--zx-border); padding-left: 3px; }

/* ── 物证 ── */
.物证列表 { display: flex; flex-direction: column; gap: 5px; }
.物证包裹 { display: flex; flex-direction: column; gap: 3px; }
.物证条 { display: inline-flex; align-items: baseline; gap: 5px; padding: 3px 7px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--zx-border-light); cursor: pointer; width: max-content; transition: all 0.3s;
  &:hover { border-color: var(--zx-gold-dim); }
  &.激活项 { border-color: var(--zx-red); background: rgba(158, 42, 43, 0.08); }
}
.物证名 { font-family: var(--font-title); color: var(--zx-text); font-size: 11px; }
.物证量 { font-family: var(--font-title); color: var(--zx-red); font-size: 9.5px; }
.物证描述板 { font-size: 10px; color: var(--zx-text-sub); background: rgba(0, 0, 0, 0.3); border-left: 2px solid var(--zx-red); padding: 5px 7px; line-height: 1.5; animation: 淡入 0.3s ease; }

/* ── 奉旨 ── */
.任务列表 { display: flex; flex-direction: column; gap: 5px; }
.任务条 { display: flex; gap: 7px; padding: 5px 7px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--zx-border-light);
  &.行 { border-left: 2px solid var(--zx-gold); .任务标 { color: var(--zx-gold); } }
  &.妥 { opacity: 0.6; .任务标 { color: var(--zx-san); } .任务名 { text-decoration: line-through; } }
  &.废 { opacity: 0.6; .任务标 { color: var(--zx-text-muted); } .任务名 { text-decoration: line-through; } }
}
.任务标 { font-size: 14px; line-height: 1; }
.任务内容 { display: flex; flex-direction: column; }
.任务名 { font-family: var(--font-title); font-size: 11.5px; color: var(--zx-text); margin-bottom: 1px; }
.任务描述 { font-size: 9.5px; color: var(--zx-text-sub); line-height: 1.4; }

/* ── 判词 ── */
.判词列表 { display: flex; flex-direction: column; gap: 4px; }
.判词条 { display: flex; align-items: center; gap: 7px; padding: 4px 6px; font-size: 10.5px; background: rgba(0, 0, 0, 0.2); border-left: 2px solid transparent; margin-bottom: 3px; flex-wrap: wrap;
  &.大成功 { border-left-color: #cba876; .判结果 { color: #cba876; } }
  &.极难 { border-left-color: #b59567; .判结果 { color: #b59567; } }
  &.困难 { border-left-color: #8c734e; .判结果 { color: #8c734e; } }
  &.成功 { border-left-color: var(--zx-text-sub); .判结果 { color: var(--zx-text-sub); } }
  &.失败 { border-left-color: var(--zx-border); .判结果, .判投骰 { color: var(--zx-text-muted); } }
  &.大失败 { border-left-color: var(--zx-red); .判结果 { color: var(--zx-red); } }
}
.判技能 { color: var(--zx-text); font-family: var(--font-title); }
.判投骰 { color: var(--zx-text-muted); font-family: var(--font-title); font-size: 10.5px; }
.判奖惩 { font-size: 8.5px; color: var(--zx-text-muted); padding: 0 4px; border: 1px solid var(--zx-border-light); }
.判结果 { margin-left: auto; font-size: 10.5px; font-family: var(--font-title); letter-spacing: 1px; }
.判来源 { font-size: 8.5px; color: var(--zx-text-muted); width: 100%; }

/* ── 心绪行 ── */
.心绪行 {
  display: flex; align-items: center; gap: 6px;
  margin-bottom: 8px; padding: 3px 8px;
  font-family: var(--font-title); font-size: 10.5px; letter-spacing: 2px;
  border: 1px solid var(--zx-border-light); background: rgba(0, 0, 0, 0.25);
  &::before { content: '心绪 ▸'; color: var(--zx-text-muted); font-size: 9.5px; }
  &.焦虑 { color: var(--zx-gold); border-color: var(--zx-gold-dim); }
  &.不安 { color: #c8825f; border-color: rgba(168, 120, 95, 0.5); }
  &.失常 { color: var(--zx-red); border-color: rgba(158, 42, 43, 0.5); animation: pulse 1.2s ease infinite; }
}

/* ── 人物 ── */
.人物列表 { display: flex; flex-direction: column; gap: 5px; }
.人物条 {
  padding: 5px 7px; background: rgba(0, 0, 0, 0.2); border: 1px solid var(--zx-border-light);
  &.逝 { opacity: 0.45; .人物名 { text-decoration: line-through; } }
}
.人物首行 { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.人物名 { font-family: var(--font-title); font-size: 11.5px; color: var(--zx-text); letter-spacing: 1px; }
.阶段签 {
  font-size: 8.5px; font-family: var(--font-title); color: var(--zx-red);
  border: 1px solid rgba(158, 42, 43, 0.4); padding: 0 4px; background: rgba(158, 42, 43, 0.06);
}
.态度签 {
  margin-left: auto; font-size: 9px; font-family: var(--font-title); padding: 0 5px; letter-spacing: 1px;
  color: var(--zx-text-muted); border: 1px solid var(--zx-border-light);
  &.友 { color: var(--zx-gold); border-color: var(--zx-gold-dim); }
  &.戒 { color: #c8825f; border-color: rgba(168, 120, 95, 0.5); }
  &.敌 { color: var(--zx-red); border-color: rgba(158, 42, 43, 0.5); }
}
.好感轨 { height: 2px; background: var(--zx-border); overflow: hidden; }
.好感填充 {
  height: 100%; background: var(--zx-gold-dim); transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  &.负 { background: var(--zx-red); }
}
.人物尾行 { display: flex; gap: 8px; margin-top: 3px; }
.好感值 { font-family: var(--font-title); font-size: 9.5px; color: var(--zx-text-sub); }
.警惕值 { font-size: 9px; color: var(--zx-text-muted); }

/* ── 疑云 ── */
.疑云列表 { display: flex; flex-direction: column; gap: 4px; }
.疑云条 {
  display: flex; align-items: baseline; gap: 7px;
  padding: 4px 7px; font-size: 10.5px; font-family: var(--font-title); letter-spacing: 1px;
  color: var(--zx-text); background: rgba(0, 0, 0, 0.2); border-left: 2px solid var(--zx-gold-dim);
}
.疑云印 { color: var(--zx-gold-dim); font-size: 9px; }
.疑云注 { margin-top: 8px; text-align: center; font-size: 9px; color: var(--zx-text-muted); font-family: var(--font-title); letter-spacing: 1px; }

/* ── 未建卡占位 ── */
.未建卡框 {
  display: flex; align-items: center; justify-content: center;
  min-height: 96px; padding: 12px;
}
.未建卡 { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
.未建卡题 { font-family: var(--font-title); font-size: 14px; color: var(--zx-text); letter-spacing: 3px; }
.未建卡注 { font-size: 10px; color: var(--zx-text-muted); letter-spacing: 1px; line-height: 1.6; }

/* ── 空注 ── */
.空注 { font-size: 10px; color: var(--zx-text-muted); text-align: center; padding: 8px 0; font-family: var(--font-title); }

/* ── 里程 ── */
.里程条 { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--zx-border-light); }
.里程标 { font-size: 9.5px; color: var(--zx-text-muted); font-family: var(--font-title); }
.里程数 { font-size: 10px; color: var(--zx-gold-dim); font-family: var(--font-title); }
</style>