"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { JOB_STATUSES, type JobStatus } from "@/app/page"

interface FilterSidebarProps {
  filters: {
    status: JobStatus[]
    dateRange: {
      from: Date | undefined
      to: Date | undefined
    }
    search: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      status: JobStatus[]
      dateRange: {
        from: Date | undefined
        to: Date | undefined
      }
      search: string
    }>
  >
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Toggle status filter
  const toggleStatus = (status: JobStatus) => {
    setFilters((prev) => {
      if (prev.status.includes(status)) {
        return {
          ...prev,
          status: prev.status.filter((s) => s !== status),
        }
      } else {
        return {
          ...prev,
          status: [...prev.status, status],
        }
      }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: [],
      dateRange: {
        from: undefined,
        to: undefined,
      },
      search: "",
    })
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }))
  }

  // Handle date range selection
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        from: range.from,
        to: range.to,
      },
    }))
  }

  return (
    <div
      className={cn("h-screen bg-card border-r transition-all duration-300 overflow-y-auto", isOpen ? "w-64" : "w-0")}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Company or role..." value={filters.search} onChange={handleSearchChange} />
          </div>

          <Separator />

          {/* Status filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="space-y-2">
              {JOB_STATUSES.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date range filter */}
          <div className="space-y-2">
            <Label>Application Date</Label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange.from}
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to,
                    }}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Clear filters button */}
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
