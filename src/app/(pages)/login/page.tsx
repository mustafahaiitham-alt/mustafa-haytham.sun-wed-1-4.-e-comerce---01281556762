import { LoginForm } from '@/components/LoginForm/LoginForm'
import React from 'react'

export default function Login() {
  return <>
  <div className="container mx-auto flex flex-col justify-center items-center gap-3">
    <LoginForm/>
  </div>
  </>
}