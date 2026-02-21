import { Products } from '@/Interfaces/productsinterface';
import { Params } from 'next/dist/server/request/params'
import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, StarHalf, Heart } from "lucide-react"
import Slider from '@/components/Slider/Slider';
import Addtocart from '@/components/Addtocart/page';
import { formatCurrency } from '@/Helpers/CurrencyForm';


export default async function Productdetails({params}:{params:Params}) {
    const {productId}=await params;
    const response = await fetch (`https://ecommerce.routemisr.com/api/v1/products/`+productId);
    const{data:product}:{data:Products}=await response.json()


  return <>
    <h2>ProductDetails</h2>

    <Card className="grid grid-cols-1 md:grid-cols-3 items-center">
<div className=''>
<Slider images={product.images} title={product.title}/>
</div>
   

      <div className="col-span-2 space-y-4 p-4">

        <CardHeader className="mt-2">
          <CardDescription>{product.brand?.name}</CardDescription>
          <CardTitle>{product.title}</CardTitle>
          <CardAction>{product.category.name}</CardAction>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 items-center">
            <div className="flex">
              <Star className="text-amber-400 fill-amber-400" />
              <Star className="text-amber-400 fill-amber-400" />
              <Star className="text-amber-400 fill-amber-400" />
              <Star className="text-amber-400 fill-amber-400" />
              <StarHalf className="text-amber-400 fill-amber-400" />
            </div>
            <p>{product.ratingsAverage}</p>
          </div>

          <p className="mt-2 font-semibold">
            {formatCurrency(product.price)}
          </p>
        </CardContent>

      <Addtocart productId={product.id}/>

      </div>

    </Card>
  </>
  
}
