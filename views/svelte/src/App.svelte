<style>
/* Layout */

main {
  padding: 8px 16px;
  max-width: 1024px;
  margin: 0 auto;
}

.legend {
  /*flex-basis: 30%;*/
  background: #eee;
  height: 30px;
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
  <Headline>Voter Registration Deadlines</Headline>
  <Tagline>Register while you still can! Data combined from public, nonprofit, and media sources.</Tagline>
  <TaglineS>Updated 11 hours ago. (<Link href='https://github.com'>Changelog</Link>) (<Link href='https://github.com'>Source code</Link>)</TaglineS>

  <div class="map-wrapper">
    <Map statesAndDc={statesAndDc} />
  </div>

  <div class="legend"></div>

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
