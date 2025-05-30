"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/admin/DashboardHeader";
import UserManagement from "@/components/admin/UserManagement";
import JobManagement from "@/components/admin/JobManagement";
// import ApplicationLinksManagement from "@/components/admin/ApplicationLinksManagement"
import DashboardOverview from "@/components/admin/DashboardOverview";
import { Briefcase, LayoutDashboard, Users } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
          Admin Dashboard
        </h1>

        <Tabs
          defaultValue="overview"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="overview"
              className="flex items-center justify-center gap-2 py-3"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center justify-center gap-2 py-3"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="flex items-center justify-center gap-2 py-3"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Jobs</span>
            </TabsTrigger>
            {/* <TabsTrigger value="links" className="flex items-center justify-center gap-2 py-3">
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">Application Links</span>
            </TabsTrigger> */}
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="users" className="space-y-6 mt-0">
              <UserManagement />
            </TabsContent>

            <TabsContent value="jobs" className="space-y-6 mt-0">
              <JobManagement />
            </TabsContent>

            <TabsContent value="links" className="space-y-6 mt-0">
              {/* <ApplicationLinksManagement /> */}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
