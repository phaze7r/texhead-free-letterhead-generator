'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface StatsBannerProps {
  total: number
}

export function StatsBanner({ total }: StatsBannerProps) {
  return (
    <div className="mt-12 md:mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
        </div>
        <CardContent className="p-8 text-center relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">Our Community Impact</p>
          <div className="flex flex-col items-center justify-center">
            <span className="text-5xl md:text-6xl font-black text-foreground mb-4">
              {total.toLocaleString()}
            </span>
            <p className="text-xl text-muted-foreground font-medium max-w-md">
              Professional letterheads generated for free by businesses worldwide.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
