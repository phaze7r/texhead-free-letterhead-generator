import { getBlogPostBySlug, getRedirect } from '@/app/actions/blog'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) return {}

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
    twitter: {
        card: 'summary_large_image',
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.featuredImage ? [post.featuredImage] : [],
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    // Check for redirects
    const redirection = await getRedirect(`/blog/${slug}`)
    if (redirection) {
        redirect(redirection.destination)
    }
    notFound()
  }

  return (
    <article className="container mx-auto py-12 px-4 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage || "https://letterhead.texodus.tech/icon.svg",
            "datePublished": post.createdAt.toISOString(),
            "dateModified": post.updatedAt.toISOString(),
            "author": {
              "@type": "Organization",
              "name": "TexHead"
            }
          })
        }}
      />
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-8 p-0 hover:bg-transparent hover:text-primary" asChild>
            <Link href="/blog">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to all articles
            </Link>
        </Button>

        <header className="space-y-6 mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {Math.ceil(post.content.split(' ').length / 200)} min read
                </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl leading-tight">
                {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed font-medium border-l-4 border-primary/20 pl-6 py-2">
                {post.excerpt}
            </p>
        </header>

        {post.featuredImage && (
            <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10">
                <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="object-cover w-full h-full"
                />
            </div>
        )}

        <div className="prose prose-lg prose-invert prose-slate max-w-none 
            prose-headings:text-foreground prose-headings:font-bold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg
            prose-strong:text-foreground
            prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg">
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <hr className="my-16 border-white/10" />

        <div className="bg-card rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Need a professional letterhead?</h2>
            <p className="text-muted-foreground">Create and download your customized letterhead in minutes for free.</p>
            <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/">Create My Letterhead</Link>
            </Button>
        </div>
      </div>
    </article>
  )
}