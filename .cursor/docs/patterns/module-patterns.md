# Module Pattern Guidelines

## Directory Structure

When creating a new module, determine its location:

- **`/src/modules`** - Business logic modules
- **`/src/services`** - Service layer (API clients, external services)
- **`/src/domain`** - Domain models and entities

## Required Files

Every module should include:

1. **`types.ts`** - TypeScript type definitions
2. **`index.ts`** - Public API exports
3. **`[name].service.ts`** - Main service/implementation

## Example Module Structure

```
src/modules/user/
├── types.ts
├── index.ts
├── user.service.ts
└── user.spec.ts
```

## Code Patterns

### Error Handling
- Use CustomError class (search for `extends Error` in codebase)
- Never throw generic Error objects
- Include error codes and context

### Logging
- Use project-standard logger (Winston, Pino, etc.)
- **Never use `console.log` in production code**
- Include context in log messages

### Testing
- Create `[name].spec.ts` matching existing test style
- Test both success and error cases
- Use project's testing framework

## Type Safety

- No implicit `any` types
- Use strict TypeScript configuration
- Validate external data with Zod/Joi
