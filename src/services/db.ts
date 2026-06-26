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

const db = new Dexie('changarro') as Dexie & {
  products: EntityTable<Product, 'id'>
}

db.version(1).stores({
  products: 'id, name, category, isActive, createdAt',
})

export { db }
