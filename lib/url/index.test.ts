import { afterEach, describe, expect, test, vi } from 'vitest'
import { languageCodes, url } from './index'

const mockStorefrontCode = 'uk'

const testData = [
  ['_default/adults/', '/uk/adults'],
  ['/', '/uk/'],
  ['https://careers.happysocks.com/', 'https://careers.happysocks.com/'],
  ['www.careers.happysocks.com/', 'https://www.careers.happysocks.com/'],
  ...languageCodes.map(l => [`/${l}/about-us/all-stores/`, '/uk/about-us/all-stores']),
]

describe('url', () => {
  vi.mock('./../../stores/storefront', () => ({
    useStorefrontStore: () => ({
      currentStorefrontCode: mockStorefrontCode,
    }),
  }))

  afterEach(() => {
    vi.restoreAllMocks()
  })
  test('should return the correct URL with parameters', () => {
    const path = '/some-path'
    const parameters = { foo: 'bar', baz: 'qux' }

    const result = url(path, parameters)

    expect(result).toEqual(`/${mockStorefrontCode}/some-path?foo=bar&baz=qux`)
  })

  test('should return the correct URL without parameters', () => {
    const path = '/some-path'

    const result = url(path)

    expect(result).toEqual(`/${mockStorefrontCode}/some-path`)
  })

  test.each(testData)('should return the correct URL for %s', (path, expected) => {
    const result = url(path)

    expect(result).toEqual(expected)
  })
})
