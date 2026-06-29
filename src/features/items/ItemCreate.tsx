import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/forms/FormField'
import { FormSection } from '@/components/forms/FormSection'
import { categoryOptions, storeOptions, unitOptions } from '@/lib/options'
import { itemSchema, type ItemFormValues } from '@/lib/validations'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { useItemStore } from '@/store/masters.store'
import type { Item } from '@/types'

export default function ItemCreate() {
  const navigate = useNavigate()
  const addItem = useItemStore((s) => s.add)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { gstPercent: 18, currentRate: 0, mrp: 0, annualConsumption: 0, reorderLevel: 0 },
  })

  const onSubmit = async (values: ItemFormValues) => {
    await new Promise((r) => setTimeout(r, 400))
    const item: Item = {
      id: `ITM-${Date.now()}`,
      code: values.code,
      name: values.name,
      category: values.category,
      unit: values.unit,
      brand: values.brand,
      store: values.store,
      currentRate: values.currentRate,
      mrp: values.mrp,
      gstPercent: values.gstPercent,
      annualConsumption: values.annualConsumption,
      reorderLevel: values.reorderLevel,
      active: true,
    }
    addItem(item)
    toast.success('Item created', `${values.name} added to the catalogue.`)
    navigate(paths.itemMaster)
  }

  return (
    <div>
      <PageHeader
        title="Create Item"
        description="Add a new item to the master catalogue."
        breadcrumbs={[
          { label: 'Master Data' },
          { label: 'Item Master', to: paths.itemMaster },
          { label: 'New Item' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="px-6">
            <FormSection title="Identification" description="Basic item identity and classification.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Item Code" required error={errors.code?.message}>
                  <Input placeholder="e.g. GEN-SHLM-01" {...register('code')} />
                </FormField>
                <FormField label="Item Name" required error={errors.name?.message}>
                  <Input placeholder="e.g. Safety Helmet Yellow" {...register('name')} />
                </FormField>
                <FormField label="Category" required error={errors.category?.message}>
                  <Select {...register('category')} defaultValue="">
                    <option value="" disabled>
                      Select category
                    </option>
                    {categoryOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Brand" error={errors.brand?.message} hint="Optional manufacturer / brand">
                  <Input placeholder="e.g. Karam" {...register('brand')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Stocking" description="Where the item is stored and replenishment thresholds.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Store" required error={errors.store?.message}>
                  <Select {...register('store')} defaultValue="">
                    <option value="" disabled>
                      Select store
                    </option>
                    {storeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Unit" required error={errors.unit?.message}>
                  <Select {...register('unit')} defaultValue="">
                    <option value="" disabled>
                      Select unit
                    </option>
                    {unitOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Annual Consumption" error={errors.annualConsumption?.message}>
                  <Input type="number" {...register('annualConsumption')} />
                </FormField>
                <FormField label="Reorder Level" error={errors.reorderLevel?.message}>
                  <Input type="number" {...register('reorderLevel')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Pricing" description="Cost, MRP and applicable tax.">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField label="Current Rate (₹)" required error={errors.currentRate?.message}>
                  <Input type="number" step="0.01" {...register('currentRate')} />
                </FormField>
                <FormField label="MRP (₹)" required error={errors.mrp?.message}>
                  <Input type="number" step="0.01" {...register('mrp')} />
                </FormField>
                <FormField label="GST (%)" required error={errors.gstPercent?.message}>
                  <Input type="number" step="0.01" {...register('gstPercent')} />
                </FormField>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(paths.itemMaster)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? 'Saving…' : 'Save Item'}
          </Button>
        </div>
      </form>
    </div>
  )
}
