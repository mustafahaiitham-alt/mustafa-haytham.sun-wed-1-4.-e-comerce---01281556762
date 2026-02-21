"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/Helpers/CurrencyForm";

interface Product {
  _id: string;
  title?: string;
  imageCover?: string;
  price?: number | string;
}

interface OrderItem {
  product?: string | Product;
  quantity?: number | string;
  count?: number | string; // 👈 دعم count
  price?: number | string;
}

interface Order {
  _id: string;
  cartItems?: OrderItem[];
  totalOrderPrice?: number | string;
  paymentMethodType?: "card" | "cash";
  isPaid?: boolean;
  isDelivered?: boolean;
  shippingAddress?: {
    details?: string;
    phone?: string;
    city?: string;
    postalCode?: string;
  };
  createdAt?: string;
}

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {

  const validOrders = initialOrders.filter(
    (order) => order && typeof order._id === "string"
  );

  const [orders] = useState<Order[]>(validOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProductName = (product?: string | Product) => {
    if (!product) return "N/A";
    if (typeof product === "string") return product;
    return product.title || product._id;
  };

  // ✅ المنطق النهائي لحساب سعر العنصر
  const getItemTotal = (item: OrderItem) => {

    const quantity = Number(item.quantity ?? item.count ?? 0);

    const price =
      item.price !== undefined
        ? Number(item.price)
        : typeof item.product === "object" &&
          item.product?.price !== undefined
        ? Number(item.product.price)
        : 0;

    if (isNaN(price) || isNaN(quantity)) return 0;

    return price * quantity;
  };

  const calculateOrderTotal = (order: Order) => {
    if (order.cartItems && order.cartItems.length > 0) {
      const itemsTotal = order.cartItems.reduce(
        (sum, item) => sum + getItemTotal(item),
        0
      );

      if (itemsTotal > 0) return itemsTotal;
    }

    return Number(order.totalOrderPrice ?? 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            Track and view your order history
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">
              You haven't placed any orders yet
            </p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order._id ? null : order._id
                    )
                  }
                  className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left flex justify-between items-center"
                >
                  <div className="flex-1 flex flex-wrap gap-6">

                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">
                        {order._id.slice(0, 12)}...
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(calculateOrderTotal(order))}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Payment</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Delivery</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.isDelivered
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "In Transit"}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-400">
                    {expandedOrderId === order._id ? "▲" : "▼"}
                  </div>
                </button>

                {expandedOrderId === order._id && (
                  <div className="border-t px-6 py-4 bg-gray-50">

                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">
                        Shipping Address
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.details || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.city || ""}{" "}
                        {order.shippingAddress?.postalCode || ""}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.phone || ""}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">
                        Order Items ({order.cartItems?.length || 0})
                      </h3>

                      <div className="space-y-3">
                        {order.cartItems?.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">
                                {getProductName(item.product)}
                              </p>

                              <p className="text-sm text-gray-600">
                                Quantity: {Number(item.quantity ?? item.count ?? 0)}
                              </p>
                            </div>

                            <p className="font-semibold">
                              {formatCurrency(getItemTotal(item))}
                            </p>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}