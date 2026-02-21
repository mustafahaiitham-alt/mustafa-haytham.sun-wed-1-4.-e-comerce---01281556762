"use client"
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
  initialCount?: number
}

export default function CartIcon({ initialCount = 0 }: Props) {
  const [cartNum, setCartNum] = useState<number>(Number(initialCount) || 0)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail
      setCartNum(Number(detail) || 0)
    }

    window.addEventListener('cartUpdated', handler as EventListener)
    return () => window.removeEventListener('cartUpdated', handler as EventListener)
  }, [])

  return (
    <>
      <Link href={'/cart'} className="relative cursor-pointer">
        <ShoppingCartIcon />
        <span className="  absolute
        top-0 left-1/2
        translate-x-1/2 -translate-y-1/2
        flex items-center justify-center
        min-w-[18px] h-[18px]
        text-[10px] font-semibold
        bg-black text-black-foreground
        rounded-full
        ring-2 ring-white">
          {cartNum}
        </span>
      </Link>
    </>
  )
}
