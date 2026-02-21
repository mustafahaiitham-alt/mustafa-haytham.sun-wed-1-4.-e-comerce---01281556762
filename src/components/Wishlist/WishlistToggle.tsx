"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { addToWishlist, removeFromWishlist } from "@/actions/whitlistactions"

interface WishlistToggleProps {
  productId: string
  isInitiallyFav: boolean
  isLoggedIn: boolean
}

export default function WishlistToggle({
  productId,
  isInitiallyFav,
  isLoggedIn,
}: WishlistToggleProps) {

  const router = useRouter()
  const [isFav, setIsFav] = useState(isInitiallyFav)
  const [loading, setLoading] = useState(false)

  async function wishlisttoggler() {

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      if (!isFav) {
        await addToWishlist(productId)
        setIsFav(true)
        toast.success("Added to favourites")
      } else {
        await removeFromWishlist(productId)
        setIsFav(false)
        toast.success("Removed from favourites")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <button
      onClick={wishlisttoggler}
      disabled={loading}
      className={`rounded-lg border p-2 transition ${
        isFav
          ? "text-red-500 bg-red-50"
          : "text-gray-500 hover:bg-red-50 hover:text-red-500"
      }`}
    >
      {loading ? (
        <div className="w-4 h-4 border-4 border-t-emerald-500 rounded-full animate-spin" />
      ) : (
        <svg
          fill={isFav ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      )}
    </button>
  )
}