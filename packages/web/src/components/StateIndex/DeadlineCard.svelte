<style>
/*
So previously, there were multiple Svelte components per deadline type (e.g.
DeadlineCardOnline, etc.). This ended up feeling pretty wet, but the present
approach has way too much branching. TODO: decompose better
*/

/*
markup:

  label
    input
    .caret
    .card
      .summary
      .details
*/

label {
  --caretSVGWidth: 12px;
  --caretSVGHeight: 12px;
  --caretMargin: 4px 4px 0 0;
  --caretWidth: 2rem;
  --caretHeight: 3rem;
  --summaryHeight: 3rem;
  --summaryMargin: 4px 0;
  --cardMargin: 4px 0;

  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

input {
  display: none;
}

input:checked {
  border: 10px solid blue;
}

/* .caret */

.caret {
  font-size: 1.125rem;
  width: var(--caretWidth);
  height: var(--caretHeight);
  flex: 0 0 var(--caretWidth);
  margin: var(--caretMargin);

  display: flex;
  justify-content: center;
  align-items: center;

  transition: transform 80ms;
}

.caret svg {
  width: var(--caretSVGWidth);
  height: var(--caretSVGHeight);
}

input:not(:checked) ~ .caret {
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
}

/* .card */

.card {
  flex: 1;
  overflow: hidden;
  margin: var(--cardMargin);
  border-radius: 4px;
  padding: 3px;
}

input:not(:checked) ~ .card {
  /* Here it omits the borders from the calculation (good?) See also .summary */
  height: var(--summaryHeight);
}

input:checked ~ .card {
  max-height: 20em;
}

.card {
  background: var(--ctGray);
}

.card.red {
  background: var(--ctRed);
}

.card.yellow {
  background: var(--ctYellow);
}

.card.green {
  background: var(--ctGreen);
}

/* .summary */

.summary {
  /*height: var(--summaryHeight);*/
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

input:checked ~ .card .summary {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  opacity: 0;
  height: 0;
}

.summary span:first-child {
  font-weight: 700;
}

.details,
.summary {
  background: hsla(0, 0%, 95%, 88%);
  border-radius: 2px;
}

/* .details */

input:not(:checked) ~ .card .details {
  max-height: 0rem;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.details {
  padding: 1rem;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  text-align: center;
}

.blurb {
  margin: 0;
}

strong {
  display: block;
  font-weight: 700;
}

em {
  font-weight: 700;
  font-style: normal;
}

/*section > :global(figure) {*/
/* This selector is a bit hacky pending named slotted custom components. */
/* For now let's assume the svg slot direct child will be a <figure>.
  /* See also https://github.com/sveltejs/svelte/issues/1037 */
/*  max-width: 96px;
  max-height: 96px;
  width: 100%;
  margin: 0 auto;
  mix-blend-mode: luminosity;
}
*/
/*section > :global(.blurb) {
  flex: 1 1;
  margin: 12px 0 8px;
}*/
</style>

<script lang="ts" type="text/typescript">
// Props
export let state
export let type

const { colors, deadlinesDisplay } = state

const ui = state.policyUIBooleans(type)
const copy = state.policyUICopy(type)
// TODO: const color = state.policyUIColor(type)
const color = {
  ONLINE: colors.ol,
  IN_PERSON: colors.ip,
  MAIL: colors.ml,
}[type]
</script>

<label>
  <input type="checkbox" />

  <div class="caret">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 28">
      <polygon points="0,0 32,0 16,28" style="fill: #333"></polygon>
    </svg>
  </div>

  <div class="card {color}">
    <div class="summary">
      <span>{copy.title}:</span>&nbsp;<span>{copy.summaryDeadlineDisplay}</span>
    </div>

    <div class="details">
      <!-- <figure>$SVG</figure> -->

      {#if ui.isCountdown}
        <p class="blurb">
          <strong>{copy.mainDeadlineDisplay}</strong> is the last day to register {copy.byMethod}
          in {state.name}. {copy.thisIs}
        </p>
        <time>
          <strong style="font-size: 3em">{copy.deadlineDisplayLarge}</strong>
        </time>

      {:else if ui.isMailPostmarkedCountdown}
        <p class="blurb">
          <strong>{copy.mainDeadlineDisplay}</strong> is the deadline for mail-in registration to be postmarked.
          {copy.thisIs}
        </p>
        <time>
          <strong style="font-size: 3em">{copy.summaryDeadlineDisplay}</strong>
        </time>

      {:else if ui.isMailReceivedCountdown}
        <p class="blurb">
          <strong>{copy.mainDeadlineDisplay}</strong> is the deadline for mail-in registration to be <em>RECEIVED</em>.
          {copy.thisIs}
        </p>
        <time>
          <strong style="font-size: 3em">{copy.summaryDeadlineDisplay}</strong>
        </time>

      {:else if ui.isUnavailable}
        <p class="blurb">
          <strong>{copy.methodCaps} registration</strong>
          <span>is not available in {state.name} as far as we know.</span>
        </p>

      {:else if ui.isPassed}
        <p class="blurb">
          <strong>{copy.mainDeadlineDisplay}</strong> was the last day to register {copy.byMethod}
          in {state.name}.
        </p>

      {:else if ui.isUnsure}
        <p class="blurb">
          <strong>
            We're not sure if registration {copy.byMethod} is available, possibly due to a
            bug on our end, or issues with data. Check the links below for a second
            opinion!
          </strong>
        </p>

      {:else}
        <p class="blurb">
          <strong>
            We're not sure if registration {copy.byMethod} is available, probably due to a
            bug on our end. Check the links below for a better answer.
          </strong>
        </p>
      {/if}
    </div>
  </div>
</label>
