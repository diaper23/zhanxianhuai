export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().prefault('待初始化'),
    当前地点: z.string().prefault('待初始化'),
    近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')).prefault({}),
  }).prefault({}),

  在场角色: z.array(z.string()).prefault(['谢秋瞳']),

  剧情要点: z
    .object({
      状态表: z
        .record(
          z.string().describe('剧情ID'),
          z
            .object({
              剧情名: z.string().prefault(''),
              状态: z.enum(['未触发', '进行中', '已完成']).prefault('未触发'),
              进程: z.array(z.string()).prefault([]),
              结果: z.string().prefault(''),
              触发时间: z.string().prefault(''),
              完成时间: z.string().prefault(''),
            })
            .prefault({}),
        )
        .prefault({}),
      本轮命中: z
        .object({
          暗示: z.array(z.string()).prefault([]),
          明示: z.array(z.string()).prefault([]),
          线索: z.array(z.string()).prefault([]),
          插入: z.array(z.string()).prefault([]),
          覆盖: z.array(z.string()).prefault([]),
          禁令: z.array(z.string()).prefault([]),
        })
        .prefault({}),
      本轮文本: z.record(z.string().describe('命中剧情ID'), z.string()).prefault({}),
    })
    .prefault({}),

  谢秋瞳: z
    .object({
      态度: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
      信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      控制欲: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(90),
      情感牵连: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      动态阶段: z.enum(['陌生试探', '有限合作', '情感动摇', '深层信任', '决裂敌对']).prefault('陌生试探'),
      隐瞒程度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
      身体状态: z.string().prefault('待初始化'),
      当前打算: z.string().prefault('待初始化'),
    })
    .prefault({})
    .transform(data => {
      const $关系阶段 =
        data.态度 < -60
          ? '敌对利用'
          : data.态度 < -20
            ? '冷淡算计'
            : data.态度 < 20
              ? '有限合作'
              : data.态度 < 50
                ? '深层盟友'
                : '以命相托';
      return { ...data, $关系阶段 };
    }),

  喜儿: z
    .object({
      好感: z.coerce.number().transform(v => _.clamp(v, -50, 100)).prefault(0),
      信任度: z.coerce.number().transform(v => _.clamp(v, -50, 100)).prefault(0),
      依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      师门牵引: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(95),
      危机感: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(70),
      动态阶段: z.enum(['暗处观察', '目标接触', '交易保护', '情感动摇', '归属确认', '背叛危机']).prefault('暗处观察'),
      当前任务: z.string().prefault('待初始化'),
      所在地: z.string().prefault('待初始化'),
      当前态度: z.string().prefault('待初始化'),
    })
    .prefault({}),

  王徽: z
    .object({
      好感: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      自主意志: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(35),
      家族压力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(75),
      情感倾向: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      动态阶段: z.enum(['未相识', '好奇', '欣赏', '倾心', '同行', '失望']).prefault('未相识'),
      当前处境: z.string().prefault('待初始化'),
      所在地: z.string().prefault('待初始化'),
      当前状态: z.string().prefault('待初始化'),
    })
    .prefault({}),

  用户: z
    .object({
      当前官职: z.string().prefault('白身'),
      武功境界: z.string().prefault('无'),
      所在地: z.string().prefault('待初始化'),
      当前行动: z.string().prefault('待初始化'),
      名望: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    })
    .prefault({}),

  势力动向: z
    .partialRecord(
      z.enum(['谢家', '王家', '太子', '皇帝', '圣心宫', '极乐宫', '后赵石虎', '慕容鲜卑', '北府兵', '戴渊']),
      z.string().describe('势力状态描述'),
    )
    .prefault({})
    .refine(data => {
      const required = ['谢家', '王家', '太子', '皇帝', '圣心宫', '极乐宫', '后赵石虎', '慕容鲜卑', '北府兵', '戴渊'];
      return required.every(k => k in data);
    }, { message: '缺少必需的势力字段' }),
});
export type Schema = z.output<typeof Schema>;
