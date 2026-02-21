import { Brand } from '@/Interfaces/productsinterface';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function Brands() {
  const respone = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
  const data = await respone.json()
  const brands = data.data;

  return (<>

    <div className='container mx-auto'>
      <div className='p-5'>
        <div className="text-center mb-14 border-b p-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Our Brands
          </h1>
          
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {brands.map((brand : Brand) => (
            <Link key={brand._id} href={"brands/" + brand._id}>
              <div
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-8 flex items-center justify-center group cursor-pointer"
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={300}
                  height={200}
                  className="h-24 object-contain grayscale group-hover:grayscale-0 transition duration-300"
                />
              </div>
            </Link>))}
        </div>
      </div>
    </div>
  </>)
}