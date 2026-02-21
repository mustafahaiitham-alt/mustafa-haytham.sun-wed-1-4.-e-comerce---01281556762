"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "./LoginForm"

export function LoginFormWrapper() {
  const searchParams = useSearchParams()
  const redirectURL = searchParams.get("url")

  return <LoginForm redirectURL={redirectURL} />
}
