import { Products } from '@/Interfaces/productsinterface'
import Image from 'next/image'
import Link from 'next/link'


interface ProductCardProps {
    product: Products
    favIds?: string[]
    CartIds?: string[]
}

export default function ProductCard({ product, favIds, CartIds }: ProductCardProps) {
    return (<>

        <div
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md"
        >
            <Link href={`/products/${product._id}`}>
                {/* sale icons and img */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                        src={product.imageCover}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        alt={product.title}
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
              
                </div>

                {/* name and brand */}
                <div className="flex flex-1 flex-col p-3">
                    <span className="text-[10px] font-medium text-gray-400 uppercase">{product.brand?.name}</span>

                    <h5 className="mt-1 text-sm font-semibold text-gray-800 line-clamp-1">
                        {product.title}
                    </h5>

                    {/* the cost */}
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-emerald-600">
                                EGP {product.priceAfterDiscount || product.price}
                            </span>
                            {product.priceAfterDiscount && (
                                <span className="text-xs text-gray-400 line-through">
                                    EGP {product.price}
                                </span>
                            )}
                        </div>
                        {/* rate btns */}
                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded">
                            <span className="text-xs font-bold text-yellow-700">{product.ratingsAverage}</span>
                            <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                    {/* card btns */}

                </div>
            </Link>
            <div className="mt-auto px-2 pb-2 flex items-center gap-2">
               
            </div>
        </div>



    </>)
}