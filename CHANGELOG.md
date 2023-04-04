# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

-

### Changed

- Storybook bumped to v7

### Deprecated

-

### Removed

-

### Fixed

-

### Security

-

## v0.1.0 - 27-03-2023

### Added

- Added `CodeBlock` component.
- Added JSDoc comments to most of the components and hooks.
- Added README.md file with examples of usage for all the components and hooks.
- Added more tests.
- Added Storybook to the project.
- Added confirm button on datepicker filter field.

### Changed

- Changed the way `useFilters` updates the search params. Now it takes the previous search params state from the `useSearchParams` hook callback.

## v0.0.3 - 23-03-2023

### Added

- Added two new types of filter fields, `numeric` and `autocomplete-single`.
- Added `useAutocompleteTextInput` hook.
