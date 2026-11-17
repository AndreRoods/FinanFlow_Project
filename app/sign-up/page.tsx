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

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,24}$/
const usernameToEmail = (username: string) => `${username.trim().toLowerCase()}@users.finanflow.invalid`

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const normalizedUsername = username.trim().toLowerCase()
    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setError("Use de 3 a 24 caracteres: letras, números, ponto, hífen ou underline.")
      return
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.")
      return
    }
    if (password !== repeatPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: usernameToEmail(normalizedUsername),
        password,
        options: {
          data: {
            username: normalizedUsername,
            display_name: normalizedUsername,
          },
        },
      })
      if (error) throw error

      if (!data.session) {
        setError("O cadastro foi criado, mas a confirmação de e-mail ainda está ativa no Supabase. Desative 'Confirm email' nas configurações de autenticação para permitir entrar sem e-mail.")
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Não foi possível criar a conta."
      setError(message.toLowerCase().includes("already registered") || message.toLowerCase().includes("already been registered")
        ? "Esse nome de usuário já está em uso. Escolha outro."
        : message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>Entre apenas com um nome de usuário e uma senha.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    autoComplete="username"
                    placeholder="Ex.: andre_roods"
                    minLength={3}
                    maxLength={24}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">3 a 24 caracteres; letras, números, ponto, hífen ou underline.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Confirmar senha</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline underline-offset-4 text-blue-600 hover:text-blue-700">
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
