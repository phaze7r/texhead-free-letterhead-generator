'use client'

import { deleteBlogPost } from '@/app/actions/blog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { BlogPostForm } from './blog-post-form'

import { Badge } from '@/components/ui/badge'

interface BlogListAdminProps {
  posts: any[]
}

export function BlogListAdmin({ posts }: BlogListAdminProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    setIsDeleting(id)
    try {
      await deleteBlogPost(id)
      toast({ title: 'Deleted', description: 'Post deleted successfully.' })
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete post.' })
    } finally {
      setIsDeleting(null)
    }
  }

  if (posts.length === 0) {
      return <p className="text-sm text-slate-500 py-4">No blog posts found.</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
              <TableCell>
                <Badge variant={post.published ? 'default' : 'secondary'}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">/{post.slug}</TableCell>
              <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <BlogPostForm post={post} mode="edit" />
                <Button variant="outline" size="icon" asChild title="View Live">
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting === post.id}
                    title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}