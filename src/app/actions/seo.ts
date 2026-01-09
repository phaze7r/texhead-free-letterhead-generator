'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const seoSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  robotsTxt: z.string(),
  googleVerification: z.string().optional(),
  showCounter: z.boolean().default(true),
})

export async function getSeoSettings() {
  const settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    return {
      metaTitle: 'Free Letterhead Generator',
      metaDescription: 'Create professional letterheads for free. Easy to use, customizable, and download as PDF.',
      robotsTxt: 'User-agent: *\nAllow: /',
      googleVerification: '',
      showCounter: true,
      totalGenerated: 0,
    }
  }
  return settings
}

export async function updateSeoSettings(data: z.infer<typeof seoSchema>) {
  const { metaTitle, metaDescription, robotsTxt, googleVerification, showCounter } = data;

  try {
    const existing = await prisma.siteSettings.findFirst()

    if (existing) {
        await prisma.siteSettings.update({
            where: { id: existing.id },
            data: {
                metaTitle,
                metaDescription,
                robotsTxt,
                googleVerification: googleVerification || '',
                showCounter
            }
        })
    } else {
        await prisma.siteSettings.create({
            data: {
                metaTitle,
                metaDescription,
                robotsTxt,
                googleVerification: googleVerification || '',
                showCounter
            }
        })
    }

    revalidatePath('/')
    revalidatePath('/mashar')
    revalidatePath('/robots.txt')
    
    return { success: true, message: 'Settings updated successfully' }
  } catch (error) {
    console.error('Failed to update SEO settings:', error)
    throw new Error('Failed to update settings.')
  }
}