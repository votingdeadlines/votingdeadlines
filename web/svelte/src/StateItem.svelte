<style>
article {
  margin-top: 1rem;
}

.deadline-cards {
  display: flex;
  margin-left: -8px;
  margin-right: -8px;
}

.deadline-cards > :global(*) {
  flex: 1 1;
  margin-bottom: 1rem;

  /*
  The max main column width is 1024px, with 16px * 2 padding, so 992px.
  Assuming 16px * 2 gutters, that's 960px available for card width, 320px each.
  To get the 16px gutters, we put 8px on each side, plus -8px on the parent.
  */
  max-width: 320px;
  margin-left: 8px;
  margin-right: 8px;
}

.more-info {
  margin-bottom: 3rem;
  text-align: center;
}

.links {
  margin-bottom: 8px;
}

/* Phone */
@media screen and (max-width: 450px) {
  .deadline-cards {
    flex-direction: column;
    align-items: center;
  }

  .more-info {
    flex-direction: column;
    align-items: center;
  }
}

/* Tablet */
@media screen and (min-width: 450px) and (max-width: 900px) {
  .deadline-cards {
    flex-direction: column;
    align-items: center;
  }

  .more-info {
    flex-direction: column;
    align-items: center;
  }
}

/* Desktop */
@media screen and (min-width: 900px) {
  .deadline-cards {
  }
}
</style>

<script lang="ts" type="text/typescript">
import BrandCapsHeading from './BrandCapsHeading.svelte'
import CapsHeading from './CapsHeading.svelte'
import DeadlineCardOnline from './DeadlineCardOnline.svelte'
import DeadlineCardMail from './DeadlineCardMail.svelte'
import DeadlineCardInPerson from './DeadlineCardInPerson.svelte'
import DeadlineCard from './DeadlineCard.svelte'
// import SvgClipboard from './SvgClipboard.svelte'

// Props
export let abbrev = ''
export let data = {} // TODO: rename stateData
export let stateColors = {}
export let timeNow

const stateData = data
const { stateAbbrev, stateName } = stateData
const lcStateName = stateName.toLowerCase()
</script>

<article id="{abbrev}">
  <BrandCapsHeading>{stateData.stateName} Registration&nbsp;Deadlines</BrandCapsHeading>

  <div class="deadline-cards">
    <DeadlineCardOnline stateData={stateData} timeNow={timeNow} color={stateColors.ol} />
    <DeadlineCardInPerson stateData={stateData} timeNow={timeNow} color={stateColors.ip} />
    <DeadlineCardMail stateData={stateData} timeNow={timeNow} color={stateColors.ml} />
  </div>

  <div class='more-info'>
    <CapsHeading h3>Double check this info:</CapsHeading>
    <div class='links'>
      <a href="https://www.voteamerica.com/register-to-vote-{lcStateName}">VoteAmerica.com</a>
      &nbsp;·&nbsp;
      <a href="https://projects.fivethirtyeight.com/how-to-vote-2020/#{stateAbbrev}-info">FiveThirtyEight.com</a>
      &nbsp;·&nbsp;
      <a href="https://vote.gov/register/{stateAbbrev}">Vote.gov</a>
    </div>

    <a href='#map'>⬆ Back to map</a>
  </div>
</article>
