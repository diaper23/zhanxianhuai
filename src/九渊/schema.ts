export const Schema = z.object({
  系统: z
    .object({
      当前时间: z.string().prefault('渊历 5050年 端月 初一 辰时'),
      国家: z.string().prefault('待初始化'),
      城镇: z.string().prefault('待初始化'),
      当前渊候: z.string().prefault('息始'),
      是否为穷日: z.boolean().prefault(false),
      是否为双息日: z.boolean().prefault(false),
      灵气浓度: z.coerce.number().transform(v => _.clamp(v, 0, 1)).prefault(0.5),
      封印松紧度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      当前探索阶段: z.string().prefault('闲逛/探索'),
      当前战斗状态: z.string().prefault('非战斗'),
      探索阶段冷却: z.string().prefault(''),
    })
    .prefault({}),

  主角_属性: z
    .object({
      境界: z.string().prefault('凡胎境'),
      通用境界: z.string().prefault('凡胎境'),
      小境界: z.string().prefault('初期'),
      修行进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      灵力: z
        .object({
          当前: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
          上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
        })
        .prefault({}),
      学派特殊状态: z.record(z.string().describe('特殊状态名'), z.coerce.number()).prefault({}),
      灵根: z.coerce.number().transform(v => _.clamp(v, 1, 9)).prefault(5),
      途径核心资源: z
        .object({
          名称: z.string().prefault('无'),
          当前值: z.coerce.number().prefault(0),
          上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
          危险阈值: z.coerce.number().transform(v => Math.max(0, v)).prefault(80),
        })
        .prefault({}),
      契灵: z
        .object({
          契灵名: z.string().prefault('无'),
          所属渊层: z.string().prefault('无'),
          契约深度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
          本月借力次数: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
        })
        .prefault({}),
      功法: z
        .record(
          z.string().describe('功法名'),
          z.object({
            类型: z.string().prefault('辅助'),
            描述: z.string().prefault(''),
          }),
        )
        .prefault({}),
      身体与精神状态: z
        .object({
          外伤: z.string().prefault('无'),
          内伤隐患: z.string().prefault('无'),
        })
        .prefault({}),
      学派: z.string().prefault('无'),
      经济: z
        .object({
          灵石: z.coerce.number().transform(v => Math.max(0, v)).prefault(10),
          银两: z.coerce.number().transform(v => Math.max(0, v)).prefault(50),
        })
        .prefault({}),
      装备: z
        .object({
          武器: z.string().prefault('普通的铁剑'),
          防具: z.string().prefault('无'),
          饰品: z.string().prefault('无'),
          核心造物: z.string().prefault('无'),
        })
        .prefault({}),
      背包: z
        .record(
          z.string().describe('物品名'),
          z.object({
            数量: z.coerce.number().transform(v => Math.max(0, v)).prefault(1),
            描述: z.string().prefault(''),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),
    })
    .prefault({}),

  好感度: z
    .partialRecord(
      z.enum(['姜瑶', '百里遥', '妫宁', '桓歌', '慕清雪', '曲红绡', '阮棠', '温知夏', '沈千歌', '小黎']),
      z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    )
    .prefault({}),

  玩家声望: z.record(z.string().describe('势力名'), z.coerce.number().transform(v => _.clamp(v, -100, 100))).prefault({}),

  当前任务: z
    .record(
      z.string().describe('任务名'),
      z.object({
        来源: z.string().prefault('事件触发'),
        类型: z.string().prefault('支线'),
        地点: z.string().prefault(''),
        简述: z.string().prefault(''),
        目标: z.string().prefault(''),
        奖励: z.string().prefault(''),
        时限: z.string().prefault(''),
      }),
    )
    .prefault({}),

  已知情报: z
    .record(
      z.string().describe('情报ID'),
      z.object({
        来源: z.string().prefault(''),
        内容: z.string().prefault(''),
        可信度: z.string().prefault('传闻'),
        是否已使用: z.boolean().prefault(false),
      }),
    )
    .prefault({}),

  势力关系: z
    .record(
      z.string().describe('势力A'),
      z.record(
        z.string().describe('势力B'),
        z.object({
          态度: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
          状态: z.string().prefault('中立'),
          最近事件: z.string().prefault(''),
        }),
      ),
    )
    .prefault({}),

  活跃事件: z
    .record(
      z.string().describe('事件ID'),
      z.object({
        类型: z.string().prefault('奇遇线索'),
        涉及势力: z.array(z.string()).prefault([]),
        区域: z.string().prefault(''),
        当前阶段: z.string().prefault('酝酿'),
        玩家介入度: z.string().prefault('未涉及'),
        简述: z.string().prefault(''),
      }),
    )
    .prefault({}),

  在场NPC: z.array(z.string()).prefault([]),

  已邂逅: z.array(z.string()).prefault([]),

  女主事件冷却: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),

  女主关系: z
    .record(
      z.string().describe('女主组合，按姓名排序用·连接'),
      z.object({
        关系: z.string().prefault('陌路'),
        导火索: z.string().prefault(''),
        最近互动: z.string().prefault(''),
      }),
    )
    .prefault({}),

  身份职位: z
    .object({
      所属国: z.string().prefault(''),
      所属衙门: z.string().prefault('无'),
      职位: z.string().prefault('白身'),
      品级: z.string().prefault('无'),
      功绩: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      月俸: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      上峰: z.string().prefault(''),
      同僚: z.array(z.string()).prefault([]),
      政敌: z.array(z.string()).prefault([]),
    })
    .prefault({}),

  先贤遗泽: z
    .record(
      z.string().describe('遗泽名'),
      z.object({
        状态: z.string().prefault('未发现'),
        简述: z.string().prefault(''),
      }),
    )
    .prefault({}),

  种族关系: z
    .record(
      z.string().describe('种族名'),
      z.object({
        态度: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
        状态: z.string().prefault('中立'),
        最近事件: z.string().prefault(''),
      }),
    )
    .prefault({}),

  大傩阴墟: z
    .object({
      状态: z.coerce.number().transform(v => _.clamp(v, 0, 2)).prefault(0),
      死亡次数: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      探索进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    })
    .prefault({}),

  修仙界传闻: z
    .array(
      z.object({
        原始事件: z.string().prefault(''),
        演化版本: z.string().prefault(''),
        热度: z.string().prefault('小道消息'),
        已反应: z.boolean().prefault(false),
      }),
    )
    .prefault([])
    .transform(data => _(data).takeRight(5).value()),

  随身洞府: z
    .object({
      开启状态: z.boolean().prefault(false),
      名称: z.string().prefault('未命名残破秘境'),
      等级: z.coerce.number().transform(v => _.clamp(v, 0, 9)).prefault(0),
      灵气充裕度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
      防御阵法: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      上次结算时间: z.string().prefault(''),
      设施: z
        .record(
          z.string().describe('设施名'),
          z.object({
            等级: z.coerce.number().transform(v => Math.max(0, v)).prefault(1),
            状态: z.string().prefault('闲置'),
            产出: z.string().prefault(''),
            指派人员: z.string().prefault(''),
          }),
        )
        .prefault({}),
      驻留人员: z.array(z.unknown()).prefault([]),
      当前告警: z.string().prefault('无'),
      入侵记录: z.array(z.unknown()).prefault([]),
      洞府日志: z.array(z.string()).prefault([]),
    })
    .prefault({}),

  隐元阁暗拍: z
    .object({
      状态: z.coerce.number().transform(v => _.clamp(v, 0, 2)).prefault(0),
      举办地: z.string().prefault(''),
      压轴拍品: z.array(z.string()).prefault([]),
      大客户名单: z.array(z.string()).prefault([]),
      最终得主: z.string().prefault(''),
    })
    .prefault({}),

  寿元与夺舍: z
    .object({
      当前寿元: z.coerce.number().transform(v => Math.max(0, v)).prefault(80),
      寿元上限: z.coerce.number().transform(v => Math.max(0, v)).prefault(80),
      夺舍次数: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      当前身躯: z.string().prefault('原身'),
      延寿记录: z.array(z.string()).prefault([]),
    })
    .prefault({}),
}).prefault({});

export type Schema = z.output<typeof Schema>;
