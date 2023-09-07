import { z } from 'zod'
import { NuxtSSRContext } from '#app'
import { getRouterParams } from 'h3'
import { RouteParams } from 'vue-router'
import { getQuery as getQueryClient, withQuery } from 'ufo'
import { getQuery as getQueryServer } from 'h3'

import { stripTrailingSlashes } from './strings'
import { url } from './url/index'

import { Route } from 'types/route'
import { Checkout } from 'types/checkout'

export const pathFromRoute = (route: Route): string => {
  const transformed = route.fullPath.slice(1).replace(/\/$/, '')
  return transformed.split('/checkout').shift() || transformed
}

interface Meta {
  [key: string]: string | boolean | undefined
  ['isCheckoutPage']?: true
  ['context']?: string
  ['section']?: string
  ['views']?: Checkout.View
}

export const parseMeta = (route?: Route): Meta => {
  if (!route) return {}

  let meta: { [key: string]: string } = {}
  if (Array.isArray(route.meta)) {
    route.meta?.forEach((metaValues: { [key: string]: string }) => {
      meta = { ...metaValues, ...meta }
    })
  } else if (route.meta) {
    meta = route.meta
  }

  return meta as Meta
}

export const productUrl = (sku: string) => {
  return url(`/product/${sku}`)
}

export const getPathFromURL = (url: string): string =>
  stripTrailingSlashes(url || '').split(/[?#]/)[0]

export const checkoutUrl: Helpers.CheckoutUrlHelper = ({
  route,
  view,
  orderId,
}: {
  route: Route
  view: string
  orderId?: string
}) => {
  const suffix = view === 'success' ? `success/${orderId}` : view
  const {
    $currentStorefront: { storefrontCode },
  } = useNuxtApp()

  switch (true) {
    // uk/broken-link -> uk/checkout/cart
    // uk/product/abc-123 -> uk/checkout/cart
    case Boolean(route.params.isError):

    default: {
      const url = `/${storefrontCode}/checkout/${suffix || 'cart'}`

      if (route.query) {
        const query = getQueryClient(route.fullPath)
        return withQuery(url, query)
      }

      return url
    }
  }
}

export const isWhiteListed = (route: Route) =>
  [new RegExp(`/collections/(.*)`), new RegExp(`/faq/(.*)`), '_default', 'api'].some(path => {
    if (path instanceof RegExp) {
      return path.test(route.path)
    }

    if (route.path === '/') return true

    return route.path.includes(path)
  })

export const isRelativeUrl = (url: string) => {
  const { host } = new URL(url)
  return !host
}

export const QueryObject = z.record(z.union([z.string(), z.string().array()]))
export type QueryObject = z.infer<typeof QueryObject>

export function getQueryObject(ssrContext?: NuxtSSRContext): QueryObject {
  if (!ssrContext) {
    const route = useRoute()
    return QueryObject.parse(route.query)
  }

  const query = getQueryServer(ssrContext!.event)
  return QueryObject.parse(query)
}

export function getRouteParams(ssrContext?: NuxtSSRContext): QueryObject {
  if (!ssrContext) {
    const route = useRoute()
    return route.params
  }

  return getRouterParams(ssrContext!.event)
}

export function getRouteParam(params: RouteParams, key: string): string | undefined {
  const value = params[key]
  if (Array.isArray(value)) {
    return value.toString()
  } else {
    return value?.toString()
  }
}
