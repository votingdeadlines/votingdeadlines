<style>
section {
  padding: 8px 20px 12px;
  text-align: center;
  display: flex;
  flex-direction: column;

  background: var(--cardBgGray);
}

section.ctRed1 {
  background: var(--ctRedCardBg);
  color: var(--ctRedCardTextColor);
}

section.ctYellow1 {
  background: var(--ctYellowCardBg);
  color: var(--ctYellowCardTextColor);
}

section.ctGreen1 {
  background: var(--ctGreenCardBg);
  color: var(--ctGreenCardTextColor);
}

section > :global(figure) {
  /* This selector is a bit hacky pending named slotted custom components. */
  /* For now let's assume the svg slot direct child will be a <figure>.
  /* See also https://github.com/sveltejs/svelte/issues/1037 */
  max-width: 96px;
  max-height: 96px;
  width: 100%;
  margin: 0 auto;
  mix-blend-mode: luminosity;
}

section > :global(.blurb) {
  flex: 1 1;
  margin: 12px 0 8px;
}
</style>

<script lang="ts" type="text/typescript">
import CapsHeading from './CapsHeading.svelte'

// Props
export let title = ''
export let color = ''
</script>

<section class="{color}">
  <CapsHeading h3>{title}</CapsHeading>
  <slot name="svg" />
  <slot />
</section>
