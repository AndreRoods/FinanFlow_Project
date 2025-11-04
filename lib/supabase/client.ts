import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias. " +
      "Crie um arquivo .env.local na raiz do projeto com essas variáveis. " +
      "Consulte: https://supabase.com/dashboard/project/_/settings/api"
    )
  }

  // Validação básica do formato da URL
  try {
    const url = new URL(supabaseUrl)
    if (!url.hostname.includes("supabase.co") && !url.hostname.includes("supabase.in")) {
      console.warn("A URL do Supabase pode estar incorreta. URLs válidas geralmente terminam com .supabase.co ou .supabase.in")
    }
  } catch (e) {
    throw new Error(
      `A URL do Supabase está em formato inválido: ${supabaseUrl}. ` +
      "Verifique se a URL no arquivo .env.local está correta. " +
      "Consulte: https://supabase.com/dashboard/project/_/settings/api"
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
