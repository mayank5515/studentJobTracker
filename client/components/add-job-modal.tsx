"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type Job, JOB_STATUSES, type JobStatus } from "@/app/page"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface AddJobModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (job: Omit<Job, "id">) => void
}

export function AddJobModal({ open, onOpenChange, onSubmit }: AddJobModalProps) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "applied" as JobStatus,
    date_of_application: new Date(),
    link: "",
  })

  const [errors, setErrors] = useState({
    company: false,
    role: false,
    link: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  const handleStatusChange = (value: JobStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date_of_application: date,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      company: !formData.company,
      role: !formData.role,
      link: !formData.link,
    }

    setErrors(newErrors)

    // If there are errors, don't submit
    if (Object.values(newErrors).some(Boolean)) {
      return
    }

    onSubmit(formData)

    // Reset form
    setFormData({
      company: "",
      role: "",
      status: "applied",
      date_of_application: new Date(),
      link: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>Enter the details of the job you've applied for.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company" className={errors.company ? "text-red-500" : ""}>
                Company {errors.company && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && <p className="text-red-500 text-sm">Company is required</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className={errors.role ? "text-red-500" : ""}>
                Role {errors.role && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? "border-red-500" : ""}
              />
              {errors.role && <p className="text-red-500 text-sm">Role is required</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleStatusChange(value as JobStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Application Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date_of_application && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date_of_application ? format(formData.date_of_application, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date_of_application}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link" className={errors.link ? "text-red-500" : ""}>
                Job Link {errors.link && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/job"
                className={errors.link ? "border-red-500" : ""}
              />
              {errors.link && <p className="text-red-500 text-sm">Job link is required</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
