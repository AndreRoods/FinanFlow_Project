import { NextRequest, NextResponse } from "next/server"
import { createSession, database, hashPassword, normalizeUsername } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = normalizeUsername(body.username)
    const password = typeof body.password === "string" ? body.password : ""

    if (!/^[a-z0-9._-]{3,24}$/.test(username)) {
      return NextResponse.json({ error: "Use um nome de usuário de 3 a 24 caracteres (letras, números, ponto, hífen ou underline)." }, { status: 400 })
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "A senha precisa ter entre 8 e 128 caracteres." }, { status: 400 })
    }

    const supabase = database()
    const password_hash = await hashPassword(password)
    const { data, error } = await supabase.from("app_users").insert({ username, password_hash }).select("id").single()

    if (error?.code === "23505") return NextResponse.json({ error: "Esse nome de usuário já está em uso." }, { status: 409 })
    if (error || !data) {
      console.error("Falha ao criar usuário:", error?.message)
      return NextResponse.json({ error: "Não foi possível criar a conta. Verifique a configuração do banco de dados." }, { status: 500 })
    }

    await createSession(data.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro no cadastro:", error)
    return NextResponse.json({ error: "O cadastro não pôde ser concluído. Verifique as configurações do servidor." }, { status: 500 })
  }
}
