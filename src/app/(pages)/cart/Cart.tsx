"use client"

import { clearaction, deleteProductAction, updateProductAction } from "@/actions/cartActions";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/Helpers/CurrencyForm";
import { cartRes } from "@/Interfaces/Cartinterface";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Cart({ cartdata }: { cartdata: cartRes | null }) {

  const price = 149;
  const quantity = 1;
  const subtotal = price * quantity;
  const[loadingid,setloadingid] = useState<string | null>(null)

  const [cart, setcart] = useState<cartRes | null>(cartdata || null);

  async function deleteProduct(productId: string) {
    setloadingid(productId)
    const response:cartRes = await deleteProductAction(productId);
    if(response.status === "success"){
      setcart(response)
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: response.numOfCartItems }));
    }
    setloadingid(null)
  }
    async function updateProduct(productId: string,count:number) {
    setloadingid(productId)
    const response:cartRes = await updateProductAction(productId,count);
    if(response.status === "success"){
        setcart(response)
        toast.success("updated successfully")
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: response.numOfCartItems }))
    }
    setloadingid(null)
  }

  async function clear() {
    setloadingid("clearing")
    try {
      await clearaction()
      setcart(null)
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: 0 }))
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setloadingid(null)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-6xl font-bold tracking-tight text-center">
          Shopping Cart
        </h1>

        <p className="text-muted-foreground mt-1">
          {cart?.numOfCartItems} items in your cart
        </p>

        {cart ? (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start mt-6">

              <div className="lg:col-span-2 space-y-4">
                {cart.data.products.map((item) => (
                  <div
                    key={item._id}
                    className="relative flex gap-4 rounded-xl border p-4 shadow-sm bg-card"
                  >
                    {loadingid === item.product._id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                        <Loader2 className="animate-spin" />
                      </div>
                    )}

                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-24 h-24 rounded-lg object-cover md:w-28 md:h-28"
                    />

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">
                          {item.product.title}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                          {item.product.brand.name}·{item.product.category.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center border rounded-md">
                          <button disabled={item.count <= 1} className="px-3 py-1 text-lg" onClick={()=>{updateProduct(item.product._id,item.count-1)}}>-</button>
                          <span className="px-3">{item.count}</span>
                          <button disabled={item.count == item.product.quantity} className="px-3 py-1 text-lg" onClick={()=>{updateProduct(item.product._id,item.count+1)}}>+</button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(item.price)}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          each
                        </span>
                      </div>

                      <button className="text-sm text-red-500 hover:underline" onClick={()=> {deleteProduct(item.product._id)}}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border p-6 shadow-sm bg-card space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                <div className="flex justify-between text-sm">
                  <span>Subtotal (1 items)</span>
                  <span>{formatCurrency(cart.data.totalCartPrice)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(cart.data.totalCartPrice)}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <Button variant="outline" className="w-full cursor-pointer">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  <Link href="/checkout" className="w-full">
                    <Button className="w-full mt-4 cursor-pointer">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="cursor-pointer text-sm text-white mt-4" onClick={clear} disabled={loadingid === "clearing"}>
                {loadingid === "clearing" && <Loader2 className="animate-spin mr-2" />}clear cart
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold text-center mt-1.5">
              there is no items
            </h1>
            <Link className="flex items-center gap-2 text-primary mt-4 justify-center" href="/products">
              <button className="border-4 border-blue-700 bg-blue-700 px-4 py-2 rounded-lg cursor-pointer">Go shopping</button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}