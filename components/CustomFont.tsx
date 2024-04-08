import * as React from 'react'
import * as types from '../lib/types'

export const CustomFont: React.FC<{ site: types.Site }> = ({ site }) => {
  if (!site.fontFamily) {
    return null
  }

  // https://developers.google.com/fonts/docs/css2
  const fontFamilies = [site.fontFamily]
  const googleFontFamilies = fontFamilies
    .map((font) => font.replace(/ /g, '+'))
    .map(
      (font) =>
        `family=${font}:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,500`
    )
    .join('&')
  const googleFontsLink = `https://fonts.googleapis.com/css?${googleFontFamilies}&display=swap`
  const cssFontFamilies = fontFamilies.map((font) => `"${font}"`).join(', ')

  return (
    <>
        <link rel='stylesheet' href={googleFontsLink} />

        <style>{`
          .notion.notion-app {
            font-family: ${cssFontFamilies}, -apple-system, BlinkMacSystemFont,
              'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif,
              'Segoe UI Emoji', 'Segoe UI Symbol';
          }
        `}</style>
    </>
  )
}
