/**
 * BoardRoom Store (Zustand)
 *
 * Client-side state management for BoardRoom UI
 * - Selected proposal ID (client state)
 * - UI preferences (drawer open/closed, view mode, etc.)
 *
 * Note: Server state (proposals list) should use TanStack Query, not Zustand.
 */

"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface BoardRoomState {
  // Selected proposal (client state only)
  selectedProposalId: string | undefined
  setSelectedProposalId: (id: string | undefined) => void

  // Strategy drawer state
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  toggleDrawer: () => void

  // View preferences
  viewMode: "pool_table" | "kanban" | "calendar"
  setViewMode: (mode: "pool_table" | "kanban" | "calendar") => void

  // Filter state (client-side only)
  filters: {
    circleIds: string[]
    statuses: string[]
    hideArchived: boolean
    onlyAwaitingMyVote: boolean
  }
  setFilters: (filters: Partial<BoardRoomState["filters"]>) => void
  resetFilters: () => void
}

const defaultFilters: BoardRoomState["filters"] = {
  circleIds: [],
  statuses: [],
  hideArchived: true,
  onlyAwaitingMyVote: false,
}

export const useBoardRoomStore = create<BoardRoomState>()(
  devtools(
    (set) => ({
      // Selected proposal
      selectedProposalId: undefined,
      setSelectedProposalId: (id) => set({ selectedProposalId: id }),

      // Drawer state
      drawerOpen: true,
      setDrawerOpen: (open) => set({ drawerOpen: open }),
      toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

      // View mode
      viewMode: "pool_table",
      setViewMode: (mode) => set({ viewMode: mode }),

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    { name: "BoardRoom Store" }
  )
)
