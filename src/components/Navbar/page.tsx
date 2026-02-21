import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { Heart, ShoppingCartIcon, UserIcon } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getServerSession } from "next-auth"
import Logout from "../Logout/page"
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route"
import CartIcon from "../CartIcon/CartIcon"
import { fetchCartAction } from "@/actions/cartActions"

export default async function Navbar() {
  const session=await getServerSession(authOptions)
  let initialCount = 0
  if (session) {
    try {
      const cart = await fetchCartAction()
      initialCount = Number(cart?.numOfCartItems ?? 0)
    } catch (err) {
      // ignore — CartIcon will update from events
    }
  }
  return <>
  <nav className="bg-gray-100 shadow py-4">
  <div className="container mx-auto flex flex-col items-start gap-0 sm:flex-row sm:items-center justify-between">

    <h2>
      <Link href={'/'}>ShopMart</Link>
    </h2>

   <div className="">
      <NavigationMenu>
        <NavigationMenuList>

          <NavigationMenuItem>
            <NavigationMenuLink asChild className="">
              <Link href="/products">Products</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
     
     <NavigationMenuItem>
            <NavigationMenuLink asChild className="">
              <Link href="/brands">Brands</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

               <NavigationMenuItem>
            <NavigationMenuLink asChild className="">
              <Link href="/categories">Categories</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>


    <div className="">
      <NavigationMenu>
        <NavigationMenuList>
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <UserIcon/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>

    <DropdownMenuLabel>My Account</DropdownMenuLabel>
{session?<><Link href={'/profile'}>
      <DropdownMenuItem>Profile</DropdownMenuItem>
    </Link>

    <Link href={'/orders'}>
      <DropdownMenuItem>My Orders</DropdownMenuItem>
    </Link>

    <Link href={'/addresses'}>
      <DropdownMenuItem>My Addresses</DropdownMenuItem>
    </Link>
   
    <DropdownMenuSeparator />
  <Logout/>
    </>:<>
    <Link href={'/login'}>
      <DropdownMenuItem>Login</DropdownMenuItem>
    </Link>

    <Link href={'/register'}>
      <DropdownMenuItem>Register</DropdownMenuItem>
    </Link>
     
    </>
}

    
    </DropdownMenuGroup>
   
  </DropdownMenuContent>
</DropdownMenu>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className="relative">
              {session ? <CartIcon initialCount={initialCount} /> : null}
            </NavigationMenuLink>
          </NavigationMenuItem>

 <NavigationMenuItem>
            <NavigationMenuLink asChild className="">
              {session ? <Link href="/Favs"> <Heart className='text-inherit size-5'/></Link> : null}
            </NavigationMenuLink>
            
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </div>

 

  </div>
</nav>
  
  </>

}
