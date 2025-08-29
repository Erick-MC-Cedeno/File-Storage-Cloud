import { SignupForm } from "@/components/auth/signup-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background neon-dashboard">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="w-full max-w-md neon-card rounded-lg p-6">
            <SignupForm />
          </div>
        </div>
      </main>
    </div>
  )
}
