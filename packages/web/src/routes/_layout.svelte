<style>
main {
  position: relative;
  max-width: 920px;
  padding: 0 16px;
  margin: 0 auto;

  background-color: white;
}
</style>

<script lang="ts">
import Nav from '../components/Nav.svelte'

export let segment: string
</script>

<Nav segment="{segment}" />

<main>
  <slot />
</main>
