<style>
  h3 {
    font-family: 'Montserrat';
    font-weight: 800;
    text-transform: uppercase;
    font-size: 16px;
    letter-spacing: 0.07em;
    color: #333;
  }

  section {
    border: 1px solid #eee;
    padding: 4px 20px 0px;
    margin-bottom: 12px;
  }

  h1 {
    font-family: 'Montserrat';
    font-weight: 800;
    /*text-transform: uppercase;*/
    font-size: 24px;
    letter-spacing: 0.07em;
  }

  section.gt-30d {
    background: hsl(111, 55%, 95%); /* green */
  }

  section.lt-30d {
    background: hsl(75, 68%, 95%); /* lime */
  }

  section.lt-21d {
    background: hsl(52, 68%, 95%); /* yellow */
  }

  section.lt-14d {
    background: hsl(30, 68%, 95%); /* orange */
  }

  section.lt-7d {
    color: var(--titleRed);
  }

  .gt-30d h1 {
    color: green;
    color: hsl(111, 55%, 60%); /* green */
  }

  .lt-30d h1 {
    color: hsl(75, 68%, 54%); /* lime */
  }

  .lt-21d h1 {
    color: hsl(52, 68%, 54%); /* yellow */
  }

  .lt-14d h1 {
    color: hsl(30, 68%, 54%); /* orange */
  }

  .lt-7d h1 {
    color: var(--titleRed);
  }

</style>

<script lang="ts">
import { v1 } from './clientTimeUtils'

const { formatDurationFromIsoDate, getDurationFromIsoDate } = v1

export let type
export let fromIsoDate
let countdownDisplay = formatDurationFromIsoDate(fromIsoDate)

// TODO: RAF
setInterval(() => {
  countdownDisplay = formatDurationFromIsoDate(fromIsoDate)
}, 1000)

let typeDisplay
if (type === 'ip') typeDisplay = '👞 In-Person Registration'
if (type === 'ol') typeDisplay = '📱 Online Registration'
if (type === 'ml') typeDisplay = '🐌 Mail Registration'

// Coloring
const duration = getDurationFromIsoDate(fromIsoDate)
const durationDays = duration && duration.D
let durationTier
if (durationDays > 30) durationTier = 'gt-30d' // green
if (durationDays < 30) durationTier = 'lt-30d' // lime green
if (durationDays < 21) durationTier = 'lt-21d' // yellow
if (durationDays < 14) durationTier = 'lt-14d' // orange
if (durationDays < 7) durationTier = 'lt-7d' // red
if (!durationDays) durationTier = 'na' // gray

</script>

<section class={durationTier}>
  <h3>{typeDisplay}</h3>
  <p>In-person registration ends on {fromIsoDate}, in approximately:
  <h1 class={durationTier}>
    {countdownDisplay}
  </h1>
</section>
