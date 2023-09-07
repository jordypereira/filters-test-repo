import { describe, expect, test } from 'vitest'
import { stripStorefrontCodeFromUrl } from './stripStorefrontCode'
import { getGeneratedStorefronts } from 'lib/storefronts'

describe('it can separate the storefront from a url', () => {
  const url = '/right-now'
  const urlLong = '/right-now/famous-tomorrow'
  const query = '?market=de'
  const query2 = '/?market=de'
  const empty = ''
  const storefronts = getGeneratedStorefronts()
  const testStorefronts = [...storefronts.map(storefront => storefront.storefrontCode), '_default']

  const testCases = [url, urlLong, query, query2, empty]

  testStorefronts.forEach(storefront => {
    testCases.forEach(url => {
      ;['', '/'].forEach(prefix => {
        const testString = `${prefix}${storefront}${url}`
        test(testString, async () => {
          const { storefrontCode, urlWithoutStorefrontCode } =
            stripStorefrontCodeFromUrl(testString)
          await expect(storefrontCode).toBe(storefront)
          await expect(urlWithoutStorefrontCode).toBe(url)
        })
      })
    })
  })
})
