<template>
  <div :class="['circle', { checked: checked }]" :style="`background:${color};`">
    <div v-if="checked" :class="['smile', { white: isDark }]"></div>
  </div>
</template>

<script lang="ts" setup>
import { isDarkColor } from 'types/models/facet.model'

const props = defineProps<{
  checked: boolean
  color: string
}>()

const isDark = computed(() => {
  return isDarkColor(props.color)
})
</script>

<style lang="scss" scoped>
.circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid var(--gray-light);
}

.smile {
  pointer-events: none;
}

svg path {
  fill: var(--black);
  stroke: var(--black);
}

div.white svg path {
  fill: var(--white);
  stroke: var(--white);
}

@media (hover: hover) and (pointer: fine) {
  .circle:hover:not(.checked) {
    transform: scale(1.2);
  }
}
</style>
