"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"
import { addToWishlist, removeFromWishlist } from "@/actions/whitlistactions"

interface FavsButtonProps {
    productId: string
    initialFavIds?: string[]
}

export default function FavsButton({ productId, initialFavIds = [] }: FavsButtonProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const token = (session as any)?.token
    const [favIds, setFavIds] = useState(initialFavIds)
    const [loading, setLoading] = useState(false)
    const isFav = favIds.includes(productId)

    async function wishlisttoggler() {
        if (!token) {
            router.push("/login")
            return
        }
        setLoading(true);
        try {
            if (!isFav) {
                await addToWishlist(productId);
                setFavIds([...favIds, productId]);
                toast.success("item added to favoutites")
            } else {
                await removeFromWishlist(productId);
                setFavIds(favIds.filter((id) => id !== productId));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            router.refresh();
        }
    }

    return (
        <button
            onClick={wishlisttoggler}
            disabled={loading}
            className={`rounded-lg border border-gray-200 p-2 transition-colors ${isFav ? "text-red-500 fill-red-500 bg-red-50" : "text-gray-500 hover:bg-red-50 hover:text-red-500"
                }`}
        >
            {loading ? (
                <div className="w-4 h-4 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFav ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                </svg>
            )}
        </button>
    )
}