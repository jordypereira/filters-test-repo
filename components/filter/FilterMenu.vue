<template>
  <aside
    ref="el"
    class="filter-menu"
    role="dialog"
    aria-modal="true"
    :aria-label="$t('filterMenuOptionsAria')"
  >
    <h1 class="title">{{ $t('filters') }}</h1>
    <IconBasic filename="close" @click="hide" />

    <p v-if="showErrorMessage" class="message">
      {{ $t('filterErrorMessage') }}
    </p>
    <div class="accordion-container">
      <FilterDropdown
        v-for="(filter, idx) in filters"
        :key="filter.id"
        :filter="filter"
        :focus="idx === 0"
        :expanded="!isExpanded(filter.id)"
        @toggle="toggleDropdown"
      />
    </div>

    <div class="filter-actions">
      <ButtonBasic
        role="button"
        :aria-label="$t('clearAllFiltersAria')"
        size="small"
        design="simple"
        native-type="reset"
        :uppercase="false"
        data-test="clear-filter-button"
        @click="clear"
        ><span aria-hidden="true">{{ $t('clearAllFilters') }}</span>
      </ButtonBasic>
      <ButtonBasic
        id="accept-btn"
        role="button"
        :aria-label="$t('acceptFilterAria')"
        design="simple"
        size="small"
        :uppercase="false"
        background-color="var(--black)"
        data-test="close-filter-button"
        @click="hide"
        ><span aria-hidden="true"> {{ $t('filtersOk') }}</span>
      </ButtonBasic>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { isFilterClickAway } from 'lib/filters'
import { FilterFacetKeys } from 'types/models/facet.model'

const { $t } = useNuxtApp()
const facetStore = useFacetStore()
const { filterTypeOpen } = storeToRefs(facetStore)
const { filters } = useFiltersInSection()
const el = ref(null)
const showErrorMessage = ref(false)
const expandedFilterDropdownKeys = ref<Set<FilterFacetKeys>>(
  filterTypeOpen.value ? new Set([filterTypeOpen.value]) : new Set()
)

function hide(e: MouseEvent) {
  if (!isFilterClickAway(e)) return
  facetStore.filterTypeOpen = undefined
  facetStore.isFilterMenuOpen = false
  // polite($t('hideFilter'))
}

onClickOutside(el, hide)

function clear() {
  // polite($t('clearFilters'))
  facetStore.filterTypeOpen = undefined
  facetStore.clearFiltersAndUpdateRoute()
}

function toggleDropdown(id: FilterFacetKeys) {
  if (expandedFilterDropdownKeys.value.has(id)) {
    expandedFilterDropdownKeys.value.delete(id)
    facetStore.filterTypeOpen = undefined
  } else {
    facetStore.filterTypeOpen = id
    expandedFilterDropdownKeys.value.add(id)
  }
}

watch(filterTypeOpen, val => {
  if (val) {
    expandedFilterDropdownKeys.value.add(val)
  }
})

function isExpanded(id: FilterFacetKeys) {
  return filterTypeOpen.value === id || expandedFilterDropdownKeys.value.has(id)
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/rules/breakpoints';
@import 'assets/scss/typography/body';
@import 'assets/scss/rules/edges';

.filter {
  border-bottom: 1px solid var(--divider-colored);
}

.title {
  @include body1;
  text-align: center;
  margin-right: var(--spacing-m);
}

.filter-menu {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background: var(--gray-lighter);
  padding: var(--spacing-m);

  &:after {
    content: '';
    position: absolute;
    background: inherit;
    top: -2rem;
    right: 0;
    width: 100%;
    height: 2rem;
    @include scallop;
  }

  .icon {
    width: 10px;
    height: 10px;
    position: absolute;
    top: var(--spacing-m);
    right: var(--spacing-m);
    cursor: pointer;
  }
}

.accordion-container {
  width: 100%;
  min-height: calc(
    var(--window-height) - var(--filter-top-bar-height) - var(--header-main-height) -
      var(--filter-bottom-actions-height)
  );
  overflow-y: auto;
  padding-top: 4.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-bottom: var(--spacing-m);

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
  flex-direction: column;
  gap: 0.8rem;

  & button {
    &:nth-of-type(2) span {
      color: var(--white);
    }

    span {
      @include body2;
    }
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

@media (min-width: $phone) {
  .filter-menu {
    max-width: 54rem;
    padding: var(--spacing-m) 0 var(--spacing-m) var(--spacing-m);

    &:after {
      width: 2rem;
      height: 100%;
      top: 0;
      right: -2rem;
      --mask: radial-gradient(11.89px at calc(100% - 16.8px) 50%, #000 99%, #0000 101%) 0
          calc(50% - 16px) / 100% 32px,
        radial-gradient(11.89px at calc(100% + 8.8px) 50%, #0000 99%, #000 101%) calc(100% - 8px)
          50%/100% 32px repeat-y;
      -webkit-mask: var(--mask);
      mask: var(--mask);
    }
  }

  .message {
    font-size: 1.6rem;
    padding: 1.2rem 2rem;
  }

  .title {
    text-align: left;
  }

  .accordion-container {
    padding-top: 7.2rem;
  }
}

@media (max-width: $phone) {
  .accordion-container {
    height: 65vh;
    min-height: auto;
  }
}

@media (max-width: 620px) {
  .filter-menu {
    max-width: auto;
  }
}
</style>
