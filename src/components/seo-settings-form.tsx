'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { updateSeoSettings } from '@/app/actions/seo'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  metaTitle: z.string().min(1, 'Meta Title is required'),
  metaDescription: z.string().min(1, 'Meta Description is required'),
  robotsTxt: z.string().optional().default(''),
  googleVerification: z.string().optional().default(''),
  showCounter: z.boolean().default(true),
})

interface SeoSettingsFormProps {
  initialData: {
    metaTitle: string
    metaDescription: string
    robotsTxt: string
    googleVerification: string
    showCounter: boolean
  }
}

export function SeoSettingsForm({ initialData }: SeoSettingsFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metaTitle: initialData.metaTitle,
      metaDescription: initialData.metaDescription,
      robotsTxt: initialData.robotsTxt,
      googleVerification: initialData.googleVerification,
      showCounter: initialData.showCounter,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await updateSeoSettings(values)
      toast({
        title: 'Settings Updated',
        description: 'SEO settings have been saved successfully.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update settings.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="showCounter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Public Generation Counter
                </FormLabel>
                <FormDescription>
                  Display the total number of generated letterheads on the home page.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input placeholder="My Website Title" {...field} />
              </FormControl>
              <FormDescription>
                The title tag of your website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A description of your website..." {...field} rows={3} />
              </FormControl>
              <FormDescription>
                The meta description tag of your website.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="googleVerification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Site Verification</FormLabel>
              <FormControl>
                <Input placeholder="DLAxNrEy7wBocc..." {...field} />
              </FormControl>
              <FormDescription>
                The verification code from Google Search Console.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="robotsTxt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>robots.txt Content</FormLabel>
              <FormControl>
                <Textarea 
                    placeholder="User-agent: *..." 
                    {...field} 
                    rows={5} 
                    className="font-mono text-sm"
                />
              </FormControl>
              <FormDescription>
                Content for robots.txt.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  )
}
