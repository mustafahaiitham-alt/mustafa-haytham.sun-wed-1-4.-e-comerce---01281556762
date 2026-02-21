import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { cartRes, Data } from "@/Interfaces/Cartinterface";
import CheckoutClient from "./CheckoutClient";

export const revalidate = 0;

interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressesResponse {
  status: string;
  data: Address[];
}

interface CartResponse {
  status: string;
  data: Data;
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    redirect("/login");
  }

  let cartData: CartResponse | null = null;
  let addresses: Address[] = [];

  try {
    // Fetch cart
    const cartResponse = await fetch(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        headers: {
          token: session.token,
        },
        cache: "no-store",
      }
    );

    cartData = await cartResponse.json();

    // Fetch addresses
    const addressResponse = await fetch(
      "https://ecommerce.routemisr.com/api/v1/addresses",
      {
        headers: {
          token: session.token,
        },
        cache: "no-store",
      }
    );

    const addressDataRaw = await addressResponse.json();

    // Handle different response structures for addresses
    if (Array.isArray(addressDataRaw)) {
      addresses = addressDataRaw;
    } else if (addressDataRaw.data && Array.isArray(addressDataRaw.data)) {
      addresses = addressDataRaw.data;
    } else if (addressDataRaw.data && typeof addressDataRaw.data === "object" && addressDataRaw.data._id && addressDataRaw.data.alias) {
      addresses = [addressDataRaw.data];
    }
  } catch (error) {
    console.error("Checkout error:", error);
    redirect("/cart");
  }

  if (!cartData || !cartData.data || !cartData.data.products || cartData.data.products.length === 0) {
    redirect("/cart");
  }

  return (
    <CheckoutClient
      cartData={cartData.data}
      addresses={addresses}
    />
  );
}
