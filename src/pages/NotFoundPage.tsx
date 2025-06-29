// CREATED: 404 Not Found page
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Home, Search, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/explore">
                <Search className="w-4 h-4 mr-2" />
                Explore
              </Link>
            </Button>
          </div>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}