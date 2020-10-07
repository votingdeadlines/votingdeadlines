<style>
article {
  --emojiLinkWidth: 2rem;
  --emojiLinkHeight: 2rem;

  padding: 1rem 0;
  margin-bottom: 0.5rem;
}

/* TODO: DRY with ButtonGroup */

.anchor {
  position: relative;
  top: -1.9rem;
}

.heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.emoji-link {
  display: inline-block;
  width: var(--emojiLinkWidth);
  height: var(--emojiLinkHeight);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  /*background: pink;*/
}

.emoji-link:hover {
  text-decoration: none;
}

/* Whitespace */
h3 > span {
  display: inline-block;
  width: 4px;
  flex: 0 0 4px;
}

.top-link {
  font-size: 14px;
}

p {
  margin: 0 0 12px;
}

/* Deadline cards */

.deadline-cards {
  margin-bottom: 12px;
}

@media screen and (min-width: 900px) {
  .deadline-cards {
    display: flex;
  }
  .deadline-cards > :global(label) {
    flex: 1 1 33%;
  }
}

/* More info links */

ul {
  list-style: none;
  padding-left: 0;
}

li {
  display: flex;
  margin-bottom: 12px;
}

li .dot {
  /* DRY with DeadlineCard */
  width: 2rem;
  flex: 0 0 2rem;
  text-align: center;
  margin-right: 4px;
}

li .copy {
  flex: 1 1;
}

.register.tooLate {
  text-decoration: line-through;
}

</style>

<script lang="ts" type="text/typescript">
import { stateEmojis } from '../../utilities/stateEmojis'
import DeadlineCard from './DeadlineCard.svelte'
import { DEADLINE_CARD_TYPES } from '../../types/deadlineCards'

// Props
export let state

if (!state) {
  throw new Error('No state passed to StateItem.')
}

const {
  abbrev,
  name,
  slug,
  isTooLateToRegister,
  isTooLateToRegisterOnline,
  officialInfoLink,
  officialRegistrationLink,
  officialCheckRegStatusLink,
} = state
const linkHref = `#${abbrev}`
const emoji = stateEmojis[abbrev]
</script>

<article>
  <aside class='anchor' id="{abbrev}" />
  <div class='heading'>
    <h3>
      <a class='emoji-link' target="_blank" href={linkHref}>{emoji}</a><span>&nbsp;</span>{name}
    </h3>
    <a class='top-link' href="#top">Top ⬆</a>
  </div>
  <p>Voter registration deadlines:</p>
  <div class='deadline-cards'>
    <DeadlineCard state={state} type={DEADLINE_CARD_TYPES.ONLINE} />
    <DeadlineCard state={state} type={DEADLINE_CARD_TYPES.IN_PERSON} />
    <DeadlineCard state={state} type={DEADLINE_CARD_TYPES.MAIL} />
  </div>
  <ul>
    {#if officialCheckRegStatusLink}
      <li>
        <span class='dot'>🌐</span>
        <span class='copy'>
          Check registration status (official):
          <a target="_blank" href={officialCheckRegStatusLink}>{officialCheckRegStatusLink}</a>
        </span>
      </li>
    {/if}
    <li>
      <span class='dot'>🌐</span>
      <span class='copy'>
        Official state election info: <a target="_blank" href="{officialInfoLink}">{officialInfoLink}</a>
      </span>
    </li>
    {#if officialRegistrationLink}
      <li>
        <span class='dot'>🌐</span>
        <span class='copy register {isTooLateToRegisterOnline ? 'tooLate' : ''}'>
          Register online (official):
          <a target="_blank" href={officialRegistrationLink}>{officialRegistrationLink}</a>
        </span>
      </li>
    {/if}
    <li>
      <span class='dot'>🌐</span>
      <span class='copy register {isTooLateToRegister ? 'tooLate' : ''}'>
        Register via:
        <a target="_blank" href="https://www.headcount.org/registertovote/">Headcount</a>
        ·
        <a target="_blank" href="httpshttps://www.voteamerica.com/register-to-vote-{slug}/">VoteAmerica</a>
      </span>
    </li>
    <li>
      <span class='dot'>🌐</span>
      <span class='copy'>More info:
        <a target="_blank" href="https://projects.fivethirtyeight.com/how-to-vote-2020/#{abbrev}-info">538</a>
        ·
        <a target="_blank" href="https://www.voteamerica.com/register-to-vote-{slug}/">VoteAmerica</a>
        ·
        <a target="_blank" href="https://vote.gov/register/{abbrev.toLowerCase()}">Vote.gov</a>
      </span>
    </li>
  </ul>
</article>
