"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function DashboardHeader({ userName }: { userName?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.replace("/login")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestor Financeiro</h1>
        <div className="flex items-center gap-4">
          {userName && <span className="text-sm text-gray-600">Olá, {userName}</span>}
          <Button onClick={handleLogout} disabled={isLoading} variant="outline" size="sm" className="gap-2 bg-transparent"><LogOut size={16} />{isLoading ? "Saindo..." : "Sair"}</Button>
        </div>
      </div>
    </header>
  )
}
