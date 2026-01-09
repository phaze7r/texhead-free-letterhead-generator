'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function incrementCounter(details: any) {
  try {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'

    // 1. Log the letter generation
    await prisma.generatedLetter.create({
      data: {
        companyName: details.companyName,
        employeeName: details.employeeName,
        employeeEmail: details.employeeEmail,
        employeeWebsite: details.employeeWebsite || '',
        ipAddress: ip,
      },
    })

    // 2. Increment global counter
    const settings = await prisma.siteSettings.findFirst()
    if (settings) {
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { totalGenerated: { increment: 1 } },
      })
      revalidatePath('/')
      revalidatePath('/mashar')
    }
  } catch (error) {
    console.error('Failed to increment counter:', error)
  }
}

export async function getRecentLetters() {
    return prisma.generatedLetter.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    })
}