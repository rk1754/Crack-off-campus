import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchAllJobs,
  createNewJob,
  updateJob,
  deleteJob,
  Job,
  getAllJobsAdmin,
} from "@/redux/slices/jobSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Search, Edit3, Trash2, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Define a job interface that makes location optional to avoid TypeScript errors
interface JobFormData {
  id?: string;
  title: string;
  description: string;
  location?: string;
  ctc_stipend?: string;
  company_name: string;
  job_url: string;
  employment_type?: string;
  remote?: boolean;
  requirements?: string[];
  benefits?: string[];
  status: "open" | "closed";
  subscription_type: string;
  passout_year?: string;
  experience?: "fresher" | "experienced";
  skills?: string[];
}

const JobManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.job);
  const { admin } = useSelector((state: RootState) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [isEditJobDialogOpen, setIsEditJobDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    ctc_stipend: "",
    company_name: "",
    job_url: "",
    employment_type: "full-time",
    remote: false,
    requirements: [],
    benefits: [],
    status: "open",
    subscription_type: "regular",
    passout_year: "",
    experience: undefined,
    skills: [],
  });

  // Fetch jobs on component mount
  useEffect(() => {
    if (admin) {
      dispatch(getAllJobsAdmin());
    }
  }, [dispatch, admin]);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJob = async () => {
    try {
      console.log("Adding job:", currentJob);
      await dispatch(createNewJob(currentJob)).unwrap();

      toast.success("Job added successfully");
      setIsAddJobDialogOpen(false);
      resetJobForm();
    } catch (error) {
      toast.error("Failed to add job");
      console.error("Error adding job:", error);
    }
  };

  const handleEditJob = async () => {
    if (!currentJob.id) return;

    try {
      await dispatch(
        updateJob({
          id: currentJob.id,
          data: currentJob,
        })
      ).unwrap();
      toast.success("Job updated successfully");
      setIsEditJobDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update job");
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async () => {
    if (!currentJob.id) return;

    try {
      await dispatch(deleteJob(currentJob.id)).unwrap();
      toast.success("Job deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete job");
      console.error("Error deleting job:", error);
    }
  };

  const openEditDialog = (job: Job) => {
    const jobToEdit: JobFormData = {
      id: job.id,
      title: job.title,
      description: job.description || "",
      location: job.location || "",
      ctc_stipend: job.ctc_stipend || "",
      company_name: job.company_name,
      job_url: job.job_url,
      employment_type: job.employment_type || "full-time",
      remote: job.remote || false,
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      status: job.status,
      subscription_type: job.subscription_type,
      passout_year: job.passout_year || "",
      experience: job.experience || undefined,
      skills: job.skills || [],
    };

    setCurrentJob(jobToEdit);
    setIsEditJobDialogOpen(true);
  };

  const openDeleteDialog = (job: Job) => {
    setCurrentJob({
      id: job.id,
      title: job.title,
      description: job.description || "",
      company_name: job.company_name,
      job_url: job.job_url,
      status: job.status,
      subscription_type: job.subscription_type,
    });
    setIsDeleteDialogOpen(true);
  };

  const resetJobForm = () => {
    setCurrentJob({
      title: "",
      description: "",
      location: "",
      ctc_stipend: "",
      company_name: "",
      job_url: "",
      employment_type: "full-time",
      remote: false,
      requirements: [],
      benefits: [],
      status: "open",
      subscription_type: "regular",
      passout_year: "",
      experience: undefined,
      skills: [],
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCurrentJob((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRequirementsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const requirementsArray = e.target.value
      .split("\n")
      .filter((item) => item.trim() !== "");
    setCurrentJob((prev) => ({ ...prev, requirements: requirementsArray }));
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const benefitsArray = e.target.value
      .split("\n")
      .filter((item) => item.trim() !== "");
    setCurrentJob((prev) => ({ ...prev, benefits: benefitsArray }));
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-foreground">Job Management</h2>
        <Button onClick={() => setIsAddJobDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Job
        </Button>
      </div>

      <div className="flex items-center border rounded-md overflow-hidden pl-3">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          Error loading jobs: {error}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company_name}</TableCell>
                    <TableCell>
                      {job.posted_at ? formatDateTime(job.posted_at) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status === "open" ? "Active" : "Closed"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(job)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(job)}
                            className="text-red-600 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          {job.job_url && (
                            <DropdownMenuItem asChild>
                              <a
                                href={job.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Posting
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Job Dialog */}
      <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentJob.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name*</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={currentJob.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description*</Label>
              <Textarea
                id="description"
                name="description"
                value={currentJob.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={currentJob.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <Select
                  value={currentJob.employment_type}
                  onValueChange={(value) =>
                    setCurrentJob((prev) => ({
                      ...prev,
                      employment_type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CTC/Stipend Field */}
            <div className="space-y-2">
              <Label htmlFor="ctc_stipend">CTC / Stipend</Label>
              <Input
                id="ctc_stipend"
                name="ctc_stipend"
                value={currentJob.ctc_stipend}
                onChange={handleInputChange}
                placeholder="e.g., 5-7 LPA or ₹20000/month"
              />
            </div>

            {/* Passout Year Field */}
            <div className="space-y-2">
              <Label htmlFor="passout_year">Target Batch (Passout Year)</Label>
              <Input
                id="passout_year"
                name="passout_year"
                value={currentJob.passout_year}
                onChange={handleInputChange}
                placeholder="e.g., 2025 (Optional)"
              />
            </div>

            {/* Experience Level Field */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                value={currentJob.experience}
                onValueChange={(value) =>
                  setCurrentJob((prev) => ({
                    ...prev,
                    experience: value as "fresher" | "experienced",
                  }))
                }
              >
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="experienced">Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_url">Application URL*</Label>
              <Input
                id="job_url"
                name="job_url"
                value={currentJob.job_url}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/careers/apply"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={currentJob.requirements?.join("\n")}
                onChange={handleRequirementsChange}
                rows={4}
                placeholder="Bachelor's degree in Computer Science
2+ years of experience in JavaScript
Knowledge of React.js"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                name="benefits"
                value={currentJob.benefits?.join("\n")}
                onChange={handleBenefitsChange}
                rows={4}
                placeholder="Health insurance
Flexible work hours
Remote work options"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="remote"
                checked={currentJob.remote}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("remote", checked)
                }
              />
              <Label htmlFor="remote">Remote Job</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Job Status</Label>
              <Select
                value={currentJob.status}
                onValueChange={(value) =>
                  setCurrentJob((prev) => ({
                    ...prev,
                    status: value as "open" | "closed",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription_type">Subscription Type</Label>
              <Select
                value={currentJob.subscription_type}
                onValueChange={(value) =>
                  setCurrentJob((prev) => ({
                    ...prev,
                    subscription_type: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetJobForm();
                setIsAddJobDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddJob} disabled={loading}>
              {loading ? "Adding..." : "Add Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditJobDialogOpen} onOpenChange={setIsEditJobDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job details and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as Add Job Dialog */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Job Title*</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={currentJob.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company_name">Company Name*</Label>
                <Input
                  id="edit-company_name"
                  name="company_name"
                  value={currentJob.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Job Description*</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={currentJob.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={currentJob.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-employment_type">Employment Type</Label>
                <Select
                  value={currentJob.employment_type}
                  onValueChange={(value) =>
                    setCurrentJob((prev) => ({
                      ...prev,
                      employment_type: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CTC/Stipend Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-ctc_stipend">CTC / Stipend</Label>
              <Input
                id="edit-ctc_stipend"
                name="ctc_stipend"
                value={currentJob.ctc_stipend}
                onChange={handleInputChange}
                placeholder="e.g., 5-7 LPA or ₹20000/month"
              />
            </div>

            {/* Passout Year Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-passout_year">
                Target Batch (Passout Year)
              </Label>
              <Input
                id="edit-passout_year"
                name="passout_year"
                value={currentJob.passout_year}
                onChange={handleInputChange}
                placeholder="e.g., 2025 (Optional)"
              />
            </div>

            {/* Experience Level Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-experience">Experience Level</Label>
              <Select
                value={currentJob.experience}
                onValueChange={(value) =>
                  setCurrentJob((prev) => ({
                    ...prev,
                    experience: value as "fresher" | "experienced",
                  }))
                }
              >
                <SelectTrigger id="edit-experience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="experienced">Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-job_url">Application URL*</Label>
              <Input
                id="edit-job_url"
                name="job_url"
                value={currentJob.job_url}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requirements">
                Requirements (one per line)
              </Label>
              <Textarea
                id="edit-requirements"
                name="requirements"
                value={currentJob.requirements?.join("\n")}
                onChange={handleRequirementsChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-benefits">Benefits (one per line)</Label>
              <Textarea
                id="edit-benefits"
                name="benefits"
                value={currentJob.benefits?.join("\n")}
                onChange={handleBenefitsChange}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-remote"
                checked={currentJob.remote}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("remote", checked)
                }
              />
              <Label htmlFor="edit-remote">Remote Job</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Job Status</Label>
              <Select
                value={currentJob.status}
                onValueChange={(value) =>
                  setCurrentJob((prev) => ({
                    ...prev,
                    status: value as "open" | "closed",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-subscription_type">Subscription Type</Label>
              <Select
                value={currentJob.subscription_type}
                onValueChange={(value) =>
                  setCurrentJob((prev) => ({
                    ...prev,
                    subscription_type: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="gold_plus">Gold Plus</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditJobDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditJob} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job:{" "}
              <strong>{currentJob.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteJob}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobManagement;
