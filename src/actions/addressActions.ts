"use server"

import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressResponse {
  status: string;
  message: string;
  data?: Address | Address[];
}

export async function getAddresses(): Promise<{ data: Address[] | null; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { data: null, error: "Not authenticated" };
    }

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

    if (response.ok && data.data) {
      return { data: data.data };
    }

    return { data: null, error: data.message || "Failed to fetch addresses" };
  } catch (error) {
    return { data: null, error: String(error) };
  }
}

export async function addAddress(addressData: {
  alias: string;
  details: string;
  phone: string;
  city: string;
  postalCode: string;
}): Promise<{ success: boolean; message: string; data?: Address }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/addresses",
      {
        method: "POST",
        headers: {
          token: session.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );

    const data: AddressResponse = await response.json();

    if (response.ok) {
      revalidatePath("/addresses");
      return {
        success: true,
        message: "Address added successfully",
        data: data.data as Address,
      };
    }

    return { success: false, message: data.message || "Failed to add address" };
  } catch (error) {
    return { success: false, message: String(error) };
  }
}

export async function updateAddress(
  addressId: string,
  addressData: {
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
  }
): Promise<{ success: boolean; message: string; data?: Address }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
      {
        method: "PUT",
        headers: {
          token: session.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      }
    );

    const data: AddressResponse = await response.json();

    if (response.ok) {
      revalidatePath("/addresses");
      return {
        success: true,
        message: "Address updated successfully",
        data: data.data as Address,
      };
    }

    return { success: false, message: data.message || "Failed to update address" };
  } catch (error) {
    return { success: false, message: String(error) };
  }
}

export async function deleteAddress(addressId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          token: session.token,
        },
      }
    );

    const data: AddressResponse = await response.json();

    if (response.ok) {
      revalidatePath("/addresses");
      return { success: true, message: "Address deleted successfully" };
    }

    return { success: false, message: data.message || "Failed to delete address" };
  } catch (error) {
    return { success: false, message: String(error) };
  }
}

export async function setDefaultAddress(addressId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
      {
        method: "PUT",
        headers: {
          token: session.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDefault: true }),
      }
    );

    const data: AddressResponse = await response.json();

    if (response.ok) {
      revalidatePath("/addresses");
      return { success: true, message: "Default address set" };
    }

    return { success: false, message: data.message || "Failed to set default address" };
  } catch (error) {
    return { success: false, message: String(error) };
  }
}
