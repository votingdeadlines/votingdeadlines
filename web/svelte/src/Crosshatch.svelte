<script lang="typescript" type="text/typescript">
// Props
export let id
export let rotation = '-45'
export let backgroundFill
export let hatch1Fill
export let hatch2Fill
</script>

<pattern
  id="{id}"
  width="9"
  height="9"
  patternTransform="rotate({rotation} 0 0)"
  patternUnits="userSpaceOnUse"
>
  <rect x="0" y="0" width="9" height="9" fill="{backgroundFill}"></rect>
  {#if hatch1Fill}
    <rect x="0" y="0" width="9" height="3" fill="{hatch1Fill}"></rect>
  {/if}
  {#if hatch2Fill}
    <rect x="0" y="3" width="9" height="3" fill="{hatch2Fill}"></rect>
  {/if}
</pattern>
