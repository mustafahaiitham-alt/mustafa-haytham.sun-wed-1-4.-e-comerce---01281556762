"use server"

import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function getWishlist() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.token) return null

    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/wishlist",
      {
        headers: { token: session.token },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch wishlist")
    }

    return await response.json()
  } catch (err: any) {
    console.log("Wishlist error:", err)
    return null
  }
}

export async function addToWishlist(productId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.token) throw new Error("Unauthorized")

  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/wishlist",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: session.token,
      },
      body: JSON.stringify({ productId }),
    }
  )

  revalidatePath("/")
  return await response.json()
}

export async function removeFromWishlist(productId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.token) throw new Error("Unauthorized")

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {
      method: "DELETE",
      headers: {
        token: session.token,
      },
    }
  )

  revalidatePath("/")
  return await response.json()
}