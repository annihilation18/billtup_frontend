# Changelog

All notable changes to BilltUp will be documented in this section.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Quick Links

- [Latest Release](./LATEST.md) - Most recent changes
- [Version History](./VERSIONS.md) - All versions
- [Migration Guides](./MIGRATIONS.md) - Upgrading between versions

## Changelog Organization

### Version Format

Versions follow semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Change Categories

Changes are categorized as follows:

- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features marked for removal
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

---

## Recent Updates

For the most recent updates, see [LATEST.md](./LATEST.md).

### [Latest] - 2025-11-21

#### Added
- Comprehensive security refactoring with centralized configuration
- Developer documentation structure
- User documentation foundation
- API reference consolidation

#### Security
- Removed hardcoded Stripe publishable key
- Centralized environment variables in `/utils/config.ts`
- Fixed duplicate imports in SignUpSection
- Updated API clients to use secure configuration

#### Changed
- Consolidated API utilities for better maintainability
- Improved code organization across utils
- Enhanced error logging (removed sensitive data exposure)

---

## Version History

For complete version history, see [VERSIONS.md](./VERSIONS.md).

## Reporting Issues

If you find a bug or have a feature request:

1. Check [existing issues](https://github.com/billtup/issues)
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

---

*Last Updated: November 21, 2025*
