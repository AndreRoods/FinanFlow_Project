import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { FinancialSummary } from "@/components/financial-summary"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { TransactionsList } from "@/components/transactions-list"
import { ExpenseChart } from "@/components/expense-chart"
import { ExpensesByCategoryTable } from "@/components/expenses-by-category-table"

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  // Fetch transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      id,
      description,
      amount,
      type,
      date,
      category_id,
      categories(name, color)
    `,
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  // Normalize the Supabase relation (returned as an array) for the UI components.
  const normalizedTransactions = (transactions || []).map((transaction) => ({
    ...transaction,
    categories: {
      name: transaction.categories?.[0]?.name || "Sem categoria",
      color: transaction.categories?.[0]?.color || "#6b7280",
    },
  }))

  // Calculate summary
  const income = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const expense = transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // Prepare chart data
  const expensesByCategory =
    categories
      ?.filter((cat) => cat.type === "expense")
      .map((cat) => ({
        name: cat.name,
        value: transactions?.filter((t) => t.category_id === cat.id).reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        color: cat.color,
      }))
      .filter((item) => item.value > 0) || []

  return (
    <>
      <DashboardHeader userName={user.user_metadata?.display_name || user.user_metadata?.username || user.email?.split("@")[0]} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FinancialSummary income={income} expense={expense} />

          <div className="flex flex-col gap-4">
            <AddTransactionForm categories={categories || []} />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TransactionsList transactions={normalizedTransactions} />
            </div>
            <div>
              <ExpenseChart data={expensesByCategory} />
            </div>
          </div>

          <ExpensesByCategoryTable transactions={normalizedTransactions} />
        </div>
      </main>
    </>
  )
}
