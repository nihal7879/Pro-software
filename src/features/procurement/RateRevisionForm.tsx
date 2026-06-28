import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/forms/FormField'
import { FormSection } from '@/components/forms/FormSection'
import { DatePicker } from '@/components/forms/DatePicker'
import { chargeableOptions, departmentOptions } from '@/lib/options'
import { rateRevisionSchema, type RateRevisionFormValues } from '@/lib/validations'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { ChargeableFlag } from '@/types'

export default function RateRevisionForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RateRevisionFormValues>({
    resolver: zodResolver(rateRevisionSchema),
    defaultValues: {
      date: '2026-06-28',
      chargeable: ChargeableFlag.NonChargeable,
      existingRate: 0,
      quotedRate: 0,
      existingMrp: 0,
      revisedMrp: 0,
      annualConsumption: 0,
    },
  })

  const existingRate = Number(watch('existingRate')) || 0
  const quotedRate = Number(watch('quotedRate')) || 0
  const existingMrp = Number(watch('existingMrp')) || 0
  const revisedMrp = Number(watch('revisedMrp')) || 0
  const rateDiff = existingRate ? ((quotedRate - existingRate) / existingRate) * 100 : 0
  const mrpDiff = existingMrp ? ((revisedMrp - existingMrp) / existingMrp) * 100 : 0

  const onSubmit = async (values: RateRevisionFormValues) => {
    await new Promise((r) => setTimeout(r, 600))
    toast.success('Rate revision submitted', `${values.itemName} sent for approval.`)
    navigate(paths.rateRevisionList)
  }

  return (
    <div>
      <PageHeader
        title="Rate Revision Form"
        description="Request a supplier price revision."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Rate Revision', to: paths.rateRevisionList }, { label: 'New' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="px-6">
            <FormSection title="Supplier & Item" description="Identify the item and supplier.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Supplier" required error={errors.supplier?.message}>
                  <Input placeholder="Supplier name" {...register('supplier')} />
                </FormField>
                <FormField label="Brand Name" required error={errors.brandName?.message}>
                  <Input placeholder="Brand" {...register('brandName')} />
                </FormField>
                <FormField label="Item Code" required error={errors.itemCode?.message}>
                  <Input placeholder="e.g. GENEITM205" {...register('itemCode')} />
                </FormField>
                <FormField label="Item Name" required error={errors.itemName?.message}>
                  <Input placeholder="Item name" {...register('itemName')} />
                </FormField>
                <FormField label="User Department" required error={errors.userDepartment?.message}>
                  <Select {...register('userDepartment')} defaultValue="">
                    <option value="" disabled>Select department</option>
                    {departmentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Chargeable" required error={errors.chargeable?.message}>
                  <Select {...register('chargeable')}>
                    {chargeableOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Pricing" description="Existing vs revised rates. Differences auto-calculate.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Existing Rate (₹)" required error={errors.existingRate?.message}>
                  <Input type="number" step="0.01" {...register('existingRate')} />
                </FormField>
                <FormField label="Quoted / Revised Rate (₹)" required error={errors.quotedRate?.message} hint={`Rate change: ${rateDiff.toFixed(2)}%`}>
                  <Input type="number" step="0.01" {...register('quotedRate')} />
                </FormField>
                <FormField label="Existing MRP (₹)" required error={errors.existingMrp?.message}>
                  <Input type="number" step="0.01" {...register('existingMrp')} />
                </FormField>
                <FormField label="Revised MRP (₹)" required error={errors.revisedMrp?.message} hint={`MRP change: ${mrpDiff.toFixed(2)}%`}>
                  <Input type="number" step="0.01" {...register('revisedMrp')} />
                </FormField>
                <FormField label="Annual Consumption" error={errors.annualConsumption?.message}>
                  <Input type="number" {...register('annualConsumption')} />
                </FormField>
                <FormField label="Date" required error={errors.date?.message}>
                  <DatePicker {...register('date')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Justification" description="Reason for the revision.">
              <div className="space-y-4">
                <FormField label="Reason" required error={errors.reason?.message}>
                  <Textarea placeholder="e.g. Due to geopolitical scenario the rates are increased" {...register('reason')} />
                </FormField>
                <FormField label="Remark" error={errors.remark?.message}>
                  <Textarea placeholder="Optional remark" {...register('remark')} />
                </FormField>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(paths.rateRevisionList)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? 'Submitting…' : 'Submit for Approval'}
          </Button>
        </div>
      </form>
    </div>
  )
}
