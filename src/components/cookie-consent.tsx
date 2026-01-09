'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cookie } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500) // Show after a short delay
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="mx-auto max-w-4xl border-2 shadow-lg bg-white/95 backdrop-blur">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full shrink-0">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg leading-none">Cookie Consent</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, serve personalized ads or content, and analyze our traffic. 
                  By clicking &quot;Accept&quot;, you consent to our use of cookies.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="ghost" size="sm" onClick={handleDecline}>
                Decline
              </Button>
              <Button size="sm" onClick={handleAccept}>
                Accept
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
