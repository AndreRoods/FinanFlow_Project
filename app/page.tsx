import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  if (await getCurrentUser()) redirect("/dashboard")
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">Gestor Financeiro</h1>
        <p className="mb-8 text-xl text-gray-700">Controle suas finanças com facilidade. Registre despesas, gerencie receitas e acompanhe seu saldo.</p>
        <div className="flex justify-center gap-4"><Link href="/login"><Button size="lg">Entrar</Button></Link><Link href="/sign-up"><Button size="lg" variant="outline">Criar conta</Button></Link></div>
      </div>
    </div>
  )
}
