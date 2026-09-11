<template>
  <transition name="page-fade" mode="out-in">
    <!-- ═══ 主界面：剧本列表 ═══ -->
    <div class="selector" v-if="view === 'list'" key="list">
      <header class="selector-header">
        <div class="header-ornament left">
          <svg viewBox="0 0 60 12" class="ornament-svg">
            <path d="M60,6 C45,6 40,2 30,2 C20,2 15,6 0,6" stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.6"/>
            <path d="M60,6 C45,6 40,10 30,10 C20,10 15,6 0,6" stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.3"/>
          </svg>
        </div>
        <div class="header-center">
          <h2 class="selector-title">薄 情 书</h2>
          <div class="title-accent"></div>
          <p class="selector-hint">十二卷残局 · 翻开哪一页</p>
        </div>
        <div class="header-ornament right">
          <svg viewBox="0 0 60 12" class="ornament-svg">
            <path d="M0,6 C15,6 20,2 30,2 C40,2 45,6 60,6" stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.6"/>
            <path d="M0,6 C15,6 20,10 30,10 C40,10 45,6 60,6" stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.3"/>
          </svg>
        </div>
      </header>

      <!-- 分类筛选 -->
      <nav class="filter-bar">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="filter-btn"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          <span class="filter-icon">{{ cat.icon }}</span>
          <span class="filter-label">{{ cat.label }}</span>
        </button>
      </nav>

      <!-- 剧本网格 -->
      <transition-group name="card-list" tag="div" class="script-grid">
        <div
          v-for="(script, idx) in filteredScripts"
          :key="script.id"
          class="script-card"
          :class="[script.era]"
          :style="{ '--i': idx }"
          @click="openDetail(script)"
        >
          <div class="card-shimmer"></div>
          <div class="card-body">
            <div class="card-header">
              <span class="card-era">{{ script.eraLabel }}</span>
              <span class="card-difficulty">
                <span v-for="n in script.starCount" :key="n" class="diff-dot filled"></span>
                <span v-for="n in (5 - script.starCount)" :key="'e'+n" class="diff-dot"></span>
              </span>
            </div>
            <h3 class="card-title">{{ script.name }}</h3>
            <p class="card-subtitle">{{ script.subtitle }}</p>
            <div class="card-footer">
              <span class="card-heroine">
                <span class="heroine-mark"></span>
                {{ script.femaleLeadName }}
              </span>
              <span class="card-arrow">›</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- ═══ 二级页面：剧本详情 ═══ -->
    <div class="detail" v-else-if="view === 'detail' && detailScript" key="detail">
      <button class="back-btn" @click="view = 'list'">
        <span class="back-icon">‹</span>
        <span class="back-text">返回</span>
      </button>

      <div class="detail-content" :class="[detailScript.era]">
        <div class="detail-top">
          <span class="detail-era">{{ detailScript.eraLabel }}</span>
          <span class="detail-stars">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= detailScript.starCount }">★</span>
          </span>
        </div>

        <h2 class="detail-title">{{ detailScript.name }}</h2>
        <p class="detail-tagline">{{ detailScript.subtitle }}</p>

        <div class="detail-divider">
          <span class="divider-dot"></span>
          <span class="divider-line"></span>
          <span class="divider-dot"></span>
        </div>

        <div class="detail-desc">
          <p>{{ detailScript.description }}</p>
        </div>

        <div class="detail-info">
          <div class="info-item">
            <span class="info-label">{{ detailScript.initData.纨绔世子 ? '类型' : '女主' }}</span>
            <span class="info-value heroine-name">{{ detailScript.initData.纨绔世子 ? '权谋RPG' : detailScript.femaleLeadName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">起始场景</span>
            <span class="info-value">{{ detailScript.initData.系统.当前场景 }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">难度</span>
            <span class="info-value">
              <span v-for="n in 5" :key="n" class="star-sm" :class="{ filled: n <= detailScript.starCount }">★</span>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ detailScript.initData.纨绔世子 ? '起始身份' : '初始情绪' }}</span>
            <span class="info-value">{{ detailScript.initData.纨绔世子 ? detailScript.initData.纨绔世子.个人.声名 : detailScript.initData.女主.当前情绪 }}</span>
          </div>
        </div>

        <div class="detail-memories" v-if="detailScript.initData.纨绔世子">
          <h4 class="memories-label">初始局势</h4>
          <div class="memory-list">
            <div class="memory-item">
              <span class="memory-key">军力</span>
              <span class="memory-val">{{ detailScript.initData.纨绔世子.势力.军力 }}/100 — 空壳世子无兵权</span>
            </div>
            <div class="memory-item">
              <span class="memory-key">朝局</span>
              <span class="memory-val">帝王{{ detailScript.initData.纨绔世子.朝局.帝王态度 }} · 雪党势力{{ detailScript.initData.纨绔世子.朝局.雪党势力 }}%</span>
            </div>
            <div class="memory-item">
              <span class="memory-key">危机</span>
              <span class="memory-val">父王失踪·退婚在即·三次暗杀未追究</span>
            </div>
          </div>
        </div>
        <div class="detail-memories" v-else>
          <h4 class="memories-label">关键记忆</h4>
          <div class="memory-list">
            <div v-for="(val, key) in detailScript.initData.女主.关键记忆" :key="key" class="memory-item">
              <span class="memory-key">{{ key }}</span>
              <span class="memory-val">{{ val }}</span>
            </div>
          </div>
        </div>

        <button class="select-btn" @click="confirmSelect(detailScript)">
          <span class="btn-text">翻开此卷</span>
          <span class="btn-glow"></span>
        </button>
      </div>
    </div>

    <!-- ═══ 选择确认：书页燃烧 ═══ -->
    <div class="selected-scene" v-else-if="view === 'selected'" key="selected">
      <div class="embers">
        <span v-for="n in 16" :key="n" class="ember" :style="emberStyle(n)"></span>
      </div>
      <div class="selected-content">
        <div class="book-icon">📖</div>
        <h3 class="selected-title">{{ selectedScript?.name }}</h3>
        <p class="selected-sub">书页正在燃烧…</p>
        <div class="loading-bar">
          <div class="loading-fill"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface ScriptInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  difficulty: string;
  starCount: number;
  era: 'modern' | 'ancient' | 'xianxia' | 'minguo' | 'strategy';
  eraLabel: string;
  femaleLeadName: string;
  tags: string[];
  initData: Record<string, any>;
}

type ViewState = 'list' | 'detail' | 'selected';

const view = ref<ViewState>('list');
const activeCategory = ref('all');
const detailScript = ref<ScriptInfo | null>(null);
const selectedScript = ref<ScriptInfo | null>(null);

const categories = [
  { key: 'all', label: '全部', icon: '卷' },
  { key: 'modern', label: '现代', icon: '今' },
  { key: 'ancient', label: '古风', icon: '古' },
  { key: 'xianxia', label: '仙侠', icon: '仙' },
  { key: 'minguo', label: '民国', icon: '旧' },
  { key: 'strategy', label: '权谋', icon: '策' },
];

const scripts = ref<ScriptInfo[]>([
  {
    id: '纨绔世子',
    name: '纨绔世子',
    subtitle: '废物世子穿书，从纨绔到九五之尊 [大型剧本]',
    description: '【大型权谋RPG剧本】镇北王世子关宁——京城人人嘲笑的纨绔废物。父亲率十万精锐失踪蛮荒，朝廷步步紧逼。一觉醒来，你成了他。退婚、暗杀、削藩……从八门考试开始，一步步走过朝堂、战场、天下。这不是追夫火葬场——这是权谋天下的史诗。',
    difficulty: '★★★★★',
    starCount: 5,
    era: 'strategy',
    eraLabel: '权谋',
    femaleLeadName: '（多线）',
    tags: ['史诗级篇幅', '势力经营', '多结局分支', '天一决养成'],
    initData: {
      系统: {
        当前剧本: '纨绔世子',
        当前场景: '镇北王府·书房',
        当前时间: '隆景二十七年五月初四夜',
      },
      女主: {
        名字: '',
        悔恨值: 0,
        执着度: 0,
        尊严值: 0,
        认知阶段: '未觉醒',
        当前情绪: '',
        关键记忆: {},
      },
      纨绔世子: {
        当前阶段: '京城风云',
        势力: { 军力: 5, 财力: 10, 朝堂权势: 3, 民间声望: 20 },
        个人: { 武力: 15, 天一决进度: 0, 声名标签: '京城第一纨绔' },
        人际网络: {
          隆景帝: { 好感度: -30, 信任度: 10, 立场: '敌对', 当前状态: '表面赐婚拉拢，实则步步紧逼' },
          永宁公主: { 好感度: 40, 信任度: 30, 立场: '支持', 当前状态: '被退婚心有不甘，暗中观察世子' },
          关重山: { 好感度: 80, 信任度: 60, 立场: '支持', 当前状态: '下落不明' },
          邓丘: { 好感度: -20, 信任度: 5, 立场: '敌对', 当前状态: '奉命疯狂试探打压' },
          薛怀仁: { 好感度: -10, 信任度: 15, 立场: '警惕', 当前状态: '冷眼旁观，两面下注' },
        },
        剧情记录: {},
        朝局: { 帝王态度: '猜忌', 雪党势力: 80 },
      },
    },
  },
  {
    id: '白月光替身局',
    name: '白月光替身局',
    subtitle: '她答应嫁你，只因你像她的白月光',
    description: '家族联姻。她点头那天，眼里看的是另一个人的影子。订婚宴叫错名字、他生日叫错名字、深夜电话也叫错名字——每次都装作没发生。他都知道，一个字没问过。',
    difficulty: '★★★',
    starCount: 3,
    era: 'modern',
    eraLabel: '现代',
    femaleLeadName: '苏晚宁',
    tags: [],
    initData: {
      系统: {
        当前剧本: '白月光替身局',
        当前场景: '苏家别墅·清晨',
        当前时间: '2024-11-15 07:30',
      },
      女主: {
        名字: '苏晚宁',
        悔恨值: 0,
        执着度: 30,
        尊严值: 90,
        认知阶段: '未觉醒',
        当前情绪: '淡漠',
        关键记忆: {
          订婚原因: '家族联姻，他的侧脸像顾衍辰',
          三次叫错名字: '订婚宴上、他生日、一次深夜电话——每次都装作没发生',
        },
      },
    },
  },
  {
    id: '偏执占有局',
    name: '偏执占有局',
    subtitle: '她的爱是一把没有钥匙的锁',
    description: '查手机、赶走他所有朋友、两年半的合照里他的表情逐渐变淡——她没注意到。她管这叫"在乎"。他管这叫"活不下去"。',
    difficulty: '★★★★',
    starCount: 4,
    era: 'modern',
    eraLabel: '现代',
    femaleLeadName: '沈琉璃',
    tags: [],
    initData: {
      系统: {
        当前剧本: '偏执占有局',
        当前场景: '一室一厅公寓·凌晨',
        当前时间: '2024-09-03 05:23',
      },
      女主: {
        名字: '沈琉璃',
        悔恨值: 0,
        执着度: 95,
        尊严值: 40,
        认知阶段: '未觉醒',
        当前情绪: '安心（熟睡中）',
        关键记忆: {
          控制升级: '逐步赶走他所有朋友；查手机成为日常',
          合照墙: '两年半的合照里他的表情逐渐变淡，她没注意到',
        },
      },
    },
  },
  {
    id: '青梅竹马局',
    name: '青梅竹马局',
    subtitle: '十二年情谊，她用一个转身碾碎',
    description: '高三她选了陆昭然，当着人面嘲笑他的告白。七年断联——她觉得都是小事。她不知道他膝盖跪坏过。',
    difficulty: '★★★',
    starCount: 3,
    era: 'modern',
    eraLabel: '校园',
    femaleLeadName: '姜棠',
    tags: [],
    initData: {
      系统: {
        当前剧本: '青梅竹马局',
        当前场景: '独居公寓·周六早晨',
        当前时间: '2024-10-12 09:40',
      },
      女主: {
        名字: '姜棠',
        悔恨值: 0,
        执着度: 50,
        尊严值: 85,
        认知阶段: '未觉醒',
        当前情绪: '期待（等他回消息）',
        关键记忆: {
          高三背叛: '选了陆昭然，当着人面嘲笑他的告白',
          七年断联: '她觉得都是小事，不知道他膝盖跪坏过',
        },
      },
    },
  },
  {
    id: '将门弃夫局',
    name: '将门弃夫局',
    subtitle: '新婚夜她面朝墙，如今你是王',
    description: '她当面朝墙睡了一夜，一语未发。三年戍边凯旋，他寄来的三封信，她一封没拆就退回。如今他披甲入城，她还在抄经。',
    difficulty: '★★★★',
    starCount: 4,
    era: 'ancient',
    eraLabel: '古风',
    femaleLeadName: '沈令仪',
    tags: [],
    initData: {
      系统: {
        当前剧本: '将门弃夫局',
        当前场景: '承天门大街·凯旋入城',
        当前时间: '仲秋午后',
      },
      女主: {
        名字: '沈令仪',
        悔恨值: 0,
        执着度: 20,
        尊严值: 95,
        认知阶段: '未觉醒',
        当前情绪: '平静（抄经中）',
        关键记忆: {
          新婚夜: '她面朝墙，一夜没说话',
          三封未拆信: '他寄来三封信，她一封没拆就退回了',
        },
      },
    },
  },
  {
    id: '仙门负心局',
    name: '仙门负心局',
    subtitle: '你把灵根渡给了她，她飞升了',
    description: '她不知道自己的灵根来自他。三年渡灵，她只说"师兄保重"，头都没抬。她在云端，他在泥里。',
    difficulty: '★★★★★',
    starCount: 5,
    era: 'xianxia',
    eraLabel: '仙侠',
    femaleLeadName: '顾清落',
    tags: [],
    initData: {
      系统: {
        当前剧本: '仙门负心局',
        当前场景: '散修坊市·周器师后院',
        当前时间: '清晨',
      },
      女主: {
        名字: '顾清落',
        悔恨值: 0,
        执着度: 10,
        尊严值: 100,
        认知阶段: '未觉醒',
        当前情绪: '无感（不知他的存在）',
        关键记忆: {
          渡灵三年: '她不知道自己的灵根来自他',
          最后一面: '她说"师兄保重"，头都没抬',
        },
      },
    },
  },
  {
    id: '迟暮仙途局',
    name: '迟暮仙途局',
    subtitle: '七十六岁觉醒顶级灵根，她在隔壁峰上',
    description: '她用一锭银子买断了六十年前的娃娃亲。他用六十年活完了一个凡人的一辈子。临终前测天石碎了——鸿蒙道骨。万年一遇。她在隔壁峰上质疑宗门不该浪费资源在他身上。她不知道他是谁。',
    difficulty: '★★★★★',
    starCount: 5,
    era: 'xianxia',
    eraLabel: '仙侠',
    femaleLeadName: '洛明月',
    tags: [],
    initData: {
      系统: {
        当前剧本: '迟暮仙途局',
        当前场景: '玄天宗太清峰·云海玉阁',
        当前时间: '正午',
      },
      女主: {
        名字: '洛明月',
        悔恨值: 0,
        执着度: 5,
        尊严值: 100,
        认知阶段: '未觉醒',
        当前情绪: '无感（不知他是谁）',
        关键记忆: {
          六十年前的银子: '五两银子放在木桩上，他没有接',
          仙凡殊途: '她转身走了，从此再没回过那个村子',
        },
      },
    },
  },
  {
    id: '山河故人局',
    name: '山河故人局',
    subtitle: '她的绝别信，你在碉堡前收到',
    description: '"对不起。我等不了了。"收信三天后他冲碉堡，左腿被子弹打穿。她不知道。她在租界，他在前线，一封信隔开生死。',
    difficulty: '★★★★★',
    starCount: 5,
    era: 'minguo',
    eraLabel: '民国',
    femaleLeadName: '沈书颜',
    tags: [],
    initData: {
      系统: {
        当前剧本: '山河故人局',
        当前场景: '英租界·听涛书屋二楼',
        当前时间: '深秋早晨',
      },
      女主: {
        名字: '沈书颜',
        悔恨值: 0,
        执着度: 35,
        尊严值: 75,
        认知阶段: '未觉醒',
        当前情绪: '压抑（不知今日重逢）',
        关键记忆: {
          绝别信: '"对不起。我等不了了。"',
          腿伤真相: '收信三天后冲碉堡，左腿被子弹打穿',
        },
      },
    },
  },
  {
    id: '傲娇回头局',
    name: '傲娇回头局',
    subtitle: '她当众说"就一舔狗"，他听见了',
    description: '食堂拐角，她跟闺蜜笑"什么男朋友？就一舔狗"。他手里奶茶冰都化了。八个月随叫随到、被贬低从不还嘴——她以为他永远不会走。',
    difficulty: '★★★',
    starCount: 3,
    era: 'modern',
    eraLabel: '校园',
    femaleLeadName: '陆念薇',
    tags: [],
    initData: {
      系统: {
        当前剧本: '傲娇回头局',
        当前场景: '大学食堂一楼拐角·午间',
        当前时间: '周四 11:47',
      },
      女主: {
        名字: '陆念薇',
        悔恨值: 0,
        执着度: 30,
        尊严值: 95,
        认知阶段: '未觉醒',
        当前情绪: '轻松（跟闺蜜聊天中）',
        关键记忆: {
          食堂那句话: '当着周甜甜的面说"什么男朋友？就一舔狗"',
          八个月: '他每天带早餐、随叫随到、被贬低从不还嘴',
        },
      },
    },
  },
  {
    id: '修罗逆天局',
    name: '修罗逆天局',
    subtitle: '她推他入渊，因果开始收债',
    description: '论道台上她一掌把他推下万魔渊，宋长庚拿走了他的剑骨。三年了，她把罪感消化成"必要的牺牲"，日子照过——她以为他死了。',
    difficulty: '★★★★★',
    starCount: 5,
    era: 'xianxia',
    eraLabel: '仙侠',
    femaleLeadName: '叶惊鸿',
    tags: [],
    initData: {
      系统: {
        当前剧本: '修罗逆天局',
        修罗主宰系统: '已激活',
        当前场景: '万魔渊底·尸骨堆',
        当前时间: '不知纪年',
      },
      女主: {
        名字: '叶惊鸿',
        悔恨值: 0,
        执着度: 20,
        尊严值: 80,
        认知阶段: '未觉醒',
        当前情绪: '无感（以为他死了）',
        关键记忆: {
          论道台一推: '她把他推下万魔渊，宋长庚拿走了他的剑骨',
          三年合理化: '把罪感消化成"必要的牺牲"，日子照过',
        },
      },
    },
  },
  {
    id: '炉鼎焚天局',
    name: '炉鼎焚天局',
    subtitle: '她的温柔是术，他是一味药引',
    description: '两年半双修，每一次温柔都是为了抽灵力。他灵根从九成降到三成。那夜他发烧灵力虚空，她站在床边三秒，转身走了。',
    difficulty: '★★★★',
    starCount: 4,
    era: 'xianxia',
    eraLabel: '仙侠',
    femaleLeadName: '柳映霜',
    tags: [],
    initData: {
      系统: {
        当前剧本: '炉鼎焚天局',
        当前场景: '青冥宗·双修密室',
        当前时间: '午后',
      },
      女主: {
        名字: '柳映霜',
        悔恨值: 0,
        执着度: 20,
        尊严值: 95,
        认知阶段: '未觉醒',
        当前情绪: '从容（刚完成一次抽取）',
        关键记忆: {
          两年半双修: '每次温柔都是为了抽灵力，他灵根从九成降到三成',
          雪夜三秒: '他发烧灵力虚空，她站在床边三秒转身走了',
        },
      },
    },
  },
  {
    id: '春闺薄幸局',
    name: '春闺薄幸局',
    subtitle: '高门嫡女下嫁寒门，心在旧人',
    description: '镇国公嫡女被迫下嫁七品寒门进士。新婚夜让他睡书房，自己在屋里哭旧情人。合欢香囊贴身带着，半年的饭减他的份例。',
    difficulty: '★★★★',
    starCount: 4,
    era: 'ancient',
    eraLabel: '古风',
    femaleLeadName: '沈令怡',
    tags: [],
    initData: {
      系统: {
        当前剧本: '春闺薄幸局',
        当前场景: '临安县衙后宅·书房',
        当前时间: '戌时末',
      },
      女主: {
        名字: '沈令怡',
        悔恨值: 0,
        执着度: 15,
        尊严值: 95,
        认知阶段: '未觉醒',
        当前情绪: '愉快（赏花归来）',
        关键记忆: {
          新婚夜的门: '让他睡书房，自己在屋里哭旧情人',
          合欢香囊: '旧情人沈玉衡所赠，贴身带着',
        },
      },
    },
  },
  {
    id: '霓虹碎影局',
    name: '霓虹碎影局',
    subtitle: '她说"嫁他是我喝醉了"，他听见了',
    description: '苏家千金喝醉答应穷记者求婚，酒醒后悔但退婚更丢脸。两年了，社交场合从不认他是丈夫，只说"认识的人"。',
    difficulty: '★★★★',
    starCount: 4,
    era: 'minguo',
    eraLabel: '民国',
    femaleLeadName: '苏锦瑟',
    tags: [],
    initData: {
      系统: {
        当前剧本: '霓虹碎影局',
        当前场景: '法租界·霞飞路小公寓',
        当前时间: '民国十七年·凌晨一点半',
      },
      女主: {
        名字: '苏锦瑟',
        悔恨值: 0,
        执着度: 10,
        尊严值: 95,
        认知阶段: '未觉醒',
        当前情绪: '倦怠（从百乐门归来）',
        关键记忆: {
          赌气下嫁: '喝醉答应穷记者求婚，酒醒后悔但退婚更丢脸',
          认识的人: '社交场合从不认他是丈夫，只说"认识的人"',
        },
      },
    },
  },
  {
    id: '情深不寿局',
    name: '情深不寿局',
    subtitle: '她把他踹开成"为他好"，他夺冠走了四年；她在巴黎追着他，才知道那句话错的是谁',
    description: '一段恋情重逢。微博年度报告爆出影后四年里主动搜他微博数千次——她最私密的"没断"被算法替她喊出来。道具戒指、经纪人的澄清稿、医院里被推开的恩人——壳一层层被穿。她在机场没拦住，找理由追到巴黎，在异乡的画廊里，她告诉他当年那句"为你好"是假的。情深者不寿。',
    difficulty: '★★★★',
    starCount: 4,
    era: 'modern',
    eraLabel: '现代',
    femaleLeadName: '林惊晚',
    tags: [],
    initData: {
      系统: {
        当前剧本: '情深不寿局',
        当前场景: 'A市·<user>下榻的酒店·高层',
        当前时间: '七夕前一天·凌晨两点',
      },
      女主: {
        名字: '林惊晚',
        悔恨值: 18,
        执着度: 70,
        尊严值: 85,
        认知阶段: '未觉醒',
        当前情绪: '被热搜烫到（强撑"我没事"）',
        关键记忆: {
          四年前偷拍: '评委席母亲问照片上的姑娘是谁，他谎称"我女朋友"',
          那首生日歌: '她从片场跑出来挤十分钟听他唱生日歌，他答应"你拿影后我给你拍一组新的"',
          那句为他好: '亲密过后主动提分手，理由是"你天天围着我转耽误你摄影了"',
          算命判词: '她"功成名就爱人在侧"，他"六亲缘浅孤鸾入命"',
          搜索数千次: '微博年度报告曝光：四年间主动搜索他微博达数千次',
        },
      },
      情深不寿局: {
        当前阶段: '热搜点燃',
        真相已知度: 0,
        羁绊值: 60,
        体面值: 90,
        人物: {
          陆知辰: { 好感度: 35, 立场: '互相成全', 当前状态: '住院中（主动推开林惊晚）' },
          沈霜月: { 好感度: 60, 立场: '懂但不说', 当前状态: '观察女儿多年，从不戳破' },
          周慎: { 好感度: 40, 立场: '职业护主', 当前状态: '准备替林惊晚发澄清稿' },
          老周: { 好感度: 70, 立场: '设局搭桥', 当前状态: '把<user>叫回国帮忙布光' },
        },
        剧情记录: {},
        舆情: { 热搜余温: 100 },
      },
    },
  },
]);

const filteredScripts = computed(() => {
  if (activeCategory.value === 'all') return scripts.value;
  return scripts.value.filter(s => s.era === activeCategory.value);
});

function openDetail(script: ScriptInfo) {
  detailScript.value = script;
  view.value = 'detail';
}

async function confirmSelect(script: ScriptInfo) {
  selectedScript.value = script;
  view.value = 'selected';

  updateVariablesWith(
    variables => {
      _.set(variables, 'stat_data', script.initData);
      return variables;
    },
    { type: 'message', message_id: -1 },
  );

  await createChatMessages([{ role: 'user', message: `（翻开了「${script.name}」的书页）` }]);
  await triggerSlash('/trigger');
}

function emberStyle(n: number) {
  const x = Math.sin(n * 2.1) * 40 + 50;
  const delay = (n * 0.25) % 3.5;
  const dur = 2.5 + (n % 3);
  const size = 2 + (n % 4);
  return {
    left: `${x}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
    width: `${size}px`,
    height: `${size}px`,
  };
}
</script>

<style lang="scss" scoped>
/* ═══════════════════════════════════════
   Transitions
   ═══════════════════════════════════════ */
.page-fade-enter-active {
  animation: fadeSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-fade-leave-active {
  animation: fadeSlideOut 0.25s cubic-bezier(0.4, 0, 1, 1);
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
@keyframes fadeSlideOut {
  from { opacity: 1; }
  to { opacity: 0; transform: translateY(-6px); }
}

.card-list-enter-active {
  animation: cardEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 0.05s);
}
.card-list-leave-active {
  animation: cardLeave 0.2s ease both;
}
.card-list-move {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes cardEnter {
  from { opacity: 0; transform: scale(0.92) translateY(8px); }
  to { opacity: 1; transform: none; }
}
@keyframes cardLeave {
  from { opacity: 1; }
  to { opacity: 0; transform: scale(0.95); }
}

/* ═══════════════════════════════════════
   Main Selector
   ═══════════════════════════════════════ */
.selector {
  padding: 24px 16px 20px;
  animation: selectorIn 0.5s ease both;
}
@keyframes selectorIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ═══ Header ═══ */
.selector-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-ornament {
  width: 50px;
  height: 12px;
  color: var(--sel-gold);
  .ornament-svg {
    width: 100%;
    height: 100%;
  }
}

.header-center {
  text-align: center;
}

.selector-title {
  font-family: var(--font-title);
  font-size: 20px;
  color: var(--sel-gold);
  letter-spacing: 10px;
  font-weight: normal;
  text-shadow: 0 0 24px rgba(201, 168, 76, 0.25);
}

.title-accent {
  width: 28px;
  height: 1.5px;
  margin: 5px auto;
  background: linear-gradient(90deg, transparent, var(--sel-accent), transparent);
  border-radius: 1px;
}

.selector-hint {
  font-size: 10.5px;
  color: var(--sel-text-muted);
  letter-spacing: 2.5px;
  margin-top: 3px;
}

/* ═══ Filter Bar ═══ */
.filter-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
  padding: 0 4px 10px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */

  /* Create an elegant mask effect for horizontal scroll */
  mask-image: linear-gradient(90deg, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, black 90%, transparent 100%);
}

.filter-bar::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.filter-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--sel-text-muted);
  font-family: var(--font-text);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  white-space: nowrap;

  .filter-icon {
    font-family: var(--font-title);
    font-size: 11px;
    opacity: 0.7;
  }

  &:hover {
    border-color: rgba(201, 168, 76, 0.2);
    color: var(--sel-text-sub);
    background: rgba(201, 168, 76, 0.04);
  }

  &.active {
    border-color: rgba(201, 168, 76, 0.3);
    color: var(--sel-gold);
    background: rgba(201, 168, 76, 0.08);
    box-shadow: 0 0 12px rgba(201, 168, 76, 0.08);

    .filter-icon {
      opacity: 1;
    }
  }
}

/* ═══ Script Grid ═══ */
.script-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* ═══ Script Card ═══ */
.script-card {
  --card-accent: var(--sel-accent);
  position: relative;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;

  &.modern { --card-accent: #c41e3a; }
  &.ancient { --card-accent: #b8860b; }
  &.xianxia { --card-accent: #5b8dd9; }
  &.minguo { --card-accent: #a07850; }
  &.strategy {
    --card-accent: #8b0000;
    grid-column: 1 / -1; /* Make the strategy card span full width to emphasize "Large Script" */
  }

  &.strategy .card-body {
    background: linear-gradient(145deg, rgba(30, 20, 10, 0.85), rgba(40, 15, 15, 0.9));
    border: 1px solid rgba(255, 215, 0, 0.15);
  }

  &:hover {
    .card-shimmer { opacity: 1; }
    .card-body {
      border-color: rgba(var(--card-accent-rgb, 196, 30, 58), 0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .card-arrow {
      opacity: 1;
      transform: translateX(0);
    }
    .card-title {
      text-shadow: 0 0 12px rgba(201, 168, 76, 0.3);
    }
  }

  &:active .card-body {
    transform: scale(0.97);
  }
}

.card-shimmer {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: radial-gradient(ellipse at 50% 0%, var(--card-accent), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
  filter: blur(16px);
  z-index: 0;
}

.card-body {
  position: relative;
  z-index: 1;
  background: var(--sel-card-bg);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 14px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  backdrop-filter: blur(4px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.card-era {
  font-size: 9.5px;
  color: var(--card-accent);
  letter-spacing: 2px;
  font-weight: 500;
  opacity: 0.85;
}

.card-difficulty {
  display: flex;
  gap: 3px;
  align-items: center;
}

.diff-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s;

  &.filled {
    background: var(--sel-gold);
    box-shadow: 0 0 3px rgba(201, 168, 76, 0.4);
  }
}

.card-title {
  font-family: var(--font-title);
  font-size: 15px;
  color: var(--sel-gold);
  font-weight: normal;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
  transition: text-shadow 0.3s;
}

.card-subtitle {
  font-size: 10.5px;
  color: var(--sel-text-sub);
  line-height: 1.6;
  margin-bottom: 12px;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.card-heroine {
  font-size: 11.5px;
  color: var(--sel-text);
  font-family: var(--font-title);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.heroine-mark {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--card-accent);
  box-shadow: 0 0 4px var(--card-accent);
}

.card-arrow {
  font-size: 16px;
  color: var(--sel-text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s ease;
  font-weight: 300;
}

/* ═══════════════════════════════════════
   Detail View
   ═══════════════════════════════════════ */
.detail {
  padding: 16px;
  min-height: 100%;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--sel-text-sub);
  font-family: var(--font-text);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.25s;
  margin-bottom: 20px;
  letter-spacing: 1px;

  .back-icon {
    font-size: 14px;
    line-height: 1;
    transition: transform 0.2s;
  }

  &:hover {
    border-color: rgba(201, 168, 76, 0.2);
    color: var(--sel-text);
    .back-icon { transform: translateX(-2px); }
  }
}

.detail-content {
  --card-accent: var(--sel-accent);
  &.modern { --card-accent: #c41e3a; }
  &.ancient { --card-accent: #b8860b; }
  &.xianxia { --card-accent: #5b8dd9; }
  &.minguo { --card-accent: #a07850; }
  &.strategy { --card-accent: #8b0000; }
}

.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-era {
  font-size: 10px;
  color: var(--card-accent);
  letter-spacing: 3px;
  font-weight: 500;
}

.detail-stars {
  .star {
    font-size: 11px;
    color: var(--sel-text-muted);
    margin-left: 1px;
    &.filled {
      color: var(--sel-gold);
      text-shadow: 0 0 4px rgba(201, 168, 76, 0.5);
    }
  }
}

.detail-title {
  font-family: var(--font-title);
  font-size: 22px;
  color: var(--sel-gold);
  letter-spacing: 3px;
  font-weight: normal;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.25);
}

.detail-tagline {
  font-size: 12px;
  color: var(--sel-text-sub);
  line-height: 1.7;
  letter-spacing: 0.5px;
  padding-left: 10px;
  border-left: 2px solid var(--card-accent);
  opacity: 0.85;
}

.detail-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
  justify-content: center;
}

.divider-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--card-accent);
  opacity: 0.5;
}

.divider-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
  opacity: 0.4;
}

.detail-desc {
  margin-bottom: 22px;

  p {
    font-size: 12px;
    color: var(--sel-text);
    line-height: 2;
    letter-spacing: 0.3px;
    opacity: 0.85;
  }
}

.detail-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 22px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 9.5px;
  color: var(--sel-text-muted);
  letter-spacing: 1.5px;
}

.info-value {
  font-size: 12px;
  color: var(--sel-text);
  font-family: var(--font-title);
  letter-spacing: 0.5px;

  &.heroine-name {
    color: var(--card-accent);
  }

  .star-sm {
    font-size: 9px;
    color: var(--sel-text-muted);
    &.filled {
      color: var(--sel-gold);
    }
  }
}

.detail-memories {
  margin-bottom: 28px;
}

.memories-label {
  font-size: 10px;
  color: var(--sel-text-muted);
  letter-spacing: 2px;
  margin-bottom: 10px;
  font-weight: normal;
}

.memory-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.memory-item {
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 2px solid var(--card-accent);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.memory-key {
  font-size: 10px;
  color: var(--sel-text-muted);
  letter-spacing: 1px;
}

.memory-val {
  font-size: 11.5px;
  color: var(--sel-text);
  line-height: 1.6;
  opacity: 0.9;
}

/* ═══ Select Button ═══ */
.select-btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 14px 0;
  border: 1px solid var(--card-accent);
  border-radius: 8px;
  background: rgba(var(--card-accent-rgb, 196, 30, 58), 0.08);
  color: var(--sel-text);
  font-family: var(--font-title);
  font-size: 14px;
  letter-spacing: 4px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(var(--card-accent-rgb, 196, 30, 58), 0.15);
    box-shadow: 0 0 24px rgba(var(--card-accent-rgb, 196, 30, 58), 0.2);
    transform: translateY(-1px);

    .btn-glow {
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 100%, var(--card-accent), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  filter: blur(12px);
}

/* ═══════════════════════════════════════
   Selected Scene
   ═══════════════════════════════════════ */
.selected-scene {
  position: relative;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  overflow: hidden;
}

.embers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ember {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background: var(--sel-accent);
  opacity: 0;
  animation: rise linear infinite;
  box-shadow: 0 0 6px var(--sel-accent);
}

@keyframes rise {
  0% { opacity: 0; transform: translateY(0) scale(1); }
  15% { opacity: 0.9; }
  75% { opacity: 0.4; }
  100% { opacity: 0; transform: translateY(-140px) scale(0.2); }
}

.selected-content {
  text-align: center;
  animation: fadeSlideIn 0.6s ease;
  position: relative;
  z-index: 1;
}

.book-icon {
  font-size: 32px;
  margin-bottom: 14px;
  animation: bookFloat 2.5s ease-in-out infinite;
}
@keyframes bookFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
}

.selected-title {
  font-family: var(--font-title);
  font-size: 18px;
  color: var(--sel-gold);
  letter-spacing: 5px;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.4);
}

.selected-sub {
  font-size: 11.5px;
  color: var(--sel-text-muted);
  letter-spacing: 2px;
  margin-bottom: 18px;
}

.loading-bar {
  width: 100px;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 1px;
  margin: 0 auto;
  overflow: hidden;
}

.loading-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sel-accent), var(--sel-gold));
  border-radius: 1px;
  animation: loadProgress 2s ease-in-out infinite;
}
@keyframes loadProgress {
  0% { width: 0; transform: translateX(0); }
  50% { width: 70%; }
  100% { width: 100%; }
}
</style>
