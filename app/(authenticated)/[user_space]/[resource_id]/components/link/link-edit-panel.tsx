"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { LinkInfo } from "./types"

interface LinkEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  initialUrl?: string,
  initialTarget?: string,
  onSave: (value: LinkInfo) => void
}

export const LinkEditPanel = (props: LinkEditBlockProps) => {

  const { initialUrl, initialTarget, className, onSave } = props

  const [formValue, setFormValue] = useState<LinkInfo>({
    href: initialUrl || '',
    target: initialTarget || ''
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(formValue)
  }

  return (
    <div>
      <div className={cn('space-y-4', className)}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Enter URL or search pages"
            value={formValue.href}
            onChange={e => setFormValue({
              ...formValue,
              href: e.target.value
            })}
          />
          <Switch
            checked={formValue.target === '_blank'}
            onCheckedChange={value => setFormValue({ ...formValue, target: value ? '_blank' : '_self' })}
          />
          <Button type="submit" size="sm">Submit</Button>
        </form>
      </div>
    </div>
  )
}
