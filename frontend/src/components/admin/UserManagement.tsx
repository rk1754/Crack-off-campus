import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux/slices/userSlice";

// Mock data for development
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user", subscription: "regular" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user", subscription: "gold" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "user", subscription: "diamond" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", role: "admin", subscription: "regular" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "user", subscription: "gold_plus" },
];

const UserManagement = () => {
  // const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {user, users, loading, error, message} = useSelector((state: RootState)=>state.user);
  const { admin } = useSelector((state: RootState) => state.admin);
  useEffect(() => {
      if (admin) {
        dispatch(getAllUsers());
      }
    }, [dispatch, admin]);
  // const handleDelete = (userId: number) => {
  //   // In a real app, this would be an API call
  //   setUsers(users.filter(user => user.id !== userId));
  //   toast.success("User deleted successfully");
  // };
  
  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          <span>User Management</span>
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
            {users.length} Users
          </span>
        </CardTitle>
        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        'user' === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' : 
                        'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                      }`}>
                        user
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.subscription_type === 'diamond' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300' : 
                        user.subscription_type === 'gold_plus' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                        user.subscription_type === 'gold' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                      }`}>
                        {user.subscription_type}
                      </span>
                    </TableCell>
                    {/* <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <UserMinus className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
