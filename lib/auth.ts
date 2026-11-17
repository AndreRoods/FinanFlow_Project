import "server-only"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)
const COOKIE_NAME = "finanflow_session"
const SESSION_SECONDS = 60 * 60 * 24 * 30

export type AppUser = { id: string; username: string }

export function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente do servidor.")
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET precisa ter pelo menos 32 caracteres.")
  return secret
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derived = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const derived = (await scrypt(password, salt, 64)) as Buffer
  const expected = Buffer.from(hash, "hex")
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex")
}

export async function createSession(userId: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS
  const payload = `${userId}.${expires}`
  const token = `${payload}.${sign(payload)}`
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  const [userId, expiresText, signature] = token.split(".")
  if (!userId || !expiresText || !signature) return null
  const payload = `${userId}.${expiresText}`
  const expected = Buffer.from(sign(payload), "hex")
  const received = Buffer.from(signature, "hex")
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
  if (!/^\d+$/.test(expiresText) || Number(expiresText) < Math.floor(Date.now() / 1000)) return null

  const { data, error } = await database().from("app_users").select("id, username").eq("id", userId).maybeSingle()
  if (error || !data) return null
  return data as AppUser
}

export function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}
