# Commit & PR Standards

## Conventional Commits

Format: `<type>(<scope>): <description>`

### Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat: add channel integration` |
| `fix` | Bug fix | `fix: resolve login redirect loop` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting, no code change | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor: extract auth middleware` |
| `test` | Adding/updating tests | `test: add order creation tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize image loading` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |

### Scope (optional)
- `backend`, `frontend`, `admin`, `shop`, `channels`, `auth`, etc.

### Examples
```
feat(channels): add Fiverr webhook receiver
fix(auth): resolve JWT expiry handling
docs(api): document shop endpoints
refactor(backend): extract payment service
test(orders): add order creation tests
chore(deps): update fastapi to 0.115
```

## PR Standards

1. **Title**: Use conventional commit format
2. **Description**: What, why, and how
3. **Size**: Keep PRs small (< 400 lines changed)
4. **Review**: At least 1 approval required
5. **CI**: All checks must pass
6. **Tests**: New code must have tests
7. **Docs**: Update docs if API changes

## PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No regressions

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No secrets committed
```
