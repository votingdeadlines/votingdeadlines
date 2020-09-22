<style>
/* Layout */

main {
  padding: 44px 16px;
  max-width: 1024px;
  margin: 0 auto;
}

.headline-row {
  display: flex;
  justify-content: center;
}

.headline-wrapper {
  position: relative;
}

.alpha {
  position: absolute;
  top: -4px;
  right: -36px;
  font-size: 12px;
  font-weight: 400;
  font-family: var(--systemSansFontStack);

  color: var(--ctRed);
}

.map-wrapper {
  margin-bottom: 4rem;
}


</style>

<script lang="ts">
import Countdown2 from './Countdown2.svelte'
import DS from './DS.svelte'
import Header from './Header.svelte'
import Headline from './Headline.svelte'
import Tagline from './Tagline.svelte'
import TaglineS from './TaglineS.svelte'
import Link from './Link.svelte'
import Map from './Map.svelte'
export let statesAndDc
</script>

<Header />
<main>
  <div class='copy'>
    <div class='headline-row'>
      <div class='headline-wrapper'>
        <Headline>Voter Registration Deadlines <span class='alpha'>alpha</span></Headline>
      </div>
    </div>
    <Tagline>
      <strong>Alaska</strong>,
      <strong>Florida</strong>,
      <strong>Arizona</strong>, &
      <strong>Georgia</strong>
      are closing soon!
      <span>Register while you still can.</span>
    </Tagline>
    <TaglineS className='mb12'>Time left as of Tuesday, September 22, 2020. Data from Vote.gov.</TaglineS>
  </div>

  <div class="map-wrapper">
    <Map statesAndDc={statesAndDc} />
  </div>

  <!-- Index -->
  <ol class="states-index">
    {#each Object.entries(statesAndDc) as st}
      <section id={st[0]}>
        <h2>{st[0]} registration deadlines:</h2>
        <Countdown2 type='ip' fromIsoDate={st[1].inPersonRegPolicies.policies[0].isoDate} />
        <Countdown2 type='ol' fromIsoDate={st[1].onlineRegPolicies.policies[0].isoDate} />
        <Countdown2 type='ml' fromIsoDate={st[1].mailRegPolicies.policies[0].isoDate} />
        <details
        >
          <summary>Data:</summary>
          <pre>{JSON.stringify(st[1], null, 2)}</pre>
        </details>
      </section>
    {/each}
  </ol>
</main>

<!-- It seem that to import the DS CSS (e.g. :root vars), we need to include -->
<!-- actual markup from DS.svelte. Maybe we should move this to global CSS. -->
<DS />
