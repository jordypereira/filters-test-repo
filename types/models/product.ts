import { Section } from './section'
import { WidgetVariantCurrencies } from 'types/vendors/xo'
import { XOFacet } from 'types/vendors/xo'

export interface ImageObject {
  url: string
  label?: string
}

export interface Discount {
  percentage: number
  absolute: number
}

export interface ProductVariant {
  size: ProductSize
  stockStatus: StockStatus
  id: string
  sku: string
  price: {
    original: number
    final: number
  }
  discount: Discount
  currencies?: WidgetVariantCurrencies
}

export const pimColors = [
  '0',
  'beige',
  'black',
  'blue',
  'brown',
  'dark-brown',
  'dark-green',
  'dark-grey',
  'dark-orange',
  'dark-pink',
  'dark-purple',
  'dark-red',
  'dark-yellow',
  'green',
  'grey',
  'light-blue',
  'light-brown',
  'light-green',
  'light-grey',
  'light-orange',
  'light-pink',
  'light-purple',
  'light-red',
  'light-yellow',
  'n-a',
  'navy',
  'not-applicable',
  'orange',
  'pink',
  'purple',
  'red',
  'turquoise',
  'white',
  'yellow',
] as const

export type PimColor = typeof pimColors[number]
export const isPimColor = (color: any): color is PimColor => color && pimColors.includes(color)

export const productSilhouettes = [
  '1-2-crew',
  '1-4-crew',
  '3-4-crew',
  'ankle',
  'boxer',
  'boxer-brief',
  'brief',
  'cheeky',
  'combination',
  'crew',
  'hipster',
  'knee-high',
  'liner',
  'low',
  'mid-high',
  'no-show',
  'no-silhouette',
  'shorts',
  'shorts-long',
  'slipper',
  'swimsuit',
  'tights',
  'trunk',
] as const

export type ProductSilhouette = typeof productSilhouettes[number]
export const isProductSilhouette = (silhouette: any): silhouette is PimColor =>
  silhouette && productSilhouettes.includes(silhouette)

const productFamilies = [
  'add-ons',
  'footwear',
  'head-wear',
  'headwear',
  'leg-wear',
  'legwear',
  'point-of-purchase-material',
  'point-of-sales-material',
  'socks',
  'swimwear',
  'underwear',
]

export type ProductFamily = typeof productFamilies[number]
export const isProductFamily = (family: any): family is ProductFamily =>
  family && productFamilies.includes(family)

export interface ProductImage {
  alt: string
  url: string
  position: number
  backgroundColor: string
}

export type StockStatus = 'in-stock' | 'low-stock' | 'no-stock'
export type ProductType = 'socks' | 'underwear' | 'box' | 'pos' | 'other' | 'swimwear' | 'accessory'
export interface ProductColor {
  name: {
    english: PimColor
    localized: string
  }
  hex: string
}

export interface LinkedProduct {
  sku: string
  name: string
  current: boolean
  mainColor: string
  sections: string[]
  background: string
}

export interface Product {
  _type: 'product' | 'collection'
  id: number
  sku: string
  name: string
  media: {
    hero: {
      small?: ImageObject
      large?: ImageObject
      original?: ImageObject
      thumbnail?: ImageObject
    }
    images: ProductImage[]
  }
  color: {
    primary?: PimColor
    secondary?: PimColor[]
  }
  meta: {
    title?: string
    description?: string
  }
  sections: Section[]
  patternGroup: string[]
  description: {
    full: string
    short: string
  }
  stockStatus: StockStatus
  information: {
    ageGroup: string
    composition: string
    sizeGuideBlock: string
    washingInstructions: string
    family: string
    occasion: string
    silhouette: string
  }
  linkedProducts: LinkedProduct[]
  variants: ProductVariant[]
  collections: string[]
  availableSizes: string[]
  updatedAt: Date
  updateReason: string
  displayFeatures: DisplayFeature[]
  materials: ProductMaterial[]
  badges: ProductBadge[]
  categories: string[]
}

export interface Image {
  src: string
  alt: string
}

export interface Filter {
  img: Image
  text: string
}

export interface FilterGroup {
  title: string
  type: string
  filters: Filter[]
}

export interface Search {
  term: string | null
  loading: boolean
  results: {
    count: number
  }
}

export interface Facets {
  visible: boolean
  active: XOFacet[]
  available: XOFacet[]
}

export const productMaterials = [
  'combed-cotton',
  'organic-combed-cotton',
  'shiny-viscose',
  'sparkly-polyamide',
  'mercerized-egyptian-cotton',
  'wool-blend',
  'shimmery-viscose',
  'viscose',
  'mercerized-pima-cotton',
  'shiny-polyamide',
  'mercerized-cotton',
  'merino-wool-blend',
  'polyester',
  'recycled-polyester',
  'recycled-polyamide',
  'tenceltm-modal',
] as const

export type ProductMaterial = typeof productMaterials[number]

export const isProductMaterial = (material: any): material is ProductMaterial =>
  material && productMaterials.includes(material)

export const displayFeatures = [
  'reinforced-heel-and-toe',
  'cushioned-sole',
  'anti-slip',
  'soft-terry-padding',
  'arch-support',
  'name-tag',
  'stay-up-grip',
  'soft-cuff',
  'seamless-toe',
  'foldable-cuff',
  'ribbed',
  'y-stitched-heel',
  'sits-below-anything-higher-than-a-loafer',
  'keeping-an-ankle-low-profile',
  'sits-below-sneakers',
  'water-resistant',
  'adjustable-straps-and-reusable',
  'anti-slip-12-24-m-2-3-y',
  'seamless-toe-0-12-m',
  'side-pockets',
  'elastic-waist',
  'air-holes',
  'mesh-lining',
  'back-pockets',
  'light-compression',
  'space-yarn',
] as const

export type DisplayFeature = typeof displayFeatures[number]

export const isDisplayFeature = (feature: any): feature is DisplayFeature =>
  feature && displayFeatures.includes(feature)

export const productSizes = [
  '0',
  '0-12M',
  '0-6M',
  '10-12Y',
  '10-13',
  '12-18M',
  '12-24M',
  '18-24M',
  '2-3Y',
  '35/36',
  '36-38',
  '36-40',
  '36',
  '36/0-12M',
  '36/12-24',
  '36/2-3Y',
  '36/37',
  '37/38',
  '38/39',
  '36/12-24M',
  '41/12-24M',
  '36-40/0-12',
  '36-40/2-3Y',
  '41-46/0-12',
  '41-46/2-3Y',
  '39-41',
  '39-42',
  '39/40',
  '4-6Y',
  '40/41',
  '41-46',
  '41/0-12M',
  '41/12-24',
  '41/2-3Y',
  '41/42',
  '42/43',
  '43-46',
  '43/44',
  '44/45',
  '45/46',
  '46',
  '6-12M',
  '7-9Y',
  '9-11',
  '9-11/0-1',
  'L',
  'M',
  'ONESIZE',
  'S',
  'S/M',
  'XL',
  'XS',
  'XXL',
  'XXS',
  'Small',
  'Medium',
  'Large',
  'Extra Large',
  'Extra Small',
  'One Size',
  '47-51',
  '36-40 & 12-24M',
  '36-40 & 2-3Y',
  '41-46 & 0-12M',
  '41-46 & 12-24M',
  '41-46 & 2-3Y',
  '36-40 & 2-3YM',
  '36-40 & 12-24',
  '36-40 & 0-12M',
  '41-46 & 12-24',
  'Small/Medium',
  '2-4Y',
  '10-13 & 0-12M',
  '9-11 & 0-12M',
] as const
export type ProductSize = typeof productSizes[number]
export const isProductSize = (size: any): size is ProductSize => size && productSizes.includes(size)

// ! do not change the order of productBadgeNames, they are in the priority order from merch
export const productBadgeNames = [
  'discount',
  'coming-soon',
  'special-edition',
  'last-chance',
  'low-stock',
  'online-exclusive',
  'bestsellers',
  'organic-cotton',
  'gift-idea',
] as const

export type ProductBadgeName = typeof productBadgeNames[number]

export const isProductBadgeName = (badge: any): badge is ProductBadgeName =>
  badge && productBadgeNames.includes(badge)

export type ProductBadge = {
  name: ProductBadgeName
  value?: number
}
