# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

-

### Changed

-

### Deprecated

-

### Removed

-

### Fixed

-

### Security

-

## v1.1.0 - 18-05-2023

### Added

- `Spinner` component.

### Changed

- Storybook bumped to v7

### Fixed

-

## v1.0.0 - 17-04-2023

### Added

- `rightContent` prop to `Filters` component.

### Changed

- Storybook bumped to v7

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
