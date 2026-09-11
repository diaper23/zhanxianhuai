export const Schema = z.object({
  系统: z.object({
    当前剧本: z.string().prefault(''),
    当前场景: z.string().prefault(''),
    当前时间: z.string().prefault(''),
  }),

  女主: z
    .object({
      名字: z.string().prefault(''),
      悔恨值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      执着度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      尊严值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(80),
      认知阶段: z.string().prefault('未觉醒'),
      当前情绪: z.string().prefault(''),
      关键记忆: z.record(z.string().describe('记忆名'), z.string().describe('记忆描述')).prefault({}),
    })
    .transform(data => {
      const $认知标签 =
        data.认知阶段 === '未觉醒'
          ? '仍在自我欺骗'
          : data.认知阶段 === '动摇'
            ? '开始质疑自己'
            : data.认知阶段 === '醒悟'
              ? '深刻认识到伤害'
              : '正在重建自我';
      return { ...data, $认知标签 };
    }),

  // ==================== 纨绔世子·权谋 RPG ====================
  纨绔世子: z
    .object({
      当前阶段: z.enum(['京城风云', '暗流涌动', '北境烽火', '九五至尊']).prefault('京城风云'),

      势力: z.object({
        军力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(5),
        财力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
        朝堂权势: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(3),
        民间声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(20),
      }),

      个人: z.object({
        武力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(15),
        天一决进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
        声名标签: z.string().prefault('京城第一纨绔'),
      }),

      人际网络: z
        .record(
          z.string().describe('NPC姓名'),
          z.object({
            好感度: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
            信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
            立场: z.string().prefault('中立'),
            当前状态: z.string().prefault(''),
          }),
        )
        .prefault({}),

      剧情记录: z
        .record(z.string().describe('事件名'), z.object({
          状态: z.enum(['进行中', '已触发', '已完成']),
          结果: z.string().prefault(''),
        }))
        .prefault({}),

      朝局: z.object({
        帝王态度: z.enum(['猜忌', '中立', '忌惮', '敌对']).prefault('猜忌'),
        雪党势力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(80),
      }),
    })
    .optional(),

  // ==================== 情深不寿局·恋情重逢 ====================
  情深不寿局: z
    .object({
      当前阶段: z.enum(['热搜点燃', '重逢试探', '记忆反噬', '和解推拉', '放手或回头']).prefault('热搜点燃'),

      真相已知度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),

      羁绊值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(60),

      体面值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(90),

      人物:
        z.record(
          z.string().describe('NPC姓名'),
          z.object({
            好感度: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
            立场: z.string().prefault('中立'),
            当前状态: z.string().prefault(''),
          }),
        ).prefault({}),

      剧情记录: z
        .record(
          z.string().describe('事件名'),
          z.object({
            状态: z.enum(['未触发', '进行中', '已完成']).prefault('未触发'),
            结果: z.string().prefault(''),
          }),
        ).prefault({}),

      舆情: z.object({
        热搜余温: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
      }),
    })
    .optional(),
});
export type Schema = z.output<typeof Schema>;
