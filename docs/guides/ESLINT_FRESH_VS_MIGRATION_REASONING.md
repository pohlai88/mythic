# ESLint: Fresh Installation vs Migration from Biome - Reasoning

**Version**: 1.0.0
**Last Updated**: 2026-01-12
**Status**: ✅ **Decision Support Document**

---

## Executive Summary

**Recommendation**: **Fresh ESLint Installation** (not migration)

**Key Reasoning**:
1. **Clean slate** avoids carrying over Biome's configuration patterns
2. **Modern ESLint 9** flat config is fundamentally different from Biome
3. **Stability issues** with Biome suggest starting fresh is safer
4. **Monorepo complexity** benefits from ESLint's proven patterns
5. **MCP integration** is only available with fresh ESLint 9.26.0+ setup

---

## Table of Contents

1. [Context: Current Biome Setup](#context-current-biome-setup)
2. [Fresh Installation Approach](#fresh-installation-approach)
3. [Migration Approach](#migration-approach)
4. [Comparative Analysis](#comparative-analysis)
5. [Decision Matrix](#decision-matrix)
6. [Recommended Path Forward](#recommended-path-forward)

---

## Context: Current Biome Setup

### Current State

**Biome Configuration**:
- ✅ `biome.json` with comprehensive rules
- ✅ VS Code integration configured
- ✅ Formatting + linting in one tool
- ✅ Turborepo-aware configuration

**Known Issues** (from `BIOME_STABILITY_ANALYSIS.md`):
- ⚠️ **Language server crashes**: "Cannot call write after a stream was destroyed"
- ⚠️ **Stream management bugs**: GitHub issue #5837 (open/unresolved)
- ⚠️ **Monorepo performance issues**: File watching problems
- ⚠️ **Process lifecycle issues**: Daemon crashes disrupt workflow

**Impact**:
- High probability of crashes
- Critical impact on developer productivity
- Ongoing stability concerns

---

## Fresh Installation Approach

### What It Means

**Fresh Installation** = Setting up ESLint from scratch with:
- New ESLint 9 flat config (`eslint.config.mjs`)
- Modern plugin ecosystem
- Best practices for monorepo
- No legacy Biome configuration patterns

### Advantages

#### 1. **Clean Architecture**

```javascript
// Fresh ESLint 9 flat config
import js from "@eslint/js";
import typescriptEslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  // Modern, clean structure
];
```

**Benefits**:
- ✅ No legacy patterns to work around
- ✅ Follows ESLint 9 best practices
- ✅ Easier to maintain and understand
- ✅ Team can learn modern ESLint patterns

#### 2. **Modern ESLint 9 Features**

**Fresh installation enables**:
- ✅ **Flat config** (modern, simpler than legacy)
- ✅ **MCP integration** (v9.26.0+ only)
- ✅ **Better TypeScript support** (typescript-eslint v8)
- ✅ **Improved performance** (ESLint 9 optimizations)

**Migration would require**:
- ⚠️ Converting Biome patterns to ESLint (complex)
- ⚠️ May miss modern ESLint features
- ⚠️ Risk of carrying over problematic patterns

#### 3. **Avoid Configuration Debt**

**Biome patterns that don't translate well**:
```json
// Biome-specific patterns
{
  "overrides": [
    {
      "include": ["**/api-schemas/**"],
      "linter": {
        "rules": {
          "suspicious": {
            "noExplicitAny": "error"
          }
        }
      }
    }
  ]
}
```

**ESLint equivalent (cleaner)**:
```javascript
// ESLint flat config (more flexible)
{
  files: ["**/api-schemas/**"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
  },
}
```

**Why fresh is better**:
- ✅ ESLint's file-based config is more intuitive
- ✅ No need to translate Biome's JSON structure
- ✅ Can use ESLint's native patterns from the start

#### 4. **Stability & Reliability**

**Fresh installation**:
- ✅ Starts with proven, stable ESLint patterns
- ✅ No risk of carrying over Biome's instability
- ✅ Uses battle-tested configurations
- ✅ Industry-standard setup

**Migration risk**:
- ⚠️ May inadvertently carry over problematic patterns
- ⚠️ Unknown edge cases from Biome config
- ⚠️ Harder to debug (mixed patterns)

#### 5. **MCP Integration (Critical)**

**ESLint MCP** (v9.26.0+):
- ✅ **Only available** with fresh ESLint 9 setup
- ✅ Enables AI-assisted linting in Cursor
- ✅ Real-time code analysis
- ✅ Context-aware fixes

**Migration limitation**:
- ❌ If migrating from older ESLint, may miss MCP
- ❌ Complex migration may delay MCP adoption
- ❌ Fresh install = immediate MCP access

#### 6. **Monorepo Best Practices**

**Fresh ESLint setup**:
```javascript
// Root config (shared)
export default [
  js.configs.recommended,
  // Shared rules
];

// App-specific config
import baseConfig from "../../eslint.config.mjs";
export default [
  ...baseConfig,
  // App-specific overrides
];
```

**Benefits**:
- ✅ Clear separation of concerns
- ✅ Easy to maintain across apps
- ✅ Follows Turborepo patterns
- ✅ Better caching strategy

**Migration complexity**:
- ⚠️ Biome's monorepo config may not translate cleanly
- ⚠️ Risk of inconsistent rules across apps
- ⚠️ Harder to maintain shared config

#### 7. **Team Learning Curve**

**Fresh installation**:
- ✅ Team learns modern ESLint from scratch
- ✅ No confusion from Biome patterns
- ✅ Clear documentation path
- ✅ Standard industry knowledge

**Migration**:
- ⚠️ Team needs to unlearn Biome patterns
- ⚠️ May carry over Biome mental models
- ⚠️ Harder to find community help (mixed patterns)

---

## Migration Approach

### What It Means

**Migration** = Converting existing Biome configuration to ESLint:
- Translating `biome.json` rules to ESLint rules
- Maintaining existing rule patterns
- Preserving current linting behavior
- Gradual transition (Biome → ESLint)

### Advantages

#### 1. **Preserve Existing Rules**

**Migration preserves**:
- ✅ Current rule configurations
- ✅ Team's established patterns
- ✅ Existing overrides and exceptions
- ✅ Known working configurations

#### 2. **Gradual Transition**

**Migration allows**:
- ✅ Run Biome and ESLint in parallel
- ✅ Compare outputs side-by-side
- ✅ Gradual rule-by-rule migration
- ✅ Lower risk of breaking changes

#### 3. **Less Disruption**

**Migration benefits**:
- ✅ Team keeps familiar patterns
- ✅ Less learning curve
- ✅ Can revert if issues arise
- ✅ Maintains current workflow

### Disadvantages

#### 1. **Configuration Complexity**

**Migration challenges**:
- ⚠️ Biome rules don't map 1:1 to ESLint
- ⚠️ Complex translation required
- ⚠️ Risk of missing edge cases
- ⚠️ Harder to maintain (mixed patterns)

**Example translation difficulty**:
```json
// Biome (simpler)
{
  "linter": {
    "rules": {
      "correctness": {
        "useExhaustiveDependencies": "warn"
      }
    }
  }
}
```

```javascript
// ESLint (more complex, but more powerful)
{
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    // But also need to configure parser, plugins, etc.
  },
}
```

#### 2. **Carry Over Problems**

**Migration risks**:
- ⚠️ May carry over Biome's instability patterns
- ⚠️ Unknown bugs from translation
- ⚠️ Harder to debug (mixed origins)
- ⚠️ May miss ESLint best practices

#### 3. **Miss Modern Features**

**Migration limitations**:
- ⚠️ May use legacy ESLint patterns
- ⚠️ Miss ESLint 9 flat config benefits
- ⚠️ Delayed MCP integration
- ⚠️ Suboptimal configuration

#### 4. **Maintenance Burden**

**Migration maintenance**:
- ⚠️ Need to maintain translation logic
- ⚠️ Two config systems to understand
- ⚠️ Harder to onboard new team members
- ⚠️ More documentation needed

---

## Comparative Analysis

### Side-by-Side Comparison

| Factor                       | Fresh Installation    | Migration                   |
| ---------------------------- | --------------------- | --------------------------- |
| **Setup Time**               | 2-4 hours             | 4-8 hours                   |
| **Configuration Complexity** | Low (modern patterns) | High (translation)          |
| **Risk of Bugs**             | Low (proven patterns) | Medium (translation errors) |
| **Maintenance**              | Easy (standard)       | Hard (mixed patterns)       |
| **Team Learning**            | Clean slate           | Unlearn + learn             |
| **MCP Integration**          | ✅ Immediate           | ⚠️ Delayed                   |
| **Stability**                | ✅ High (proven)       | ⚠️ Medium (unknown)          |
| **Monorepo Support**         | ✅ Excellent           | ⚠️ Good (if translated well) |
| **Future-Proof**             | ✅ Yes (modern)        | ⚠️ Maybe (legacy patterns)   |
| **Community Support**        | ✅ Extensive           | ⚠️ Limited (custom)          |

### Risk Assessment

#### Fresh Installation Risks

| Risk                   | Probability | Impact | Mitigation                    |
| ---------------------- | ----------- | ------ | ----------------------------- |
| **Rule differences**   | Medium      | Low    | Compare outputs, adjust rules |
| **Team adjustment**    | Low         | Low    | Good documentation, training  |
| **Initial setup time** | High        | Low    | One-time cost, worth it       |
| **Missing rules**      | Low         | Medium | Comprehensive rule mapping    |

#### Migration Risks

| Risk                     | Probability | Impact | Mitigation                 |
| ------------------------ | ----------- | ------ | -------------------------- |
| **Translation errors**   | High        | High   | Extensive testing required |
| **Carry over bugs**      | Medium      | High   | Fresh install avoids this  |
| **Maintenance burden**   | High        | Medium | Ongoing complexity         |
| **Miss modern features** | Medium      | Medium | Use fresh install instead  |

---

## Decision Matrix

### Scoring Criteria

**Weighted factors** (total = 100 points):

1. **Stability** (30 points) - Critical for production
2. **Maintainability** (20 points) - Long-term cost
3. **Modern Features** (15 points) - MCP, ESLint 9
4. **Team Productivity** (15 points) - Learning curve
5. **Monorepo Support** (10 points) - Turborepo integration
6. **Setup Complexity** (10 points) - Initial effort

### Scoring

#### Fresh Installation

| Factor            | Score | Weight | Weighted     |
| ----------------- | ----- | ------ | ------------ |
| Stability         | 9/10  | 30%    | 27.0         |
| Maintainability   | 9/10  | 20%    | 18.0         |
| Modern Features   | 10/10 | 15%    | 15.0         |
| Team Productivity | 8/10  | 15%    | 12.0         |
| Monorepo Support  | 9/10  | 10%    | 9.0          |
| Setup Complexity  | 7/10  | 10%    | 7.0          |
| **TOTAL**         |       |        | **88.0/100** |

#### Migration

| Factor            | Score | Weight | Weighted     |
| ----------------- | ----- | ------ | ------------ |
| Stability         | 6/10  | 30%    | 18.0         |
| Maintainability   | 5/10  | 20%    | 10.0         |
| Modern Features   | 6/10  | 15%    | 9.0          |
| Team Productivity | 7/10  | 15%    | 10.5         |
| Monorepo Support  | 7/10  | 10%    | 7.0          |
| Setup Complexity  | 6/10  | 10%    | 6.0          |
| **TOTAL**         |       |        | **60.5/100** |

**Winner**: **Fresh Installation** (88.0 vs 60.5)

---

## Recommended Path Forward

### Phase 1: Fresh ESLint Installation (Week 1)

**Steps**:
1. ✅ Install ESLint 9.26.0+ with modern plugins
2. ✅ Create fresh `eslint.config.mjs` (flat config)
3. ✅ Configure for monorepo (shared + app-specific)
4. ✅ Set up MCP integration
5. ✅ Test on sample files

**Time**: 2-4 hours
**Risk**: Low
**Benefit**: Clean, modern setup

### Phase 2: Rule Mapping & Validation (Week 1-2)

**Steps**:
1. ✅ Map critical Biome rules to ESLint equivalents
2. ✅ Run both tools in parallel (comparison)
3. ✅ Adjust ESLint rules to match team preferences
4. ✅ Document rule differences

**Time**: 4-6 hours
**Risk**: Low
**Benefit**: Ensures coverage

### Phase 3: Gradual Adoption (Week 2-3)

**Steps**:
1. ✅ Enable ESLint for new files
2. ✅ Migrate app-by-app (docs → boardroom → packages)
3. ✅ Keep Biome for formatting (optional)
4. ✅ Monitor for issues

**Time**: Ongoing
**Risk**: Low
**Benefit**: Smooth transition

### Phase 4: Complete Migration (Week 4)

**Steps**:
1. ✅ Remove Biome linting (keep formatting if desired)
2. ✅ Update all scripts and CI/CD
3. ✅ Update documentation
4. ✅ Team training session

**Time**: 2-3 hours
**Risk**: Low
**Benefit**: Single source of truth

---

## Specific Reasoning for Your Monorepo

### 1. **Biome Stability Issues**

**Your situation**:
- ⚠️ Language server crashes (documented)
- ⚠️ Stream management bugs (GitHub #5837)
- ⚠️ Monorepo performance issues

**Fresh installation benefit**:
- ✅ Avoids carrying over problematic patterns
- ✅ Starts with stable ESLint foundation
- ✅ No risk of inheriting Biome's bugs

### 2. **Monorepo Complexity**

**Your setup**:
- Turborepo with multiple apps (`docs`, `boardroom`)
- Shared packages
- Complex dependency graph

**Fresh installation benefit**:
- ✅ ESLint has proven monorepo patterns
- ✅ Better caching for Turborepo
- ✅ Clearer config hierarchy

### 3. **MCP Integration Priority**

**Your context**:
- Already using Figma MCP
- AI-assisted development workflow
- Cursor IDE integration

**Fresh installation benefit**:
- ✅ Immediate MCP access (ESLint 9.26.0+)
- ✅ Consistent MCP pattern (like Figma)
- ✅ AI-powered linting in Cursor

### 4. **Team Productivity**

**Current impact**:
- Biome crashes disrupt workflow
- Team frustration with instability
- Need reliable linting

**Fresh installation benefit**:
- ✅ Stable, predictable ESLint
- ✅ Better IDE integration
- ✅ Industry-standard (easier to find help)

---

## Conclusion

### Final Recommendation: **Fresh Installation**

**Primary Reasons**:

1. **Stability First**: Fresh install avoids Biome's known instability
2. **Modern Features**: Immediate access to ESLint 9 + MCP
3. **Clean Architecture**: No legacy patterns to work around
4. **Monorepo Best Practices**: ESLint's proven Turborepo patterns
5. **Long-term Maintainability**: Easier to maintain standard config

**Migration Only If**:
- ❌ You have extensive custom Biome rules that are critical
- ❌ Team has strong Biome expertise (but stability issues suggest otherwise)
- ❌ Time constraints require gradual transition (but fresh is actually faster)

**For Your Specific Situation**:
Given the documented Biome stability issues, language server crashes, and your need for reliable linting in a complex monorepo, **fresh installation is the clear choice**.

---

## Next Steps

1. **Review this reasoning** with your team
2. **Follow the recommended path** (Phase 1-4)
3. **Keep Biome for formatting** (optional, can use Prettier)
4. **Enable ESLint MCP** for AI-assisted development
5. **Monitor and optimize** based on team feedback

---

**Status**: ✅ **Recommended - Fresh Installation**
**Confidence**: **High** (88/100 score)
**Timeline**: **2-4 weeks** (phased approach)
