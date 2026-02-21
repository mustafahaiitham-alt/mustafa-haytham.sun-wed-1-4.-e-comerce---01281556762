export interface cartRes {
  status: string
  numOfCartItems: number
  message:string
  cartId: string
  data: Data
}

export interface Data {
  _id: string
  cartOwner: string
  products: Cartitem[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
}

export interface Cartitem {
  count: number
  _id: string
  product: Product
  price: number
}

export interface Product {
  subcategory: Subcategory[]
  _id: string
  title: string
  quantity: number
  imageCover: string
  category: Category
  brand: Brand
  ratingsAverage: number
  id: string
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  category: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}
