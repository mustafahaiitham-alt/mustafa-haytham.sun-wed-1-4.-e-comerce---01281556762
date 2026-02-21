"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/Helpers/CurrencyForm";
import { createOnlineOrder, createCashOrder } from "@/actions/orderActions";
import toast from "react-hot-toast";
import { fetchCartAction, createSampleCartAction } from "@/actions/cartActions";
import { Data } from "@/Interfaces/Cartinterface";

interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface CheckoutClientProps {
  cartData: Data;
  addresses: Address[];
}

export default function CheckoutClient({
  cartData,
  addresses,
}: CheckoutClientProps) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?._id || addresses[0]?._id || ""
  );
  const [paymentMethod, setPaymentMethod] =
    useState<"online" | "cash">("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [cart, setCart] = useState<Data>(cartData);

  const hasCart = Array.isArray(cart.products) && cart.products.length > 0;

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
      if (!selectedAddress) {
        setError("Please select a valid delivery address");
      } else if (paymentMethod === "online") {
        const result = await createOnlineOrder(selectedAddress);
        if (result.success && result.data?.session?.url) {
          window.location.href = result.data.session.url;
        } else {
          setDebugInfo(result.debug ?? null);
          setError(result.message || "Failed to create checkout session");
          console.log("createOnlineOrder failed:", result);
        }
      } else {
        const result = await createCashOrder(selectedAddress);
        if (result.success) {
          toast.success("Order created successfully");
          router.push("/orders");
        } else {
          setError(result.message || "Failed to create order");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetchCartAction();
      const newCart = res?.data ?? res;

      if (!newCart || !Array.isArray(newCart.products) || newCart.products.length === 0) {
        setCart({ ...(newCart || {}), products: [] } as Data);
        setError("لا توجد منتجات في السلة لهذا الحساب — أعد المحاولة أو اضغط تحديث.");
      } else {
        setCart(newCart);
      }
    } catch (err) {
      setError("فشل تحديث السلة. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleCart = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await createSampleCartAction();
      if (res?.success) {
        await refreshCart();
      } else {
        setError(res?.message || "Failed to create sample cart");
      }
    } catch (err) {
      setError("فشل إنشاء سلة تجريبية. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-6">
                {cart.products.map((item: any) => (
                  <div
                    key={item.product._id}
                    className="flex items-start gap-4 border-b pb-6 last:border-none"
                  >
                    {/* Fixed Image Size */}
                    <div className="w-24 h-24 min-w-[96px] relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product.imageCover || "/placeholder.png"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                          {item.product.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          Quantity: {item.count}
                        </p>
                      </div>

                      <p className="font-bold text-gray-900 mt-3">
                        {formatCurrency(item.price * item.count)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">
                Delivery Address
              </h2>

              {addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    You don’t have any saved addresses yet.
                  </p>
                  <Link href="/addresses">
                    <Button>Add Address</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={(e) =>
                          setSelectedAddressId(e.target.value)
                        }
                        className="hidden"
                      />

                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {address.alias}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.details}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.phone}
                          </p>
                        </div>

                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full h-fit">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                {["cash", "online"].map((method) => (
                  <label
                    key={method}
                    className={`block p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === method
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value as "cash" | "online"
                        )
                      }
                      className="hidden"
                    />

                    <p className="font-semibold text-gray-900 capitalize">
                      {method === "cash"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Total</h2>

              <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(cart.totalCartPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
              </div>

                <div className="flex justify-between text-lg font-bold mt-4 mb-6">
                <span>Total</span>
                <span>
                  {formatCurrency(cart.totalCartPrice)}
                </span>
              </div>

              {error && (
                <div className="text-sm bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                  {error}
                  {debugInfo ? (
                    <pre className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">{JSON.stringify(debugInfo, null, 2)}</pre>
                  ) : null}
                </div>
              )}

              {!hasCart ? (
                <div className="text-center text-sm text-gray-700 p-4 mb-4 bg-yellow-50 rounded">
                  <p>لا توجد منتجات في السلة لهذا الحساب — أضف منتجات ثم حاول مرة أخرى.</p>
                  <div className="mt-3 flex flex-col gap-2">
                    <Button onClick={refreshCart} variant="outline">
                      {isLoading ? "Refreshing..." : "تحديث السلة"}
                    </Button>
                    <Button onClick={createSampleCart} className="bg-blue-600 hover:bg-blue-700">
                      {isLoading ? "Processing..." : "إنشاء سلة تجريبية"}
                    </Button>
                  </div>
                </div>
              ) : null}

              <Button
                onClick={handleCheckout}
                disabled={isLoading || !selectedAddressId || !hasCart}
                className="w-full h-12 text-base cursor-pointer"
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>

              <Link href="/cart">
                <Button variant="outline" className="w-full mt-3 cursor-pointer">
                  Back to Cart
                </Button>
              </Link>

              <Button onClick={refreshCart} variant="ghost" className="w-full mt-3">
                {isLoading ? "Refreshing..." : "Refresh Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}