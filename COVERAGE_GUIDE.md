# Jest Coverage Guide

## Overview

This project uses Jest for test coverage reporting with configured thresholds and multiple output formats.

## Coverage Thresholds

The following minimum coverage thresholds are enforced:

### Global Thresholds

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Finance Dashboard Specific

- **Statements**: 85%
- **Branches**: 80%
- **Functions**: 85%
- **Lines**: 85%

## Running Coverage Reports

### Basic Coverage Report

```bash
npm run test:coverage
```

Runs all tests with coverage and displays summary in terminal.

### Coverage with Watch Mode

```bash
npm run test:coverage:watch
```

Runs coverage in watch mode - automatically reruns when files change.

### Coverage for Specific Tests

```bash
npm run test:coverage -- __tests__/finance/
```

Runs coverage only for finance-related tests.

### Open HTML Report

```bash
npm run test:coverage:html
```

Generates coverage and opens the HTML report in your default browser.

## Understanding Coverage Reports

### Terminal Output

After running coverage, you'll see:

```
----------------------------|---------|----------|---------|---------|-------------------
File                        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------|---------|----------|---------|---------|-------------------
All files                   |   61.46 |    65.21 |   59.18 |   59.37 |
 app/user/finance/dashboard |     100 |    96.77 |     100 |     100 |
  page.tsx                  |     100 |    96.77 |     100 |     100 | 226
----------------------------|---------|----------|---------|---------|-------------------
```

### Coverage Metrics Explained

1. **Statements Coverage**

   - Percentage of executable statements that were run
   - Example: `if`, `return`, function calls

2. **Branch Coverage**

   - Percentage of conditional branches tested
   - Example: Both `true` and `false` paths of `if` statements

3. **Functions Coverage**

   - Percentage of functions that were called
   - Includes component functions and utility functions

4. **Lines Coverage**
   - Percentage of code lines executed
   - Most granular measure of code execution

## Coverage Report Formats

### 1. HTML Report

- **Location**: `coverage/lcov-report/index.html`
- **Usage**: Open in browser for interactive visualization
- **Features**:
  - Color-coded coverage (green = covered, red = uncovered)
  - Line-by-line coverage details
  - Drill down into specific files

### 2. LCOV Report

- **Location**: `coverage/lcov.info`
- **Usage**: For CI/CD tools (Codecov, Coveralls, SonarQube)
- **Format**: Standard coverage format for integration

### 3. JSON Report

- **Location**: `coverage/coverage-final.json`
- **Usage**: Programmatic access to coverage data
- **Format**: Structured JSON for custom tooling

### 4. Terminal Report

- **Location**: Console output
- **Usage**: Quick summary during development
- **Format**: Table format with percentages

## Files Included in Coverage

Coverage is collected from:

- `src/app/**/*.{js,jsx,ts,tsx}` - All Next.js app routes
- `src/components/**/*.{js,jsx,ts,tsx}` - All components
- `src/lib/**/*.{js,jsx,ts,tsx}` - All library code
- `src/utils/**/*.{js,jsx,ts,tsx}` - All utility functions

## Files Excluded from Coverage

The following are automatically excluded:

- TypeScript declaration files (`*.d.ts`)
- Test files (`*.test.{js,jsx,ts,tsx}`, `*.spec.{js,jsx,ts,tsx}`)
- Test directories (`__tests__/**`)
- Storybook files (`*.stories.{js,jsx,ts,tsx}`)
- Next.js layouts (`layout.tsx`)
- Mock files (`__mocks__/**`)
- Build artifacts (`node_modules/`, `.next/`, `dist/`)
- Configuration files (`*.config.js`, `*.config.ts`)

## Coverage Workflow

### During Development

1. **Write tests first** (TDD approach)

   ```bash
   npm run test:watch
   ```

2. **Check coverage periodically**

   ```bash
   npm run test:coverage -- path/to/your/tests
   ```

3. **View detailed report**
   ```bash
   npm run test:coverage:html
   ```

### Before Committing

1. **Run full coverage**

   ```bash
   npm run test:coverage
   ```

2. **Ensure thresholds are met**

   - Check that all metrics meet minimum thresholds
   - Coverage report will fail if thresholds are not met

3. **Review uncovered lines**
   - Open HTML report to see which lines need tests
   - Add tests for critical uncovered code

### In CI/CD Pipeline

```bash
# Run tests with coverage
npm run test:coverage

# Upload to Codecov (example)
bash <(curl -s https://codecov.io/bash) -f coverage/lcov.info
```

## Current Coverage Status

### Finance Dashboard

✅ **Exceeds all thresholds!**

- Statements: 100% (Target: 85%)
- Branches: 96.77% (Target: 80%)
- Functions: 100% (Target: 85%)
- Lines: 100% (Target: 85%)

**Test Suites:**

- ✅ Integration Tests: 33/33 passing (100%)
- ✅ Calculation Tests: 48/48 passing (100%)
- ✅ Filter Tests: 52/52 passing (100%)
- ✅ Component Tests: 43/43 passing (100%)

## Improving Coverage

### Finding Uncovered Code

1. **Use HTML Report**

   ```bash
   npm run test:coverage:html
   ```

   - Navigate to specific files
   - Red-highlighted lines are uncovered

2. **Check Terminal Output**
   - Look at "Uncovered Line #s" column
   - Prioritize critical paths

### Writing Coverage Tests

Focus on:

1. **Edge Cases**: Boundary conditions, empty arrays, null values
2. **Error Paths**: Exception handling, error states
3. **Conditional Logic**: All branches of if/else, switch cases
4. **User Interactions**: Click handlers, form submissions
5. **State Changes**: Component state updates, side effects

### Example: Improving Branch Coverage

```javascript
// Uncovered branch
function calculateDiscount(amount) {
  if (amount > 100) {
    return amount * 0.9; // ✅ Covered
  }
  return amount; // ❌ Not covered
}

// Add test for both branches
test("calculates discount for amount > 100", () => {
  expect(calculateDiscount(150)).toBe(135);
});

test("returns original amount for amount <= 100", () => {
  expect(calculateDiscount(50)).toBe(50);
});
```

## Troubleshooting

### Coverage Report Not Generated

```bash
# Check if coverage directory exists
ls -la coverage/

# Manually enable coverage
jest --coverage
```

### Thresholds Failing

```bash
# See detailed report
npm run test:coverage:html

# Check which files are below threshold
# Look for files in red in the HTML report
```

### Coverage Too Low

1. Identify critical uncovered code
2. Prioritize by:
   - Business logic importance
   - Error-prone areas
   - User-facing functionality
3. Write focused tests for gaps

## Best Practices

1. **Aim for Quality, Not Just Quantity**

   - 100% coverage doesn't mean bug-free code
   - Focus on testing critical paths and edge cases

2. **Test Behavior, Not Implementation**

   - Test what the code does, not how it does it
   - Avoid testing internal implementation details

3. **Maintain Coverage in Code Reviews**

   - Require tests for new features
   - Ensure coverage doesn't decrease

4. **Use Coverage as a Guide**

   - Coverage shows what's tested, not what's correct
   - Combine with code reviews and QA testing

5. **Update Thresholds Gradually**
   - Start with achievable thresholds (80%)
   - Increase as codebase matures

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Coverage
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Istanbul Coverage](https://istanbul.js.org/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [React Testing Guide](https://reactjs.org/docs/testing.html)

---

**Note**: Coverage reports are gitignored and should not be committed to the repository. They are regenerated on each test run.
