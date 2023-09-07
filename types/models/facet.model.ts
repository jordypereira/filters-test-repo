import {
  facetKeys,
  filterKeysOrder,
  filterLengthValuesOrder,
  filterSizeValuesOrderAdult,
  filterSizeValuesOrderKid,
  QueryKeys,
} from '../../data/facets'
import { z } from 'zod'

/**
 * A facet is a group of related filters.
 * Faceted search allows users to quickly filter search results by selecting from a range of criteria options, making it easy to refine results and find the most relevant information, saving time and effort.
 *
 * @link https://attraqt.gitbook.io/developer-documentation/xo-search/api-parameters/faceting
 * @link https://www.loop54.com/blog/what-is-a-search-facet-what-is-a-search-filter
 */

export type FacetKeys = typeof facetKeys[number] | FilterFacetKeys

export const FacetValue = z.object({
  value: z.string(),
  count: z.number(),
  selected: z.boolean(),
  disabled: z.boolean().default(false),
})

export type FacetValue = z.infer<typeof FacetValue>

const FacetTypes = z.enum(['filter', 'suggestion', 'search', 'facet'])

export const Facet = z.object({
  id: z.enum(facetKeys),
  name: z.string(),
  count: z.number(),
  type: FacetTypes,
  values: z.array(FacetValue),
})

export const FacetArray = z.array(Facet)

export type Facet = z.infer<typeof Facet>

export interface SelectedFacet {
  id: FacetKeys
  values: string[]
}

export const SelectedFacet = z.object({
  id: z.enum(facetKeys),
  values: z.array(z.string()),
})

// FilterFacets
export const FilterFacetKeys = z.enum(filterKeysOrder)
export type FilterFacetKeys = z.infer<typeof FilterFacetKeys>

export const FilterFacet = Facet.extend({
  id: FilterFacetKeys,
  name: QueryKeys,
  type: z.literal(FacetTypes.enum.filter),
})

export type FilterFacet = z.infer<typeof FilterFacet>

export const SelectedFilterFacet = SelectedFacet.extend({
  id: FilterFacetKeys,
})

export type SelectedFilterFacet = z.infer<typeof SelectedFilterFacet>

export const darkColorGroup = ['black', 'brown', 'blue', 'purple'] as const
export type DarkcolorGroup = typeof darkColorGroup[number]
export const isDarkColor = (color: any): color is DarkcolorGroup =>
  color && darkColorGroup.includes(color)

export const FilterLengthValue = FacetValue.extend({
  value: z.enum(filterLengthValuesOrder),
})
export type FilterLengthValue = z.infer<typeof FilterLengthValue>
export const FilterSizeAdult = FacetValue.extend({
  value: z.enum(filterSizeValuesOrderAdult),
})
export type FilterSizeAdult = z.infer<typeof FilterSizeAdult>
export const FilterSizeKid = FacetValue.extend({
  value: z.enum(filterSizeValuesOrderKid),
})
export type FilterSizeKid = z.infer<typeof FilterSizeKid>

export const filterRules = ['kids', 'no-colors', 'no-filters'] as const
export type FilterRules = typeof filterRules[number]
