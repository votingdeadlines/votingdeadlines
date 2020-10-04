<style>
h1 {
  text-align: center;
  margin: 0 0 1rem;
}

p {
  font-size: 1.25rem;
  margin: 0 0 0.75rem;
  text-align: center;
  color: var(--ctGray);
}

p ~ p {
  font-size: 1rem;
}

.map-wrapper {
  margin-bottom: 2rem;
  /*display: none;*/
}

/* Desktop */
@media screen and (min-width: 900px) {
  .map-wrapper {
    margin-bottom: 4rem;
  }
}
</style>

<script lang="ts" type="text/typescript">
// import Header from './Header.svelte'
// import Headline from './Headline.svelte'
// import StateIndex from './StateIndex.svelte'
// import Tagline from './Tagline.svelte'
// import TaglineS from './TaglineS.svelte'
// import Link from './Link.svelte'
// import { getStateColorsIndex } from './colorUtilities'

import { default as smoothscroll } from 'smoothscroll-polyfill'
import { default as datafile } from '../../data/data/votingDeadlines.json'
import type { MergedStateRegIndex } from '../../data/src/mergeData'
import { VDStateIndex } from '../../data/src/models/State'
import DS from '../DS/DS.svelte'
import ButtonGroup from '../ButtonGroup/ButtonGroup.svelte'
import Map from '../Map/Map.svelte'
import StateIndex from '../StateIndex/StateIndex.svelte'
import Footer from '../Footer/Footer.svelte'

// smoothscroll.polyfill()

const vdStateIndex = VDStateIndex.fromMap(datafile as MergedStateRegIndex)
const { swingStates, senateRaces, regions} = vdStateIndex
const endingSoonest = vdStateIndex.endingSoonest(10)
</script>

<aside id="top" />
<h1>Voter Registration</h1>
<p>Days left as of Tuesday, October&nbsp;6,&nbsp;2020.</p>
<p>
  <a target="_blank" href="https://www.headcount.org/verify-voter-registration/">Triple-check your registration status</a> if you haven't already!
</p>
<div class="map-wrapper">
  <Map vdStateIndex={vdStateIndex} />
</div>

<ButtonGroup heading='Swing states' states={swingStates} />
<ButtonGroup heading='Ending soon' states={endingSoonest} />
<ButtonGroup heading='Northeast' states={regions.Northeast} />
<ButtonGroup heading='South' states={regions.South} />
<ButtonGroup heading='Midwest' states={regions.Midwest} />
<ButtonGroup heading='West' states={regions.West} />
<ButtonGroup heading='Senate races' states={senateRaces} />

<StateIndex stateIndex={vdStateIndex} />

<!-- It seem that to import the DS CSS (e.g. :root vars), we need to include -->
<!-- actual markup from DS.svelte. Maybe we should move this to global CSS. -->
<DS />
