# Changelog

## v0.3.0

> 2020-10-09

* Data: selectively merge Vote.gov and VoteAmerica in cases where they disagree
  * Most notable: NV in-person registration is now shown to end on Election Day.
  * More confidence in DC data
  * Minor changs to VT, FL
  * No data source disagreement on WI deadlines now
* Fix unit tests broken during project reorganization
* Cap TypeScript warnings

## v0.2.1

> 2020-10-08

* Merge the updated Arizona deadlines into the production data.

## v0.2.0

> 2020-10-08

* Update Arizona's deadlines in the source data.

## v0.1.1

> 2020-10-07

* Minor fixes, e.g. a Safari font-size bug.

## v0.1.0

> 2020-10-06

* Initial alpha release.

## v0.0.1

> 2020-09-22

* First attempt at a webapp.

## v0.0.0

> 2020-09-22

* First attempts at a data pipeline.

## Checklist

* [ ] Update ./version
* [ ] Update package.json version
* [ ] Update footer copy if needed
* [ ] Update CHANGELOG.md (this file)
* [ ] Build website (make release)
* [ ] Git tag release