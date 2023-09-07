<template>
  <div class="color-options-group" data-test="color-selection-group">
    <label
      v-for="option in options"
      :key="option.value"
      :for="`option-${option.value}`"
      :data-gtm-label-filter="option.value"
      :class="['option-container', { active: option.selected, disabled: option.disabled }]"
      data-test="color-selection-button"
    >
      <input
        :id="`option-${option.value}`"
        type="checkbox"
        :value="option.value"
        :aria-label="`${$t(option.value)}`"
        :aria-checked="option.selected"
        :checked="option.selected"
        tabindex="0"
        @change="onApply(option.value)"
      />

      <FilterToggleSmileIcon
        :checked="option.selected"
        :color="getColor(option.value)"
        aria-hidden="true"
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

const emit = defineEmits<Emits>()

const getColor = (value: string) => {
  return value.split('-').pop()
}

const onApply = (value: string) => {
  try {
    emit('apply', value)
  } catch (error) {
    console.error(error)
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/rules/breakpoints';
@import '~/assets/scss/typography/body';

input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
  border-radius: 0 !important;
  top: 0;
  left: 0;
  opacity: 0;
  position: absolute;
}

.color-options-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-items: center;
  padding-bottom: var(--spacing-m);
}

.option-container {
  position: relative;
  display: flex;
  justify-items: center;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid var(--gray-dark);
  padding: 0.8rem 1.6rem;
  border-radius: 0.2rem;
  cursor: pointer;

  &.active,
  &:hover {
    border-color: var(--black);
  }

  &.active {
    background-color: var(--black);

    span {
      color: var(--white);
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
}
</style>
