"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Não foi possível entrar.")
      router.replace("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader><CardTitle className="text-2xl">Entrar</CardTitle><CardDescription>Entre com seu nome de usuário e senha.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="grid gap-2"><Label htmlFor="username">Nome de usuário</Label><Input id="username" autoComplete="username" minLength={3} maxLength={24} required value={username} onChange={(e) => setUsername(e.target.value)} /></div>
              <div className="grid gap-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Entrando..." : "Entrar"}</Button>
              <p className="text-center text-sm">Não tem uma conta? <Link href="/sign-up" className="text-blue-600 underline underline-offset-4">Criar conta</Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
