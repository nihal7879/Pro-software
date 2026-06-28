import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Stepper } from '@/components/common/Stepper'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/forms/FormField'
import { FormSection } from '@/components/forms/FormSection'
import { DatePicker } from '@/components/forms/DatePicker'
import { MultiSelect } from '@/components/forms/MultiSelect'
import { storeOptions, vendorOptions } from '@/lib/options'
import { rfqSchema, type RfqFormValues } from '@/lib/validations'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'

export default function RfqCreate() {
  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RfqFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: { date: '2026-06-28', dueDate: '2026-07-05', vendorIds: [] },
  })

  const onSubmit = async (values: RfqFormValues) => {
    await new Promise((r) => setTimeout(r, 600))
    toast.success('RFQ created', `Sent to ${values.vendorIds.length} vendor(s).`)
    navigate(paths.rfqList)
  }

  return (
    <div>
      <PageHeader
        title="Create RFQ"
        description="Request quotations from selected vendors."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'RFQ', to: paths.rfqList }, { label: 'New' }]}
      />

      <Card className="mb-4">
        <CardContent className="p-6">
          <Stepper steps={['RFQ Details', 'Select Vendors', 'Review & Send']} current={1} />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="px-6">
            <FormSection title="RFQ Details" description="Store and timeline for the quotation.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Store" required error={errors.store?.message}>
                  <Select {...register('store')} defaultValue="">
                    <option value="" disabled>Select store</option>
                    {storeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <div />
                <FormField label="RFQ Date" required error={errors.date?.message}>
                  <DatePicker {...register('date')} />
                </FormField>
                <FormField label="Response Due Date" required error={errors.dueDate?.message}>
                  <DatePicker {...register('dueDate')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Vendors" description="Choose which vendors to invite for quotes.">
              <FormField label="Invite Vendors" required error={errors.vendorIds?.message}>
                <Controller
                  control={control}
                  name="vendorIds"
                  render={({ field }) => (
                    <MultiSelect options={vendorOptions} value={field.value} onChange={field.onChange} placeholder="Select vendors to invite…" />
                  )}
                />
              </FormField>
            </FormSection>

            <FormSection title="Notes" description="Instructions or terms for vendors.">
              <FormField label="Notes" error={errors.notes?.message}>
                <Textarea placeholder="Delivery terms, specifications, etc." {...register('notes')} />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(paths.rfqList)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Send />
            {isSubmitting ? 'Sending…' : 'Send RFQ'}
          </Button>
        </div>
      </form>
    </div>
  )
}
