<style>
/* TODO: DRY variables with Header.svelte */

/*:root {*/
/* Layout */
/*--logoGraphicWidth: 32px;*/
/*--logoGraphicHeight: var(--logoGraphicWidth);*/
/*--logoTypeFontSize: 14px;*/
/*--logoTypeMarginTop: 2px;*/
/*--logoTypePaddingLeft: 16px;*/

/* Colors */

/*--logoGray: rgba(0, 0, 0, 0.1);*/
/*--titleBlack: rgba(0, 0, 0, 0.8);*/
/*--underlineRed: var(--brandRed);*/
/*--subtitleGray: hsl(0, 0%, 67%);*/
/*}*/

/* Layout */

h2,
h3 {
  font-family: 'Montserrat';
  font-weight: 800;
  font-size: var(--logoTypeFontSize);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  text-align: center;
  line-height: 2;

  color: var(--titleBlack);
}

h2 {
  margin-bottom: 24px;
}

h3 {
  margin: 8px 0 4px;
}

.underlined {
  padding-bottom: 1px;
  border-bottom: 3px solid var(--underlineRed);
}

.period {
  padding-left: 2px;
}
</style>

<script lang="ts" type="text/typescript">
export let addPeriod: boolean = false
export let addUnderline: boolean = false
export let h3: boolean = false

const wordsClass = `words${addUnderline ? ' underlined' : ''}`
</script>

<!-- TODO: figure out a better solution for dynamic tag names. -->

{#if h3}
  <h3>
    <span class="{wordsClass}"><slot /></span>{#if addPeriod}
      <span class="period">.</span>
    {/if}
  </h3>
{:else}
  <h2>
    <span class="{wordsClass}"><slot /></span>{#if addPeriod}
      <span class="period">.</span>
    {/if}
  </h2>
{/if}
