import { describe, expect, test } from 'vitest'
import { parseURL } from './index'

describe('it can strings as url', () => {
  test('starts with ""', async () => {
    const string = '//a.storyblok.com/se-withoutfreeshipping.svg'
    await expect(parseURL(string)).toBeTruthy()
  })
  test('starts with //', async () => {
    const string = 'a.storyblok.com/se-withoutfreeshipping.svg'
    await expect(parseURL(string)).toBeTruthy()
  })
  test('starts with /', async () => {
    const string = '/a.storyblok.com/se-withoutfreeshipping.svg'
    await expect(parseURL(string)).toBeTruthy()
  })
  test('starts with http://', async () => {
    const string = 'http://a.storyblok.com/se-withoutfreeshipping.svg'
    await expect(parseURL(string)).toBeTruthy()
  })
  test('starts with https://', async () => {
    const string = 'https://a.storyblok.com/se-withoutfreeshipping.svg'
    await expect(parseURL(string)).toBeTruthy()
  })
})
