<style>
section {
  /* See parent for flex and margin. */
  padding: 1rem;
  text-align: center;

  background: var(--cardBgGray);
}

strong {
  display: block;
}
</style>

<script lang="ts" type="text/typescript">
import DeadlineCard from './DeadlineCard.svelte'
import DeadlineCountdownDetails from './DeadlineCountdownDetails.svelte'
import { getOnlineUiBooleans, getOnlineDeadlineUiDates } from './stateUtilities'
import SvgSmartphone from './SvgSmartphone.svelte'

// Props
export let stateData = {}
export let timeNow
export let color // class/code like 'ctRed1'

const { stateName } = stateData

// UI determination
const ui = getOnlineUiBooleans(stateData)

// Relevant dates (if countdown)
const dates = ui.isCountdown
  ? getOnlineDeadlineUiDates(stateData, timeNow)
  : null
</script>

<DeadlineCard title="Online" color="{color}">
  <figure slot="svg">
    <SvgSmartphone />
  </figure>

  {#if ui.isCountdown}
    <p class="blurb">
      <strong>{dates.mainDeadlineDisplay}</strong> is the last day to register online
      in {stateName}. This is in
    </p>
    <time style="display: block; margin-bottom: 1em">
      <strong style="font-size: 3em">{dates.mainCountdown.daysString}</strong>
      <strong style="font-size: 2em">+{dates.mainCountdown.hmsString}</strong>
    </time>
    <DeadlineCountdownDetails stateName="{stateName}" dates="{dates}" />
  {:else if ui.isNotAvailable}
    <p class="blurb">
      <strong>Online registration</strong>
      <strong>is not available in {stateName}.</strong>
    </p>
  {:else if ui.isUnsure}
    <p class="blurb">
      <strong>
        We're not sure if online registration is available, possibly due to a
        bug on our end, or issues with data. Check the links below for a second
        opinion!
      </strong>
    </p>
  {:else}
    <p class="blurb">
      <strong>
        We're not sure if online registration is available, probably due to a
        bug on our end. Check the links below for a better answer.
      </strong>
    </p>
  {/if}
</DeadlineCard>
