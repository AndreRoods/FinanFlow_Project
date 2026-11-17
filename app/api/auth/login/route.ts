import { NextRequest, NextResponse } from "next/server"
import { createSession, database, normalizeUsername, verifyPassword } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = normalizeUsername(body.username)
    const password = typeof body.password === "string" ? body.password : ""
    if (!username || !password) return NextResponse.json({ error: "Informe seu nome de usuário e senha." }, { status: 400 })

    const { data, error } = await database().from("app_users").select("id, password_hash").eq("username", username).maybeSingle()
    if (error) {
      console.error("Falha ao consultar usuário:", error.message)
      return NextResponse.json({ error: "Não foi possível acessar o banco de dados." }, { status: 500 })
    }
    if (!data?.password_hash || !(await verifyPassword(password, data.password_hash))) {
      return NextResponse.json({ error: "Nome de usuário ou senha incorretos." }, { status: 401 })
    }

    await createSession(data.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Não foi possível entrar. Verifique as configurações do servidor." }, { status: 500 })
  }
}
