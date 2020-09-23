<style>
ol {
  padding-left: 0;
}
</style>

<script lang="ts" type="text/typescript">
import StateItem from './StateItem.svelte'

// Props
export let stateColorsIndex
export let entries = []
export let timeNow
</script>

<ol class="states-index">
  {#each entries as st}
    <StateItem
      abbrev="{st[0]}"
      data="{st[1]}"
      stateColors={stateColorsIndex[st[0]]}
      timeNow={timeNow} />
  {/each}
</ol>
