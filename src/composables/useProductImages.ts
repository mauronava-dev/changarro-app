import { ref, onBeforeUnmount } from 'vue'
import { db } from '@/services/db'

/**
 * Composable that manages product image object URLs.
 * Loads images from IndexedDB and creates blob URLs for display.
 * Automatically revokes URLs on unmount to prevent memory leaks.
 */
export function useProductImages() {
  const imageUrls = ref<Record<string, string>>({})
  const objectUrls: string[] = []

  async function loadImages(productIds: string[]) {
    const idsToLoad = productIds.filter((id) => !(id in imageUrls.value))
    if (idsToLoad.length === 0) return

    const images = await db.productImages.where('productId').anyOf(idsToLoad).toArray()

    for (const img of images) {
      const url = URL.createObjectURL(img.blob)
      imageUrls.value[img.productId] = url
      objectUrls.push(url)
    }
  }

  async function loadImage(productId: string): Promise<string | null> {
    if (imageUrls.value[productId]) return imageUrls.value[productId]

    const img = await db.productImages.get(productId)
    if (!img) return null

    const url = URL.createObjectURL(img.blob)
    imageUrls.value[productId] = url
    objectUrls.push(url)
    return url
  }

  function getImageUrl(productId: string): string | undefined {
    return imageUrls.value[productId]
  }

  onBeforeUnmount(() => {
    for (const url of objectUrls) {
      URL.revokeObjectURL(url)
    }
  })

  return { imageUrls, loadImages, loadImage, getImageUrl }
}

/**
 * Resizes an image file to a max dimension and returns a JPEG blob.
 */
export async function resizeImage(file: File, maxSize = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize)
          width = maxSize
        } else {
          width = Math.round((width / height) * maxSize)
          height = maxSize
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        },
        'image/jpeg',
        0.85,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Save a product image to IndexedDB.
 */
export async function saveProductImage(productId: string, blob: Blob): Promise<void> {
  await db.productImages.put({ productId, blob })
}

/**
 * Delete a product image from IndexedDB.
 */
export async function deleteProductImage(productId: string): Promise<void> {
  await db.productImages.delete(productId)
}
