"use server"

import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export async function deleteProductAction(productId: string) {
  const session = await getServerSession(authOptions);

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      token: session?.token + ''
    }
  })

  const data = await response.json();

  return data
}

export async function clearaction() {

  const session = await getServerSession(authOptions);

  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: 'DELETE',
    headers: {
      token: session?.token + ''
    }
  })

  const data = await response.json();

  return data
}


export async function updateProductAction(productId: string,count:number) {
  const session = await getServerSession(authOptions);

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
    method: 'PUT',
    headers: {
      token: session?.token + '',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ count: count })
  })

  const data = await response.json();

  return data
}

export async function fetchCartAction() {
  const session = await getServerSession(authOptions);

  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    headers: {
      token: session?.token + ''
    },
    cache: 'no-store'
  })

  const data = await response.json();

  return data
}

export async function createSampleCartAction() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    // Fetch products to pick a sample product id
    const prodRes = await fetch("https://ecommerce.routemisr.com/api/v1/products", {
      headers: { token: session.token },
      cache: "no-store",
    });

    const prodText = await prodRes.text();
    let prodBody: any = prodText;
    try {
      prodBody = JSON.parse(prodText);
    } catch (e) {}

    const products = Array.isArray(prodBody) ? prodBody : prodBody?.data ?? prodBody?.products ?? null;

    const first = Array.isArray(products) && products.length > 0 ? products[0] : null;

    if (!first || !first._id && !first.id) {
      return { success: false, message: "No products available to create a sample cart" };
    }

    const productId = first._id ?? first.id;

    const added = await updateProductAction(productId, 1);

    return { success: true, data: added };
  } catch (error) {
    return { success: false, message: String(error) };
  }
}


