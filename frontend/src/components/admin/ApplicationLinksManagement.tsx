
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { BACKEND_URL } from "@/redux/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Search, ExternalLink } from "lucide-react";

interface ApplicationLink {
  id: string;
  title: string;
  company: string;
  url: string;
  category: string;
  created_at: string;
}

const ApplicationLinksManagement = () => {
  const { admin } = useSelector((state: RootState) => state.admin);
  const [links, setLinks] = useState<ApplicationLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<ApplicationLink>({
    id: "",
    title: "",
    company: "",
    url: "",
    category: "",
    created_at: new Date().toISOString(),
  });

  // Mock data for development - in production this would be fetched from backend
  const mockLinks = [
    {
      id: "1",
      title: "Software Engineer",
      company: "Google",
      url: "https://careers.google.com/jobs",
      category: "Engineering",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Product Manager",
      company: "Microsoft",
      url: "https://careers.microsoft.com",
      category: "Product",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "UX Designer",
      company: "Apple",
      url: "https://www.apple.com/careers",
      category: "Design",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Data Scientist",
      company: "Amazon",
      url: "https://www.amazon.jobs",
      category: "Data Science",
      created_at: new Date().toISOString(),
    },
  ];

  // Fetch links on component mount
  useEffect(() => {
    if (admin) {
      fetchLinks();
    }
  }, [admin]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      // In production, this would be:
      // const response = await axios.get(`${BACKEND_URL}/links`);
      // setLinks(response.data);
      
      // For development, we'll use mock data
      setTimeout(() => {
        setLinks(mockLinks);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to fetch application links");
      setLoading(false);
    }
  };

  // Filter links based on search term
  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLink = async () => {
    try {
      // In production, this would be:
      // await axios.post(`${BACKEND_URL}/links`, currentLink);
      
      // For development, simulate API call
      const newLink = {
        ...currentLink,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
      };
      
      setLinks((prev) => [...prev, newLink]);
      toast.success("Link added successfully");
      setIsAddLinkDialogOpen(false);
      resetLinkForm();
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to add link");
    }
  };

  const handleEditLink = async () => {
    if (!currentLink.id) return;

    try {
      // In production, this would be:
      // await axios.put(`${BACKEND_URL}/links/${currentLink.id}`, currentLink);
      
      // For development, update local state
      setLinks((prev) =>
        prev.map((link) =>
          link.id === currentLink.id ? { ...currentLink } : link
        )
      );
      
      toast.success("Link updated successfully");
      setIsEditLinkDialogOpen(false);
    } catch (error) {
      console.error("Error updating link:", error);
      toast.error("Failed to update link");
    }
  };

  const handleDeleteLink = async () => {
    if (!currentLink.id) return;

    try {
      // In production, this would be:
      // await axios.delete(`${BACKEND_URL}/links/${currentLink.id}`);
      
      // For development, update local state
      setLinks((prev) => prev.filter((link) => link.id !== currentLink.id));
      
      toast.success("Link deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const openEditDialog = (link: ApplicationLink) => {
    setCurrentLink({ ...link });
    setIsEditLinkDialogOpen(true);
  };

  const openDeleteDialog = (link: ApplicationLink) => {
    setCurrentLink({ ...link });
    setIsDeleteDialogOpen(true);
  };

  const resetLinkForm = () => {
    setCurrentLink({
      id: "",
      title: "",
      company: "",
      url: "",
      category: "",
      created_at: new Date().toISOString(),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentLink((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">Application Links Management</h2>
        <Button onClick={() => setIsAddLinkDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Link
        </Button>
      </div>

      <div className="flex items-center border rounded-md overflow-hidden pl-3">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading links...</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No application links found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.title}</TableCell>
                    <TableCell>{link.company}</TableCell>
                    <TableCell>{link.category}</TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:underline"
                      >
                        <span className="truncate max-w-[150px]">
                          {link.url}
                        </span>
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(link)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(link)}>
                            Delete
                          </DropdownMenuItem>
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

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Application Link</DialogTitle>
            <DialogDescription>
              Add a new job application portal link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title*</Label>
              <Input
                id="title"
                name="title"
                value={currentLink.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company*</Label>
              <Input
                id="company"
                name="company"
                value={currentLink.company}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Application URL*</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={currentLink.url}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/careers/apply"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={currentLink.category}
                onChange={handleInputChange}
                placeholder="Engineering, Design, Marketing, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetLinkForm();
              setIsAddLinkDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddLink}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Link Dialog */}
      <Dialog open={isEditLinkDialogOpen} onOpenChange={setIsEditLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Application Link</DialogTitle>
            <DialogDescription>
              Update the application link details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Job Title*</Label>
              <Input
                id="edit-title"
                name="title"
                value={currentLink.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company*</Label>
              <Input
                id="edit-company"
                name="company"
                value={currentLink.company}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-url">Application URL*</Label>
              <Input
                id="edit-url"
                name="url"
                type="url"
                value={currentLink.url}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                value={currentLink.category}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLink}>
              Save Changes
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
              Are you sure you want to delete the application link for{" "}
              <strong>{currentLink.title}</strong> at{" "}
              <strong>{currentLink.company}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLink}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationLinksManagement;
