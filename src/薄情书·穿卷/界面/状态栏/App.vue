<template>
  <div class="stat-bar" v-if="store.data">
    <!-- 环境光晕已改为静态径向渐变直接画进 .stat-bar 背景（替代 3 个 blur aurora，零动画开销） -->
    <!-- 流光扫边 —— transform 驱动，无 mix-blend 合成开销 -->
    <div class="edge-sweep"></div>
    <!-- 浮尘粒子 —— 仅 transform/opacity 合成动画 -->
    <div class="dust-field">
      <span class="dust d1"></span>
      <span class="dust d2"></span>
      <span class="dust d3"></span>
      <span class="dust d4"></span>
    </div>
    <!-- 噪点纹理 —— 静态低透叠加（无 mix-blend） -->
    <div class="glass-noise"></div>

    <div class="bar-content" v-if="store.data.系统.当前剧本 === '情深不寿局'">
      <PhaseTrackQSBS :phase="store.data.情深不寿局.当前阶段" />
      <SceneInfo :scene="store.data.系统.当前场景" :time="store.data.系统.当前时间" />
      <div class="divider"></div>
      <HeroinePanel
        :name="store.data.女主.名字"
        :regret="store.data.女主.悔恨值"
        :determination="store.data.女主.执着度"
        :dignity="store.data.女主.尊严值"
        :cognition="store.data.女主.$认知标签"
        :emotion="store.data.女主.当前情绪"
      />
      <QingshenPanel
        :truth="store.data.情深不寿局.真相已知度"
        :bond="store.data.情深不寿局.羁绊值"
        :dignity="store.data.情深不寿局.体面值"
        :gossip="store.data.情深不寿局.舆情.热搜余温"
      />
      <RelationPanel :relations="store.data.情深不寿局.人物" v-if="store.data.情深不寿局.人物 && Object.keys(store.data.情深不寿局.人物).length > 0" />
      <MemoryPanel :memories="store.data.女主.关键记忆" />
    </div>

    <!-- 纨绔世子专属面板 -->
    <div class="bar-content" v-else-if="store.data.系统.当前剧本 === '纨绔世子'">
      <PhaseTrackWKSZ :phase="store.data.纨绔世子.当前阶段" />
      <SceneInfo :scene="store.data.系统.当前场景" :time="store.data.系统.当前时间" />
      <div class="divider"></div>
      <WorldPrincePanel :stats="store.data.纨绔世子.势力" :personal="store.data.纨绔世子.个人" />
      <CourtPanel :court="store.data.纨绔世子.朝局" />
      <RelationPanel :relations="store.data.纨绔世子.人际网络" />
    </div>

    <!-- 默认女主面板 -->
    <div class="bar-content" v-else>
      <PhaseTrack :stage="store.data.女主.认知阶段" :script="store.data.系统.当前剧本" />
      <SceneInfo :scene="store.data.系统.当前场景" :time="store.data.系统.当前时间" />
      <div class="divider"></div>
      <HeroinePanel
        :name="store.data.女主.名字"
        :regret="store.data.女主.悔恨值"
        :determination="store.data.女主.执着度"
        :dignity="store.data.女主.尊严值"
        :cognition="store.data.女主.$认知标签"
        :emotion="store.data.女主.当前情绪"
      />
      <MemoryPanel :memories="store.data.女主.关键记忆" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';
import PhaseTrack from './components/PhaseTrack.vue';
import SceneInfo from './components/SceneInfo.vue';
import HeroinePanel from './components/HeroinePanel.vue';
import MemoryPanel from './components/MemoryPanel.vue';
import PhaseTrackWKSZ from './components/PhaseTrackWKSZ.vue';
import PhaseTrackQSBS from './components/PhaseTrackQSBS.vue';
import WorldPrincePanel from './components/WorldPrincePanel.vue';
import CourtPanel from './components/CourtPanel.vue';
import RelationPanel from './components/RelationPanel.vue';
import QingshenPanel from './components/QingshenPanel.vue';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.stat-bar {
  --bar-w: 360px;
  width: 100%;
  max-width: var(--bar-w);
  margin: 10px auto;
  position: relative;
  border-radius: 10px;
  /* 仿毛玻璃：半透明深底 + 多层柔和渐变 + 静态暮色光晕（替代原 3 个 blur aurora） */
  background:
    /* 三个静态光晕 —— 暖金/暮橘/暗金，固定不动，零 GPU 卷积 */
    radial-gradient(ellipse 55% 50% at 12% 8%, var(--aurora-a) 0%, transparent 60%),
    radial-gradient(ellipse 60% 55% at 88% 35%, var(--aurora-b) 0%, transparent 65%),
    radial-gradient(ellipse 50% 45% at 50% 95%, var(--aurora-c) 0%, transparent 60%),
    /* 玻璃透光渐变 */
    linear-gradient(160deg, var(--haze-strong) 0%, transparent 40%),
    linear-gradient(20deg, transparent 60%, var(--haze) 100%),
    radial-gradient(ellipse 120% 80% at 50% 0%, var(--glass-light) 0%, var(--glass) 60%, var(--glass-deep) 100%);
  /* 边缘高光 + 内阴影 —— 玻璃质感的核心 */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 var(--edge-light),
    inset 0 -1px 0 var(--edge-dim),
    inset 0 0 0 1px var(--edge-dim);
  animation: panelReveal 0.7s var(--ease-out-expo) both;
  overflow: hidden;
}

@keyframes panelReveal {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: none; }
}

/* 流光扫边 —— 改用 transform 平移伪元素，去掉 mix-blend-mode 与 background-position 动画 */
.edge-sweep {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}
.edge-sweep::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  transform: translateX(-150%) skewX(-18deg);
  background: linear-gradient(90deg, transparent, rgba(255, 238, 210, 0.1), rgba(255, 238, 210, 0.16), rgba(255, 238, 210, 0.1), transparent);
  animation: edgeSweep 7s var(--ease-in-out-quart) infinite;
}

@keyframes edgeSweep {
  0% { transform: translateX(-150%) skewX(-18deg); }
  60%, 100% { transform: translateX(380%) skewX(-18deg); }
}

/* 浮尘粒子 —— 空气微尘上浮（仅 transform/opacity，合成层友好） */
.dust-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.dust {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--aqua-bright);
  box-shadow: 0 0 4px var(--aqua-glow);
  opacity: 0;
  will-change: transform, opacity;
}

.d1 { left: 18%; bottom: 0; animation: dustFloat 11s 0s var(--ease-in-out-quart) infinite; }
.d2 { left: 42%; bottom: 0; animation: dustFloat 13s 2.5s var(--ease-in-out-quart) infinite; }
.d3 { left: 68%; bottom: 0; animation: dustFloat 12s 5s var(--ease-in-out-quart) infinite; }
.d4 { left: 86%; bottom: 0; animation: dustFloat 14s 1.2s var(--ease-in-out-quart) infinite; }

@keyframes dustFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  15% { opacity: 0.6; }
  85% { opacity: 0.45; }
  100% { transform: translateY(-200px) translateX(10px); opacity: 0; }
}

/* 噪点 —— 静态低透叠加（去掉 mix-blend-mode overlay，避免整层合成） */
.glass-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 0;
}

.bar-content {
  position: relative;
  z-index: 2;
  padding: 20px 22px 18px;
}

.divider {
  height: 1px;
  margin: 16px 0;
  background: linear-gradient(90deg, transparent, var(--line), transparent);
}
</style>
