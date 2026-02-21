"use server"

import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderItem[];
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
  updatedAt: string;
}

interface OrderResponse {
  status: string;
  message: string;
  data?: Order | Order[];
}

function translateApiMessage(msg?: any) {
  if (!msg) return "حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى لاحقًا.";
  const text = String(msg);
  // Backend message pattern: "There is no cart for this id :<id>"
  if (text.includes("There is no cart for this id")) {
    return "لا توجد سلة مشتريات مرتبطة بحسابك. تأكد من إضافة منتجات إلى السلة ثم أعد المحاولة.";
  }
  // Generic fallback
  return text;
}

export async function getOrders(): Promise<{ data: Order[] | null; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { data: null, error: "Not authenticated" };
    }

    // Try to extract a user identifier from the session (many shapes supported)
    const sessionUser: any = session.user as any;
    const userId = sessionUser?._id ?? sessionUser?.id ?? sessionUser?.email ?? null;

    // Prefer user-scoped endpoint if possible
    const url = userId
      ? `https://ecommerce.routemisr.com/api/v1/orders/user/${encodeURIComponent(String(userId))}`
      : `https://ecommerce.routemisr.com/api/v1/orders`;

    const response = await fetch(url, {
      headers: {
        token: session.token,
      },
      cache: "no-store",
    });

    const raw = await response.text();
    let data: any = raw;
    try {
      data = JSON.parse(raw);
    } catch (e) {}

    // Accept either { data: [...] } or direct array at root
    const orders = data?.data ?? (Array.isArray(data) ? data : null);

    if (response.ok && orders) {
      return { data: orders };
    }

    return { data: null, error: data?.message || "Failed to fetch orders" };
  } catch (error) {
    return { data: null, error: String(error) };
  }
}

export async function getOrder(orderId: string): Promise<{
  data: Order | null;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { data: null, error: "Not authenticated" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/${orderId}`,
      {
        headers: {
          token: session.token,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (response.ok && data.data) {
      return { data: data.data };
    }

    return { data: null, error: data.message || "Failed to fetch order" };
  } catch (error) {
    return { data: null, error: String(error) };
  }
}

export async function createOnlineOrder(address: any): Promise<{
  success: boolean;
  message: string;
  data?: { session: { url: string } };
  error?: string;
  debug?: any;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { success: false, message: "Not authenticated" };
    }

    // First fetch cart to obtain cartId
    const cartRes = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: { token: session.token },
      cache: "no-store",
    });

    const cartText = await cartRes.text();
    let cartBody: any = cartText;
    try {
      cartBody = JSON.parse(cartText);
    } catch (e) {}

    const cartData = cartBody?.data ?? cartBody;
    const cartId = cartData?._id ?? cartData?.id ?? null;

    if (!cartId) {
      return {
        success: false,
        message: translateApiMessage(cartBody?.message) || "لا توجد سلة مشتريات مرتبطة بالحساب",
        error: cartBody?.message ?? String(cartBody ?? cartText),
        debug: { cartResponse: cartBody ?? cartText },
      };
    }

    const callbackUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/orders`;

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(callbackUrl)}`,
      {
        method: "POST",
        headers: {
          token: session.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingAddress: address }),
      }
    );

    const rawText = await response.text();
    let parsed: any = rawText;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {}

    const debugEnabled = process.env.NODE_ENV !== "production" || process.env.DEBUG_CART === "1";

    if (debugEnabled) {
      try {
        const masked = session?.token ? String(session.token).slice(-6) : "(no-token)";
        console.log("[createOnlineOrder] tokenSuffix:", masked, "status:", response.status);
        console.log("[createOnlineOrder] rawResponse:", parsed);
      } catch (e) {
        // ignore logging errors
      }
    }

    // The API sometimes returns the session either under `data.session` or at root `session`.
    const sessionObj = parsed?.data?.session ?? parsed?.session ?? null;

    if (sessionObj && sessionObj.url) {
      revalidatePath("/orders");
      return {
        success: true,
        message: "Checkout session created",
        data: { session: sessionObj },
      };
    }

    const returnedMessage = parsed?.message ?? parsed?.error ?? null;

    return {
      success: false,
      message: translateApiMessage(returnedMessage) || "فشل إنشاء جلسة الدفع",
      error: returnedMessage ?? String(parsed ?? rawText),
      debug: debugEnabled ? { status: response.status, body: parsed ?? rawText } : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: translateApiMessage(String(error)),
      error: String(error),
      debug: process.env.NODE_ENV !== "production" || process.env.DEBUG_CART === "1" ? { error: String(error) } : undefined,
    };
  }
}

export async function createCashOrder(address: any): Promise<{
  success: boolean;
  message: string;
  data?: Order;
  error?: string;
  debug?: any;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { success: false, message: "Not authenticated" };
    }

    // Fetch current cart to obtain cartId (API requires cart id in URL)
    const cartRes = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: { token: session.token },
      cache: "no-store",
    });

    const cartText = await cartRes.text();
    let cartBody: any = cartText;
    try {
      cartBody = JSON.parse(cartText);
    } catch (e) {}

    const cartData = cartBody?.data ?? cartBody;
    const cartId = cartData?._id ?? cartData?.id ?? null;

    if (!cartId) {
      return {
        success: false,
        message: translateApiMessage(cartBody?.message) || "لا توجد سلة مشتريات مرتبطة بالحساب",
        error: cartBody?.message ?? String(cartBody ?? cartText),
      };
    }

    // Build shipping payload from provided address object
    const payload = {
      shippingAddress: address,
    };

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      {
        method: "POST",
        headers: {
          token: session.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const dataText = await response.text();
    let data: any = dataText;
    try {
      data = JSON.parse(dataText);
    } catch (e) {}

    // The API may return the created order under different shapes:
    // - { data: { ...order } }
    // - { order: { ... } }
    // - { ...order } (order at root)
    const orderObj = data?.data ?? data?.order ?? (data && data._id ? data : null);

    if (response.ok && orderObj) {
      revalidatePath("/orders");
      revalidatePath("/cart");
      return {
        success: true,
        message: "Order created successfully",
        data: orderObj as Order,
      };
    }

    return {
      success: false,
      message: translateApiMessage(data?.message) || "فشل إنشاء الطلب",
      error: data?.message ?? String(data ?? dataText),
      debug: { status: response.status, body: data ?? dataText },
    };
  } catch (error) {
    return {
      success: false,
      message: translateApiMessage(String(error)),
      error: String(error),
    };
  }
}
