import ProductCard from '@/components/ProductCard/page';
import { ProductsResponse } from '@/Interfaces/productsinterface';
import { Params } from 'next/dist/server/request/params'
import Link from 'next/link';
import React from 'react'


export default async function BrandDetails({ params }: { params: Params }) {
    const { brandId } = await params;
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`);
    const data: ProductsResponse = await response.json()
    if (!data.data || data.data.length === 0) {
        return <div className='mx-auto text-4xl md:text-5xl font-bold text-center text-gray-800'>No products in this brand
            <button className='rounded-lg py-2 text-sm font-bold text-white active:scale-95'>
                <h2 className='text-blue-500'>
                    <Link href="/brands">Return to brands</Link>
                </h2>
            </button>
        </div>
    }

    return (<>

        <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data.data.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>

    </>)
}