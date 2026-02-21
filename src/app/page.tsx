import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between ">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center px-4 ">
        
      

        <h1 className="text-5xl font-bold mb-6">
          Welcome to ShopMart
        </h1>

        <p className="max-w-2xl text-muted-foreground mb-8">
          Discover the latest technology, fashion, and lifestyle products.
          Quality guaranteed with fast shipping and excellent customer service.
        </p>

        <div className="flex gap-4">
          <Link href="/products">
            <Button className="cursor-pointer px-6 py-2">
              Shop Now
            </Button>
          </Link>

          <Link href="/categories">
            <Button variant="outline" className="cursor-pointer px-6 py-2">
              Browse Categories
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}