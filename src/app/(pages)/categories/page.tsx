import { Category } from '@/Interfaces/productsinterface';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function Categories() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/categories");
  const data = await response.json();
  const categories = data.data;
  return (<>


    <div className='container mx-auto'>
      <div className='p-5'>
        <div className="text-center mb-14 border-b p-3">
          <h1 className="text-4xl text-gray-800">
          Categories
          </h1>
         
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {categories.map((category : Category) => (
            <Link key={category._id} href={`/categories/${category._id}`}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-8 flex flex-col items-center justify-center group cursor-pointer">
                <Image
                  width={300}
                  height={200}
                  src={category.image}
                  alt={category.name}
                  className="h-24 object-contain transition duration-300"
                />
                <h2 className='text-gray-500 mt-4 text-sm'>{category.name}</h2>
              </div>
            </Link>))}
        </div>
      </div>
    </div>




  </>)
}