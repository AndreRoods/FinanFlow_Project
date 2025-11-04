"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  date: string
  categories: {
    name: string
    color: string
  }
  category_id?: string
}

interface CategoryExpenses {
  categoryId: string
  categoryName: string
  categoryColor: string
  total: number
  transactions: Transaction[]
}

interface ExpensesByCategoryTableProps {
  transactions: Transaction[]
}

export function ExpensesByCategoryTable({ transactions }: ExpensesByCategoryTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Filtrar apenas despesas e agrupar por categoria
  const expenses = transactions.filter((t) => t.type === "expense")

  // Agrupar por categoria
  const categoryMap = new Map<string, CategoryExpenses>()

  expenses.forEach((transaction) => {
    const categoryId = transaction.category_id || "uncategorized"
    const categoryName = transaction.categories?.name || "Sem categoria"
    const categoryColor = transaction.categories?.color || "#6b7280"

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        categoryId,
        categoryName,
        categoryColor,
        total: 0,
        transactions: [],
      })
    }

    const categoryExpenses = categoryMap.get(categoryId)!
    categoryExpenses.total += Number(transaction.amount)
    categoryExpenses.transactions.push(transaction)
  })

  // Converter para array e ordenar por total (maior para menor)
  const categoryExpenses = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total)

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-8">
          Nenhuma despesa registrada
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categoryExpenses.map((category) => {
            const isExpanded = expandedCategories.has(category.categoryId)
            const sortedTransactions = category.transactions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )

            return (
              <div
                key={category.categoryId}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleCategory(category.categoryId)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.categoryColor }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{category.categoryName}</div>
                      <div className="text-sm text-gray-500">
                        {category.transactions.length}{" "}
                        {category.transactions.length === 1 ? "gasto" : "gastos"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-red-600">R$ {category.total.toFixed(2)}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t bg-white">
                    <div className="divide-y">
                      {sortedTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <div className="font-semibold text-red-600">
                              R$ {Number(transaction.amount).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">Total de Despesas</div>
            <div className="text-xl font-bold text-red-600">
              R$ {expenses.reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
