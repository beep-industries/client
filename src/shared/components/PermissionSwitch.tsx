import { Switch } from "@/shared/components/ui/Switch"
import { Label } from "@/shared/components/ui/Label"

interface PermissionSwitchProps {
  name: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function PermissionSwitch({
  name,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: PermissionSwitchProps) {
  return (
    <div className="border-border hover:bg-accent/50 flex flex-row items-center justify-between gap-4 rounded-lg border p-4 transition-colors">
      <div className="flex flex-1 flex-col gap-1">
        <Label htmlFor={name} className="cursor-pointer text-base font-medium">
          {name}
        </Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch id={name} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}
