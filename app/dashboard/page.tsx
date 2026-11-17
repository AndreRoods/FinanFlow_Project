import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FinancialSummary } from "@/components/financial-summary"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { TransactionsList } from "@/components/transactions-list"
import { ExpenseChart } from "@/components/expense-chart"
import { ExpensesByCategoryTable } from "@/components/expenses-by-category-table"
import { database, getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  const supabase = database()
  const [{ data: categories, error: categoriesError }, { data: transactions, error: transactionsError }] = await Promise.all([
    supabase.from("categories").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
    supabase.from("transactions").select("id, description, amount, type, date, category_id, categories(name, color)").eq("user_id", user.id).order("date", { ascending: false }),
  ])
  if (categoriesError || transactionsError) {
    console.error("Erro ao carregar painel:", categoriesError?.message, transactionsError?.message)
    throw new Error("Não foi possível carregar seus dados financeiros. Confira a migração do banco.")
  }
  const normalizedTransactions = (transactions || []).map((transaction: any) => ({
    ...transaction,
    categories: {
      name: Array.isArray(transaction.categories) ? transaction.categories[0]?.name || "Sem categoria" : transaction.categories?.name || "Sem categoria",
      color: Array.isArray(transaction.categories) ? transaction.categories[0]?.color || "#6b7280" : transaction.categories?.color || "#6b7280",
    },
  }))
  const income = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const expense = transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const expensesByCategory = (categories || []).filter((cat) => cat.type === "expense").map((cat) => ({
    name: cat.name,
    value: transactions?.filter((t) => t.category_id === cat.id && t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0,
    color: cat.color,
  })).filter((item) => item.value > 0)
  return (
    <>
      <DashboardHeader userName={user.username} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <FinancialSummary income={income} expense={expense} />
          <div className="flex flex-col gap-4"><AddTransactionForm categories={categories || []} /></div>
          <div className="grid gap-8 lg:grid-cols-3"><div className="lg:col-span-2"><TransactionsList transactions={normalizedTransactions} /></div><div><ExpenseChart data={expensesByCategory} /></div></div>
          <ExpensesByCategoryTable transactions={normalizedTransactions} />
        </div>
      </main>
    </>
  )
}
