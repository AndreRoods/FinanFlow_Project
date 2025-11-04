"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Check, X } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
}

interface TransactionsListProps {
  transactions: Transaction[]
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string, description: string) => {
    toast.warning("Confirmar exclusão", {
      description: `Deseja realmente excluir "${description}"?`,
      duration: 5000,
      action: {
        label: "Excluir",
        onClick: () => confirmDelete(id, description),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    })
  }

  const confirmDelete = (id: string, description: string) => {
    setDeleteId(id)
    const deleteToast = toast.loading("Excluindo transação...", {
      description: "Aguarde um momento",
    })

    startTransition(async () => {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Transação excluída", {
            description: `"${description}" foi removida com sucesso`,
            icon: <Check className="h-4 w-4" />,
            duration: 3000,
          })
          router.refresh()
        } else {
          const error = await response.json()
          console.error("Erro ao excluir transação:", error)
          toast.error("Erro ao excluir", {
            description: "Não foi possível excluir a transação. Tente novamente.",
            icon: <X className="h-4 w-4" />,
            duration: 4000,
          })
        }
      } catch (error) {
        console.error("Erro ao excluir transação:", error)
        toast.error("Erro de conexão", {
          description: "Verifique sua conexão e tente novamente.",
          icon: <X className="h-4 w-4" />,
          duration: 4000,
        })
      } finally {
        toast.dismiss(deleteToast)
        setDeleteId(null)
      }
    })
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">Nenhuma transação registrada</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: transaction.categories.color }}
                  >
                    {transaction.categories.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span
                  className={`font-semibold whitespace-nowrap ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(transaction.id, transaction.description)}
                  disabled={isPending || deleteId === transaction.id}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                  title="Excluir transação"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
