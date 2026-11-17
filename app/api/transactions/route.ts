import { NextRequest, NextResponse } from "next/server"
import { database, getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 })
  try {
    const body = await request.json()
    const type = body.type
    const categoryId = body.categoryId
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const amount = Number(body.amount)
    const date = new Date(body.date)
    if (!["income", "expense"].includes(type) || !categoryId || !description || description.length > 160 || !Number.isFinite(amount) || amount <= 0 || Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Confira os dados da transação." }, { status: 400 })
    }
    const supabase = database()
    const { data: category } = await supabase.from("categories").select("id").eq("id", categoryId).eq("user_id", user.id).eq("type", type).maybeSingle()
    if (!category) return NextResponse.json({ error: "Categoria inválida." }, { status: 400 })
    const { error } = await supabase.from("transactions").insert({ user_id: user.id, category_id: categoryId, description, amount, type, date: date.toISOString() })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar transação:", error)
    return NextResponse.json({ error: "Não foi possível salvar a transação." }, { status: 500 })
  }
}
