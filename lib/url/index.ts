import { Environment } from 'types/environment'
// import { Helpers } from 'types/helpers'
import { MARKET_QUERY } from 'configuration/global.configuration'
// import { useStorefrontStore } from 'store/storefront'

import { stripStorefrontCodeFromUrl } from './stripStorefrontCode'
import {
  cleanDoubleSlashes,
  withQuery,
  withTrailingSlash,
  withoutLeadingSlash,
  withoutTrailingSlash,
  parseURL as parseURLUfo,
} from 'ufo'

export const parseURL = (url: string): URL => {
  const config = useRuntimeConfig()
  try {
    const withHttps = url.replace(/^(http[s]?)?:?(\/?\/?)/, 'https://')
    return new URL(withHttps)
  } catch (e) {
    console.error(e)
    return new URL('', config.public.baseUrlClient)
  }
}

export const sluggify = (string: string): string =>
  string
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')

export const replaceStorefrontcodeInUrl = (storefrontCode: Environment.StorefrontCode): string =>
  `${window.location.origin}/${storefrontCode}${
    stripStorefrontCodeFromUrl(window.location.pathname).urlWithoutStorefrontCode
  }`

export const languageCodes = ['en-GB', 'nl-NL', 'de-DE']

function stripLanguageCodeFromUrl(url: string) {
  const urlWithoutLanguageCode = url.replace(new RegExp(`^/(${languageCodes.join('|')})`, 'i'), '')

  return urlWithoutLanguageCode
}

const stripDefaultWord = (url: string) => {
  const stringToReplace = '/_default/'
  const defaultRegExp = new RegExp(stringToReplace)

  if (defaultRegExp.test(url)) {
    return url.replace(stringToReplace, '/')
  }
  return url
}

export const url: Helpers.UrlHelper = (path, parameters = {}) => {
  if (path.startsWith('www')) {
    path = 'https://' + path
  }

  const url = parseURLUfo(path)

  if (url.protocol || url.host) {
    return path
  }

  const storefrontCode = useStorefrontStore().currentStorefrontCode
  const pathWithoutLanguageCode = stripLanguageCodeFromUrl(path)
  const { urlWithoutStorefrontCode } = stripStorefrontCodeFromUrl(pathWithoutLanguageCode)

  const restOfUrl =
    urlWithoutStorefrontCode === '/'
      ? ''
      : withoutLeadingSlash(withoutTrailingSlash(urlWithoutStorefrontCode))
  const cleanedResult = cleanDoubleSlashes(`/${storefrontCode}/${restOfUrl}`)

  const result = stripDefaultWord(cleanedResult)

  return withQuery(withTrailingSlash(result), parameters)
}
