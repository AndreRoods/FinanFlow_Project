"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react"

interface FinancialSummaryProps {
  income: number
  expense: number
}

export function FinancialSummary({ income, expense }: FinancialSummaryProps) {
  const balance = income - expense

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
            <ArrowUpRight className="text-green-600" size={16} />
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700">R$ {income.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-2">
            <ArrowDownLeft className="text-red-600" size={16} />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-700">R$ {expense.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={16} />
            Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${balance >= 0 ? "text-blue-700" : "text-red-600"}`}>
            R$ {balance.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
