import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      headers: { token: session.token },
      cache: "no-store",
    });

    const rawText = await response.text();
    let body: any = rawText;
    try {
      body = JSON.parse(rawText);
    } catch (e) {
      // keep raw text
    }

    return NextResponse.json(
      { status: response.status, body },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
