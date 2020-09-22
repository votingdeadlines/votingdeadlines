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

.state, .dc {
  opacity: 0.83;
}

#ILm {
  /*opacity: 1;*/
}

.state:not(:hover) {
  transition: opacity 400ms ease;
}

.state:hover {
  opacity: 1;
}

/* TODO: DRY with Crosshatch */

.ctGreen1 {
  fill: var(--ctGreen);
}

.ctYellow1 {
  fill: var(--ctYellow);
}

.ctRed1 {
  fill: var(--ctRed);
}

.ctGray1 {
  fill: var(--ctGray);
}

</style>

<script lang="typescript" type="text/typescript">
  // Imports
  import Legend from './Legend.svelte'
  import { stateOutlines } from './mapOutlines'
  import { getStateColors, getStateColorsIndex } from './mapUtilities'

  // Props
  export let statesAndDc

  const colors = getStateColorsIndex(statesAndDc)

  const statesAndDcAbbrevs = Object.keys(statesAndDc).sort()
  const statesOnlyAbbrevs = statesAndDcAbbrevs.filter(k => k !== 'DC')
</script>

<figure class='map-usa'>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 5 910 585">
    <!-- 50 states -->

    <g class="states">
      {#each statesAndDcAbbrevs as entityAbbrev}
        <!-- TODO: replace with <Crosshatch /> -->
        <pattern
          id="{entityAbbrev}p"
          width="9"
          height="9"
          patternTransform="rotate(-47 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="9" height="9" class="{colors[entityAbbrev].ol}"/>
          <rect x="0" y="0" width="9" height="3" class="{colors[entityAbbrev].ip}"/>
          <rect x="0" y="3" width="9" height="3" class="{colors[entityAbbrev].ml}"/>
        </pattern>
      {/each}

      {#each statesOnlyAbbrevs as stateAbbrev}
        <a href="#{stateAbbrev}" class="state-link">
          <path
            id="{stateAbbrev}m"
            class="state"
            fill="url(#{stateAbbrev}p)"
            d="{stateOutlines[stateAbbrev]}"
          >
            <title>{stateAbbrev}</title>
          </path>
        </a>
      {/each}

      <!-- DC  -->

      <a href="#DC">
        <circle class='dc' fill="url(#DCp)" cx="800" cy="251.8" r="5"></circle>
        <title>District of Columbia</title>
      </a>
    </g>
  </svg>
</figure>

<Legend />
