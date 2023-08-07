import type { TestCase } from './types.js'

import optionalNullable from './testcases/optional-nullable.js'
import manyFeatures from './testcases/many-features.js'
import deep from './testcases/deep.js'
import wide from './testcases/wide.js'

export const TEST_CASES: TestCase[] = [optionalNullable, manyFeatures, deep, wide]
