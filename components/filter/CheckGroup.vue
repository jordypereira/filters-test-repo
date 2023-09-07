<template>
  <div class="check-group" data-test="collections-group">
    <label
      v-for="option in options.slice(0, 8)"
      :key="option.value"
      :for="`option-${option.value.replace('!!', '')}`"
      :class="{ active: option.selected, disabled: option.disabled }"
      :data-gtm-label-filter="option.value"
      data-test="collection-button"
    >
      <FilterImage :length-type="option.value" />
      <input
        :id="`option-${option.value.replace('!!', '')}`"
        type="checkbox"
        :value="option.value"
        :aria-label="`${$t(option.value)}`"
        :aria-checked="option.selected"
        :checked="option.selected"
        :disabled="option.disabled"
        tabindex="0"
        @change="$emit('apply', option.value)"
      />
      <span aria-hidden="true">{{ $t(option.value) }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { FilterFacet, FilterFacetKeys } from 'types/models/facet.model'

interface Props {
  options: FilterFacet['values']
  filterKey: FilterFacetKeys
}
interface Emits {
  (e: 'apply', filterFacetValue: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style lang="scss" scoped>
@import '~/assets/scss/rules/breakpoints';
@import '~/assets/scss/typography/body';

.check-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding-bottom: var(--spacing-m);
}

label {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  border: 1px solid var(--gray-dark);
  padding: 0.8rem 1.6rem;
  border-radius: 0.2rem;
  cursor: pointer;
  gap: 1.2rem;

  &.active,
  &:hover {
    border-color: var(--black);
  }

  &.active {
    background-color: var(--black);

    span {
      color: var(--white);
    }

    img {
      filter: invert(1);
    }
  }

  &.disabled {
    pointer-events: none;

    span {
      color: var(--gray-dark);
    }
  }

  span {
    @include body2;

    &.bold {
      font-weight: bold;
    }
  }

  input {
    position: absolute;
    opacity: 0;
  }
}
</style>
