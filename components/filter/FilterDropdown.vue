<template>
  <BaseDropdown
    v-if="filter.values.length > 0"
    class="filter"
    :expanded="expanded"
    :active="selectedFilterKeys.includes(filter.id)"
    :title="$t(filter.id)"
    :data-test="`${filter.id}-dropdown`"
    @clear="() => clearSelectedFilter(filter.id)"
    @toggle="() => toggleDropdown(filter.id)"
  >
    <template #dropdown-content>
      <FilterCheckGroupColors
        v-if="filter.name === 'color'"
        :options="filter.values"
        :filter-key="filter.id"
        class="slider-content"
        @apply="e => applyFilter(filter.id, e)"
      />
      <FilterCheckGroup
        v-else
        :options="filter.values"
        :filter-key="filter.id"
        class="slider-content"
        @apply="e => applyFilter(filter.id, e)"
      />
    </template>
  </BaseDropdown>
</template>

<script lang="ts" setup>
import { FilterFacet } from 'types/models/facet.model'

defineProps<{
  filter: FilterFacet
  expanded: boolean
}>()
const emit = defineEmits<{
  (e: 'toggle', filterKey: FilterFacet['id']): void
}>()

const facetStore = useFacetStore()

const { selectedFilterKeys } = storeToRefs(facetStore)

function clearSelectedFilter(filterKey: FilterFacet['id']) {
  facetStore.clearFilterAndUpdateRoute(filterKey)
  facetStore.fetch()
}

function toggleDropdown(filterKey: FilterFacet['id']) {
  emit('toggle', filterKey)
}

function applyFilter(filterKey: FilterFacet['id'], filterFacetValue: string) {
  facetStore.toggleFilterValueAndUpdateRouteQuery(filterKey, filterFacetValue)
  facetStore.fetch()
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/rules/breakpoints';

.filter-menu {
  position: relative;
  width: 100%;
  height: calc(var(--window-height) - var(--header-main-height) - var(--filter-top-bar-height));
  z-index: 100;
  display: flex;
  flex-direction: column;
  background: var(--white);
  overflow-y: hidden;

  @supports (height: 100dvh) {
    height: calc(100dvh - var(--header-main-height) - var(--filter-top-bar-height));
  }
}

.accordion-container {
  width: 100%;
  min-height: calc(
    var(--window-height) - var(--filter-top-bar-height) - var(--header-main-height) -
      var(--filter-bottom-actions-height)
  );
  overflow-y: scroll;

  @supports (height: 100dvh) {
    min-height: calc(
      100dvh - var(--filter-top-bar-height) - var(--header-main-height) -
        var(--filter-bottom-actions-height)
    );
  }
}

.filter-actions {
  bottom: 0;
  z-index: 3;
  width: 100%;
  display: flex;
  position: sticky;
  overflow: hidden;
  min-height: calc(var(--filter-bottom-actions-height) + 0.2rem);

  :first-child {
    border-left: none;
  }
}

.filter-actions > * {
  flex: 1;
}

.filter-actions #accept-btn {
  border-left: none;
  border-right: none;
}

.radio-group + .radio-group {
  margin-top: 5rem;
}

.message {
  z-index: 3;
  width: 100%;
  font-size: 1.4rem;
  padding: 0.5rem 2rem;
  background: var(--red);
  transition: linear 0.2s;
  border-bottom: 0.2rem solid var(--black);
}

@media (min-width: $tablet) {
  .filter-menu {
    max-width: 54rem;
  }

  .message {
    font-size: 1.6rem;
    padding: 1.2rem 2rem;
  }
}

@media (max-width: 620px) {
  .filter-menu {
    max-width: auto;
    border-right: none;
  }
}
</style>
