'use client'

import * as React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  title: string
  content: string
  className?: string
}

export function InfoTooltip({ title, content, className }: InfoTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className={cn(
              "inline-flex items-center justify-center ml-2 w-4 h-4 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors",
              className
            )}
            type="button"
          >
            <Info className="w-3 h-3" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
            sideOffset={5}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {content}
              </div>
            </div>
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}