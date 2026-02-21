"use client"
import React from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { signOut } from 'next-auth/react'

export default function Logout() {
  return <>
      <DropdownMenuItem onClick={() => signOut({
                    callbackUrl: "/login"
                  })} className='cursor-pointer'>logout</DropdownMenuItem>
  </>
}
