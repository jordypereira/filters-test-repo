<template>
  <div class="filter-controls">
    <ModalWrapper
      :show="isOpen"
      :slide-from="{ mobile: 'left', desktop: 'left' }"
      :align-to="{ mobile: 'end', desktop: 'start' }"
      header-size="with-filters"
    >
      <template #modal-content>
        <FilterMenu />
      </template>
    </ModalWrapper>
  </div>
</template>

<script lang="ts" setup>
const facetStore = useFacetStore()
const { isFilterMenuOpen: isOpen } = storeToRefs(facetStore)

watch(
  () => isOpen.value,
  bool => {
    bool
      ? document.body?.classList.add('filter-open')
      : document.body?.classList.remove('filter-open')
  }
)
</script>

<style lang="scss" scoped>
.filter-controls {
  z-index: 3;
}
</style>
