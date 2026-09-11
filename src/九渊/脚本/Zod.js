import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  系统: z.object({
    当前时间: z.string(),
    国家: z.enum([
      '大朔', '南烬', '西戈', '北朔', '东屿', '渊下野', '大傩阴墟',
      '梁川', '越棘', '磐丘', '商於', '涪陵', '郢丘',
      '天衡宗', '心炉盟', '隐元阁', '冥契会', '未知区域', '待初始化'
    ]).prefault('待初始化'),
    城镇: z.string().prefault('待初始化'),
    当前渊候: z.enum([
      '息始','脉动','封印微启','渊气分','灵泉涌','地脉畅',
      '息盛始','灵气盈','渊芒出','息极','炎渊蒸','炽渊腾',
      '息敛始','渊气肃','灵露凝','渊息平','寒渊沁','封力增',
      '息藏始','地表凝','渊息潜','息穷','寒渊锁','封极'
    ]),
    是否为穷日: z.boolean(),
    是否为双息日: z.boolean(),
    探索阶段冷却: z.string(),
    灵气浓度: z.coerce.number().transform(v => _.clamp(v, 0, 1)),
    封印松紧度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    当前探索阶段: z.enum(['闲逛/探索', '危机/副本', '休整/结算']),
    当前战斗状态: z.enum(['非战斗', '战斗中'])
  }),

  主角_属性: z.object({
    境界: z.string(),
    通用境界: z.enum([
      '凡胎境','启灵境','筑基境','凝脉境','化炁境',
      '结丹境','元婴境','出窍境','化神境','合道境','超脱境'
    ]),
    小境界: z.enum(['初期','中期','后期','巅峰']),
    修行进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    灵力: z.object({
      当前: z.coerce.number(),
      上限: z.coerce.number()
    }),
    学派: z.enum([
      '无','儒门','道宗','释家','法家','墨门','兵家','纵横家',
      '气脉','心炉','冥契','散修','异变散修'
    ]),
    灵根: z.coerce.number().transform(v => _.clamp(v, 1, 9)),
    途径核心资源: z.object({
      名称: z.enum([
        '德亏值','心斋值','执障','偏差值','工债','透支度',
        '因果链','薪柴值','契约深度','无'
      ]),
      当前值: z.coerce.number(),
      上限: z.coerce.number(),
      危险阈值: z.coerce.number()
    }),
    契灵: z.object({
      契灵名: z.string(),
      所属渊层: z.enum([
        '无','端渊','脉渊','苏渊','炽渊','溟渊',
        '冥渊','敛渊','肃渊','封渊'
      ]),
      契约深度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      本月借力次数: z.coerce.number()
    }),
    功法: z.record(z.string(), z.object({
      类型: z.enum(['主修','技法','秘术','辅助','废弃']),
      描述: z.string()
    })),
    学派特殊状态: z.record(z.string(), z.coerce.number()),
    身体与精神状态: z.object({
      外伤: z.string(),
      内伤隐患: z.string()
    }),
    经济: z.object({
      灵石: z.coerce.number(),
      银两: z.coerce.number()
    }),
    装备: z.object({
      武器: z.string(),
      防具: z.string(),
      饰品: z.string(),
      核心造物: z.string()
    }),
    背包: z.record(z.string(), z.object({
      数量: z.coerce.number(),
      描述: z.string()
    })).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
  }),

  玩家声望: z.record(z.string(), z.coerce.number().transform(v => _.clamp(v, -100, 100))).prefault({}),

  当前任务: z.record(z.string(), z.object({
    来源: z.enum(['主动接取','事件触发','偶遇','悬赏','委托']),
    类型: z.enum(['主线','支线','奇遇','日常','委托']),
    地点: z.string(),
    简述: z.string(),
    目标: z.string(),
    奖励: z.string(),
    时限: z.string()
  })).prefault({}).transform(tasks => _(tasks).entries().takeRight(7).fromPairs().value()),

  已知情报: z.record(z.string(), z.object({
    来源: z.string(),
    内容: z.string(),
    可信度: z.enum(['确证','可靠','传闻','可疑']),
    是否已使用: z.boolean()
  })).prefault({}),

  势力关系: z.record(z.string(), z.record(z.string(), z.object({
    态度: z.coerce.number().transform(v => _.clamp(v, -100, 100)),
    状态: z.enum(['交战','对峙','冷淡','中立','友好','同盟']),
    最近事件: z.string()
  }))).prefault({}),

  活跃事件: z.record(z.string(), z.object({
    类型: z.enum([
      '边境冲突','封印异动','朝堂斗争','商路争端',
      '宗门事务','天象异常','民间动荡','奇遇线索','个人恩怨'
    ]),
    涉及势力: z.array(z.string()),
    区域: z.string(),
    当前阶段: z.enum(['酝酿','爆发','持续','收束']),
    玩家介入度: z.enum(['未涉及','已听闻','已介入','已解决']),
    简述: z.string()
  })).prefault({}).transform(events =>
    _(events).entries()
      .filter(([, v]) => !(v.当前阶段 === '收束' && v.玩家介入度 === '已解决'))
      .takeRight(7).fromPairs().value()
  ),

  好感度: z.partialRecord(
    z.enum(['姜瑶', '百里遥', '妫宁', '桓歌', '慕清雪', '曲红绡', '阮棠', '温知夏', '沈千歌', '小黎']),
    z.coerce.number().transform(v => _.clamp(v, 0, 100))
  ),

  在场NPC: z.array(z.string()).prefault([]),

  大傩阴墟: z.object({
    状态: z.coerce.number().transform(v => _.clamp(v, 0, 2)).prefault(0),
    死亡次数: z.coerce.number().prefault(0),
    探索进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0)
  }).prefault({状态: 0, 死亡次数: 0, 探索进度: 0}),

  修仙界传闻: z.array(z.object({
    原始事件: z.string(),
    演化版本: z.string(),
    热度: z.enum(['小道消息', '满城风雨', '天下皆知'])
  })).prefault([]),

  随身洞府: z.object({
    开启状态: z.boolean().prefault(false),
    名称: z.string().prefault('未命名残破秘境'),
    等级: z.coerce.number().transform(v => _.clamp(v, 0, 9)).prefault(0),
    灵气充裕度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
    防御阵法: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    上次结算时间: z.string().prefault(''),
    设施: z.record(z.string(), z.object({
      等级: z.coerce.number().transform(v => _.clamp(v, 0, 3)).prefault(1),
      状态: z.enum(['闲置', '运转中', '损坏']).prefault('闲置'),
      产出: z.string().prefault(''),
      指派人员: z.string().prefault('')
    })).prefault({}),
    驻留人员: z.array(z.object({
      姓名: z.string(),
      身份: z.enum(['散修', '凡人匠师', '高好感女主', '收服战俘', '契约灵仆']).prefault('散修'),
      分工: z.enum(['护阵', '培植', '炼制', '杂役']).prefault('杂役'),
      境界: z.string().prefault('凡胎境')
    })).prefault([]),
    当前告警: z.enum(['无', '阵法告急', '被窥探', '入侵中']).prefault('无'),
    入侵记录: z.array(z.object({
      时间: z.string(),
      经过: z.string(),
      损失: z.string()
    })).prefault([]),
    洞府日志: z.array(z.string()).prefault([])
  }).prefault({开启状态: false, 名称: '未命名残破秘境', 等级: 0, 灵气充裕度: 10, 防御阵法: 0, 上次结算时间: '', 设施: {}, 驻留人员: [], 当前告警: '无', 入侵记录: [], 洞府日志: []}),

  隐元阁暗拍: z.object({
    状态: z.coerce.number().transform(v => _.clamp(v, 0, 2)).prefault(0),
    举办地: z.string().prefault(''),
    压轴拍品: z.array(z.string()).prefault([]),
    大客户名单: z.array(z.string()).prefault([]),
    最终得主: z.string().prefault('')
  }).prefault({状态: 0, 举办地: '', 压轴拍品: [], 大客户名单: [], 最终得主: ''}),

  寿元与夺舍: z.object({
    当前寿元: z.coerce.number(),
    寿元上限: z.coerce.number(),
    夺舍次数: z.coerce.number().prefault(0),
    当前身躯: z.string().prefault('原身'),
    延寿记录: z.array(z.string()).prefault([])
  }).prefault({当前寿元: 80, 寿元上限: 80, 夺舍次数: 0, 当前身躯: '原身', 延寿记录: []})
});

$(() => {
  registerMvuSchema(Schema);
})
