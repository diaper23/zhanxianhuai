import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVariablesStore = defineStore('variables', () => {
  const raw = ref<any>(null);
  function refresh() {
    try { raw.value = getAllVariables() ?? {}; }
    catch { raw.value = {}; }
  }
  const stat = computed(() => raw.value?.stat_data ?? {});
  const time       = computed(() => _.get(stat.value, '系统.当前时间', '未知'));
  const nation     = computed(() => _.get(stat.value, '系统.国家', '未知区域'));
  const town       = computed(() => _.get(stat.value, '系统.城镇', ''));
  const yuanhou    = computed(() => _.get(stat.value, '系统.当前渊候', '息始'));
  const isQiong    = computed(() => _.get(stat.value, '系统.是否为穷日', false));
  const isDual     = computed(() => _.get(stat.value, '系统.是否为双息日', false));
  const aura       = computed(() => parseFloat(_.get(stat.value, '系统.灵气浓度', '0')));
  const sealTension = computed(() => parseFloat(_.get(stat.value, '系统.封印松紧度', '100')));
  const phase      = computed(() => _.get(stat.value, '系统.当前探索阶段', '闲逛/探索'));
  const combatState = computed(() => _.get(stat.value, '系统.当前战斗状态', '非战斗'));
  const cooldown   = computed(() => _.get(stat.value, '系统.探索阶段冷却', ''));
  const realmPath    = computed(() => _.get(stat.value, '主角_属性.境界', '凡胎境'));
  const realmCommon  = computed(() => _.get(stat.value, '主角_属性.通用境界', '凡胎境'));
  const subRealm     = computed(() => _.get(stat.value, '主角_属性.小境界', '初期'));
  const progress     = computed(() => _.get(stat.value, '主角_属性.修行进度', 0));
  const linggen      = computed(() => _.get(stat.value, '主角_属性.灵根', 1));
  const mpCurr       = computed(() => _.get(stat.value, '主角_属性.灵力.当前', 100));
  const mpMax        = computed(() => _.get(stat.value, '主角_属性.灵力.上限', 100));
  const school       = computed(() => _.get(stat.value, '主角_属性.学派', '无'));
  const coreRes      = computed(() => _.get(stat.value, '主角_属性.途径核心资源', { 名称: '无' }));
  const spirit       = computed(() => _.get(stat.value, '主角_属性.契灵', { 契灵名: '' }));
  const injuryExt    = computed(() => _.get(stat.value, '主角_属性.身体与精神状态.外伤', '无'));
  const injuryInt    = computed(() => _.get(stat.value, '主角_属性.身体与精神状态.内伤隐患', '无'));
  const specialState = computed(() => _.get(stat.value, '主角_属性.学派特殊状态', {}));
  const skillObj     = computed(() => _.get(stat.value, '主角_属性.功法', {}));
  const stone        = computed(() => _.get(stat.value, '主角_属性.经济.灵石', 0));
  const coin         = computed(() => _.get(stat.value, '主角_属性.经济.银两', 0));
  const equip        = computed(() => _.get(stat.value, '主角_属性.装备', { 武器: '无', 防具: '无', 饰品: '无', 核心造物: '无' }));
  const bagObj       = computed(() => _.get(stat.value, '主角_属性.背包', {}));
  const favorObj  = computed(() => _.get(stat.value, '好感度', {}));
  const tasksObj  = computed(() => _.get(stat.value, '当前任务', {}));
  const eventsObj = computed(() => _.get(stat.value, '活跃事件', {}));
  const intelObj  = computed(() => _.get(stat.value, '已知情报', {}));
  const repObj    = computed(() => _.get(stat.value, '玩家声望', {}));
  const factionObj = computed(() => _.get(stat.value, '势力关系', {}));
  const npcList   = computed(() => _.get(stat.value, '在场NPC', []));

  const danuo   = computed(() => _.get(stat.value, '大傩阴墟', {状态: 0, 死亡次数: 0, 探索进度: 0}));
  const rumors  = computed(() => _.get(stat.value, '修仙界传闻', []));
  const dongfu  = computed(() => _.get(stat.value, '随身洞府', {开启状态: false, 名称: '未命名残破秘境', 等级: 0, 灵气充裕度: 10, 防御阵法: 0, 上次结算时间: '', 设施: {}, 驻留人员: [], 当前告警: '无', 入侵记录: [], 洞府日志: []}));
  const auction = computed(() => _.get(stat.value, '隐元阁暗拍', {状态: 0, 举办地: '', 压轴拍品: [], 大客户名单: [], 最终得主: ''}));
  const life    = computed(() => _.get(stat.value, '寿元与夺舍', {当前寿元: 80, 寿元上限: 80, 夺舍次数: 0, 当前身躯: '原身', 延寿记录: []}));

  const metHeroines   = computed(() => _.get(stat.value, '已邂逅', []));
  const heroineCooldown = computed(() => _.get(stat.value, '女主事件冷却', 0));
  const heroineRels   = computed(() => _.get(stat.value, '女主关系', {}));

  return {
    refresh, time, nation, town, yuanhou, isQiong, isDual, aura, sealTension,
    phase, combatState, cooldown, realmPath, realmCommon, subRealm, progress, linggen,
    mpCurr, mpMax, school, coreRes, spirit, injuryExt, injuryInt, specialState, skillObj,
    stone, coin, equip, bagObj, favorObj, tasksObj, eventsObj, intelObj, repObj, factionObj, npcList,
    danuo, rumors, dongfu, auction, life,
    metHeroines, heroineCooldown, heroineRels
  };
});
