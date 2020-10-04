<style>
ol {
  padding-left: 0;
}
</style>

<script lang="ts" type="text/typescript">
import StateItem from './StateItem.svelte'

export let stateIndex

const states = stateIndex.states // alpha?
</script>

<ol>
  {#each states as state}
    <StateItem state={state} />
  {/each}
</ol>
