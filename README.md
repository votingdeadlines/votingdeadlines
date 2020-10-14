# 🗓 VotingDeadlines.ts

This is a project for validating, organizing, and visualizing voting deadlines, starting with the 2020 elections in the USA.

The data pipeline is written in TypeScript, and the [webapp](https://usa.votingdeadlines.com) is built with [Svelte](https://svelte.dev/).

The underlying data (official state voting deadlines) is hard to perfectly capture in code, and [keeps](https://www.orlandoweekly.com/Blogs/archives/2020/10/06/florida-extends-voter-registration-deadline-to-7-pm-tonight-after-website-crashes-just-as-it-has-in-the-past-two-years) [changing](https://www.12news.com/article/news/politics/elections/arizona-voter-registration-extended-to-october-23/75-0d77294c-61b6-4802-ab21-54dcc6b5e21f), so contributions are welcome.

## Dependencies

Most can be installed with `yarn` in the `packages/web` folder.

On macOS, install `trash-cli` with `brew install macos-trash` (used by `bin/` scripts).

## Organization

* The webapp is in `packages/web`. 
* The data pipeline is in `packages/web/src/data`. 
* A WIP setup for visual and E2E testing is in `packages/e2e`.

## Quick start

* Run `yarn dev` in `packages/web` to start the Svelte webapp.
* Run `yarn export` in `packages/web` to build a static version of the webapp.
* Run `make help` to see a list of available commands.
* Run `make data` at root to pull/scrape fresh data.
* Run `make merge` at root to merge source data to `packages/web/src/data/`.

## Data pipeline

Data is ingested from the sources below and merged into the `packages/web/src/data/data` folder.

### Vote.gov

Vote.gov contains voting registration deadlines and links, and is open source. To ingest, we do this:

1. Download the source code of the website (`data-sources/vote.gov`)
2. Keep just the file we care about (`vote.gov/state-data.raw.json`)
3. Clean the source JSON into a simplified format (`vote.gov/state-data.cleaned.json`)
4. Parse the JSON data into a standardized format (`vote.gov/state-data.parsed.json`)

### VoteAmerica

VoteAmerica.com data is scraped to get a second opinion about the Vote.gov data. Currently most of it is not merged into the final file, except for some official state website links.

### Vote.org

There is some code to scrape Vote.org but it is not currently in use due to that data being relatively unstructured and harder to parse.

## Changelog

See CHANGELOG.md in this folder.

## References

- https://www.voteamerica.com/election-deadlines/
- https://www.voteamerica.com/voter-registration-deadlines/
- https://www.voteamerica.com/vote-by-mail-deadlines/
- https://vote.gov/
- https://www.vote.org/voter-registration-deadlines/
- https://projects.fivethirtyeight.com/how-to-vote-2020/