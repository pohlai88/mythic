/**
 * Broadcast Export Component
 *
 * UI for exporting broadcasts to CSV, JSON, or PDF formats.
 */

"use client"

import { Card } from "@mythic/tailwindcss-v4-design-system"
import { cn, intelligentButtonStyles, intelligentInputStyles } from "@mythic/nextjs-shared-utils"
import { useState, memo } from "react"
import { exportBroadcasts } from "@/app/actions/broadcast-export"

interface BroadcastExportProps {
  className?: string
}

export const BroadcastExport = memo(function BroadcastExport({ className }: BroadcastExportProps) {
  const [format, setFormat] = useState<"csv" | "json" | "pdf">("csv")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [type, setType] = useState<string>("")
  const [category, setCategory] = useState("")
  const [includeReads, setIncludeReads] = useState(true)
  const [includeComments, setIncludeComments] = useState(false)
  const [includeReactions, setIncludeReactions] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setExporting(true)
    setError(null)

    try {
      const result = await exportBroadcasts({
        format,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        type: type || undefined,
        category: category || undefined,
        includeReads,
        includeComments,
        includeReactions,
      })

      if (result.success && result.data) {
        // Create download
        const blob = new Blob([result.data], {
          type: result.mimeType || "text/plain",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `broadcasts-export-${new Date().toISOString().split("T")[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        setError(result.error || "Export failed")
      }
    } catch (err) {
      console.error("Error exporting broadcasts:", err)
      setError("Failed to export broadcasts")
    } finally {
      setExporting(false)
    }
  }

  return (
    <Card elevation="sm" className={cn("p-4", className)}>
      <h3 className="font-serif text-lg text-parchment mb-4">Export Broadcasts</h3>

      <div className="space-y-4">
        {/* Format selection */}
        <div>
          <label className="block text-sm text-ash mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "csv" | "json" | "pdf")}
            className={intelligentInputStyles()}
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="pdf">PDF (Coming Soon)</option>
          </select>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ash mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={intelligentInputStyles()}
            />
          </div>
          <div>
            <label className="block text-sm text-ash mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={intelligentInputStyles()}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ash mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={intelligentInputStyles()}
            >
              <option value="">All Types</option>
              <option value="approval">Approval</option>
              <option value="veto">Veto</option>
              <option value="announcement">Announcement</option>
              <option value="poll">Poll</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-ash mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Filter by category"
              className={intelligentInputStyles()}
            />
          </div>
        </div>

        {/* Include options */}
        <div className="space-y-2">
          <label className="block text-sm text-ash mb-2">Include</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeReads}
              onChange={(e) => setIncludeReads(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-parchment">Read Statistics</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-parchment">Comments</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeReactions}
              onChange={(e) => setIncludeReactions(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-parchment">Reactions</span>
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-sm text-ember bg-obsidian border border-ember rounded-xs p-3">
            {error}
          </div>
        )}

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={exporting || format === "pdf"}
          className={intelligentButtonStyles(
            "primary",
            "md",
            "w-full disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {exporting ? "Exporting..." : `Export as ${format.toUpperCase()}`}
        </button>
      </div>
    </Card>
  )
})
