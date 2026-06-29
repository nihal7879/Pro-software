import { createCrudStore } from './createCrudStore'
import { comparisons } from '@/mocks/comparisons'
import type { Comparison } from '@/types'

export const useComparisonStore = createCrudStore<Comparison>('procura.comparisons', comparisons)
