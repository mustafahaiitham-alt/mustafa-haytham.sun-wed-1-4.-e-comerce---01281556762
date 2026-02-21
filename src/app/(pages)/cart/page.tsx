import { getServerSession } from 'next-auth'

import React from 'react'

import { authOptions } from '../api/auth/[...nextauth]/route'

import { cartRes } from '@/Interfaces/Cartinterface'

import Cart from './Cart'



export default async function Cartpage() {

  const session =await getServerSession(authOptions)

  const response =await fetch("https://ecommerce.routemisr.com/api/v1/cart",{

    headers:{

        token:session?.token as string

    }

  })

  const data:cartRes = await response.json()
  return <Cart cartdata={data.numOfCartItems === 0 ? null : data} />
}