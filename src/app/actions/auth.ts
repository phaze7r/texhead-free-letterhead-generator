'use server'

import { createSession, deleteSession, getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Please enter all fields.' }
  }

  const user = await prisma.adminUser.findUnique({
    where: { username }
  })

  if (!user) {
    return {
      error: 'Invalid credentials.',
    }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return {
      error: 'Invalid credentials.',
    }
  }

  await createSession(username)
  redirect('/mashar')
}

export async function logout() {
  await deleteSession()
  redirect('/mashar/login')
}

export async function updatePassword(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Not authorized')
  }

  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' }
  }

  const user = await prisma.adminUser.findUnique({
    where: { username: session.user as string }
  })

  if (!user) {
    return { error: 'User not found.' }
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password)
  if (!isCurrentValid) {
    return { error: 'Current password is incorrect.' }
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  await prisma.adminUser.update({
    where: { username: session.user as string },
    data: { password: hashedNewPassword }
  })

  revalidatePath('/mashar')
  return { success: 'Password updated successfully.' }
}
