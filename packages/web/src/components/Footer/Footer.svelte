<style>
  footer {
    background: rgb(226, 226, 226);
    color: var(--taglineGray);
    margin-top: 4rem;

    padding: 2.5rem 2rem 2rem;
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

<footer>
  <p>
    <a href='https://github.com/usagov/vote-gov/blob/master/config/gulp/state-data.json'>Data</a> from <a href="https://vote.gov">Vote.gov</a> and <a href="https://voteamerica.com">VoteAmerica</a>, plus manual comparisons with data from <a href="projects.fivethirtyeight.com/how-to-vote-2020/">FiveThirtyEight</a> and <a href="https://vote.org">Vote.org</a>. Built with TypeScript and Svelte.
  <p>

  <p>
    This is version v0.1.0, published October 6, 2020. (Biggest change: AZ has been pushed back to October 23.) The data should be almost identical to the <a href='https://github.com/usagov/vote-gov/blob/master/config/gulp/state-data.json'>Vote.gov data</a>, which may have errors, or be out of date; check your state's official website for the most authoritative information. Other errors may have been introduced by our code as well. For feedback or errors, email <a href="mailto:votingdeadlines@almnac.com">votingdeadlines@almnac.com</a>.
  </p>

  <ul>
    <li>
      <span>🐙 GitHub:</span> <a href="https://github.com/votingdeadlines">github.com/votingdeadlines</a>
    </li>
    <li>
      <span>🐘 Mastodon:</span> <a href="https://mastodon.social/@votingdeadlines">@votingdeadlines@mastodon.social</a>
    </li>
    <li>
      <span>🐦 Twitter:</span> <a href="https://twitter.com/votingdeadlines">@votingdeadlines@twitter.com</a>
    </li>
  </ul>

  <p class='license'>
    <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/80x15.png" /></a> Licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</a>.
  </p>
</footer>
