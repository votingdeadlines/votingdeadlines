# Changelog

## Releases

### v0.4.1-alpha

> 2020-10-12

* Update `map.png` for crawlers.
* Append `-alpha` to version in `package.json` (not just web copy).
* Rebase `v0.3.1` onto `v0.4.0`.
* Fix various TypeScript issues.
* Dockerize webapp development environment.

### v0.4.0

> 2020-10-10

* Data: Prefer VoteAmerica's date for ME mail deadline (10/19) over Vote.gov's.

### v0.3.1

> 2020-10-09

* Unify the two TypeScript projects to fix issues with tests vs. Svelte dev

### v0.3.0

> 2020-10-09

* Data: selectively merge Vote.gov and VoteAmerica in cases where they disagree
  * Most notable: NV in-person registration is now shown to end on Election Day.
  * More confidence in DC data
  * Minor changs to VT, FL
  * No data source disagreement on WI deadlines now
* Fix unit tests broken during project reorganization
* Cap TypeScript warnings

### v0.2.1

> 2020-10-08

* Merge the updated Arizona deadlines into the production data.

### v0.2.0

> 2020-10-08

* Update Arizona's deadlines in the source data.

### v0.1.1

> 2020-10-07

* Minor fixes, e.g. a Safari font-size bug.

### v0.1.0

> 2020-10-06

* Initial alpha release.

### v0.0.1

> 2020-09-22

* First attempt at a webapp.

### v0.0.0

> 2020-09-22

* First attempts at a data pipeline.

## Release checklist

* [ ] Update ./version
* [ ] Update package.json version
* [ ] Update footer copy if needed
* [ ] Update CHANGELOG.md (this file)
* [ ] Build website (make release)
* [ ] Git tag release

## Roadmap

### v0.4.x

> Alpha cleanup

* Resolve remaining TypeScript issues and warnings after recent unification
* Resolve more data discrepancies

### v0.5.x 

* Scrape own site for testing and verification
* Add additional data sources
* Add open source license