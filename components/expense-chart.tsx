"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface Category extends Record<string, string | number> {
  name: string
  value: number
  color: string
}

export function ExpenseChart({ data }: { data: Category[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Despesas</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-8">Nenhuma despesa registrada</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${String(name ?? "")} ${((typeof percent === "number" ? percent : 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
