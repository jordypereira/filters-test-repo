import { z } from 'zod'
import { FilterRules } from 'types/models/facet.model'

export const FILTER_ID_PATTERN = 'filter-pattern-groups'
export const FILTER_ID_COLOR = 'filter-color-groups'
export const FILTER_ID_LENGTH = 'filter-length'
export const FILTER_ID_SIZE_KID = 'filter-size-kid'
export const FILTER_ID_MATERIALS = 'filter-materials'
export const FILTER_ID_COLLABORATION = 'filter-collaboration'
export const FILTER_ID_SIZE_ADULT = 'filter-size-adult'
export const FILTER_ID_PRICE = 'filter-price'
export const FACET_ID_CATEGORIES = 'facet-categoryIds'

export const LENGTH_LOW = 'product-length-group-low'
export const LENGTH_MID = 'product-length-group-mid'
export const LENGTH_ALL = 'product-length-group-all'
export const filterLengthValuesOrder = [LENGTH_LOW, LENGTH_MID, LENGTH_ALL] as const
export const DEFAULT_FILTER_LENGTH_VALUE_INDEX = 2

export const ADULT_SIZE_0 = 'product-size-adult-group-0'
export const ADULT_SIZE_1 = 'product-size-adult-group-1'
export const filterSizeValuesOrderAdult = [ADULT_SIZE_0, ADULT_SIZE_1] as const

export const KID_SIZE_0 = 'product-size-kid-0M12M'
export const KID_SIZE_1 = 'product-size-kid-12M24M'
export const KID_SIZE_2 = 'product-size-kid-2Y3Y'
export const KID_SIZE_3 = 'product-size-kid-4Y6Y'
export const KID_SIZE_4 = 'product-size-kid-7Y9Y'
export const filterSizeValuesOrderKid = [
  KID_SIZE_0,
  KID_SIZE_1,
  KID_SIZE_2,
  KID_SIZE_3,
  KID_SIZE_4,
] as const

export const filterKeysOrder = [
  FILTER_ID_PRICE,
  FILTER_ID_LENGTH,
  FILTER_ID_SIZE_KID,
  FILTER_ID_SIZE_ADULT,
  FILTER_ID_PATTERN,
  FILTER_ID_COLLABORATION,
  FILTER_ID_MATERIALS,
  FILTER_ID_COLOR,
] as const

export const otherFacetKeys = [FACET_ID_CATEGORIES] as const

export const facetKeys = [...filterKeysOrder, ...otherFacetKeys] as const

// TODO: Check to make sure changing the query names do not impact any other teams.
export const QueryKeys = z.enum([
  'pattern',
  'color',
  'length',
  'size-kid',
  'material',
  'collaboration',
  'size-adult',
  'price',
])

export type QueryKeys = z.infer<typeof QueryKeys>

export const filterToQueryMap = {
  [FILTER_ID_PATTERN]: QueryKeys.enum.pattern,
  [FILTER_ID_COLOR]: QueryKeys.enum.color,
  [FILTER_ID_LENGTH]: QueryKeys.enum.length,
  [FILTER_ID_SIZE_KID]: QueryKeys.enum['size-kid'],
  [FILTER_ID_MATERIALS]: QueryKeys.enum.material,
  [FILTER_ID_COLLABORATION]: QueryKeys.enum.collaboration,
  [FILTER_ID_SIZE_ADULT]: QueryKeys.enum['size-adult'],
  [FILTER_ID_PRICE]: QueryKeys.enum.price,
}

export const filterValuePrefixMap = {
  [FILTER_ID_PATTERN]: 'product-pattern-group',
  [FILTER_ID_COLOR]: 'product-color-group',
  [FILTER_ID_LENGTH]: 'product-length-group',
  [FILTER_ID_SIZE_KID]: 'product-size-kid',
  [FILTER_ID_MATERIALS]: 'product-material-group',
  [FILTER_ID_COLLABORATION]: 'product-collaboration',
  [FILTER_ID_SIZE_ADULT]: 'product-size-adult',
  [FILTER_ID_PRICE]: 'product-price-group',
}

export function excludeAllFilters(rules: FilterRules[]) {
  return rules.includes('no-filters')
}

export function includeFilter(rules: FilterRules[], filterKey: string) {
  if (filterKey === QueryKeys.enum['size-kid']) {
    return rules.includes('kids')
  }

  if (filterKey === QueryKeys.enum['size-adult']) {
    return !rules.includes('kids')
  }

  if (filterKey === QueryKeys.enum['color']) {
    return !rules.includes('no-colors')
  }

  return true
}

export const DEFAULT_FILTERS = filterKeysOrder.reduce(
  (acc, key) => ({
    ...acc,
    [key]: [],
  }),
  {} as any
)
