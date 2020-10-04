import { encode } from 'js-base64'

// This is a somewhat convoluted way to create SVG fill patterns usable in CSS.
// The best way to do that seems to be to use an SVG encoded as base64, which
// means we probably can't use the Svelte SVG components. If this works, we may
// want to phase those out entirely to avoid duplication.

function colorDefinition(colorKey: string): string {
  // This is WET with DS.svelte's CSS variable color definitions, because
  // it seems base64 SVGs may not be stylable via external CSS. This isn't
  // the end of the world though given that we may want slightly different
  // values for the buttons anyway.
  return {
    red: 'hsl(7, 71%, 58%)', // ~var(--ctRed) in DS.svelte
    yellow: 'hsl(46, 86%, 67%)', // ~var(--ctYellow)
    green: 'hsl(164, 78%, 44%)', // ~var(--ctGreen)
    gray: 'hsl(0, 0%, 50%)', // ~var(--ctGray)
  }[colorKey]
}

function buildCrosshatchSVGString(
  id: string,
  rotation: string = '-45',
  backgroundFill: string,
  hatch1Fill: string,
  hatch2Fill: string
): string {
  const patternId = `${id}-pattern`
  const svg = `
<svg
  id="${id}"
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
>
  <pattern
    id="${patternId}"
    width="9"
    height="9"
    patternTransform="rotate(${rotation} 0 0)"
    patternUnits="userSpaceOnUse"
  >
    <rect x="0" y="0" width="9" height="9" fill="${backgroundFill}"></rect>
    <rect x="0" y="0" width="9" height="3" fill="${hatch1Fill}" opacity="1"></rect>
    <rect x="0" y="3" width="9" height="3" fill="${hatch2Fill}" opacity="1"></rect>
  </pattern>
  <rect width="100%" height="100%" fill="url(#${patternId})"></rect>
</svg>
  `.trim()
  return svg
}

function base64CrosshatchSVG(
  id: string,
  rotation: string = '-45',
  backgroundFill: string,
  hatch1Fill: string,
  hatch2Fill: string
): string {
  const svgString = buildCrosshatchSVGString(
    id,
    rotation,
    backgroundFill,
    hatch1Fill,
    hatch2Fill
  )
  const encodedSVG = encode(svgString)
  const prefix = 'data:image/svg+xml;base64,'
  return `${prefix}${encodedSVG}`
}

type Base64SVGPatternMap = {
  [key: string]: string
}

export const patternMap = buildBase64SVGs(['red', 'yellow', 'green', 'gray'])
function buildBase64SVGs(colors: Array<string>): Base64SVGPatternMap {
  const permutationsMap = {}
  colors.forEach(c1 => {
    colors.forEach(c2 => {
      colors.forEach(c3 => {
        const key = `${c1}-${c2}-${c3}`
        // TODO: if c1 == c2 == c3, use "c1" and no SVG?
        permutationsMap[key] = base64CrosshatchSVG(
          key,
          '-45',
          colorDefinition(c1),
          colorDefinition(c2),
          colorDefinition(c3),
        )
      })
    })
  })
  return permutationsMap
}
