import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const userId = (session.user as any)?._id ?? (session.user as any)?.id ?? (session.user as any)?.email ?? null;

    const urls = {
      generic: "https://ecommerce.routemisr.com/api/v1/orders",
      userScoped: userId
        ? `https://ecommerce.routemisr.com/api/v1/orders/user/${encodeURIComponent(String(userId))}`
        : null,
    };

    const fetchOpts = { headers: { token: session.token }, cache: "no-store" } as any;

    const [genericRes, userRes] = await Promise.all([
      fetch(urls.generic, fetchOpts).then(async (r) => ({ status: r.status, body: await r.text() })),
      urls.userScoped
        ? fetch(urls.userScoped, fetchOpts).then(async (r) => ({ status: r.status, body: await r.text() }))
        : null,
    ]);

    const tryParse = (t: string) => {
      try {
        return JSON.parse(t);
      } catch (e) {
        return t;
      }
    };

    return NextResponse.json({
      userId,
      generic: { status: genericRes.status, body: tryParse(genericRes.body) },
      userScoped: userRes ? { status: userRes.status, body: tryParse(userRes.body) } : null,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
