import { getBlogPosts } from '@/app/actions/blog'
import { BlogList } from '@/components/blog-list'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata = {
  title: 'Blog - TexHead Free Letterhead Generator',
  description: 'Read the latest tips and guides on creating professional letterheads and business branding.',
}

export default async function BlogPage() {
  const { posts, total } = await getBlogPosts(1, 20)

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
            Read our latest blogs about our Letterhead generations
          </h1>
          <p className="text-xl text-muted-foreground">
            Tips, guides, and inspiration for you.
          </p>
        </div>

        <BlogList initialPosts={posts} totalCount={total} />
      </div>
    </div>
  )
}
