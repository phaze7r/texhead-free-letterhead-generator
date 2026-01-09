'use client'

import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { createBlogPost, updateBlogPost } from '@/app/actions/blog'
import { Loader2, Plus, Edit2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(true),
})

interface BlogPostFormProps {
  post?: any
  mode?: 'create' | 'edit'
}

export function BlogPostForm({ post, mode = 'create' }: BlogPostFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      featuredImage: post?.featuredImage || '',
      metaTitle: post?.metaTitle || '',
      metaDescription: post?.metaDescription || '',
      published: post?.published ?? true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    let result
    if (mode === 'edit' && post) {
      result = await updateBlogPost(post.id, values)
    } else {
      result = await createBlogPost(values)
    }
    setIsSubmitting(false)

    if (result.success) {
      toast({ title: 'Success', description: `Blog post ${mode === 'edit' ? 'updated' : 'created'} successfully.` })
      if (mode === 'create') form.reset()
      setOpen(false)
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'edit' ? (
          <Button variant="outline" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit' : 'Create New'} Blog Post</DialogTitle>
          <DialogDescription>
            Publish rich, SEO optimized content with media and links.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter blog title" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. how-to-create-letterhead" {...field} />
                    </FormControl>
                    <FormDescription>URL-friendly name (Redirection is auto-managed if changed)</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Featured Image URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormDescription>External image URL for the blog header</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt (Short Summary)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary of the post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-lg border border-border space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                   <LinkIcon className="h-3 w-3" /> Content Writing Tips
                </p>
                <div className="flex flex-wrap gap-2">
                    <code className="text-[10px] bg-background text-foreground px-2 py-1 rounded border border-border">[Image Name](url)</code>
                    <code className="text-[10px] bg-background text-foreground px-2 py-1 rounded border border-border">[Link Text](url)</code>
                    <code className="text-[10px] bg-background text-foreground px-2 py-1 rounded border border-border">## Subheading</code>
                    <code className="text-[10px] bg-background text-foreground px-2 py-1 rounded border border-border">**Bold Text**</code>
                </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Rich Text / Markdown)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your blog content here..." {...field} rows={15} className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-secondary/10 rounded-lg border border-border">
                <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>SEO Meta Title</FormLabel>
                    <FormControl>
                        <Input placeholder="SEO Title" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>SEO Meta Description</FormLabel>
                    <FormControl>
                        <Input placeholder="SEO Description" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Published Status
                    </FormLabel>
                    <FormDescription>
                      If unchecked, this post will be saved as a draft and hidden from the public blog.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'edit' ? 'Update Post' : 'Publish Post'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}