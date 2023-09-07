import { price } from './price'
import {
  filterValuePrefixMap,
  filterToQueryMap,
  excludeAllFilters,
  includeFilter,
  FILTER_ID_SIZE_ADULT,
  filterSizeValuesOrderAdult,
  FILTER_ID_SIZE_KID,
  filterSizeValuesOrderKid,
  FILTER_ID_LENGTH,
  filterLengthValuesOrder,
  QueryKeys,
} from '../data/facets'
import {
  Facet,
  FilterFacet,
  FilterFacetKeys,
  FilterLengthValue,
  FilterRules,
  FilterSizeAdult,
  FilterSizeKid,
  SelectedFacet,
} from '../types/models/facet.model'
import { QueryObject } from './routing'
import { XOFacet, XOFacetValue } from '~~/types/vendors/xo'

export const isFilteredView = (query: Route['query']) => {
  return FilterFacetKeys.some((key: any) => Reflect.has(query, key))
}

export const getFilterFromQuery = (query: string) => {
  const filter = Object.entries(filterToQueryMap).find(([, value]) => value === query)

  return filter?.[0] as FilterFacetKeys | undefined
}

export const getQueryName = (filter: string) => {
  try {
    const data = FilterFacetKeys.parse(filter)

    return filterToQueryMap[data]
  } catch (error) {
    return undefined
  }
}

export const removePrefixFromFilterValue = (filter: FilterFacetKeys, value: string) => {
  const prefix = filterValuePrefixMap[filter]

  return value.replace(`${prefix}-`, '')
}

export const convertQueryToFacets = (query: QueryObject): SelectedFacet[] => {
  const facets: SelectedFacet[] = []
  Object.keys(query).forEach(key => {
    const filter = getFilterFromQuery(key)
    if (!filter) return
    const queryParameter = query[key]
    if (typeof queryParameter !== 'string') return

    const valuePrefix = filterValuePrefixMap[filter]
    const values = queryParameter.split(',').map(value => `${valuePrefix}-${value}`)

    facets.push({ id: filter, values })
  })

  return facets
}

export const getQueryString = (facet: FilterFacet) => {
  const values = facet.values
    .filter(value => value.selected)
    .map(value => removePrefixFromFilterValue(facet.id, value.value))

  return values.join(',')
}

export const parseParam = (query: string | (string | null)[]) => {
  const param = typeof query === 'string' ? decodeURIComponent(query) : ''
  return param.replace(/(\+|-)/g, ' ')
}

export const getPriceFilterNameByCountry = (value: string) => {
  const storefrontStore = useStorefrontStore()
  const storyblokStore = useStoryblokStore()

  const countryCode = storefrontStore.currentMarketCountryCode

  const priceCurrencyMapping: Record<any, number> = {
    SE: 100,
    NO: 100,
    DK: 90,
    CZ: 279,
    KR: 13000,
    AU: 19.95,
    CH: 13.95,
    JP: 1300,
  }

  const getMappedPriceFilterString = (value: string) => {
    const mappedPrice = priceCurrencyMapping[countryCode]
    if (!mappedPrice) return undefined

    if (value === 'product-price-group-0') {
      return `${price(mappedPrice)} & under`
    }

    if (value === 'product-price-group-1') {
      return `${price(mappedPrice)} & over`
    }

    return undefined
  }

  return getMappedPriceFilterString(value) || storyblokStore.getTranslation(value)
}

export const getPricesFilterNameByCurrency = (filter: FilterFacet) => {
  return filter.values.map(price => {
    return {
      ...price,
      name: getPriceFilterNameByCountry(price.value),
    }
  })
}

export function isFilterClickAway(event: MouseEvent): boolean {
  const target = event?.target

  if (
    target instanceof HTMLElement &&
    target.attributes.getNamedItem('data-filter-button-ignored-el')
  ) {
    return false
  }

  return true
}

export function getFiltersBySection(rules: FilterRules[], filters: FilterFacet[]) {
  if (excludeAllFilters(rules)) return []

  return filters.filter(({ name }) => includeFilter(rules, name))
}

export function updateRouteQuery(filterFacets: FilterFacet[]) {
  const route = useRoute()
  const router = useRouter()
  const query = { ...route.query }
  filterFacets.forEach(facet => {
    const queryString = getQueryString(facet)
    if (queryString) {
      query[facet.name] = queryString
    } else {
      delete query[facet.name]
    }
  })
  return router.replace({ query })
}

export function compareAndSetDisabledValues(allFacets: Facet[], facets: Facet[]) {
  return allFacets.map(facet => {
    const selectedFacet = facets.find(f => f.id === facet.id)
    if (!selectedFacet)
      return {
        ...facet,
        values: facet.values.map(value => ({ ...value, disabled: true })),
      }

    return {
      ...selectedFacet,
      values: facet.values.map(value => {
        const selectedFacetValue = selectedFacet.values.find(v => v.value === value.value)

        if (!selectedFacetValue) return { ...value, disabled: true }

        return selectedFacetValue
      }),
    }
  })
}

export function toggleFacetValue(facets: Facet[], facetId: string, value: string) {
  return facets.map(facet => {
    if (facet.id !== facetId) return facet

    const values = facet.values.map(v => {
      if (v.value !== value) return v
      return { ...v, selected: !v.selected }
    })

    return { ...facet, values }
  })
}

export function sortFilterValues(id: XOFacet['id'], values: XOFacetValue[]): XOFacetValue[] {
  // TODO: Clean this up and make it more generic
  if (id === FILTER_ID_SIZE_ADULT) {
    return values
      .reduce((acc, v) => {
        const parsed = FilterSizeAdult.safeParse(v)
        if (parsed.success) {
          acc.push(parsed.data)
        }

        return acc
      }, [] as FilterSizeAdult[])
      .sort(
        (a, b) =>
          filterSizeValuesOrderAdult.indexOf(a.value) - filterSizeValuesOrderAdult.indexOf(b.value)
      )
  } else if (id === FILTER_ID_SIZE_KID) {
    return values

      .reduce((acc, v) => {
        const parsed = FilterSizeKid.safeParse(v)
        if (parsed.success) {
          acc.push(parsed.data)
        }

        return acc
      }, [] as FilterSizeKid[])
      .sort(
        (a, b) =>
          filterSizeValuesOrderKid.indexOf(a.value) - filterSizeValuesOrderKid.indexOf(b.value)
      )
  } else if (id === FILTER_ID_LENGTH) {
    return values
      .reduce((acc, v) => {
        const parsed = FilterLengthValue.safeParse(v)
        if (parsed.success) {
          acc.push(parsed.data)
        }

        return acc
      }, [] as FilterLengthValue[])
      .sort(
        (a, b) =>
          filterLengthValuesOrder.indexOf(a.value) - filterLengthValuesOrder.indexOf(b.value)
      )
  } else {
    // TODO: This only sorts by the key value and not the final translated text on site
    return values.sort((a, b) => a.value.localeCompare(b.value))
  }
}

export function deleteFilterQueries(query: QueryObject) {
  const filterQueries = QueryKeys.options
  return Object.keys(query).reduce((acc, key) => {
    if (!filterQueries.includes(key as any)) {
      const value = query[key]
      if (!value) return acc

      acc[key] = value
    }

    return acc
  }, {} as QueryObject)
}

export function hasFilterQueries(query: QueryObject) {
  const filterQueries = QueryKeys.options
  return Object.keys(query).some(key => filterQueries.includes(key as any))
}
