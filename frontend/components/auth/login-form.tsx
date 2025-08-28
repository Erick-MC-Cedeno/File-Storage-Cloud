"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { healthApi } from "@/lib/api"

export function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("[v0] Starting login process...")

      console.log("[v0] Checking server connectivity...")
      try {
        await healthApi.check()
        console.log("[v0] Server is reachable")
      } catch (healthError) {
        console.error("[v0] Server health check failed:", healthError)
        toast({
          title: "Connection Error",
          description: "Cannot connect to server. Please check if the server is running.",
          variant: "destructive",
        })
        return
      }

      await login(formData.username, formData.password)
      console.log("[v0] Login successful, checking auth state...")

      setTimeout(() => {
        console.log("[v0] Attempting redirect to:", redirectTo)
        window.location.href = redirectTo
      }, 200)

      toast({
        title: "Success",
        description: "Logged in successfully",
      })
    } catch (error) {
      console.log("[v0] Login failed:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your File Storage Cloud account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
