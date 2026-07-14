import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db, type Shift } from '@/services/db'

export const useShiftsStore = defineStore('shifts', () => {
  const activeShift = ref<Shift | null>(null)
  const isLoading = ref(false)

  // Load the currently active shift (no closedAt) from IndexedDB
  async function loadActiveShift() {
    isLoading.value = true
    try {
      const open = await db.shifts
        .filter((s) => s.closedAt === undefined)
        .first()
      activeShift.value = open ?? null
    } finally {
      isLoading.value = false
    }
  }

  // Get the next incremental shift ID
  async function nextShiftId(): Promise<number> {
    const last = await db.shifts.orderBy('id').last()
    return last ? last.id + 1 : 1
  }

  // Open a brand-new shift
  async function openShift(): Promise<Shift> {
    const id = await nextShiftId()
    const shift: Shift = {
      id,
      startedAt: new Date().toISOString(),
      totalCash: 0,
      salesCount: 0,
    }
    await db.shifts.add(shift)
    activeShift.value = shift
    return shift
  }

  // Close the active shift: update totals and set closedAt, then open next
  async function closeShift(
    totalCash: number,
    salesCount: number,
    notes?: string,
    shortage?: number,
  ): Promise<void> {
    if (!activeShift.value) return

    const closedAt = new Date().toISOString()
    const updated: Shift = {
      ...activeShift.value,
      closedAt,
      totalCash,
      salesCount,
      ...(notes?.trim() ? { notes: notes.trim() } : {}),
      ...(typeof shortage === 'number' && shortage > 0 ? { shortage } : {}),
    }

    await db.shifts.put(updated)
    activeShift.value = null
  }

  // Get all sales belonging to a specific shift
  async function getShiftSales(shiftId: number) {
    return db.sales.where('shiftId').equals(shiftId).reverse().sortBy('createdAt')
  }

  // Get all shifts ordered from newest to oldest
  async function getAllShifts(): Promise<Shift[]> {
    return db.shifts.orderBy('id').reverse().toArray()
  }

  // Get a single shift by numeric ID
  async function getShiftById(id: number): Promise<Shift | undefined> {
    return db.shifts.get(id)
  }

  return {
    activeShift,
    isLoading,
    loadActiveShift,
    openShift,
    closeShift,
    getShiftSales,
    getAllShifts,
    getShiftById,
  }
})
