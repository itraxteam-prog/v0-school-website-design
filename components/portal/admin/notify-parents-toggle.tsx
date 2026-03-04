"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

interface NotifyParentsToggleProps {
    defaultChecked?: boolean
    onChange?: (checked: boolean) => void
}

export function NotifyParentsToggle({
    defaultChecked = false,
    onChange,
}: NotifyParentsToggleProps) {
    const [enabled, setEnabled] = useState(defaultChecked)

    const handleChange = (checked: boolean) => {
        setEnabled(checked)
        onChange?.(checked)
    }

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
                <Label
                    htmlFor="notify-parents-switch"
                    className="text-sm font-semibold cursor-pointer"
                >
                    Notify parents via email
                </Label>
                <p className="text-xs text-muted-foreground">
                    Send this announcement to all linked parent email addresses.
                </p>
            </div>
            <Switch
                id="notify-parents-switch"
                checked={enabled}
                onCheckedChange={handleChange}
            />
        </div>
    )
}
