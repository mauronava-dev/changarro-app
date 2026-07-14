import Dexie, { type EntityTable } from 'dexie'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  unit: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  productId: string
  blob: Blob
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  taxIncluded: boolean
  taxRate: number
  taxAmount: number
  total: number
  receivedAmount?: number
  changeAmount?: number
  createdAt: string
}

export interface AppSettings {
  id: string
  taxEnabled: boolean
  taxRate: number
  businessName: string
  currency: string
}

export interface CartItemRecord {
  id: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

const db = new Dexie('changarro') as Dexie & {
  products: EntityTable<Product, 'id'>
  productImages: EntityTable<ProductImage, 'productId'>
  sales: EntityTable<Sale, 'id'>
  settings: EntityTable<AppSettings, 'id'>
  cartItems: EntityTable<CartItemRecord, 'id'>
}

db.version(4).stores({
  products: 'id, name, category, isActive, createdAt',
  productImages: 'productId',
  sales: 'id, createdAt',
  settings: 'id',
  cartItems: 'id, productId',
})

export { db }
