import { useEffect } from 'react'
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
import {
  departmentOptions,
  itemOptionsForStore,
  priorityOptions,
  storeOptionsForDepartment,
  unitOptions,
} from '@/lib/options'
import { materialRequestSchema, type MaterialRequestFormValues } from '@/lib/validations'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { useMaterialRequestStore } from '@/store/materialRequest.store'
import { departments } from '@/mocks/departments'
import { items } from '@/mocks/items'
import { ApprovalStatus, PriorityLevel, UserRole, type MaterialRequest } from '@/types'

export default function MaterialRequestCreate() {
  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MaterialRequestFormValues>({
    resolver: zodResolver(materialRequestSchema),
    defaultValues: {
      priority: PriorityLevel.Medium,
      date: '2026-06-28',
      lines: [{ itemName: '', unit: 'pcs', quantity: 1, estimatedRate: 0 }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' })
  const lines = watch('lines')
  const total = lines?.reduce((s, l) => s + (Number(l.quantity) || 0) * (Number(l.estimatedRate) || 0), 0) ?? 0

  // Cascading dropdowns: department → store → items.
  const department = watch('department')
  const store = watch('store')
  const storeChoices = storeOptionsForDepartment(department ?? '')
  const itemChoices = itemOptionsForStore(store ?? '')

  // When the department changes, auto-pick its store (or clear if ambiguous).
  useEffect(() => {
    if (!department) return
    setValue('store', storeChoices.length === 1 ? String(storeChoices[0].value) : '')
  }, [department]) // eslint-disable-line react-hooks/exhaustive-deps

  // When the store changes, clear any selected items that no longer belong to it.
  useEffect(() => {
    const valid = new Set(itemChoices.map((o) => o.value))
    lines?.forEach((l, i) => {
      if (l.itemName && !valid.has(l.itemName)) setValue(`lines.${i}.itemName`, '')
    })
  }, [store]) // eslint-disable-line react-hooks/exhaustive-deps

  const addRequest = useMaterialRequestStore((s) => s.addRequest)

  const onSubmit = async (values: MaterialRequestFormValues) => {
    await new Promise((r) => setTimeout(r, 400))

    const lines = values.lines.map((l, i) => ({
      id: `L${i + 1}`,
      itemCode: items.find((it) => it.name === l.itemName)?.code ?? '',
      itemName: l.itemName,
      unit: l.unit,
      quantity: Number(l.quantity),
      estimatedRate: Number(l.estimatedRate),
    }))
    const totalEstimate = lines.reduce((s, l) => s + l.quantity * l.estimatedRate, 0)
    const dept = departments.find((d) => d.name === values.department)
    const hodName = dept?.hodName ?? 'Department HOD'
    const deptCode = dept?.code ?? 'NEW'
    const seq = Date.now().toString().slice(-4)

    const request: MaterialRequest = {
      id: `MR-${Date.now()}`,
      mrNo: `SH-MR-${deptCode}-${seq}`,
      date: values.date,
      department: values.department,
      store: values.store,
      requestedBy: values.requestedBy,
      priority: values.priority,
      status: ApprovalStatus.Pending,
      lines,
      totalEstimate,
      remark: values.remark,
      approvals: [{ role: UserRole.HOD, approverName: hodName, status: ApprovalStatus.Pending }],
    }

    addRequest(request)
    toast.success('Material Request submitted', `${request.mrNo} sent to ${hodName} for approval.`)
    navigate(paths.materialRequestList)
  }

  return (
    <div>
      <PageHeader
        title="Create Material Request"
        description="Raise an indent for procurement of items."
        breadcrumbs={[
          { label: 'Procurement' },
          { label: 'Material Requests', to: paths.materialRequestList },
          { label: 'New' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="px-6">
            <FormSection title="Request Details" description="Who is requesting and for which department.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Department" required error={errors.department?.message}>
                  <Select {...register('department')} defaultValue="">
                    <option value="" disabled>Select department</option>
                    {departmentOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Store" required error={errors.store?.message}>
                  <Select {...register('store')} disabled={!department}>
                    <option value="" disabled>{department ? 'Select store' : 'Select department first'}</option>
                    {storeChoices.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Requested By" required error={errors.requestedBy?.message}>
                  <Input placeholder="Full name" {...register('requestedBy')} />
                </FormField>
                <FormField label="Priority" required error={errors.priority?.message}>
                  <Select {...register('priority')}>
                    {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                </FormField>
                <FormField label="Request Date" required error={errors.date?.message}>
                  <DatePicker {...register('date')} />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Line Items" description="Items being requested with estimated rates." className="md:col-span-2">
              <div className="space-y-3">
                {fields.map((field, i) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 rounded-xl border border-border p-3">
                    <div className="col-span-12 sm:col-span-5">
                      <Select {...register(`lines.${i}.itemName`)} disabled={!store}>
                        <option value="" disabled>{store ? 'Select item' : 'Select store first'}</option>
                        {itemChoices.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Select {...register(`lines.${i}.unit`)}>
                        {unitOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </Select>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input type="number" placeholder="Qty" {...register(`lines.${i}.quantity`)} />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input type="number" step="0.01" placeholder="Rate" {...register(`lines.${i}.estimatedRate`)} />
                    </div>
                    <div className="col-span-12 flex justify-end sm:col-span-1">
                      <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(i)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {errors.lines?.message && <p className="text-xs text-destructive">{errors.lines.message}</p>}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ itemName: '', unit: 'pcs', quantity: 1, estimatedRate: 0 })}>
                  <Plus />
                  Add Item
                </Button>
                <div className="flex justify-end border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground">
                    Estimated Total: <span className="text-base font-semibold text-foreground">{formatCurrency(total)}</span>
                  </p>
                </div>
              </div>
            </FormSection>

            <FormSection title="Notes" description="Any additional context for approvers.">
              <FormField label="Remark" error={errors.remark?.message}>
                <Textarea placeholder="Reason for request, urgency, etc." {...register('remark')} />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(paths.materialRequestList)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save />
            {isSubmitting ? 'Submitting…' : 'Submit for Approval'}
          </Button>
        </div>
      </form>
    </div>
  )
}
