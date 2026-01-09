import { logout, updatePassword } from '@/app/actions/auth'
import { getSeoSettings } from '@/app/actions/seo'
import { getAllBlogPostsAdmin } from '@/app/actions/blog'
import { SeoSettingsForm } from '@/components/seo-settings-form'
import { ChangePasswordForm } from '@/components/change-password-form'
import { BlogPostForm } from '@/components/blog-post-form'
import { BlogListAdmin } from '@/components/blog-list-admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSession } from '@/lib/session'

import { getRecentLetters } from '@/app/actions/stats'
import { LetterLogs } from '@/components/letter-logs'
import { getContactMessages } from '@/app/actions/contact'
import { ContactMessagesList } from '@/components/contact-messages-list'

export default async function AdminDashboard() {
  const session = await getSession()
  const seoSettings = await getSeoSettings()
  const blogPosts = await getAllBlogPostsAdmin()
  const recentLetters = await getRecentLetters()
  const contactMessages = await getContactMessages()

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
             <p className="text-muted-foreground">Welcome back, {session?.user as string}.</p>
          </div>
          <form action={logout}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Letters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoSettings.totalGenerated}</div>
              <p className="text-xs text-muted-foreground">Generated to date</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts.length}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Generation Logs</CardTitle>
                <CardDescription>Monitor recent letterhead generations and track potential spam.</CardDescription>
            </CardHeader>
            <CardContent>
                <LetterLogs logs={recentLetters} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>Direct inquiries from the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
                <ContactMessagesList messages={contactMessages} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Blog Management</CardTitle>
                    <CardDescription>Create and manage your SEO optimized articles.</CardDescription>
                </div>
                <BlogPostForm />
            </CardHeader>
            <CardContent>
                <BlogListAdmin posts={blogPosts} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Manage your website&apos;s global SEO metadata.</CardDescription>
            </CardHeader>
            <CardContent>
                <SeoSettingsForm initialData={seoSettings} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Change your administrator password.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChangePasswordForm />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
