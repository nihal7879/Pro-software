import { createCrudStore } from './createCrudStore'
import { newMaterials } from '@/mocks/newMaterials'
import type { NewMaterialRequest } from '@/types'

export const useNewMaterialStore = createCrudStore<NewMaterialRequest>('procura.newMaterials', newMaterials)
