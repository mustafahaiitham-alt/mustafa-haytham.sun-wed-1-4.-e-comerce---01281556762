import Image from "next/image"
import Link from "next/link"
import FavsButton from "@/components/Wishlist/FavsButton"
import { getWishlist } from "@/actions/whitlistactions"

export const dynamic = 'force-dynamic'

export default async function FavsPage() {

  const wishlistData = await getWishlist()

  const products = wishlistData?.data || []

  if (!products.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty 💔</h2>
        <Link
          href="/products"
          className="text-emerald-600 font-semibold underline"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-8">My Wishlist ❤️</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product._id} className="border rounded-lg p-4">

            <Link href={`/products/${product._id}`}>
              <Image
                src={product.imageCover}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-60 object-cover"
              />

              <h3 className="mt-3 font-semibold line-clamp-1">
                {product.title}
              </h3>

              <p className="text-emerald-600 font-bold mt-1">
                EGP {product.price}
              </p>
            </Link>

            {/* زر الحذف (نفس زر القلب) */}
            <div className="mt-4">
              <FavsButton
                productId={product._id}
                initialFavIds={[product._id]}
              />
            </div>

          </div>
        ))}
      </div>
    </>
  )
}