<style>
/************************/
/* Map layout & borders */
/************************/

.map-usa {
  max-width: 800px;
  margin: 0 auto;
}

.map-usa svg {
  width: 100%;
  height: 100%;
}

.states {
  transform: rotate(-2deg);
}

.state,
.dc {
  stroke: white;
}

.state {
  stroke-width: 1; /* effectively 2 for inner borders */
}

.dc {
  stroke-width: 2; /* to match inner borders */
}

/*****************************/
/* Opacity / hover / colors */
/*****************************/

.state,
.dc {
  opacity: 1;
}

.state:not(:hover) {
  transition: opacity 400ms ease;
}

.state:hover {
  opacity: 0.83;
}

/* TODO: DRY with Crosshatch */

.green {
  fill: var(--ctGreen);
}

.yellow {
  fill: var(--ctYellow);
}

.red {
  fill: var(--ctRed);
}

.red.red-d0 {
  fill: red;
}

.gray {
  fill: var(--ctGray);
}
</style>

<script lang="typescript" type="text/typescript">
import Legend from './Legend.svelte'
import { stateOutlines } from './mapOutlines'

// Props
export let vdStateIndex

const states = vdStateIndex.states
const nonDCStates = vdStateIndex.nonDCStates
console.warn(`TODO: Filter nonDCStates`)
</script>

<figure class="map-usa">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 5 910 585">
    <g class="states">
      {#each states as state}
        <!-- TODO: replace with <Crosshatch /> -->
        <!-- TODO: reduce to minimum number of patterns needed -->
        <pattern
          id="{state.abbrev}p"
          width="9"
          height="9"
          patternTransform="rotate(-47 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="9"
            height="9"
            class="{state.colors.ol}"
          ></rect>
          <rect
            x="0"
            y="0"
            width="9"
            height="3"
            class="{state.colors.ip}"
          ></rect>
          <rect
            x="0"
            y="3"
            width="9"
            height="3"
            class="{state.colors.ml}"
          ></rect>
        </pattern>
      {/each}

      <!-- States not including DC (which needs special handling below) -->

      {#each nonDCStates as nonDCState}
        <a href="/#{nonDCState.abbrev}" class="state-link">
          <path
            id="{nonDCState.abbrev}m"
            class="state"
            fill="url(#{nonDCState.abbrev}p)"
            d="{stateOutlines[nonDCState.abbrev]}"
          >
            <title>{nonDCState.abbrev}</title>
          </path>
        </a>
      {/each}

      <!-- DC  -->

      <a href="/#DC">
        <circle class="dc" fill="url(#DCp)" cx="800" cy="251.8" r="5"></circle>
        <title>District of Columbia</title>
      </a>
    </g>
  </svg>
</figure>

<Legend />
