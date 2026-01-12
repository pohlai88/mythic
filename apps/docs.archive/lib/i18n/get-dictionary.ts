/**
 * Dictionary loader for Nextra 4 RSC i18n
 *
 * This file MUST be called in server components only.
 * Uses dynamic imports to load translations without shipping to client.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/internationalization
 */

import 'server-only'

// Enumerate all dictionaries
const dictionaries = {
  en: () => import('./dictionaries/en.json'),
  fr: () => import('./dictionaries/fr.json'),
  es: () => import('./dictionaries/es.json'),
  de: () => import('./dictionaries/de.json'),
  zh: () => import('./dictionaries/zh.json'),
  ja: () => import('./dictionaries/ja.json'),
  ru: () => import('./dictionaries/ru.json'),
  he: () => import('./dictionaries/he.json'),
} as const

export type Locale = keyof typeof dictionaries

/**
 * Get dictionary for a specific locale
 * Falls back to English if locale not found
 */
export async function getDictionary(
  locale: string
): Promise<typeof import('./dictionaries/en.json')> {
  const normalizedLocale = locale.toLowerCase().split('-')[0] as Locale
  const dictionaryLoader = dictionaries[normalizedLocale] || dictionaries.en
  const { default: dictionary } = await dictionaryLoader()
  return dictionary
}

/**
 * Get text direction for a locale
 * Returns 'rtl' for right-to-left languages, 'ltr' for others
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  const rtlLocales = ['he', 'ar', 'fa', 'ur']
  const normalizedLocale = locale.toLowerCase().split('-')[0] ?? locale.toLowerCase()
  return rtlLocales.includes(normalizedLocale) ? 'rtl' : 'ltr'
}

/**
 * Get available locales
 */
export function getAvailableLocales(): Locale[] {
  return Object.keys(dictionaries) as Locale[]
}
