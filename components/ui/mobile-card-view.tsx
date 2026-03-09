"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MobileCardField {
    label: string
    key: string
    render?: (value: any, item: any) => React.ReactNode
}

interface MobileCardViewProps {
    data: any[]
    fields: MobileCardField[]
    actions?: (item: any) => React.ReactNode
    primaryFieldKey?: string
    loading?: boolean
    emptyMessage?: string
}

export function MobileCardView({
    data,
    fields,
    actions,
    primaryFieldKey,
    loading,
    emptyMessage = "No data available."
}: MobileCardViewProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse bg-muted/20 border-border/50">
                        <CardContent className="p-4 space-y-3">
                            <div className="h-4 w-1/3 bg-muted rounded" />
                            <div className="h-3 w-3/4 bg-muted rounded" />
                            <div className="h-3 w-1/2 bg-muted rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground italic border-2 border-dashed border-border rounded-xl">
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {data.map((item, idx) => (
                <Card key={item.id || idx} className="glass-card border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                    <CardContent className="p-0">
                        {/* Header/Primary Field */}
                        {primaryFieldKey && (
                            <div className="bg-muted/30 px-4 py-3 border-b border-border/50 flex items-center justify-between">
                                <div className="font-bold text-foreground truncate">
                                    {(() => {
                                        const field = fields.find(f => f.key === primaryFieldKey);
                                        return field?.render
                                            ? field.render(item[primaryFieldKey], item)
                                            : item[primaryFieldKey];
                                    })()}
                                </div>
                                {actions && <div className="flex items-center gap-2">{actions(item)}</div>}
                            </div>
                        )}

                        <div className="p-4 space-y-4">
                            {fields.filter(f => f.key !== primaryFieldKey).map((field) => (
                                <div key={field.key} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                        {field.label}
                                    </span>
                                    <div className="text-sm font-medium text-foreground">
                                        {field.render ? field.render(item[field.key], item) : (item[field.key] || "—")}
                                    </div>
                                </div>
                            ))}

                            {!primaryFieldKey && actions && (
                                <div className="pt-2 border-t border-border/50 mt-2 flex justify-end">
                                    {actions(item)}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
