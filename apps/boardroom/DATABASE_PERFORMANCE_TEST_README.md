# Database Performance Test Suite

## Overview

Comprehensive performance testing for Drizzle, Neon, and Zod optimization implementation.

## Prerequisites

1. **Database Connection**: Ensure `DATABASE_URL` is set in your `.env` file
2. **Test Data**: Some tests require existing data (proposals, circles, etc.)
3. **Dependencies**: All dependencies installed (`pnpm install`)

## Running Tests

### From Root Directory
```bash
pnpm db:performance
```

### From BoardRoom App
```bash
cd apps/boardroom
pnpm test:db-performance
```

### Direct Execution
```bash
cd apps/boardroom
npx tsx scripts/database-performance-test.ts
```

## Test Coverage

### 1. Cold Start Test
- **Target**: <200ms
- **Measures**: Time to establish first database connection
- **Iterations**: 1

### 2. Connection Overhead Test
- **Target**: <5ms
- **Measures**: Overhead of establishing connections
- **Iterations**: 20

### 3. Prepared Statement Test
- **Target**: <50ms
- **Measures**: Performance of prepared statements
- **Iterations**: 20
- **Requires**: At least one proposal in database

### 4. Regular Query Test
- **Target**: <50ms
- **Measures**: Performance of regular queries
- **Iterations**: 20
- **Requires**: At least one proposal in database

### 5. Relational Query Test
- **Target**: <100ms
- **Measures**: Performance of relational queries (nested data)
- **Iterations**: 20
- **Requires**: At least one proposal with relations

### 6. Manual Join Test (Comparison)
- **Target**: <150ms
- **Measures**: Performance of manual joins (multiple queries)
- **Iterations**: 20
- **Requires**: At least one proposal with relations

## Output

### Console Output
- Real-time test progress
- Individual test results with statistics
- Performance summary
- Target compliance check
- Improvement percentages

### JSON Report
- Saved to: `apps/boardroom/database-performance-report.json`
- Contains detailed metrics for all tests
- Includes percentiles (P50, P95, P99)
- Timestamp and summary statistics

## Metrics Explained

- **Average Duration**: Mean execution time across all iterations
- **Min/Max**: Fastest and slowest execution times
- **P50**: Median execution time (50th percentile)
- **P95**: 95th percentile (95% of queries faster than this)
- **P99**: 99th percentile (99% of queries faster than this)

## Expected Results

### Performance Targets

| Test | Target | Expected Range |
|------|--------|----------------|
| Cold Start | <200ms | 50-200ms |
| Connection Overhead | <5ms | 1-5ms |
| Query Latency | <50ms | 20-50ms |
| Relational Query | <100ms | 50-100ms |

### Improvement Expectations

- **Prepared Statements**: 10-30% faster than regular queries
- **Relational Queries**: 20-50% faster than manual joins
- **Connection Overhead**: <5ms (Neon serverless optimized)

## Troubleshooting

### Database Connection Error
```
Error: Database configuration is missing
```
**Solution**: Set `DATABASE_URL` in your `.env` file

### No Test Data
```
⚠️  No proposals found, skipping test
```
**Solution**: Create test data using:
```bash
pnpm db:push  # Push schema
# Then create test proposals via UI or API
```

### Module Not Found
```
Error: Cannot find module '@neondatabase/serverless'
```
**Solution**: Run `pnpm install` to install dependencies

## Continuous Integration

Add to CI/CD pipeline:
```yaml
- name: Run Database Performance Tests
  run: pnpm db:performance
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Performance Monitoring

The test suite generates a JSON report that can be:
- Tracked over time
- Compared across deployments
- Used for performance budgets
- Integrated with monitoring tools

## Next Steps

After running tests:
1. Review performance report
2. Compare against targets
3. Identify optimization opportunities
4. Track improvements over time
5. Set up continuous monitoring
