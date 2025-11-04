import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Gestor Financeiro</h1>
        <p className="text-xl text-gray-700 mb-8">
          Controle suas finanças com facilidade. Rastreie despesas, gerenciie receitas e visualize sua saúde financeira
          em tempo real.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" variant="default">
              Entrar
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
