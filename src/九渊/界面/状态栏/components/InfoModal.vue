<template>
  <Teleport to="body">
    <div v-if="open" class="modal-mask" @click="$emit('close')">
      <div class="modal-box" @click.stop>
        <div class="modal-head">
          <span class="modal-title">{{ title }}</span>
          <span class="modal-close" @click="$emit('close')">✕</span>
        </div>
        <div class="modal-body">{{ body }}</div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
defineProps<{ open: boolean; title: string; body: string }>();
defineEmits<{ close: [] }>();
</script>
