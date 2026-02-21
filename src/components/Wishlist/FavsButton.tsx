import { getServerSession } from "next-auth"
import WishlistToggle from "@/components/Wishlist/WishlistToggle"
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route"

interface FavsButtonProps {
  productId: string
  initialFavIds?: string[]
}

export default async function FavsButton({
  productId,
  initialFavIds = [],
}: FavsButtonProps) {

  const session = await getServerSession(authOptions)

  const isInitiallyFav = initialFavIds.includes(productId)

  return (
    <WishlistToggle
      productId={productId}
      isInitiallyFav={isInitiallyFav}
      isLoggedIn={!!session}
    />
  )
}