import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Cloud, Lock, Zap } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background neon-dashboard">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold neon-title">
              Secure Cloud Storage
              <span className="text-neon-light-blue"> Made Simple</span>
            </h1>
            <p className="text-xl neon-subtitle max-w-2xl mx-auto">
              Store, organize, and manage all your files in the cloud with enterprise-grade security and privacy
              protection. Access your files anywhere, anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Today
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="text-center neon-card">
            <CardHeader>
              <Shield className="h-12 w-12 text-neon-blue mx-auto mb-4" />
              <CardTitle>Secure Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enterprise-grade encryption ensures your files are always protected and secure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center neon-card">
            <CardHeader>
              <Cloud className="h-12 w-12 text-neon-light-blue mx-auto mb-4" />
              <CardTitle>Cloud Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access your files from anywhere in the world with our reliable cloud infrastructure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center neon-card">
            <CardHeader>
              <Lock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your data privacy is our priority. We never access or share your personal files.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center neon-card">
            <CardHeader>
              <Zap className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Fast Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lightning-fast upload speeds and instant file synchronization across all devices.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 space-y-6">
          <h2 className="text-3xl font-bold neon-title">Ready to get started?</h2>
          <p className="text-lg neon-subtitle">
            Join thousands of users who trust File Storage Cloud with their important files.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t bg-background/60 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 File Storage Cloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
