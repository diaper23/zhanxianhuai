export const Schema = z.object({
  主角: z
    .object({
      姓名: z.string(),
      身份: z.string().describe('苍家文官（单主角固定为 <user>）'),
      性别: z.string(),
      年龄: z.coerce.number(),
      出身: z.string().describe('家世、门派或背景一句话'),
      //  八大核心属性
      力量: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      敏捷: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      体质: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      外貌: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      智力: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      意志: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      教育: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      体型: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      // 衍生
      幸运: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
      气血: z
        .object({
          当前: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
          上限: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
        })
        .prefault({ 当前: 10, 上限: 10 }),
      法力: z
        .object({
          当前: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
          上限: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
        })
        .prefault({ 当前: 10, 上限: 10 }),
      心神: z
        .object({
          当前: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
          上限: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
        })
        .prefault({ 当前: 50, 上限: 50 }),
      技能: z
        .record(
          z.string().describe('技能名'),
          z.object({
            等级: z.coerce.number().transform(v => _.clamp(v, 0, 99)),
            本职: z.boolean().default(false),
          }),
        )
        .prefault({}),
      特长与加成: z.array(z.string()).prefault([]),
      物品栏: z
        .record(
          z.string().describe('物品名'),
          z.object({
            描述: z.string().describe('物品外观与特性的简短描述'),
            数量: z.coerce.number().transform(v => Math.max(v, 0)),
          }),
        )
        .prefault({})
        .transform(data => _.pickBy(data, item => item.数量 > 0)),
    })
    .transform(data => {
      const sanRatio = data.心神.当前 / Math.max(1, data.心神.上限);
      const $精神状态 =
        sanRatio > 0.8
          ? '常态'
          : sanRatio > 0.6
            ? '焦虑'
            : sanRatio > 0.4
              ? '不安'
              : sanRatio > 0.2
                ? '失常'
                : '濒临崩溃';
      return { ...data, $精神状态 };
    }),

  剧情进度: z.object({
    当前章节: z.enum(['第一章·诏起龙庭', '第二章·龙泽听潮']),
    // 模组内经过的整日数；接旨当日为第 1 日，玩家过夜即 +1（硬时钟，见 主持协议）
    当前日: z.coerce.number().transform(v => Math.max(1, Math.floor(v))).prefault(1),
    // 大祭首日锚点：抵达龙泽后首个大祭日的 当前日 值；由事件总线维护，主持不写
    大祭首日: z.coerce.number().transform(v => Math.max(0, Math.floor(v))).prefault(0),
    当前场景: z.string().describe('章节内小场景关键名，如 接旨/桐淮派堂口/东市百年老槐/护国寺/阜财坊/城北高门/出山仪式'),
    在场角色: z.array(z.string()).prefault([]).describe('在场的 NPC 名数组，事件总线用 present() 容错包含匹配'),
    地点: z.string().describe('场景_前缀条目名，由场景控制器读并 getwi 拉取'),
    // 已到达过的章节名集合；事件总线用 reached()/atOrAfter() 判里程，避免 主持 忘切章导致整章断流
    到达章节: z.array(z.string()).prefault([]),
    仪式四物: z
      .object({
        向阳木心: z.boolean().default(false),
        不灭灯油: z.boolean().default(false),
        不落之尘: z.boolean().default(false),
        清晨初露: z.boolean().default(false),
      })
      .prefault({ 向阳木心: false, 不灭灯油: false, 不落之尘: false, 清晨初露: false }),
    // 任务目标：主线事件给出写入指引、主持在变量更新里维护；状态栏"奉旨"面板展示
    任务目标: z
      .record(
        z.string().describe('目标名'),
        z.object({
          描述: z.string().prefault(''),
          状态: z.enum(['进行中', '已完成', '已失败']).prefault('进行中'),
        }),
      )
      .prefault({}),
  }),

  世界: z.object({
    当前地点: z.string(),
    现实时间: z.string().describe('模组内时间，光熙三十年12月某日'),
    天气: z.string(),
    现实日期推进: z.coerce.number().transform(v => Math.max(v, 0)).describe('从开局起经过的天数'),
    // 硬时钟六格时段；每拍实质行动推进一格，过夜回清晨（见 主持协议·硬时钟）
    时段: z.enum(['清晨', '上午', '午后', '黄昏', '夜晚', '深夜']).prefault('清晨'),
  }),

  NPC关系表: z
    .record(
      z.string().describe('NPC名'),
      z.object({
        警惕度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        态度: z.enum(['敌意', '戒备', '中立', '友善', '信任']),
        好感: z.coerce.number().transform(v => _.clamp(v, -100, 100)),
        存活: z.boolean().default(true),
        备注: z.string().default(''),
      }),
    )
    .prefault({}),

  秘密知晓: z
    .record(
      z.string().describe('秘密名'),
      z.boolean().default(false),
    )
    .prefault({}),

  // 事件总线"门"系统：keysMatch 命中且首次开门后置 true，永久锚定防重复注入剧透
  门: z
    .record(
      z.string().describe('门牌号'),
      z.boolean().default(true),
    )
    .prefault({}),

  // 事件总线运行时缓冲：扫描阶段清空、注入阶段读取后用完即弃。下划线前缀被 MVU 视为只读，但此字段由 EJS 写不在 AI patch 链路内，不冲突
  _本轮注入: z
    .array(
      z.object({
        id: z.string(),
        body: z.string(),
        order: z.coerce.number().prefault(0),
        ts: z.coerce.number().prefault(0),
      }),
    )
    .prefault([]),

  // 骰子引擎运行时日志：每次掷骰追加一条；只读字段，AI 不在 <UpdateVariable> 写它
  _rollLog: z
    .array(
      z.object({
        技能: z.string(),
        目标: z.coerce.number().prefault(50),
        投出: z.coerce.number().prefault(0),
        结果: z.string(),
        奖惩: z.coerce.number().prefault(0),
        损失量: z.string().prefault(''),
        理由: z.string().prefault(''),
        来源: z.enum(['主持请求', '玩家请求', '幸运翻盘', '强投']).prefault('玩家请求'),
        楼层: z.coerce.number().prefault(0),
        ts: z.coerce.number().prefault(0),
      }),
    )
    .prefault([]),
});
export type Schema = z.output<typeof Schema>;
