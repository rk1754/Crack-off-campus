import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchDashboardData } from "@/redux/slices/analyticsSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "recharts";
import {
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Briefcase, Users, FileText } from "lucide-react";

const DashboardOverview = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.analytics);
  const { admin } = useSelector((state: RootState) => state.admin);
  // FIX: Use data directly, not data.data
  const dashboardData = data;
  const { totalUsers, totalJobs, totalApplications } = dashboardData || {};
  useEffect(() => {
    if (admin) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, admin]);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading dashboard: {error}
      </div>
    );
  }
  console.log(dashboardData);
  if (!dashboardData) {
    return <div className="p-6 text-center">No dashboard data available</div>;
  }

  // Convert jobsByCategory object to array for PieChart
  const categoryData = Object.entries(dashboardData.jobsByCategory || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Colors for pie chart
  const COLORS = ["#9b87f5", "#F97316", "#10B981", "#3B82F6", "#8B5CF6"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold">
                  {totalUsers}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-4">
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                <h3 className="text-2xl font-bold">{totalJobs}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Applications
                </p>
                <h3 className="text-2xl font-bold">
                  {totalApplications}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Jobs by Category</CardTitle>
            <CardDescription>
              Distribution of jobs across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>Weekly application trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.applicationsByDate}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Applications"
                    stroke="#9b87f5"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              { (dashboardData.recentJobs || []).map((job) => (
                <div
                  key={job.id}
                  className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.applications} Applicants
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              { (dashboardData.recentUsers || []).map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
