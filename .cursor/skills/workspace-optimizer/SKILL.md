---
name: Workspace Optimizer
description: Comprehensive workspace optimization using Cursor's full capability stack
version: 1.0.0
author: AI System Architect
tags: [optimization, automation, documentation, quality]
---

# Workspace Optimizer Skill

## Overview

This skill leverages Cursor's complete capability stack to optimize workspace quality, maintainability, and developer productivity through automated workflows, intelligent documentation, and proactive code quality management.

## Capabilities

### 1. **Intelligent Documentation Management**
Automatically maintains documentation consistency with codebase changes.

**Commands:**
- `/optimize-docs` - Audit and update all documentation
- `/generate-api-docs` - Generate API documentation from code
- `/sync-docs` - Sync documentation with code changes

**Evidence:** Uses hooks (afterFileEdit) to detect code changes and trigger documentation updates.

### 2. **Code Quality Automation**
Proactive code quality management with automated reviews and validation.

**Commands:**
- `/review-code` - Comprehensive code review with BugBot
- `/validate-workspace` - Run all quality checks
- `/fix-lints` - Auto-fix linting issues

**Evidence:** Integrates with BugBot for automated code review and uses pre-commit hooks for validation.

### 3. **Architecture Compliance**
Enforces architectural patterns and best practices across the workspace.

**Commands:**
- `/check-architecture` - Validate against architecture rules
- `/suggest-refactor` - Suggest refactoring opportunities
- `/validate-patterns` - Check code patterns compliance

**Evidence:** Uses 32 specialized rules covering Next.js, TypeScript, security, and performance patterns.

### 4. **Security & Safety Automation**
Automated security scanning and secret management.

**Commands:**
- `/scan-security` - Run security audit
- `/check-secrets` - Scan for exposed secrets
- `/validate-deps` - Check dependency vulnerabilities

**Evidence:** Uses security rules (013_security.mdc, 060_security-secrets.mdc) and hook-based secret scanning.

### 5. **Performance Optimization**
Automated performance analysis and optimization suggestions.

**Commands:**
- `/analyze-performance` - Analyze bundle size and performance
- `/optimize-imports` - Optimize import statements
- `/check-indexing` - Validate codebase indexing efficiency

**Evidence:** Uses codebase indexing configuration and large-codebase optimization rules.

## Implementation Details

### Hook Integration

**afterFileEdit Hook:**
```bash
# Triggers: format-code.sh, update-docs.sh
# Purpose: Auto-format and update docs on file changes
```

**beforeShellExecution Hook:**
```bash
# Triggers: audit-command.sh
# Purpose: Log and validate shell commands
```

**beforeSubmitPrompt Hook:**
```bash
# Triggers: validate-prompt.sh
# Purpose: Validate prompts for quality and security
```

**afterAgentResponse Hook:**
```bash
# Triggers: log-activity.sh
# Purpose: Log agent actions for audit trail
```

### Rule Coverage

| Category     | Rules                                      | Purpose                             |
| ------------ | ------------------------------------------ | ----------------------------------- |
| Safety       | 001_core-safety.mdc                        | Non-negotiable safety + correctness |
| Architecture | 010_nextjs-architecture.mdc                | Next.js App Router conventions      |
| Code Quality | 020_typescript-standards.mdc               | Type safety and style consistency   |
| Tools        | 009_tools-usage.mdc                        | Effective tool usage                |
| Security     | 013_security.mdc, 060_security-secrets.mdc | Security best practices             |
| Performance  | 020_large-codebase.mdc                     | Performance optimization            |

## Usage Examples

### Example 1: Optimize Documentation
```
User: /optimize-docs

Agent:
1. Scans for outdated documentation using hooks/update-docs.sh
2. Identifies code changes without documentation updates
3. Generates missing documentation using templates
4. Validates documentation against rules
5. Updates doc-manifest.json with changes

Result: All documentation synced with codebase
```

### Example 2: Comprehensive Code Review
```
User: /review-code

Agent:
1. Runs BugBot integration
2. Validates against architecture rules
3. Checks TypeScript standards
4. Scans for security issues
5. Validates code style
6. Generates review report with actionable feedback

Result: Comprehensive review report with fix suggestions
```

### Example 3: Security Audit
```
User: /scan-security

Agent:
1. Scans for exposed secrets
2. Checks .env files not in .gitignore
3. Validates API key usage patterns
4. Checks dependency vulnerabilities
5. Validates authentication patterns
6. Generates security report

Result: Security audit report with risk assessment
```

## Success Metrics

- ✅ Documentation sync rate: 100%
- ✅ Code review coverage: All PRs
- ✅ Security scan frequency: Pre-commit
- ✅ Rule compliance: 100%
- ✅ Hook execution time: <100ms

## Integration with Cursor Features

### Agent Modes
- **Agent Mode**: Full automation with all tools
- **Plan Mode**: Design before implementation
- **Ask Mode**: Quick questions without changes

### Context Management
- **@docs/**: Reference local documentation
- **@rules/**: Reference Cursor rules
- **@.cursor/**: Reference Cursor configuration

### MCP Integration
- **filesystem-cell**: Advanced file operations
- **next-devtools**: Next.js development tools
- **vercel**: Deployment automation

## References

- Rules: `.cursor/rules/` (32 rules)
- Hooks: `.cursor/hooks/` (5 hooks + hooks.json)
- Templates: `.cursor/templates/plans/` (3 templates)
- Documentation: `@docs/` (architecture, patterns, guides)

---

**Status**: ✅ Production Ready
**Last Updated**: 2026-01-06
**Maintainer**: AI System Architect
