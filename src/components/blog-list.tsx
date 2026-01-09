'use client'

import { useState } from 'react'
import { getBlogPosts } from '@/app/actions/blog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface BlogListProps {
  initialPosts: any[]
  totalCount: number
}

export function BlogList({ initialPosts, totalCount }: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const hasMore = posts.length < totalCount

  async function loadMore() {
    setIsLoading(true)
    const nextPage = page + 1
    const { posts: newPosts } = await getBlogPosts(nextPage, 10)
    
    setPosts([...posts, ...newPosts])
    setPage(nextPage)
    setIsLoading(false)
  }

  if (posts.length === 0) {
      return (
        <div className="text-center py-20">
            <p className="text-slate-500 italic">No blog posts published yet. Stay tuned!</p>
        </div>
      )
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} className="group hover:shadow-md transition-shadow flex flex-col">
            <CardHeader>
              <div className="text-xs text-muted-foreground mb-2">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0 h-auto font-semibold" asChild>
                <Link href={`/blog/${post.slug}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={loadMore} 
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
