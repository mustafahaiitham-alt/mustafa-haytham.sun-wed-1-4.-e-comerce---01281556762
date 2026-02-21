import { ProductsResponse } from "@/Interfaces/productsinterface"
import Image from "next/image"
import Link from "next/link"
import FavsButton from "@/components/Wishlist/FavsButton"
import Addtocart from "@/components/Addtocart/page"
import { getWishlist } from "@/actions/whitlistactions"

export default async function Products() {

  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/products",
    { cache: "no-store" }
  )

  const data: ProductsResponse = await response.json()

  const wishlistData = await getWishlist()

  const wishlistIds =
    wishlistData?.data?.map((item: any) => item._id) || []

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((product) => (
          <div key={product._id} className="border rounded-lg p-4">

            <Link href={`/products/${product._id}`}>
              <Image
                src={product.imageCover}
                alt={product.title}
                width={300}
                height={300}
                className="w-full h-60 object-cover"
              />

              <h3 className="mt-2 font-semibold line-clamp-1">
                {product.title}
              </h3>

              <p className="text-emerald-600 font-bold">
                EGP {product.price}
              </p>
            </Link>

            <div className="flex items-center  mt-4">
              <Addtocart productId={product._id} />
              <FavsButton
                productId={product._id}
                initialFavIds={wishlistIds}
              />
            </div>

          </div>
        ))}
      </div>
    </>
  )
}