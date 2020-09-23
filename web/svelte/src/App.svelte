<style>
/* Layout */

main {
  padding: 16px 16px;
  max-width: 1024px;
  margin: 0 auto;
}

@media screen and (min-width: 900px) {
  main {
    padding: 8px 16px;
  }
}

.headline-row {
  display: flex;
  justify-content: center;
}

.headline-wrapper {
  position: relative;
}

.alpha {
  display: none;
  position: absolute;
  top: -4px;
  right: -36px;
  font-size: 12px;
  font-weight: 400;
  font-family: var(--systemSansFontStack);

  color: var(--ctRed);
}

@media screen and (min-width: 900px) {
  .alpha {
    display: unset;
  }
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

footer {
  color: var(--taglineGray);
  margin-top: 6rem;
  margin-bottom: 3rem;
  max-width: 40em;
}
</style>

<script lang="ts" type="text/typescript">
import DS from './DS.svelte'
import Header from './Header.svelte'
import Headline from './Headline.svelte'
import StateIndex from './StateIndex.svelte'
import Tagline from './Tagline.svelte'
import TaglineS from './TaglineS.svelte'
import Link from './Link.svelte'
import Map from './Map.svelte'
import { getStateColorsIndex } from './colorUtilities'

// Props
export let statesAndDc
export let timeNow

const stateColorsIndex = getStateColorsIndex(statesAndDc, timeNow)
</script>

<Header />
<main id="map">
  <div class="copy">
    <div class="headline-row">
      <div class="headline-wrapper">
        <Headline>
          Voter Registration Deadlines <span class="alpha">alpha</span>
        </Headline>
      </div>
    </div>
    <Tagline>
      A dozen states are closing in less than 10 days!
      <span>Register while you still can.</span>
    </Tagline>
    <TaglineS className="mb12">
      Time left as of Saturday, September 26, 2020. Data from Vote.gov.
    </TaglineS>
  </div>

  <div class="map-wrapper">
    <Map
      stateColorsIndex={stateColorsIndex}
      statesAndDc={statesAndDc}
    />
  </div>

  <StateIndex
    stateColorsIndex={stateColorsIndex}
    entries={statesAndDc}
    timeNow={timeNow}
  />

  <footer>
    This website was made using data from Vote.gov, with manual and automated comparisons to data from VoteAmerica.com and FiveThirtyEight.com. Code will be open source soon on GitHub.
  </footer>
</main>

<!-- It seem that to import the DS CSS (e.g. :root vars), we need to include -->
<!-- actual markup from DS.svelte. Maybe we should move this to global CSS. -->
<DS />
