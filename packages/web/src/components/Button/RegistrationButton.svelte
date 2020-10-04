<style>
  :root {
    --buttonDefaultBg: #ddd;
    --buttonDefaultBorderColor: #dadada;
  }

  a {
    appearance: button;
    display: inline-block;
    text-align: center;
    padding: 3px;
    margin: 6px;

    /* Default size */
    font-size: 16px;

    /* Appearance */
    color: inherit;
    border-radius: 4px;
    border: none;
  }

  a > span {
    display: inline-block;
    min-width: 8.125em;
    padding: 1em 8px;
    border-radius: 2px;
    background: hsla(0, 0%, 95%, 88%);
  }

  small {
    margin-left: -0.1em;
  }
</style>

<script lang="typescript" type="text/typescript">
import { stateEmojis } from '../../utilities/stateEmojis'
import { patternMap } from '../Pattern/crosshatchSVG.ts'

// Props
export let state

const { abbrev, colors, copy, colorsKey } = state
const linkHref = `#${abbrev}`
const emoji = stateEmojis[abbrev]
</script>

<a href={linkHref} style='background-image: {`url(${patternMap[colorsKey]})`}'>
  <span>
    <small>{emoji}</small>
    <strong>
      {state.abbrev}
    </strong>
    <span class='countdown'>
      {copy.buttonCopy}
    </span>
  </span>
</a>
