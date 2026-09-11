import { acceptHMRUpdate, defineStore } from 'pinia';

interface SkillEntry {
  等级: number;
  本职: boolean;
}

interface ItemEntry {
  描述: string;
  数量: number;
}

/* ── 固定主角档案：<user>（苍家文官），除八大属性与幸运外不可配置 ── */
export const 固定档案 = {
  姓名: '<user>',
  身份: '苍家文官',
  性别: '男',
  年龄: 22,
  出身: '前阁老苍晏独孙，文状元入仕，与严狰同科举魁',
  特长与加成: ['教育+5', '图书馆/历史检定奖励骰', '交涉检定奖励骰'],
  技能: {
    翻检文牍: { 等级: 50, 本职: true },
    历史: { 等级: 50, 本职: true },
    交涉: { 等级: 50, 本职: true },
    法律: { 等级: 40, 本职: true },
    说服: { 等级: 40, 本职: true },
    母语: { 等级: 50, 本职: true },
  } as Record<string, SkillEntry>,
  物品栏: {
    敕令牌: { 描述: '皇城司腰牌，可辨识番子身份；出京后在龙泽镇可号令衙门配合', 数量: 1 },
    山川纹玉佩: { 描述: '苍晏所传，纹路可拼合严家旧物', 数量: 1 },
    雏鹰: { 描述: '严狰所赠幼鹰，可由玩家自命名', 数量: 1 },
    笔砚: { 描述: '随身文房', 数量: 1 },
    雪花银: { 描述: '少量盘缠', 数量: 30 },
  } as Record<string, ItemEntry>,
};

export const ATTR_KEYS = ['力量', '敏捷', '体质', '外貌', '智力', '意志', '教育', '体型'] as const;

export const useCreateStore = defineStore('zx-create', () => {
  /* ── 唯一可配置项：八大属性 + 幸运 ── */
  const attrs = reactive<Record<string, number>>({
    力量: 50, 敏捷: 50, 体质: 50, 外貌: 50,
    智力: 50, 意志: 50, 教育: 50, 体型: 50,
    幸运: 50,
  });

  const method = ref<'A' | 'B'>('B'); // A=标准模板（全50） B=320点购

  /* ── derived ── */
  const hpMax = computed(() => Math.floor((attrs.体质 + attrs.体型) / 10));
  const mpMax = computed(() => Math.floor(attrs.意志 / 5));
  const sanMax = ref(50);
  const total = computed(() => Object.values(attrs).reduce((s, v) => s + v, 0));
  const remaining = computed(() => 320 - total.value);

  function applyTemplate() {
    for (const k of [...ATTR_KEYS, '幸运'] as const) attrs[k] = 50;
  }

  watch(method, m => {
    if (m === 'A') applyTemplate();
  });

  function init() {
    applyTemplate();
    method.value = 'B';
  }

  /* ── submit ── */
  async function submitCreate() {
    const data: Record<string, any> = {
      主角: {
        姓名: 固定档案.姓名,
        身份: 固定档案.身份,
        性别: 固定档案.性别,
        年龄: 固定档案.年龄,
        出身: 固定档案.出身,
        力量: attrs.力量, 敏捷: attrs.敏捷, 体质: attrs.体质, 外貌: attrs.外貌,
        智力: attrs.智力, 意志: attrs.意志, 教育: attrs.教育, 体型: attrs.体型,
        幸运: attrs.幸运,
        气血: { 当前: hpMax.value, 上限: hpMax.value },
        法力: { 当前: mpMax.value, 上限: mpMax.value },
        心神: { 当前: sanMax.value, 上限: sanMax.value },
        技能: 固定档案.技能,
        特长与加成: 固定档案.特长与加成,
        物品栏: 固定档案.物品栏,
      },
      剧情进度: {
        当前章节: '第一章·诏起龙庭',
        当前日: 1,
        当前场景: '接旨',
        在场角色: ['传令太监'],
        地点: '苍府',
        仪式四物: { 向阳木心: false, 不灭灯油: false, 不落之尘: false, 清晨初露: false },
      },
      世界: {
        当前地点: '京城·苍府',
        现实时间: '光熙三十年 12月初·大雪',
        天气: '入冬以来最大的一场雪',
        现实日期推进: 0,
        时段: '清晨',
      },
    };

    updateVariablesWith(
      variables => {
        // 主角对象一次性整体替换（开局初始化，无副作用累积）
        _.set(variables, 'stat_data.主角', data.主角);
        // 剧情进度按子节点局部写入，避免覆盖事件总线维护的运行时键
        _.set(variables, 'stat_data.剧情进度.当前章节', data.剧情进度.当前章节);
        _.set(variables, 'stat_data.剧情进度.当前日', data.剧情进度.当前日);
        _.set(variables, 'stat_data.剧情进度.当前场景', data.剧情进度.当前场景);
        _.set(variables, 'stat_data.剧情进度.在场角色', data.剧情进度.在场角色);
        _.set(variables, 'stat_data.剧情进度.地点', data.剧情进度.地点);
        _.set(variables, 'stat_data.剧情进度.仪式四物', data.剧情进度.仪式四物);
        // 硬时钟世界状态随建卡一并初始化
        _.set(variables, 'stat_data.世界', data.世界);
        // 新结构字段：到达章节初始化为第一章，门清空
        _.set(variables, 'stat_data.剧情进度.到达章节', ['第一章·诏起龙庭']);
        _.set(variables, 'stat_data.门', {});
        return variables;
      },
      { type: 'message', message_id: -1 },
    );

    await createChatMessages([{
      role: 'user',
      message: `（主角 <user>——苍家文官，年${固定档案.年龄}岁，属性已配定，已就位接旨）`,
    }]);

    await triggerSlash('/trigger');
  }

  return { attrs, method, hpMax, mpMax, sanMax, total, remaining, init, submitCreate };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCreateStore, import.meta.hot));
}
