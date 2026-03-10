'use client'
 
import { useEffect } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedWrapper } from '@/components/ui/animated-wrapper'
import Link from 'next/link'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <AnimatedWrapper direction="up">
        <Card className="glass-panel max-w-md border-border/50 text-center shadow-burgundy-glow/10">
          <CardHeader className="flex flex-col items-center gap-2 pt-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-sm">
              <AlertCircle className="h-8 w-8" />
            </div>
            <CardTitle className="heading-2 mt-4 text-burgundy-gradient">Something went wrong</CardTitle>
            <p className="text-sm text-muted-foreground">
              We encountered an unexpected error while loading this page.
            </p>
          </CardHeader>
          <CardContent className="pb-8 pt-2">
            <div className="rounded-lg bg-muted/30 p-3 text-[10px] font-mono text-muted-foreground/70 break-all select-all">
              ID: {error.digest || "An internal error occurred"}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center pb-8 px-8">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 shadow-burgundy-glow gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto glass-card gap-2"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </AnimatedWrapper>
    </div>
  )
}
