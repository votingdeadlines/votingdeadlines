# votingdeadlines

This project aims to scrape, verify, and re-publish information on voting deadlines in the USA.

## Pipeline

### Vote.org

The data from Vote.org is processed in several steps:

1. **Download** the raw HTML of the relevant pages (`general-info.raw.html`)
2. **Trim** the raw HTML into just the relevant parts (`general-info.trimmed.html`)
3. **Format** the trimmed HTML so it is human-readable (`general-info.formatted.html`)
4. **Extract** the raw text from the HTML into a JSON file (`general-info.raw.json`)
5. **Clean** the raw text into a more structured form (`general-info.cleaned.json`)
6. **Normalize** the cleaned text into a standard form.

Each of these steps involves variables set in `config.sh`, functions in `src/`, and scripts in `bin/` that call the functions. For now you have to call each step one at a time, via the relevant `make` commands, e.g. `make extract`.

## References

- https://www.voteamerica.com/election-deadlines/
- https://www.voteamerica.com/voter-registration-deadlines/
- https://www.voteamerica.com/vote-by-mail-deadlines/
- https://vote.gov/
- https://www.vote.org/voter-registration-deadlines/
- https://projects.fivethirtyeight.com/how-to-vote-2020/