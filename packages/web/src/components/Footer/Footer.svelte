<style>
.footer {
  background: rgb(226, 226, 226);
  color: var(--taglineGray);
  margin-top: 3rem;
  padding: 2rem 2rem 2rem;

  border: 3px solid var(--ctGray);
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

p {
  margin-top: 0;
  max-width: 40em;
}

ul {
  padding-left: 0;
  list-style: none;
}

li {
  margin: 0 0 1rem;
}

li span {
  display: inline-block;
  min-width: 8em;
}

.license {
  margin-top: 2rem;
}

.license img {
  position: relative;
  top: 1px;
}
</style>

<script lang="ts" type="text/typescript">
import { version } from '../../../package.json'
</script>

<div class="footer">
  <p>
    <a
      href="https://github.com/usagov/vote-gov/blob/master/config/gulp/state-data.json"
    >Data</a>
    from
    <a href="https://vote.gov">Vote.gov</a>
    and
    <a href="https://voteamerica.com">VoteAmerica</a>, with manual comparisons
    to data from
    <a href="https://projects.fivethirtyeight.com/how-to-vote-2020/">FiveThirtyEight</a>
    and
    <a href="https://vote.org">Vote.org</a>.
  </p>
  <p>
    The data is mostly identical to the
    <a
      href="https://github.com/usagov/vote-gov/blob/master/config/gulp/state-data.json"
    >Vote.gov data</a>, which may contain errors, or be out of date; other errors
    may have been introduced by our code. Check your state's official website
    for the most authoritative information.
  </p>
  <p>
    This is version v{version}, published October 14, 2020. (Biggest recent changes:
    court orders extending <a href="/#VA">Virginia</a>'s deadline from 10/13 to 10/15, and shortening <a href="/#AZ">Arizona</a>'s from 10/23 to 10/15.
  </p>

  <p>To give feedback or report errors:</p>

  <ul>
    <li>
      <span>🐙 GitHub:</span>
      <a
        href="https://github.com/votingdeadlines"
      >github.com/votingdeadlines</a>
    </li>
    <li>
      <span>🐦 Twitter:</span>
      <a
        href="https://twitter.com/votingdeadlines"
      >@votingdeadlines</a>
    </li>
    <li>
      <span>🐘 Mastodon:</span>
      <a
        href="https://mastodon.social/@votingdeadlines"
      >@votingdeadlines@mastodon.social</a>
    </li>
    <li>
      <span>📫 Email:</span>
      <a href="mailto:votingdeadlines@almnac.com">votingdeadlines@almnac.com</a>
    </li>
  </ul>

  <p class="license">
    <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img
        alt="Creative Commons License"
        style="border-width:0"
        src="https://i.creativecommons.org/l/by/4.0/80x15.png"
      /></a>
    Licensed under a
    <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative
      Commons Attribution License</a>.
  </p>
</div>
