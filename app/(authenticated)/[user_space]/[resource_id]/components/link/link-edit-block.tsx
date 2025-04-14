"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { LinkInfo } from "./types"

const FormSchema = z.object({
  href: z.string(),
  target: z.string()
})

interface LinkEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValues?: z.infer<typeof FormSchema>
  onSave: (value: LinkInfo) => void
}

export const LinkEditBlock = (props: LinkEditBlockProps) => {

  const { defaultValues, className, onSave } = props

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  useEffect(() => {
    form.setValue('href', defaultValues?.href || '')
    form.setValue('target', defaultValues?.target || '')
  }, [defaultValues, form])


  function onSubmit(data: z.infer<typeof FormSchema>) {

    const { href, target } = data

    const value = {
      href: href,
      target
    }

    onSave(value)
  }

  return (
    <div>
      <div className={cn('space-y-4', className)}>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page or URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter URL or search pages" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open in New Tab</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === '_blank'}
                      onCheckedChange={value => field.onChange(value ? '_blank' : '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
