import React, { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background neon-dashboard">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="w-full max-w-md neon-card rounded-lg p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-6">
                  <span className="text-sm neon-subtitle">Loading form...</span>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
