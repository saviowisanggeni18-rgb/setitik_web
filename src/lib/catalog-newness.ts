import type { Product } from '@/data/products'

const newProductWindowMs = 3 * 24 * 60 * 60 * 1000

export function getProductCreatedTime(product: Product) {
  if (!product.createdAt) return 0

  const createdTime = new Date(product.createdAt).getTime()

  return Number.isFinite(createdTime) ? createdTime : 0
}

export function isProductRecentlyAdded(product: Product) {
  if (product.source === 'built-in') return false

  const createdTime = getProductCreatedTime(product)

  if (!createdTime) return false

  const age = Date.now() - createdTime

  return age >= 0 && age <= newProductWindowMs
}
