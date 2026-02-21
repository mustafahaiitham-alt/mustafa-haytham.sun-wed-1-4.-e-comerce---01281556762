import ProductCard from '@/components/ProductCard/page';
import { ProductsResponse } from '@/Interfaces/productsinterface';
import { Params } from 'next/dist/server/request/params';
import Link from 'next/link';
import React from 'react'

export default async function CategoryDetails({ params }: { params: Params }) {

  const { categoryId } = await params;
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`);
  const data: ProductsResponse = await response.json()
  
  return (
    <>
    
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>)
}