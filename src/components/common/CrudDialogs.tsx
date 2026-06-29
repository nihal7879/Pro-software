import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { SelectOption } from '@/types'

export interface FieldConfig {
  key: string
  label: string
  type?: 'text' | 'number' | 'toggle' | 'select'
  options?: SelectOption[]
  full?: boolean
}

/** Read-only details popup — a simple label/value grid. */
export function DetailModal({
  open,
  onClose,
  title,
  rows,
}: {
  open: boolean
  onClose: () => void
  title?: string
  rows: { label: string; value: React.ReactNode }[]
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="mt-0.5 text-sm font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}

/** Field-driven edit form. Mount with a `key` so it resets per record. */
export function EditModal<T extends Record<string, unknown>>({
  open,
  onClose,
  title,
  fields,
  initial,
  onSave,
}: {
  open: boolean
  onClose: () => void
  title?: string
  fields: FieldConfig[]
  initial: T
  onSave: (values: T) => void
}) {
  const [values, setValues] = useState<T>(initial)
  const set = (key: string, value: unknown) => setValues((p) => ({ ...p, [key]: value }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(values)}>Save changes</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className={f.full || f.type === 'toggle' ? 'sm:col-span-2' : ''}>
            <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
            {f.type === 'select' ? (
              <Select value={String(values[f.key] ?? '')} onChange={(e) => set(f.key, e.target.value)}>
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            ) : f.type === 'toggle' ? (
              <Checkbox
                checked={Boolean(values[f.key])}
                onChange={(e) => set(f.key, e.target.checked)}
                label="Active"
              />
            ) : (
              <Input
                type={f.type === 'number' ? 'number' : 'text'}
                value={String(values[f.key] ?? '')}
                onChange={(e) => set(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </Modal>
  )
}

/** Destructive confirmation dialog. */
export function ConfirmDialog({
  open,
  onClose,
  title = 'Delete record',
  message,
  confirmLabel = 'Delete',
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  title?: string
  message: React.ReactNode
  confirmLabel?: string
  onConfirm: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{message}</p>
    </Modal>
  )
}
