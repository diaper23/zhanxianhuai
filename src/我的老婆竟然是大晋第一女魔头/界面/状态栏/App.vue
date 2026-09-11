<template>
  <div class="stat-bar" v-if="store.data">
    <!-- 顶部极简情报 -->
    <div class="top-brief">
      <div class="brief-item"><span>岁次</span><span class="val">{{ store.data.世界.当前时间 || '—' }}</span></div>
      <div class="brief-item"><span>分野</span><span class="val">{{ store.data.世界.当前地点 || '—' }}</span></div>
      <div class="brief-item"><span>官阶</span><span class="val">{{ store.data.用户.当前官职 || '—' }}</span></div>
      <div class="brief-item"><span>名望</span><span class="val gold-glow">{{ store.data.用户.名望 ?? '—' }}</span></div>
      <div class="brief-item"><span>武功</span><span class="val">{{ store.data.用户.武功境界 || '—' }}</span></div>
      <div class="brief-item"><span>所在</span><span class="val">{{ store.data.用户.所在地 || '—' }}</span></div>
      <div class="brief-item brief-wide"><span>动向</span><span class="val">{{ store.data.用户.当前行动 || '—' }}</span></div>
    </div>

    <!-- 导航切页 -->
    <div class="nav-tabs">
      <div class="tab-btn" :class="{ active: activeTab === 'heroines' }" @click="activeTab = 'heroines'">红颜录</div>
      <div class="tab-btn" :class="{ active: activeTab === 'world' }" @click="activeTab = 'world'">天下局</div>
      <div class="tab-btn" :class="{ active: activeTab === 'plots' }" @click="activeTab = 'plots'">演命盘</div>
    </div>

    <!-- 视图内容 -->
    <div class="tab-content-wrap">
      <transition name="fade-slide" mode="out-in">
        <!-- 红颜录 -->
        <div v-if="activeTab === 'heroines'" class="heroines-list" key="heroines">
          <HeroineCard
            name="谢秋瞳" cls="xqt"
            avatar="https://zora404.ccwu.cc/file/1782989418980_IMG_20260702_184723.png"
            :affection="store.data.谢秋瞳.态度" affection-range="-100~100" affection-name="态度"
            :sub-a="store.data.谢秋瞳.$关系阶段" sub-a-label="关系"
            :sub-b="store.data.谢秋瞳.身体状态" sub-b-label="贵体"
            :mood="store.data.谢秋瞳.当前打算" mood-label="谋算"
            bar-color="linear-gradient(90deg, rgba(225,29,72,0.3), #e11d48)"
            @viewImage="openImage"
          />
          <HeroineCard
            name="喜儿" cls="xer"
            avatar="https://zora404.ccwu.cc/file/1782989442434_喜儿.png"
            :affection="store.data.喜儿.好感" affection-range="-50~100" affection-name="好感"
            :sub-a="store.data.喜儿.所在地" sub-a-label="踪迹"
            :sub-b="store.data.喜儿.当前任务" sub-b-label="任务"
            :mood="store.data.喜儿.当前态度" mood-label="心绪"
            bar-color="linear-gradient(90deg, rgba(192,38,211,0.3), #c026d3)"
            @viewImage="openImage"
          />
          <HeroineCard
            name="王徽" cls="wh"
            avatar="https://zora404.ccwu.cc/file/1782995780080_IMG_20260702_203434.png"
            :affection="store.data.王徽.好感" affection-range="0~100" affection-name="好感"
            :sub-a="store.data.王徽.所在地" sub-a-label="踪迹"
            :sub-b="store.data.王徽.当前处境" sub-b-label="处境"
            :mood="store.data.王徽.当前状态" mood-label="心绪"
            bar-color="linear-gradient(90deg, rgba(13,148,136,0.3), #0d9488)"
            @viewImage="openImage"
          />
        </div>

        <!-- 天下局 -->
        <div v-else-if="activeTab === 'world'" class="world-view" key="world">
          <div class="dossier-card" v-if="hasAffairs">
            <div class="dc-title"><span class="title-deco"></span>近期事务<span class="title-deco"></span></div>
            <div class="dc-list">
              <div v-for="(desc, name) in store.data.世界.近期事务" :key="name" class="dc-item">
                <span class="dc-text"><span class="dc-highlight">「{{ name }}」</span>{{ desc }}</span>
              </div>
            </div>
          </div>
          <div class="dossier-card" v-else>
            <div class="empty-state">天下承平，暂无大事。</div>
          </div>

          <div class="dossier-card" v-if="hasFactions" style="margin-top: 16px;">
            <div class="dc-title"><span class="title-deco"></span>天下暗潮<span class="title-deco"></span></div>
            <div class="faction-grid">
              <div v-for="(status, name) in store.data.势力动向" :key="name" class="faction-box">
                <div class="fac-name">{{ name }}</div>
                <div class="fac-status">{{ status }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 演命盘 -->
        <div v-else-if="activeTab === 'plots'" class="plots-view" key="plots">
          <div class="dossier-card" v-if="activePlots.length">
            <div class="dc-title"><span class="title-deco"></span>剧情推演<span class="title-deco"></span></div>
            <div class="dc-list">
              <div v-for="p in activePlots" :key="p.key" class="dc-item plot-item">
                <div class="plot-header">
                  <span class="dc-dot active-dot"></span>
                  <span class="dc-highlight">{{ p.name }}</span>
                </div>
                <div class="plot-latest" v-if="p.latest">{{ p.latest }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">命盘沉寂，暂无波澜。</div>
        </div>
      </transition>
    </div>

    <!-- 大图查看器 -->
    <transition name="fade">
      <div class="lightbox" v-if="viewerImage" @click="closeImage">
        <div class="lb-close">×</div>
        <img :src="viewerImage" class="lb-img" @click.stop />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();

// 导航状态
const activeTab = ref('heroines');

// 立绘查看器逻辑
const viewerImage = ref<string | null>(null);
const openImage = (url: string) => { viewerImage.value = url; };
const closeImage = () => { viewerImage.value = null; };

const hasAffairs = computed(() => {
  const a = store.data.世界.近期事务;
  return a && typeof a === 'object' && Object.keys(a).length > 0;
});

const activePlots = computed(() => {
  const plots = store.data.剧情要点?.状态表;
  if (!plots || typeof plots !== 'object') return [];
  return Object.entries(plots)
    .filter(([, v]) => v.状态 === '进行中')
    .map(([key, v]) => ({
      key,
      name: v.剧情名,
      latest: v.进程?.length ? v.进程[v.进程.length - 1] : '',
    }));
});

const hasFactions = computed(() => {
  const f = store.data.势力动向;
  return f && typeof f === 'object' && Object.keys(f).length > 0;
});
</script>

<script lang="ts">
import { defineComponent, h, computed } from 'vue';

const HeroineCard = defineComponent({
  props: {
    name: String, cls: String, avatar: String,
    affection: Number, affectionRange: String, affectionName: String,
    subA: String, subALabel: String,
    subB: String, subBLabel: String,
    mood: String, moodLabel: String,
    barColor: String,
  },
  emits: ['viewImage'],
  setup(props, { emit }) {
    const rangeParts = props.affectionRange?.split('~') || ['0', '100'];
    const lo = Number(rangeParts[0]);
    const hi = Number(rangeParts[1]);
    const pct = computed(() => Math.max(0, Math.min(100, ((props.affection ?? 0) - lo) / (hi - lo) * 100)));
    
    const tagInfo = computed(() => {
      const p = pct.value;
      if (p >= 70) return { cls: 'tag-good', text: props.name === '谢秋瞳' ? '信赖' : props.name === '喜儿' ? '依恋' : '倾心' };
      if (p >= 40) return { cls: 'tag-mid', text: props.name === '谢秋瞳' ? '合作' : '在意' };
      return { cls: 'tag-bad', text: props.name === '谢秋瞳' ? '敌对' : props.name === '喜儿' ? '警惕' : '观望' };
    });

    return () => h('div', { class: ['heroine-card', props.cls] }, [
      h('div', { class: 'hc-main' }, [
        // 左侧：头像
        props.avatar ? h('div', { class: 'hc-avatar-wrap', onClick: () => emit('viewImage', props.avatar), title: '点击查看立绘' }, [
          h('img', { class: 'hc-avatar', src: props.avatar, alt: props.name }),
          h('div', { class: 'hc-avatar-mask' }, '🔍')
        ]) : h('div', { class: 'hc-avatar-placeholder' }),
        
        // 右侧：信息区
        h('div', { class: 'hc-info' }, [
          h('div', { class: 'hc-title-row' }, [
            h('span', { class: 'hc-name' }, props.name),
            h('span', { class: 'hc-tag ' + tagInfo.value.cls }, tagInfo.value.text),
          ]),
          h('div', { class: 'hc-bar-row' }, [
            h('span', { class: 'hc-bar-lbl' }, props.affectionName),
            h('div', { class: 'hc-bar-bg' }, [
              h('div', { class: 'hc-bar-fill', style: { width: pct.value + '%', background: props.barColor } })
            ]),
            h('span', { class: 'hc-bar-val' }, String(props.affection ?? '—'))
          ]),
          h('div', { class: 'hc-grid' }, [
            h('div', { class: 'hc-fld' }, [h('span', { class: 'hc-fld-lbl' }, props.subALabel), h('span', { class: 'hc-fld-val' }, props.subA || '—')]),
            h('div', { class: 'hc-fld' }, [h('span', { class: 'hc-fld-lbl' }, props.subBLabel), h('span', { class: 'hc-fld-val' }, props.subB || '—')]),
          ])
        ])
      ]),
      // 下部：心境
      h('div', { class: 'hc-mood' }, [
        h('span', { class: 'hc-mood-val' }, props.mood || '—')
      ])
    ]);
  },
});

export default { components: { HeroineCard } };
</script>