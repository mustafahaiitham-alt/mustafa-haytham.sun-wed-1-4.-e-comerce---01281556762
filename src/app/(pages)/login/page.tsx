import { LoginFormWrapper } from '@/components/LoginForm/LoginFormWrapper'
import React, { Suspense } from 'react'

export default function Login() {
  return <>
  <div className="container mx-auto flex flex-col justify-center items-center gap-3">
    <Suspense fallback={<div>Loading...</div>}>
      <LoginFormWrapper/>
    </Suspense>
  </div>
  </>
}