<template>
  <canvas ref="cv" class="qi-canvas"></canvas>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const cv = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let ro: ResizeObserver | null = null;

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = cv.value;
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  let w = 0, h = 0;
  const fit = () => {
    const r = c.parentElement?.getBoundingClientRect();
    if (!r) return;
    w = c.width = r.width;
    h = c.height = r.height;
  };
  fit();
  ro = new ResizeObserver(fit);
  if (c.parentElement) ro.observe(c.parentElement);

  type P = { x: number; y: number; r: number; s: number; gold: boolean; a: number; ph: number };
  const ps: P[] = Array.from({ length: 34 }, () => ({
    x: Math.random() * 500,
    y: Math.random() * 800,
    r: 0.5 + Math.random() * 1.7,
    s: 0.1 + Math.random() * 0.28,
    gold: Math.random() > 0.72,
    a: 0.06 + Math.random() * 0.2,
    ph: Math.random() * Math.PI * 2,
  }));
  let t = 0;
  const tick = () => {
    t += 0.016;
    ctx.clearRect(0, 0, w, h);
    for (const p of ps) {
      p.y -= p.s;
      p.x += Math.sin(t * 0.8 + p.ph) * 0.14;
      if (p.y < -4) {
        p.y = h + 4;
        p.x = Math.random() * w;
      }
      const flicker = p.a * (0.65 + 0.35 * Math.sin(t * 2.2 + p.ph));
      ctx.beginPath();
      ctx.fillStyle = p.gold ? `rgba(201,168,106,${flicker})` : `rgba(127,184,164,${flicker})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  tick();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  ro?.disconnect();
});
</script>
<style>
.qi-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
