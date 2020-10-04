<style>
h2 {
  margin: 0 0 0.5rem;
}

nav {
  /* Negative margins to offset button margins (8px). */
  margin: 0 -8px 1.75rem;
  display: flex;
  flex-wrap: wrap;
}

/* TODO: DRY with StateItem */

.anchor {
  position: relative;
  top: -1.9rem;
}

.heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

h2 a {
  color: inherit;
}

h2 a:hover {
  text-decoration: underline;
}

h2 span {
  opacity: 0.25;
}

.top-link {
  font-size: 14px;
}

</style>

<script lang="typescript" type="text/typescript">
import { stringToSlug } from '../../utilities/stringUtilities'
import RegistrationButton from '../Button/RegistrationButton.svelte'

// Props
export let heading
export let states

// Links
const anchorId = stringToSlug(heading)
const linkHref = `#${anchorId}`
</script>

<aside class='anchor' id="{anchorId}" />
<div class='heading'>
  <h2>
    <a href={linkHref}>
      <span>#</span>
      {heading}
    </a>
  </h2>
  <a class='top-link' href="#top">Top ⬆</a>
</div>
<nav>
  {#each states as state}
    <RegistrationButton state={state} />
  {/each}
</nav>
