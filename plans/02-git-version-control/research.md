# Git & Version Control — Research Findings

## Research Date: 2026-11-16

## Key Findings

### 1. Monorepo vs Polyrepo
- **Monorepo**: Single repo for all projects. Pros: shared code, atomic changes. Cons: large clone, complex CI.
- **Polyrepo**: Separate repo per project. Pros: isolation, independent releases. Cons: code duplication, cross-repo changes.
- **Decision**: Polyrepo for client isolation + agency-core monorepo for shared tools
- **Reference**: Atlassian monorepo guide, Microsoft repo strategy

### 2. Branching Models
- **Git Flow**: main/develop/feature/release/hotfix. Good for versioned releases.
- **GitHub Flow**: main + feature branches. Simpler, good for continuous deployment.
- **Decision**: Simplified Git Flow (main + develop + feature/* + hotfix/*)
- **Reference**: Vincent Driessen's Git Flow, GitHub Flow

### 3. Conventional Commits
- **Standard**: `<type>(<scope>): <description>`
- **Benefits**: Automated changelogs, semantic versioning, clear history
- **Tool**: commitlint + husky for enforcement
- **Reference**: conventionalcommits.org

### 4. Code Review
- **PR required** for all changes to main/develop
- **Size limit**: < 400 lines per PR (research shows larger PRs get less thorough review)
- **Approval**: At least 1 reviewer
- **Reference**: Google Engineering Practices, Atlassian PR best practices

### 5. Access Control
- **Agency owns all repos** — clients get read-only or no access
- **Branch protection**: Require PR + review + CI pass for main/develop
- **Secrets**: Never in git, use .env (gitignored) + .env.example

## References

- [Atlassian: Monorepos](https://www.atlassian.com/git/tutorials/monorepos)
- [Microsoft: Monorepo vs Multi-repo](https://learn.microsoft.com/training/modules/manage-git-repositories/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [commitlint](https://commitlint.js.org/)
