import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Plus, Save, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/forms/FormField'
import { FormSection } from '@/components/forms/FormSection'
import { DatePicker } from '@/components/forms/DatePicker'
import { departmentOptions, storeOptions, unitOptions, vendorOptions } from '@/lib/options'
import { purchaseOrderSchema, type PurchaseOrderFormValues } from '@/lib/validations'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'

export default function PoCreate() {
  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      date: '2026-06-28',
      expectedDelivery: '2026-07-05',
      terms: 'Payment Net 30. Delivery within agreed lead time.',
      lines: [{ itemName: '', unit: 'pcs', quantity: 1, rate: 0, gstPercent: 18 }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = watch('lines')
  const subTotal = lines?.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.rate) || 0), 0) ?? 0
  const tax = lines?.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.rate) || 0) * ((Number(l.gstPercent) || 0) / 100), 0) ?? 0

  const onSubmit = async (values: PurchaseOrderFormValues) => {
    await new Promise((r) => setTimeout(r, 600))
    toast.success('Purchase Order created', `Sent for CEO approval (${values.lines.length} item(s)).`)
    navigate(paths.poList)
  }

  return (
    <div>
      <PageHeader
        title="Create Purchase Order"
        description="Issue a purchase order to a vendor."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Purchase Orders', to: paths.poList }, { label: 'New' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="px-6">
            <FormSection title="Order Details" description="Vendor and delivery information.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Vendor" required error={errors.vendorId?.message}>
                  <Select {...register('vendorId')} defaultValue="">
                    <option value="" disabled>Select vendor</option>
                    {vendorOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Department" required error={errors.department?.message}>
                  <Select {...register('department')} defaultValue="">
                    <option value="" disabled>Select department</option>
                    {departmentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Store" required error={errors.store?.message}>
                  <Select {...register('store')} defaultValue="">
                    <option value="" disabled>Select store</option>
                    {storeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <div />
                <FormField label="PO Date" required error={errors.date?.message}>
                  <DatePicker {...register('date')} />
                </FormField>
                <FormField label="Expected Delivery" required error={errors.expectedDelivery?.message}>
                  <DatePicker {...register('expectedDelivery')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Line Items" description="Items, quantities and rates." className="md:col-span-2">
              <div className="space-y-3">
                {fields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 rounded-xl border border-border p-3">
                    <div className="col-span-12 sm:col-span-5">
                      <Input placeholder="Item name" {...register(`lines.${i}.itemName`)} />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Select {...register(`lines.${i}.unit`)}>
                        {unitOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input type="number" placeholder="Qty" {...register(`lines.${i}.quantity`)} />
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <Input type="number" placeholder="Rate" {...register(`lines.${i}.rate`)} />
                    </div>
                    <div className="col-span-8 sm:col-span-1">
                      <Input type="number" placeholder="GST%" {...register(`lines.${i}.gstPercent`)} />
                    </div>
                    <div className="col-span-4 flex justify-end sm:col-span-1">
                      <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(i)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {errors.lines?.message && <p className="text-xs text-destructive">{errors.lines.message}</p>}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ itemName: '', unit: 'pcs', quantity: 1, rate: 0, gstPercent: 18 })}>
                  <Plus />
                  Add Item
                </Button>
                <div className="flex flex-col items-end gap-1 border-t border-border pt-3 text-sm">
                  <p className="text-muted-foreground">Sub Total: <span className="font-medium text-foreground">{formatCurrency(subTotal)}</span></p>
                  <p className="text-muted-foreground">Tax: <span className="font-medium text-foreground">{formatCurrency(tax)}</span></p>
                  <p className="text-base font-semibold">Grand Total: {formatCurrency(subTotal + tax)}</p>
                </div>
              </div>
            </FormSection>

            <FormSection title="Terms" description="Payment and delivery terms.">
              <FormField label="Terms & Conditions" required error={errors.terms?.message}>
                <Textarea {...register('terms')} />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(paths.poList)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? 'Creating…' : 'Create PO'}
          </Button>
        </div>
      </form>
    </div>
  )
}
