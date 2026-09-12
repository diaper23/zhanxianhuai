import { acceptHMRUpdate, defineStore } from 'pinia';

interface RollEntry {
  技能: string;
  目标: number;
  投出: number;
  结果: string;
  奖惩: number;
  损失量: string;
  理由: string;
  来源: string;
  楼层: number;
  ts: number;
}

interface CharacterStats {
  姓名: string;
  身份: string;
  性别: string;
  年龄: number;
  出身: string;
  气血: { 当前: number; 上限: number };
  法力: { 当前: number; 上限: number };
  心神: { 当前: number; 上限: number };
  幸运: number;
  力量: number; 敏捷: number; 体质: number; 外貌: number;
  智力: number; 意志: number; 教育: number; 体型: number;
  技能: Record<string, { 等级: number; 本职: boolean }>;
  物品栏: Record<string, { 描述: string; 数量: number }>;
}

interface PlotProgress {
  当前章节: string;
  当前日: number;
  当前场景: string;
  在场角色: string[];
  地点: string;
  到达章节: string[];
  仪式四物: { 向阳木心: boolean; 不灭灯油: boolean; 不落之尘: boolean; 清晨初露: boolean };
  任务目标: Record<string, { 描述: string; 状态: '进行中' | '已完成' | '已失败' }>;
}

export const 时段序列 = ['清晨', '上午', '午后', '黄昏', '夜晚', '深夜'] as const;

export interface NPCEntry {
  警惕度: number;
  态度: string;
  好感: number;
  存活: boolean;
  备注: string;
}

interface WorldState {
  现实时间: string;
  天气: string;
  现实日期推进: number;
  时段: string;
}

function readStat<T>(path: string, def: T): T {
  try {
    const v = getvar('stat_data.' + path, { defaults: def, noCache: true });
    return v ?? def;
  } catch {
    return def;
  }
}

/* 姓名存的是 <user> 宏（单主角固定），显示时替换为玩家角色名 */
function resolveName(raw: string): string {
  if (!raw || !(raw.includes('<user>') || raw.includes('{{user}}'))) return raw;
  try {
    const name = substitudeMacros('{{user}}');
    return name ? raw.replace('<user>', name).replace('{{user}}', name) : raw;
  } catch {
    return raw;
  }
}

export const useStatusStore = defineStore('zx-status', () => {
  const char = reactive<CharacterStats>({
    姓名: '', 身份: '', 性别: '', 年龄: 0, 出身: '',
    气血: { 当前: 10, 上限: 10 }, 法力: { 当前: 10, 上限: 10 }, 心神: { 当前: 50, 上限: 50 },
    幸运: 50,
    力量: 50, 敏捷: 50, 体质: 50, 外貌: 50,
    智力: 50, 意志: 50, 教育: 50, 体型: 50,
    技能: {}, 物品栏: {},
  });

  const plot = reactive<PlotProgress>({
    当前章节: '', 当前日: 1, 当前场景: '', 在场角色: [], 地点: '',
    到达章节: [],
    仪式四物: { 向阳木心: false, 不灭灯油: false, 不落之尘: false, 清晨初露: false },
    任务目标: {},
  });

  const world = reactive<WorldState>({
    现实时间: '', 天气: '', 现实日期推进: 0, 时段: '清晨',
  });

  const rollLog = ref<RollEntry[]>([]);

  const npcs = ref<Record<string, NPCEntry>>({});
  const secrets = ref<Record<string, boolean>>({});

  const NORMALIZE_ATTRS = ['力量', '敏捷', '体质', '外貌', '智力', '意志', '教育', '体型'] as const;

  function refresh() {
    // ── 主角 ──
    const c = readStat<Partial<CharacterStats>>('主角', {});
    char.姓名 = resolveName(String(c.姓名 ?? ''));
    char.身份 = String(c.身份 ?? '').replace(/^HO\d/, '');
    char.性别 = String(c.性别 ?? '');
    char.年龄 = Number(c.年龄 ?? 0) || 0;
    char.出身 = String(c.出身 ?? '');
    if (c.气血) { char.气血.当前 = Number(c.气血.当前) || 0; char.气血.上限 = Number(c.气血.上限) || 10; }
    if (c.法力) { char.法力.当前 = Number(c.法力.当前) || 0; char.法力.上限 = Number(c.法力.上限) || 10; }
    if (c.心神) { char.心神.当前 = Number(c.心神.当前) || 0; char.心神.上限 = Number(c.心神.上限) || 50; }
    if (c.幸运 != null) char.幸运 = Number(c.幸运) || 50;
    for (const key of NORMALIZE_ATTRS) {
      if (c[key] != null) char[key] = Number(c[key]) || 50;
    }
    if (c.技能) char.技能 = { ...c.技能 };
    if (c.物品栏) char.物品栏 = { ...c.物品栏 };

    // ── 剧情进度 ──
    plot.当前章节 = String(readStat('剧情进度.当前章节', ''));
    plot.当前日 = Number(readStat('剧情进度.当前日', 1)) || 1;
    plot.当前场景 = String(readStat('剧情进度.当前场景', ''));
    plot.地点 = String(readStat('剧情进度.地点', ''));
    const present = readStat<string[]>('剧情进度.在场角色', []);
    plot.在场角色 = Array.isArray(present) ? present : [];
    plot.到达章节 = readStat<string[]>('剧情进度.到达章节', []);
    plot.仪式四物 = readStat('剧情进度.仪式四物', { 向阳木心: false, 不灭灯油: false, 不落之尘: false, 清晨初露: false });
    plot.任务目标 = readStat<Record<string, any>>('剧情进度.任务目标', {});

    // ── 世界 ──
    world.现实时间 = String(readStat('世界.现实时间', ''));
    world.天气 = String(readStat('世界.天气', ''));
    world.现实日期推进 = Number(readStat('世界.现实日期推进', 0)) || 0;
    world.时段 = String(readStat('世界.时段', '清晨')) || '清晨';

    // ── 判词记录（新引擎字段为中文键）──
    const stored = readStat<RollEntry[]>('_rollLog', []);
    if (Array.isArray(stored) && stored.length > 0) {
      rollLog.value = stored.slice(-8).reverse();
    }

    // ── 人物关系与秘密知晓 ──
    const rel = readStat<Record<string, any>>('NPC关系表', {});
    const normalized: Record<string, NPCEntry> = {};
    if (rel && typeof rel === 'object') {
      for (const [name, v] of Object.entries(rel)) {
        if (!v || typeof v !== 'object') continue;
        normalized[name] = {
          警惕度: Number(v.警惕度) || 0,
          态度: String(v.态度 ?? '中立'),
          好感: Number(v.好感) || 0,
          存活: v.存活 !== false,
          备注: String(v.备注 ?? ''),
        };
      }
    }
    npcs.value = normalized;
    const sk = readStat<Record<string, any>>('秘密知晓', {});
    const skOut: Record<string, boolean> = {};
    if (sk && typeof sk === 'object') {
      for (const [k, v] of Object.entries(sk)) {
        if (v === true) skOut[k] = true;
      }
    }
    secrets.value = skOut;
  }

  refresh();
  const timer = setInterval(refresh, 2000);

  return { char, plot, rollLog, world, npcs, secrets, refresh };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatusStore, import.meta.hot));
}