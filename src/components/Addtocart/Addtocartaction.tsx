"use server"
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export async function addToCartAction(productId: string) {
  const session = await getServerSession(authOptions)
if(session){
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: "POST",
    body: JSON.stringify({ productId }),
    headers: {
      token: session?.token as string,
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()

  return data}else{
return null;
  }
}