import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

export const revalidate = 0;

interface Order {
  _id: string;
  cartItems: any[];
  totalOrderPrice: number;
  paymentMethodType: "card" | "cash";
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  };
  createdAt: string;
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    redirect("/login");
  }

  try {
    // ✅ فك التوكن عشان نطلع الـ userId
    const tokenParts = session.token.split(".");
    const decodedPayload = JSON.parse(
      Buffer.from(tokenParts[1], "base64").toString("utf-8")
    );

    const userId = decodedPayload.id;

    if (!userId) {
      return <OrdersClient initialOrders={[]} />;
    }

    // ✅ المسار الصح
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      {
        headers: {
          token: session.token,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return <OrdersClient initialOrders={[]} />;
    }

    const data = await response.json();

    // ✅ من غير validation معقد
    const orders: Order[] = Array.isArray(data)
      ? data
      : Array.isArray(data.data)
      ? data.data
      : [];

    return <OrdersClient initialOrders={orders} />;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return <OrdersClient initialOrders={[]} />;
  }
}