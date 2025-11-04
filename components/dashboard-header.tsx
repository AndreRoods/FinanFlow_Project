"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export function DashboardHeader({ userName }: { userName?: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Gestor Financeiro</h1>
          </div>
          <div className="flex items-center gap-4">
            {userName && <span className="text-sm text-gray-600">Olá, {userName}</span>}
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
