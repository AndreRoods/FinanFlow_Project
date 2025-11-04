import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { type, categoryId, description, amount, date } = body

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    category_id: categoryId,
    description,
    amount: Number.parseFloat(amount),
    type,
    date: new Date(date).toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
