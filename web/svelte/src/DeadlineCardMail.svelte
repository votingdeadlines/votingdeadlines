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
// Imports
import DeadlineCard from './DeadlineCard.svelte'
import DeadlineCountdownDetails from './DeadlineCountdownDetails.svelte'
import { getMailUiBooleans, getMailDeadlineUiDates } from './stateUtilities'
import SvgMailbox from './SvgMailbox.svelte'

// Props
export let stateData = {}
export let timeNow
export let color

const { stateName } = stateData

// UI determination
const ui = getMailUiBooleans(stateData)

// Relevant dates (if countdown)
const isCountdown = ui.isPostmarkedCountdown || ui.isReceivedCountdown
const dates = isCountdown ? getMailDeadlineUiDates(stateData, timeNow) : null
</script>

<DeadlineCard title="By Mail" color="{color}">
  <figure slot="svg">
    <SvgMailbox />
  </figure>

  <!-- POSTMARKED  -->

  {#if ui.isPostmarkedCountdown}
    <p class="blurb">
      <strong>{dates.mainDeadlineDisplay}</strong> is the deadline for mail-in registration
      to be postmarked. This is in
    </p>
    <time style="display: block; margin-bottom: 1em">
      <strong style="font-size: 3em">{dates.mainCountdown.daysString}</strong>
      <strong style="font-size: 2em">+{dates.mainCountdown.hmsString}</strong>
    </time>
    <DeadlineCountdownDetails stateName="{stateName}" dates="{dates}" />

    <!-- RECEIVED -->
  {:else if ui.isReceivedCountdown}
    <p class="blurb">
      <strong>{dates.mainDeadlineDisplay}</strong> is the deadline for mail-in registration
      to be <em>received</em>. This is in
    </p>
    <time style="display: block; margin-bottom: 1em">
      <strong style="font-size: 3em">{dates.mainCountdown.daysString}</strong>
      <strong style="font-size: 2em">+{dates.mainCountdown.hmsString}</strong>
    </time>
    <DeadlineCountdownDetails stateName="{stateName}" dates="{dates}" />
  {:else if ui.isNotAvailable}
    <p class="blurb">
      <strong>Online registration is not available in this state.</strong>
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
