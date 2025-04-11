"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobTable } from "@/components/job-table"
import { FilterSidebar } from "@/components/filter-sidebar"
import { AddJobModal } from "@/components/add-job-modal"
import { EditJobModal } from "@/components/edit-job-modal"
import { DeleteJobDialog } from "@/components/delete-job-dialog"
// import axios from "../utils/axiosInstance";
import axios from "axios"

// Job status options
export const JOB_STATUSES = ["applied", "interview", "offer", "rejected"] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

// Job type definition
export interface Job {
  id?: string
  company: string
  role: string
  status: JobStatus
  date_of_application: Date
  link: string
}



export default function JobTracker() {
  // State for jobs
  const [jobs, setJobs] = useState<Job[]>([])

  // State for filters
  const [filters, setFilters] = useState({
    status: [] as JobStatus[],
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    search: "",
  })

  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`);
      const { data } = response.data;
      console.log('data', data);
      const jobsWithDate = data.map((job: any) => ({
        ...job,
        date_of_application: new Date(job.date_of_application),
      }));
      setJobs(jobsWithDate);
    }
    catch (err) {
      console.error('Error fetching jobs:', err);
    }
  }

  // Load initial data
  useEffect(() => {
    // This would be replaced with an API call to your backend
    fetchJobs()


  }, [])

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter((job) => {
    // Filter by status
    if (filters.status.length > 0 && !filters.status.includes(job.status)) {
      return false
    }

    // Filter by date range
    if (filters.dateRange.from && job.date_of_application < filters.dateRange.from) {
      return false
    }
    if (filters.dateRange.to && job.date_of_application > filters.dateRange.to) {
      return false
    }

    // Filter by search term
    if (
      filters.search &&
      !job.company.toLowerCase().includes(filters.search.toLowerCase()) &&
      !job.role.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // CRUD operations
  const addJob = (job: Omit<Job, "id">) => {
    const newJob = {
      ...job,
      // id: Math.random().toString(36).substring(2, 9), // Generate a random ID
    }
    console.log('newJob', newJob);
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs`, newJob).then((response) => {
      console.log('Job added successfully:', response.data);
      fetchJobs();// so that jobs are showcased in sorted order
      // setJobs((prevJobs) => [{ ...newJob, id: response.data.id }, ...prevJobs]);

    }).catch((error) => {
      console.error('Error adding job:', error);
    });
    // setJobs([...jobs, newJob])
    setAddModalOpen(false)
  }

  const updateJob = (updatedJob: Job) => {
    setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)))
    //also update the selected job in backend
    console.log('updated Jobs: ', updatedJob);
    axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${updatedJob.id}`, updatedJob)
      .then(response => {
        console.log('Job updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating job:', error);
      });

    setEditModalOpen(false)
    setSelectedJob(null)
  }

  const deleteJob = () => {
    if (selectedJob) {
      // Delete the job from the backend
      // console.log('selected job for deleting from deleteJob fn: ', selectedJob);
      axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/jobs/${selectedJob.id}`).then((response) => {
        console.log('Job deleted successfully:', response);
        fetchJobs();
      }).catch((error) => {
        console.error('Error deleting job:', error);
      })
      // setJobs(jobs.filter((job) => job.id !== selectedJob.id))
      setDeleteDialogOpen(false)
      setSelectedJob(null)
    }
  }

  // Handlers for job actions
  const handleEdit = (job: Job) => {
    setSelectedJob(job)
    setEditModalOpen(true)
  }

  const handleDelete = (job: Job) => {
    setSelectedJob(job)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <FilterSidebar filters={filters} setFilters={setFilters} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b p-4 flex justify-between items-center bg-card">
          <h1 className="text-2xl font-bold">Student Job Tracker</h1>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Job
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <JobTable jobs={filteredJobs} onEdit={handleEdit} onDelete={handleDelete} />
        </main>
      </div>

      {/* Modals */}
      <AddJobModal open={addModalOpen} onOpenChange={setAddModalOpen} onSubmit={addJob} />

      {selectedJob && (
        <EditJobModal open={editModalOpen} onOpenChange={setEditModalOpen} job={selectedJob} onSubmit={updateJob} />
      )}

      {selectedJob && (
        <DeleteJobDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          job={selectedJob}
          onConfirm={deleteJob}
        />
      )}
    </div>
  )
}
// const mockJobs: Job[] = [
//   {
//     id: "1",
//     company: "Tech Solutions Inc.",
//     role: "Frontend Developer",
//     status: "applied",
//     date_of_application: new Date("2023-10-15"),
//     link: "https://techsolutions.com/careers",
//   },
//   {
//     id: "2",
//     company: "Data Systems Corp",
//     role: "Full Stack Engineer",
//     status: "interview",
//     date_of_application: new Date("2023-10-10"),
//     link: "https://datasystems.com/jobs",
//   },
//   {
//     id: "3",
//     company: "Innovative Software",
//     role: "React Developer",
//     status: "offer",
//     date_of_application: new Date("2023-09-28"),
//     link: "https://innovativesoftware.com/careers",
//   },
//   {
//     id: "4",
//     company: "Global Tech",
//     role: "Software Engineer",
//     status: "rejected",
//     date_of_application: new Date("2023-09-20"),
//     link: "https://globaltech.com/jobs",
//   },
//   {
//     id: "5",
//     company: "Future Systems",
//     role: "Frontend Engineer",
//     status: "applied",
//     date_of_application: new Date("2023-10-18"),
//     link: "https://futuresystems.com/careers",
//   },
// ]