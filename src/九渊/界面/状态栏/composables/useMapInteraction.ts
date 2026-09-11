import { onBeforeUnmount, onMounted } from 'vue';

export function useMapInteraction(viewportRef: () => HTMLElement | null, contentRef: () => HTMLElement | null) {
  let scale = 1, posX = 0, posY = 0;
  let isDragging = false, startX = 0, startY = 0;
  let initialDistance = 0, initialScale = 1;

  function updateTransform() {
    const vp = viewportRef(), ct = contentRef();
    if (!vp || !ct) return;
    const max = (scale - 1) * vp.clientWidth;
    posX = Math.max(-max, Math.min(0, posX));
    posY = Math.max(-max, Math.min(0, posY));
    ct.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }

  function onMD(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('.hotspot,.map-info-modal')) return;
    isDragging = true; startX = e.clientX - posX; startY = e.clientY - posY;
  }
  function onMM(e: MouseEvent) { if (!isDragging) return; posX = e.clientX - startX; posY = e.clientY - startY; updateTransform(); }
  function onMU() { isDragging = false; }
  function onW(e: WheelEvent) {
    e.preventDefault();
    const vp = viewportRef(); if (!vp) return;
    const old = scale;
    scale = e.deltaY < 0 ? Math.min(scale + 0.1, 3) : Math.max(scale - 0.1, 1);
    const r = vp.getBoundingClientRect();
    posX = (e.clientX - r.left) - ((e.clientX - r.left) - posX) * (scale / old);
    posY = (e.clientY - r.top) - ((e.clientY - r.top) - posY) * (scale / old);
    updateTransform();
  }
  function onTS(e: TouchEvent) {
    if ((e.target as HTMLElement).closest('.hotspot,.map-info-modal')) return;
    if (e.touches.length === 1) { isDragging = true; startX = e.touches[0].clientX - posX; startY = e.touches[0].clientY - posY; }
    else if (e.touches.length === 2) { isDragging = false; initialDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); initialScale = scale; }
  }
  function onTM(e: TouchEvent) {
    if ((e.target as HTMLElement).closest('.hotspot,.map-info-modal')) return;
    e.preventDefault();
    if (isDragging && e.touches.length === 1) { posX = e.touches[0].clientX - startX; posY = e.touches[0].clientY - startY; updateTransform(); }
    else if (e.touches.length === 2) { scale = Math.min(Math.max(initialScale * (Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY) / initialDistance), 1), 3); updateTransform(); }
  }
  function onTE() { isDragging = false; }

  onMounted(() => {
    const vp = viewportRef(); if (!vp) return;
    vp.addEventListener('mousedown', onMD); window.addEventListener('mousemove', onMM); window.addEventListener('mouseup', onMU);
    vp.addEventListener('wheel', onW, { passive: false });
    vp.addEventListener('touchstart', onTS, { passive: false }); vp.addEventListener('touchmove', onTM, { passive: false }); vp.addEventListener('touchend', onTE);
  });
  onBeforeUnmount(() => {
    const vp = viewportRef(); if (!vp) return;
    vp.removeEventListener('mousedown', onMD); window.removeEventListener('mousemove', onMM); window.removeEventListener('mouseup', onMU);
    vp.removeEventListener('wheel', onW);
    vp.removeEventListener('touchstart', onTS); vp.removeEventListener('touchmove', onTM); vp.removeEventListener('touchend', onTE);
  });
}
