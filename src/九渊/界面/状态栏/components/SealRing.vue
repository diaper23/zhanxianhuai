<template>
  <div class="ring-stage" :class="{ danger: value >= 60 }" :style="{ width: (size ?? 76) + 'px', height: (size ?? 76) + 'px' }">
    <!-- 旋转法阵：外圈符文环 -->
    <svg viewBox="0 0 100 100" class="array array-outer">
      <circle cx="50" cy="50" r="47" class="arc-ring" />
      <g v-for="t in 48" :key="'t' + t" :transform="`rotate(${t * 7.5} 50 50)`" class="tick">
        <line x1="50" y1="3.5" x2="50" y2="6" />
      </g>
      <g v-for="i in 4" :key="'r' + i" :transform="`rotate(${i * 90} 50 50)`" class="rune-glyph">
        <path d="M 50 1.5 L 52.5 4.5 L 50 7.5 L 47.5 4.5 Z" />
        <circle cx="50" cy="10" r="0.9" />
      </g>
    </svg>
    <!-- 反向旋转的内虚环 -->
    <svg viewBox="0 0 100 100" class="array array-mid">
      <circle cx="50" cy="50" r="40" class="dashed-ring" />
      <circle cx="50" cy="50" r="34" class="faint-ring" />
    </svg>
    <!-- 九刻主环 -->
    <svg viewBox="0 0 64 64" class="ring-svg">
      <g
        v-for="i in 9"
        :key="i"
        class="seg"
        :class="{ on: i <= lit, danger: i >= 7 }"
        :style="{ transitionDelay: `${i * 45}ms` }"
        :transform="`rotate(${(i - 1) * 40 + 90 - 14} 32 32)`"
      >
        <path d="M 32 7 A 25 25 0 0 1 45.4 10.9 L 43.4 14.6 A 21 21 0 0 0 32 11 Z" />
      </g>
      <circle cx="32" cy="32" r="19" class="ring-inner" />
      <text x="32" y="30" class="ring-num">{{ displayNum }}</text>
      <text x="32" y="40" class="ring-cap">{{ caption }}</text>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ value: number; size?: number }>();
const lit = computed(() => Math.max(0, Math.min(9, Math.round((props.value / 100) * 9))));
const displayNum = computed(() => Math.round(props.value));
const caption = computed(() => (props.value >= 80 ? '渊动' : props.value >= 60 ? '失固' : props.value <= 20 ? '紧固' : '守恒'));
</script>
<style>
.ring-stage { flex-shrink: 0; position: relative; }
.ring-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.array-outer { animation: spinCW 60s linear infinite; }
.array-mid { animation: spinCCW 45s linear infinite; }
@keyframes spinCW { to { transform: rotate(360deg); } }
@keyframes spinCCW { to { transform: rotate(-360deg); } }

.arc-ring { fill: none; stroke: rgba(201, 168, 106, 0.5); stroke-width: 0.7; }
.tick line { stroke: rgba(201, 168, 106, 0.62); stroke-width: 0.8; }
.rune-glyph path { fill: rgba(127, 184, 164, 0.7); }
.rune-glyph circle { fill: rgba(127, 184, 164, 0.55); }
.dashed-ring { fill: none; stroke: rgba(127, 184, 164, 0.42); stroke-width: 0.6; stroke-dasharray: 3 5; }
.faint-ring { fill: none; stroke: rgba(216, 207, 191, 0.14); stroke-width: 0.5; }

.ring-stage .seg path { fill: rgba(169, 159, 141, 0.22); transition: fill 0.5s; }
.ring-stage .seg.on path { fill: rgba(127, 184, 164, 0.9); filter: drop-shadow(0 0 2.5px rgba(127, 184, 164, 0.7)); }
.ring-stage .seg.on.danger path { fill: rgba(194, 94, 94, 0.95); filter: drop-shadow(0 0 3px rgba(194, 94, 94, 0.8)); }
.ring-inner { fill: rgba(10, 12, 15, 0.78); stroke: rgba(201, 168, 106, 0.45); stroke-width: 0.8; }
.ring-num { font-family: var(--f-num); font-size: 16px; font-weight: bold; fill: var(--paper); text-anchor: middle; dominant-baseline: middle; }
.ring-cap { font-family: var(--f-title); font-size: 7.5px; letter-spacing: 2px; fill: var(--paper-dim); text-anchor: middle; }
.ring-stage.danger .ring-num { fill: var(--cinnabar); }
.ring-stage.danger .ring-cap { fill: var(--cinnabar); }
.ring-stage.danger .tick line { stroke: rgba(194, 94, 94, 0.55); }
.ring-stage.danger .rune-glyph path { fill: rgba(194, 94, 94, 0.6); }
@media (prefers-reduced-motion: reduce) {
  .array-outer, .array-mid { animation: none; }
}
</style>
