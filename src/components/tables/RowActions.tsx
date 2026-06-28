import { MoreHorizontal } from 'lucide-react'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown'
import { Button } from '@/components/ui/button'

export interface RowAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  separatorBefore?: boolean
  destructive?: boolean
}

export function RowActions({ actions }: { actions: RowAction[] }) {
  return (
    <Dropdown
      trigger={
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal />
        </Button>
      }
    >
      {(close) => (
        <>
          {actions.map((action, i) => (
            <div key={action.label}>
              {action.separatorBefore && i > 0 && <DropdownSeparator />}
              <DropdownItem
                className={action.destructive ? 'text-destructive hover:bg-destructive/10' : ''}
                onClick={() => {
                  action.onClick()
                  close()
                }}
              >
                {action.icon}
                {action.label}
              </DropdownItem>
            </div>
          ))}
        </>
      )}
    </Dropdown>
  )
}
