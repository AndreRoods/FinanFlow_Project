import { NextResponse } from "next/server"
import { database, getCurrentUser } from "@/lib/auth"

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  const { id } = await params
  const { error } = await database().from("transactions").delete().eq("id", id).eq("user_id", user.id)
  if (error) {
    console.error("Erro ao excluir transação:", error.message)
    return NextResponse.json({ error: "Não foi possível excluir a transação." }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
