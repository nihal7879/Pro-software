import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { toast } from '@/store/toast.store'

interface ApprovalActionsProps {
  reference: string
  onApprove?: (remark: string) => void
  onReject?: (remark: string) => void
  size?: 'sm' | 'default'
}

export function ApprovalActions({ reference, onApprove, onReject, size = 'default' }: ApprovalActionsProps) {
  const [mode, setMode] = useState<'approve' | 'reject' | null>(null)
  const [remark, setRemark] = useState('')

  const submit = () => {
    if (mode === 'approve') {
      onApprove?.(remark)
      toast.success('Approved', `${reference} has been approved.`)
    } else {
      onReject?.(remark)
      toast.error('Rejected', `${reference} has been rejected.`)
    }
    setMode(null)
    setRemark('')
  }

  return (
    <>
      <div className="flex gap-2">
        <Button size={size} variant="success" onClick={() => setMode('approve')}>
          <Check />
          Approve
        </Button>
        <Button size={size} variant="destructive" onClick={() => setMode('reject')}>
          <X />
          Reject
        </Button>
      </div>

      <Modal
        open={mode !== null}
        onClose={() => setMode(null)}
        title={mode === 'approve' ? 'Approve document' : 'Reject document'}
        description={`${reference}`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button variant={mode === 'approve' ? 'success' : 'destructive'} onClick={submit}>
              Confirm {mode === 'approve' ? 'approval' : 'rejection'}
            </Button>
          </>
        }
      >
        <label className="text-sm font-medium">Remark {mode === 'reject' && <span className="text-destructive">*</span>}</label>
        <Textarea
          className="mt-1.5"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={mode === 'approve' ? 'Optional remark…' : 'Reason for rejection…'}
        />
      </Modal>
    </>
  )
}
