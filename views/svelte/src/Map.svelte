<style>
/************************/
/* Map layout & borders */
/************************/

.map-usa {
  width: 85%;
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
  opacity: 0.8;
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

.ctGreen1 {
  fill: var(--ctGreen1);
}

.ctYellow1 {
  fill: var(--ctYellow1);
}

.ctOrange1 {
  fill: var(--ctOrange1);
}

.ctRed1 {
  fill: var(--ctRed1);
}

.ctLightGray1 {
  fill: var(--ctLightGray1);
}

/*******************/
/* WIP USA, take 3 */
/*******************/



</style>

<script lang="typescript" type="text/typescript">
  // Imports
  import DS from './DS.svelte'
  import { stateOutlines } from './mapOutlines'
  import { getStateTierV0, getStateColors, getStateColorsIndex } from './mapUtilities'

  // Props
  export let statesAndDc

  // console.log(`1. About to get state colors index.`)
  // const colors1 = Object.entries(statesAndDc).reduce((memo, entity) => {
  //   const abbrev = entity[0]
  //   const data = entity[1]
  //   const onlineIsoDate = data.onlineRegPolicies.policies[0].isoDate
  //   const ipIsoDate = data.inPersonRegPolicies.policies[0].isoDate
  //   memo[abbrev] = getStateTierV0(onlineIsoDate) || getStateTierV0(ipIsoDate) || 'na'

  //   // IL 2 (WIP)
  //   if (abbrev === 'IL') {
  //     console.log(`2. At IL. memo.IL is:`, memo.IL)
  //     memo[abbrev] = getStateColors(data)
  //     console.log(`2b. After IL call. memo.IL is:`, memo.IL)
  //   }

  //   return memo
  // }, {})
  // console.log(`3. OK so IL is colors.IL:`, colors1.IL)

  const colors = getStateColorsIndex(statesAndDc)

  const statesAndDcAbbrevs = Object.keys(statesAndDc)
  const statesOnlyAbbrevs = statesAndDcAbbrevs.filter(k => k !== 'DC')

  console.log(`5. Now via getStateColorsIndex, colors.IL:`, colors.IL)
</script>

<figure class='map-usa'>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 5 910 585">
    <!-- 50 states -->

    <g class="states">
      {#each statesAndDcAbbrevs as entityAbbrev}
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
        <circle class='dc' fill="url(#DCp)" cx="801.3" cy="251.8" r="4.5"></circle>
        <title>District of Columbia</title>
      </a>
    </g>
  </svg>
</figure>
