# Script para corrigir a URL do Supabase
# A URL deve terminar com .supabase.co (nÃ£o .supabase.com)

$content = Get-Content .env.local -Raw
$content = $content -replace '\.supabase\.com', '.supabase.co'
Set-Content -Path .env.local -Value $content -NoNew
line

Write-Host "URL corrigida de .supabase.com para .supabase.co"
Write-Host "IMPORTANTE: Verifique se o projeto existe e atualize as credenciais se necessÃ¡rio"
