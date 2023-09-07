export const replaceAll = (haystack: string, needle: string, replacement: string) =>
  haystack.replace(new RegExp(needle, 'g'), replacement)

export const toKebabCase = (string: string): string =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()

export const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export const capitalizeSentence = (sentence: string): string => {
  return sentence
    .split(/[_\s]/)
    .map(word =>
      word
        .split('-')
        .map(innerWord => capitalize(innerWord))
        .join('-')
    )
    .filter(Boolean)
    .join(' ')
}

export const stripTrailingSlashes = (string: string): string => string.replace(/\/$/, '')
export const stripLeadingSlashes = (string: string): string => string.replace(/^\//, '')

export const uppercaseSkipSpecialChar = (text: string) => {
  const specialChar = ['ß']
  let output = ''

  for (const char of text) {
    if (specialChar.includes(char)) {
      output += char
    } else {
      output += char.toUpperCase()
    }
  }
  return output
}
