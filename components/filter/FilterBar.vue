<template>
  <div :class="['filter-top-bar', { disabled: !facetStore.filterBarInteraction }]">
    <div class="filter-controls">
      <button
        :aria-label="$t('openCloseFilterMenuAria')"
        data-test="open-all-filters-button"
        data-filter-button-ignored-el
        @click="toggleFilterMenu"
      >
        <img :src="`/icons/filter.svg`" height="14" width="16" data-filter-button-ignored-el />
        <p>{{ $t('filter') }}</p>
      </button>
    </div>
    <div class="quick-filters">
      <ul v-if="patternFilters">
        <li v-for="(pattern, index) in patternFilters.values" :key="index">
          <button
            :class="['quick-filter', { active: pattern.value === selectedPatternFilter?.value }]"
            aria-hidden="true"
            tabindex="-1"
            :aria-label="$t(pattern.value)"
            :data-test="`${pattern.value}-button`"
            data-filter-button-ignored-el
            @click="toggleFilter(patternFilters.id, pattern.value)"
          >
            {{ $t(pattern.value) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { updateRouteQuery } from 'lib/filters'
import { FilterFacet } from 'types/models/facet.model'

const facetStore = useFacetStore()
const { $t } = useNuxtApp()

const { isFilterMenuOpen } = storeToRefs(facetStore)
const { filters } = useFiltersInSection()

const patternFilters = computed(() => filters.value.find(element => element.name === 'pattern'))
const selectedPatternFilter = computed(() =>
  patternFilters.value?.values.find(element => element.selected)
)

const activeFilters = computed(() => facetStore.selectedFilterValues)

const toggleFilterMenu = () => {
  isFilterMenuOpen.value = !isFilterMenuOpen.value
}

const toggleFilter = (filterKey: FilterFacet['id'], filterFacetValue: string) => {
  const isAlreadyApplied = activeFilters.value.includes(filterFacetValue)
  facetStore.clearFilter(filterKey)

  !isAlreadyApplied && facetStore.toggleFilterValue(filterKey, filterFacetValue)
  updateRouteQuery(facetStore.filterFacets)
  facetStore.fetch()
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/rules/breakpoints';
@import '~/assets/scss/typography/body';

.filter-top-bar {
  z-index: 2;
  gap: 1.5rem;
  padding: 1.6rem;
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  flex-direction: column-reverse;
  align-items: flex-start;
  background: var(--white);
  overflow: hidden;
}

.filter-top-bar > * {
  opacity: 1;
  will-change: opacity;
  transition: opacity 0.3s ease;
}

.filter-top-bar.disabled > * {
  pointer-events: none;
  opacity: 0.3;
}

.btn-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
}

span + .icon.arrow {
  margin: 0;
}

.rotate {
  transform: scale(-1);
}

.filter-controls {
  display: flex;

  button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0 1.2rem;

    &:first-of-type {
      padding: 0 1.2rem 0 0;
    }

    &:not(:last-child) {
      border-right: 1px solid var(--gray-dark);
    }

    p {
      display: none;
      @include body2;
    }
  }
}

.quick-filters {
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  ul {
    display: flex;
    gap: 4rem;
    flex-wrap: nowrap;
    align-items: center;
    margin: 0;
    list-style: none;
    width: 100%;
  }

  button.quick-filter {
    @include body2;
    height: 2.5rem;
    white-space: nowrap;

    &.active {
      background-image: url('/icons/wavyLineBlue.svg');
      position: relative;
      background-repeat: repeat-x;
      background-position-y: bottom;
    }
    &:hover {
      background-image: url('/icons/wavyLine.svg');
      position: relative;
      background-size: 8rem;
      background-repeat: repeat-x;
      background-position-y: bottom;
    }
  }
}

@media (min-width: $phone) {
  .filter-top-bar {
    align-items: center;
    flex-direction: row;
    padding: var(--spacing-m);
  }

  .filter-controls button p {
    display: block;
  }
}
</style>
