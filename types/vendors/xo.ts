/* eslint-disable camelcase */

import { Environment } from 'types/environment'
import {
  DisplayFeature,
  PimColor,
  ProductFamily,
  ProductMaterial,
  ProductSilhouette,
  StockStatus,
} from 'types/models/product'
import { Section } from 'types/models/section'
import { z } from 'zod'

export interface WidgetVariant {
  size: string
  stockStatus: StockStatus
  price: number
  finalPrice: number
  id: string
  sku: string
  currencies?: WidgetVariantCurrencies
}
export interface WidgetProduct {
  version: number
  context: 'default'
  id: number
  _id: {
    original_id: string
    tenant: string
    kind: 'product'
  }
  url: string // future implementation
  title: string
  recommended: boolean
  sections: Section[]
  price: number
  metadata: {
    updated: string
  }
  categories: string[]
  photo: string
  infoSizeGuideBlock: string
  heroLarge: string // should be used (?)
  linked?: { sku: string; name: string; sections: Section[]; color: PimColor[] }[]
  media: {
    position: number
    url: string
    background_color: string
    image_angle: string
    original: string
    background: string
    label?: string
    image_type: 'Flat' | 'Man model' | 'Woman model' | string
  }[]
  stockStatus: StockStatus
  name: string
  updateReason?: string
  patternGroup: string[]
  metaTitle: string
  pimProductType: string
  metaDescription: string
  giftWrap: number
  colorMain: PimColor[]
  sku: string
  children: WidgetVariant[]
  heroSmall: string
  updateTimestamp: Date
  urlKey: string // not being used
  pimProductTypeParent: string
  infoComposition: string
  heroThumbnail: string
  colors: PimColor[]

  infoWashingInstructions: string
  descriptionFull: string
  descriptionShort: string
  collections?: []
  availableSizes: string[]
  collaboration: string // not being used
  productFeatures: string[] // not being used
  displayFeatures: DisplayFeature[]
  materials: ProductMaterial[]

  // newly added
  finalPrices: number[]
  mainColor: PimColor
  outletStatus: string
  prices: number[]
  productAgeGroup: string
  productAssortmentSegment: string
  productClustering: string
  productCollaborationType: string
  productCollectionSegment: string
  productComposition: string
  productConcept: string
  productCountryOfOrigin: string
  productDescription: string
  productDimension: string
  productDivision: string
  productExcludeFromSale: boolean
  productFamily: ProductFamily
  productGoogleProductCategory: string
  productIsCollaboration: boolean
  productItemUPC: string
  productMainMaterial1: string
  productMainMaterial2: string
  productMainMaterial3: string
  productOccasion: string
  productPack: string
  productSaleStatus: string
  productSecondaryColors: PimColor[]
  productSections: Section[]
  productSilhouette: ProductSilhouette
  productType1: string
  productType2: string
  season: string[]
  seasonalDrop: string
  availableFrom: Date
  buildHash: string
}

export interface WidgetRecommendation {
  id: string
  strategy: 'local-mandatoryProducts' | string
  score: number
  distribution: number
  product: WidgetProduct
}

export interface WidgetResponse<T = any> {
  id: string
  recommendations: T
  pagination: {
    total: number
  }
  widget: {
    title: string
    attributes: { [key: string]: string }
    minResults: number
  }
  metadata?: {
    count?: number
  }
}

interface XOSearchItemBase<Kind = 'product' | ''> {
  id: string
  kind: Kind
  context: 'default'
  score: number
}

export interface XOSearchItemProduct extends XOSearchItemBase<'product'> {
  product: WidgetProduct
}

export interface XOSearchItemRedirect extends XOSearchItemBase<''> {
  redirect: {
    id: string // bcd385f1-73ab-451c-b455-2c89f04a089e
    url: string // https://www.happysocks.com/se/collection/halloween?section=right-now
    name: string // Halloween
  }
}

export interface XOFacet {
  id: string
  attribute: string
  title: string
  count: number
  values: XOFacetValue[]
}

export interface XOFacetValue {
  value: string
  count: number
  selected: boolean
}

export const XOFacet = z.object({
  id: z.string(),
  attribute: z.string(),
  title: z.string(),
  count: z.number(),
  values: z.array(
    z.object({
      value: z.string(),
      count: z.number(),
      selected: z.boolean(),
    })
  ),
})

export interface XOSearchResponse {
  metadata: {
    id: string
    count: number
    time: number
    token: string
    url: string
    offset: number
    limit: number
    facets: XOFacet[]
  }
  items: Array<XOSearchItemProduct | XOSearchItemRedirect>
}

export interface ParameterValue {
  id: string
  values: string[]
}

export interface XOSearchOptions {
  offset?: number
  limit?: number
  disable?: ParameterValue[]
  facets?: ParameterValue[]
  sortBy?: {
    attribute: string
    order: 'asc' | 'desc'
  }[]
  filter?: string
  customResponseMask?: string
}

export interface XOSearchBody {
  token: string
  query: string
  options: XOSearchOptions
}

export type WidgetVariantCurrencies = {
  [key in Environment.Currency['code']]: {
    discount: number
    price: number
    finalPrice: number
    discountPercentage: number
  }
}
