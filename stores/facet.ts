import { NuxtSSRContext } from '#app'
import { defineStore } from 'pinia'

import { ITEMS_PER_FILTER_REQUEST } from 'configuration/global.configuration'
import { FACET_ID_CATEGORIES, filterKeysOrder } from 'data/facets'
import {
  convertQueryToFacets,
  updateRouteQuery,
  compareAndSetDisabledValues,
  toggleFacetValue,
} from 'lib/filters'
import { getQueryObject } from 'lib/routing'

import {
  Facet,
  FilterFacet,
  FilterFacetKeys,
  SelectedFilterFacet,
  SelectedFacet,
  FacetKeys,
  FilterRules,
} from 'types/models/facet.model'
import { getFacetsDefault } from 'utils/facet'
import { defu } from 'defu'

export const useFacetStore = defineStore('FacetStore', () => {
  const facets = ref<Facet[]>([])
  const allFacets = ref<Facet[]>([])
  const isFilterMenuOpen = ref(false)
  const filterBarInteraction = ref(true)
  const filterTypeOpen = ref<FilterFacetKeys | undefined>(undefined)
  const filteredProductSkusByOrder = ref<Set<string>>(new Set())
  const loadingFacets = ref(false)
  const filterRules = ref<FilterRules[]>([])
  const activeCategory = ref<string | undefined>(undefined)

  const storefrontStore = useStorefrontStore()

  const { $facets } = useNuxtApp()

  // Computed
  const filterFacets = computed(() =>
    facets.value
      .filter((facet): facet is FilterFacet => FilterFacet.safeParse(facet).success)
      .sort((a, b) => {
        const aIndex = filterKeysOrder.indexOf(a.id)
        const bIndex = filterKeysOrder.indexOf(b.id)
        return aIndex - bIndex
      })
  )

  const facetsMap = computed(() => {
    const map = new Map<FacetKeys, Facet>()
    facets.value.forEach(facet => {
      map.set(facet.id, facet)
    })
    return map
  })

  const disableFilterBar = computed(() => filterRules.value.includes('no-filters'))

  const isFiltered = computed(() => filteredProductSkusByOrder.value.size > 0)

  const selectedFacets = computed(() => {
    const selectedFacets: SelectedFacet[] = selectedFilters.value

    if (activeCategoryFacetQuery.value) {
      selectedFacets.push(
        SelectedFacet.parse({ id: FACET_ID_CATEGORIES, values: [activeCategoryFacetQuery.value] })
      )
    }

    return selectedFacets
  })

  const selectedFilters = computed<SelectedFilterFacet[]>(() => {
    const selectedFilters: SelectedFilterFacet[] = filterFacets.value
      .filter(({ values }) => values.filter(value => value.selected).length)
      .map(({ id, values }) => ({
        id,
        values: values.filter(value => value.selected).map(value => value.value),
      }))
    return selectedFilters
  })

  const selectedFilterKeys = computed(() => selectedFilters.value.map(({ id }) => id))
  const selectedFilterValues = computed(() =>
    selectedFilters.value.map(({ values }) => values).flat()
  )
  const activeCategoryFacetQuery = computed(() => {
    if (activeCategory.value) return `${activeCategory.value}.0`
    return undefined
  })

  // Methods
  function toggleFilterValue(facetId: FilterFacetKeys, facetValueKey: string) {
    facets.value = toggleFacetValue(facets.value, facetId, facetValueKey)
  }

  function toggleFilterValueAndUpdateRouteQuery(facetId: FilterFacetKeys, facetValueKey: string) {
    toggleFilterValue(facetId, facetValueKey)

    updateRouteQuery(filterFacets.value)
  }

  const clearFilters = () => {
    if (!selectedFilterKeys.value.length) return

    filteredProductSkusByOrder.value = new Set()
    setAvailableFacets(allFacets.value)
  }

  function clearFiltersAndUpdateRoute() {
    if (!selectedFilterKeys.value.length) return

    clearFilters()
    return updateRouteQuery(filterFacets.value)
  }

  const clearFilter = (facetId: FilterFacetKeys) => {
    const facet = filterFacets.value.find(facet => facet.id === facetId)

    if (!facet) return

    facet.values.forEach(value => {
      value.selected = false
    })

    return facet
  }

  const clearFilterAndUpdateRoute = (facetId: FilterFacetKeys) => {
    const facet = clearFilter(facetId)

    if (!facet) return

    updateRouteQuery(filterFacets.value)
  }

  const setAvailableFacets = (newFacets: Facet[]) => {
    facets.value = compareAndSetDisabledValues(allFacets.value, newFacets)
  }

  const fetchDefaultFacets = async () => {
    const storecode = storefrontStore.currentStorefrontCode
    const preGeneratedFacets = await getFacetsDefault(storecode)

    if (preGeneratedFacets) {
      return { facets: preGeneratedFacets }
    }

    return $facets.fetchFacets({
      limit: 0,
    })
  }

  // actions
  const fetchAllAvailableFacets = async (ssrContext?: NuxtSSRContext) => {
    const queryFacets = convertQueryToFacets(getQueryObject(ssrContext)) // Could replace this step by setting the filters, which then gets included in the computed below. But the update is happening after the fetch anyway, and with better formatted data.
    const selectedAndQueryFacets = [...selectedFacets.value, ...queryFacets]

    try {
      const [dataAll, dataQuery] = await Promise.all([
        fetchDefaultFacets(),
        queryFacets.length
          ? await $facets.searchProducts({
              limit: ITEMS_PER_FILTER_REQUEST,
              facets: selectedAndQueryFacets,
            })
          : Promise.resolve(undefined),
      ])

      allFacets.value = dataAll.facets
      setAvailableFacets(dataQuery?.facets ?? dataAll.facets)

      if (dataQuery) {
        const skus = dataQuery.products.map(product => product.sku)
        filteredProductSkusByOrder.value = new Set(skus)
        useProductStore().setProducts(dataQuery.products)
      }

      return Promise.resolve()
    } catch (e) {
      console.warn('Failed to fetch filters', e)
      return Promise.reject(e)
    }
  }

  const fetch = async (options?: { page?: number; skipProducts?: boolean }) => {
    const { skipProducts, page } = defu(options, {
      skipProducts: false,
      page: 1,
    })

    if (page === 1) {
      filteredProductSkusByOrder.value = new Set()
    }
    try {
      loadingFacets.value = true
      const data = await $facets.searchProducts({
        facets: selectedFacets.value,
        limit: ITEMS_PER_FILTER_REQUEST,
        offset: (page - 1) * ITEMS_PER_FILTER_REQUEST,
      })
      const productStore = useProductStore()
      !skipProducts && productStore.setProducts(data.products)
      setAvailableFacets(data.facets)
      const newSkus = data.products.map(product => product.sku)

      if (selectedFilterKeys.value.length === 0) {
        filteredProductSkusByOrder.value = new Set()
      } else {
        filteredProductSkusByOrder.value = new Set([
          ...filteredProductSkusByOrder.value,
          ...newSkus,
        ])
      }

      return Promise.resolve(data)
    } catch (e) {
      console.warn('Failed to fetch products', e)
      return Promise.reject(e)
    } finally {
      loadingFacets.value = false
    }
  }

  function setCategory(categoryId: string) {
    if (activeCategory.value === categoryId) return
    activeCategory.value = categoryId

    if (activeCategory.value && selectedFacets.value.length) {
      fetch({ skipProducts: true })
    }
  }

  return {
    // State
    allFacets,
    facets,
    isFilterMenuOpen,
    filterBarInteraction,
    filterTypeOpen,
    filteredProductSkusByOrder,
    loadingFacets,
    filterRules,
    // Computed
    facetsMap,
    filterFacets,
    disableFilterBar,
    isFiltered,
    selectedFilters,
    selectedFilterKeys,
    selectedFilterValues,
    selectedFacets,
    // Methods
    clearFilters,
    clearFilter,
    clearFilterAndUpdateRoute,
    toggleFilterValue,
    toggleFilterValueAndUpdateRouteQuery,
    clearFiltersAndUpdateRoute,
    // actions
    fetchAllAvailableFacets,
    fetch,
    setCategory,
  }
})
