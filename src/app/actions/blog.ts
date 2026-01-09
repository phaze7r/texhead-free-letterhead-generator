'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(true),
  featuredImage: z.string().optional(),
})

export async function createBlogPost(data: z.infer<typeof blogPostSchema>) {
  try {
    const formattedSlug = data.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    await prisma.blogPost.create({
      data: {
        ...data,
        slug: formattedSlug,
      },
    })
    revalidatePath('/blog')
    revalidatePath('/mashar')
    return { success: true }
  } catch (error) {
    console.error('Failed to create blog post:', error)
    return { error: 'Failed to create blog post.' }
  }
}

export async function updateBlogPost(id: number, data: z.infer<typeof blogPostSchema>) {
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) throw new Error('Post not found')

    const newSlug = data.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    // Handle redirection if slug changed
    if (existing.slug !== newSlug) {
      await prisma.redirect.upsert({
        where: { source: `/blog/${existing.slug}` },
        update: { destination: `/blog/${newSlug}` },
        create: {
          source: `/blog/${existing.slug}`,
          destination: `/blog/${newSlug}`,
        },
      })
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        slug: newSlug,
      },
    })

    revalidatePath('/blog')
    revalidatePath(`/blog/${existing.slug}`)
    revalidatePath(`/blog/${newSlug}`)
    revalidatePath('/mashar')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update blog post:', error)
    return { error: 'Failed to update blog post.' }
  }
}

export async function getBlogPosts(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ])

  return { posts, total }
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  })
}

export async function getAllBlogPostsAdmin() {
    return prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function deleteBlogPost(id: number) {
    await prisma.blogPost.delete({ where: { id } })
    revalidatePath('/blog')
    revalidatePath('/mashar')
}

export async function getRedirect(source: string) {
    return prisma.redirect.findUnique({
        where: { source }
    })
}