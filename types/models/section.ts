import { sections } from 'data/defaults/sections'
import { CollectionEntity } from './collection'

export type Section = typeof sections[number]
export type SectionCollectionMap = { [key in Section | 'all']: CollectionEntity[] }
export type SectionRequestIdMap = { [key in Section | 'all']: string }

export const isSection = (value: any): value is Section => value && sections.includes(value)
