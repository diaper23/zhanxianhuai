import App from './App.vue';
import './global.css';

$(async () => {
  // 本地测试时，如果不存在 getvar，注入一个假的
  if (typeof window.getvar === 'undefined') {
    window.getvar = (path: string, options: any) => {
      const mockData = {
        'stat_data.调查员': {
          姓名: '邵清舟',
          身份: '苍家文官',
          HP: { 当前: 12, 上限: 12 },
          MP: { 当前: 15, 上限: 15 },
          SAN: { 当前: 55, 上限: 60 },
          力量: 50, 敏捷: 60, 体质: 55,
          技能: { 图书馆使用: { 等级: 60, 本职: true }, 交涉: { 等级: 70, 本职: true } },
          物品栏: {
            敕令牌: { 描述: '皇城司腰牌，可辨识番子身份', 数量: 1 },
            雪花银: { 描述: '少量盘缠', 数量: 20 }
          }
        },
        'stat_data.剧情进度.当前章节': '第一章·诏起龙庭',
        'stat_data.剧情进度.地点': '皇城司地牢',
        'stat_data.剧情进度.在场角色': ['严狰', '太监'],
        'stat_data.剧情进度.任务目标': {
          '查明诏书真伪': { 描述: '探明内廷送出的这封圣旨是否经过内阁司礼监', 状态: '进行中' },
          '拜见严狰': { 描述: '前往死牢底面见严伯父', 状态: '已完成' }
        },
        'stat_data.世界.现实时间': '光熙三十年 12月初·大雪',
        'stat_data.世界.天气': '入冬以来最大的一场雪'
      };
      return (mockData as any)[path] ?? options?.defaults;
    };
  }

  createApp(App).use(createPinia()).mount('#app');
});