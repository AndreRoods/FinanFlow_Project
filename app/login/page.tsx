"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      let errorMessage = "Erro ao fazer login"
      
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()
        const errorStr = error.toString().toLowerCase()
        
        // Erros de conexão/DNS - verifica múltiplos padrões
        if (
          errorMsg.includes("failed to fetch") || 
          errorMsg.includes("err_name_not_resolved") ||
          errorMsg.includes("network error") ||
          errorMsg.includes("network request failed") ||
          errorStr.includes("err_name_not_resolved") ||
          errorStr.includes("failed to fetch")
        ) {
          errorMessage = "❌ Erro de conexão com o Supabase. O projeto pode estar pausado ou a URL está incorreta. Verifique: 1) Se o projeto existe no dashboard do Supabase, 2) Se a URL no arquivo .env.local está correta, 3) Se o servidor foi reiniciado após atualizar o .env.local"
        } else if (errorMsg.includes("network")) {
          errorMessage = "Erro de rede. Verifique sua conexão com a internet."
        } else {
          errorMessage = error.message
        }
      } else if (typeof error === "string") {
        // Pode ser uma string com o erro
        if (error.toLowerCase().includes("failed to fetch") || error.toLowerCase().includes("err_name_not_resolved")) {
          errorMessage = "❌ Erro de conexão com o Supabase. Verifique se o projeto está ativo e a URL está correta no arquivo .env.local"
        } else {
          errorMessage = error
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para gerenciar suas finanças</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <Link href="/sign-up" className="underline underline-offset-4 text-blue-600 hover:text-blue-700">
                  Criar conta
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
