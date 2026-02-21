"use client"

import { useState } from "react"
import { Heart, Loader2, ShoppingCart } from "lucide-react"

import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { addToCartAction } from "./Addtocartaction"
import { useRouter } from "next/navigation"

export default function AddToCart({ productId }: { productId: string }) {
  const [isLoading, setLoading] = useState(false)
  const router =useRouter()

  async function addToCart(productId: string) {
    try {
      setLoading(true)
      const res = await addToCartAction(productId)
         if (!res) {
      router.push("/login")
      return   
    }
      toast.success(res.message + "")
      // if API returns the cart count, dispatch it so CartIcon updates
      const count = (res as any)?.numOfCartItems ?? (res as any)?.numOfCartItemsLocal ?? null
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: Number(count) || 1 }))
    } catch (err) {
      console.log("🚀 ~ addToCart ~ err:", err)
    }
    setLoading(false)
  }
  return (
    <CardFooter className="gap-2">
      <Button
        disabled={isLoading}
        onClick={() => addToCart(productId)}
        className="grow gap-2"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ShoppingCart />
        )}
        Add To Cart
      </Button>
    </CardFooter>
  )
}
