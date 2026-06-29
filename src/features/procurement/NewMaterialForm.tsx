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
import { FileUpload } from '@/components/forms/FileUpload'
import { chargeableOptions, departmentOptions, unitOptions } from '@/lib/options'
import { newMaterialSchema, type NewMaterialFormValues } from '@/lib/validations'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { useNewMaterialStore } from '@/store/newMaterial.store'
import { departments } from '@/mocks/departments'
import { ApprovalStatus, ChargeableFlag, UserRole, type NewMaterialRequest } from '@/types'

export default function NewMaterialForm() {
  const navigate = useNavigate()
  const addNewMaterial = useNewMaterialStore((s) => s.add)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewMaterialFormValues>({
    resolver: zodResolver(newMaterialSchema),
    defaultValues: {
      date: '2026-06-28',
      chargeable: ChargeableFlag.NonChargeable,
      lines: [{ itemName: '', unit: 'pcs', packSize: '1', brand: '', quantity: 1, quoteRate: 0, negotiatedRate: 0, mrp: 0, gstPercent: 5 }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })

  const onSubmit = async (values: NewMaterialFormValues) => {
    await new Promise((r) => setTimeout(r, 400))
    const hodName = departments.find((d) => d.name === values.department)?.hodName ?? 'Department HOD'
    const record: NewMaterialRequest = {
      id: `NM-${Date.now()}`,
      formNo: `SH-NM-NEW-${Date.now().toString().slice(-4)}`,
      refNo: `REF-${Date.now().toString().slice(-5)}`,
      date: values.date,
      supplierName: values.supplierName,
      supplierAddress: values.supplierAddress,
      department: values.department,
      requestedBy: values.requestedBy,
      leadTime: values.leadTime,
      chargeable: values.chargeable,
      remark: values.remark,
      lines: values.lines.map((l) => ({
        itemName: l.itemName,
        unit: l.unit,
        packSize: l.packSize,
        brand: l.brand,
        quantity: l.quantity,
        quoteRate: l.quoteRate,
        negotiatedRate: l.negotiatedRate,
        mrp: l.mrp,
        gstPercent: l.gstPercent,
      })),
      status: ApprovalStatus.Pending,
      approvals: [
        { role: UserRole.HOD, approverName: hodName, status: ApprovalStatus.Pending },
        { role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Pending },
      ],
    }
    addNewMaterial(record)
    toast.success('New Material form submitted', `${record.formNo} sent for HOD review.`)
    navigate(paths.newMaterialList)
  }

  return (
    <div>
      <PageHeader
        title="New Material Form"
        description="Request approval to onboard new materials."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'New Material', to: paths.newMaterialList }, { label: 'New' }]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="px-6">
            <FormSection title="Supplier" description="Vendor offering the new material.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Supplier Name" required error={errors.supplierName?.message}>
                  <Input placeholder="e.g. OSB Agencies Pvt Ltd" {...register('supplierName')} />
                </FormField>
                <FormField label="Date" required error={errors.date?.message}>
                  <DatePicker {...register('date')} />
                </FormField>
                <FormField label="Supplier Address" required error={errors.supplierAddress?.message} className="sm:col-span-2">
                  <Input placeholder="Full address" {...register('supplierAddress')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Request" description="Department and approval context.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Department" required error={errors.department?.message}>
                  <Select {...register('department')} defaultValue="">
                    <option value="" disabled>Select department</option>
                    {departmentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Requested By" required error={errors.requestedBy?.message}>
                  <Input placeholder="Doctor / requester" {...register('requestedBy')} />
                </FormField>
                <FormField label="Lead Time" required error={errors.leadTime?.message}>
                  <Input placeholder="e.g. 5-7 working days" {...register('leadTime')} />
                </FormField>
                <FormField label="Chargeable" required error={errors.chargeable?.message}>
                  <Select {...register('chargeable')}>
                    {chargeableOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Items" description="Materials with quoted and negotiated rates." className="md:col-span-2">
              <div className="space-y-3">
                {fields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 rounded-xl border border-border p-3">
                    <div className="col-span-12 sm:col-span-4">
                      <Input placeholder="Item name" {...register(`lines.${i}.itemName`)} />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <Input placeholder="Brand" {...register(`lines.${i}.brand`)} />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <Select {...register(`lines.${i}.unit`)}>
                        {unitOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <Input placeholder="Qty" type="number" {...register(`lines.${i}.quantity`)} />
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <Input placeholder="Quote" type="number" {...register(`lines.${i}.quoteRate`)} />
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                      <Input placeholder="Negot." type="number" {...register(`lines.${i}.negotiatedRate`)} />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <Input placeholder="GST" type="number" {...register(`lines.${i}.gstPercent`)} />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(i)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                    <input type="hidden" {...register(`lines.${i}.packSize`)} defaultValue="1" />
                    <input type="hidden" {...register(`lines.${i}.mrp`)} defaultValue="0" />
                  </div>
                ))}
                {errors.lines?.message && <p className="text-xs text-destructive">{errors.lines.message}</p>}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ itemName: '', unit: 'pcs', packSize: '1', brand: '', quantity: 1, quoteRate: 0, negotiatedRate: 0, mrp: 0, gstPercent: 5 })}>
                  <Plus />
                  Add Item
                </Button>
              </div>
            </FormSection>

            <FormSection title="Attachments & Remark" description="Supporting quotes and notes.">
              <div className="space-y-4">
                <FileUpload hint="Vendor quotation, catalogue — PDF/JPG up to 10MB" />
                <FormField label="Remark" error={errors.remark?.message}>
                  <Textarea placeholder="Vendor contact, justification…" {...register('remark')} />
                </FormField>
              </div>
            </FormSection>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(paths.newMaterialList)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? 'Submitting…' : 'Submit for Review'}
          </Button>
        </div>
      </form>
    </div>
  )
}
