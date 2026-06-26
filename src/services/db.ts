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
  createdAt: string
}

export interface AppSettings {
  id: string
  taxEnabled: boolean
  taxRate: number
  businessName: string
  currency: string
}

const db = new Dexie('changarro') as Dexie & {
  products: EntityTable<Product, 'id'>
  sales: EntityTable<Sale, 'id'>
  settings: EntityTable<AppSettings, 'id'>
}

db.version(2).stores({
  products: 'id, name, category, isActive, createdAt',
  sales: 'id, createdAt',
  settings: 'id',
})

export { db }
