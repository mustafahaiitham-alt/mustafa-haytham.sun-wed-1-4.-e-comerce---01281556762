import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AddressesClient from "./AddressesClient";

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

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/addresses",
      {
        headers: {
          token: session.token,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    // Handle different response structures
    let addresses: Address[] = [];
    if (Array.isArray(data)) {
      addresses = data;
    } else if (data.data && Array.isArray(data.data)) {
      addresses = data.data;
    } else if (data.data && typeof data.data === "object" && data.data._id && data.data.alias) {
      // Single address object
      addresses = [data.data];
    } else {
      addresses = [];
    }

    return <AddressesClient initialAddresses={addresses} />;
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return <AddressesClient initialAddresses={[]} />;
  }
}
