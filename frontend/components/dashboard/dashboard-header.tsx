"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { LogOut, User, Settings, Zap } from "lucide-react"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 neon-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <Zap className="h-6 w-6 text-cyan-400" style={{ filter: "drop-shadow(0 0 8px rgba(0,255,255,0.6))" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold neon-title">CYBER STORAGE</h1>
              <p className="text-sm text-muted-foreground neon-subtitle">// Neural Cloud Interface v2.1</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm neon-subtitle">NEURAL LINK ACTIVE</p>
              <p className="text-xs text-cyan-400/80">{user?.fullName}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full neon-avatar-btn">
                  <Avatar className="h-10 w-10 neon-avatar">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-400 font-bold">
                      {user?.fullName ? getInitials(user.fullName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 neon-card border-cyan-500/30" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none neon-title">{user?.fullName}</p>
                    <p className="text-xs leading-none neon-subtitle">@{user?.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem className="hover:bg-cyan-500/10">
                  <User className="mr-2 h-4 w-4 text-cyan-400" />
                  <span>Neural Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-purple-500/10">
                  <Settings className="mr-2 h-4 w-4 text-purple-400" />
                  <span>System Config</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4 text-red-400" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
