# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- `Spinner` component.
- `languages` option to `generateRoutes` function, that allows to generate routes for multiple languages.
- `InferRouteKey` type utility that infers the `RouteKey` type from the route object.
- `useSwitchPathLang` hook, returned by `generatePath`. It allows to switch between languages keeping the language path synchronized.
- Tests for routing.
- `InferRouteKey` type utility that infers the `RouteKey` type from the route object.

### Changed

- Storybook bumped to v7

### Deprecated

-

### Removed

-

### Fixed

- Missing initial forward slash in `RouteKey`'s generated paths.

### Security

-

## v1.0.0 - 17-04-2023

### Added

- Added `CodeBlock` component.
- Added `rightContent` prop to `Filters` component.

### Changed

- Storybook bumped to v7

### Fixed

- Fixed router typing declarations.

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
