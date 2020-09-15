# votingdeadlines

This project aims to scrape, verify, and re-publish information on voting deadlines in the USA.

## Pipeline

### Vote.gov

Vote.gov contains voting registration deadlines and links, and is open source. To ingest:

1. **Download** the source code of the website (`data-sources/vote.gov/src`)
2. **Trim** the source code to just the file we care about (`state-info.raw.json`)
3. **Clean** the source JSON into a standardized format (`state-info.cleaned.json`)

### Vote.org

The data from Vote.org is processed in several steps:

1. **Download** the raw HTML of the relevant pages (`general-info.raw.html`)
2. **Trim** the raw HTML into just the relevant parts (`general-info.trimmed.html`)
3. **Format** the trimmed HTML so it is human-readable (`general-info.formatted.html`)
4. **Extract** the raw text from the HTML into a JSON file (`general-info.raw.json`)
5. **Clean** the text to remove HTML/whitespace artifacts (`general-info.cleaned.json`)
6. **Parse** the language into a structure where feasible (`general-info.parsed.json`)

Each of these steps involves variables set in `config.sh`, functions in `src/`, and scripts in `bin/` that call the functions. For now you have to call each step one at a time, via the relevant `make` commands, e.g. `make extract`.

Many states from this data are pretty messy still, but it may be useful to compare with other sources.


## References

- https://www.voteamerica.com/election-deadlines/
- https://www.voteamerica.com/voter-registration-deadlines/
- https://www.voteamerica.com/vote-by-mail-deadlines/
- https://vote.gov/
- https://www.vote.org/voter-registration-deadlines/
- https://projects.fivethirtyeight.com/how-to-vote-2020/