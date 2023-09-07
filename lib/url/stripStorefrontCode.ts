import { isValidStorefrontCode } from 'types/models/storefront'
import { $URL, withQuery, withoutLeadingSlash, withoutTrailingSlash } from 'ufo'

/**
 * return the url without the storefront code (e.g. /uk/) and without a forward slash
 */
export const stripStorefrontCodeFromUrl = (slug: string) => {
  const url = new $URL(slug)
  const pathname = url.pathname
  const config = useRuntimeConfig()
  const env = config.public?.environment ?? 'production'
  const slugWithoutForwardSlash = withoutLeadingSlash(pathname)

  const potentialStorefrontCode = withoutTrailingSlash(slugWithoutForwardSlash.split('/')[0])

  const storefrontCode = isValidStorefrontCode(potentialStorefrontCode, env)
    ? potentialStorefrontCode
    : null

  const restOfUrl =
    (storefrontCode && slugWithoutForwardSlash.substring(storefrontCode.length)) || ''

  const urlWithoutStorefrontCode = withQuery(storefrontCode ? restOfUrl : pathname, url.query)

  return {
    storefrontCode,
    urlWithoutStorefrontCode,
    urlWithoutStorefrontCodeWithoutForwardSlash: urlWithoutStorefrontCode.startsWith('/')
      ? urlWithoutStorefrontCode.slice(1)
      : urlWithoutStorefrontCode,
  }
}
