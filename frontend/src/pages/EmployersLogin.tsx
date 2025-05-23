import React from "react";
import Layout from "../components/layout/Layout";
import AuthForm from "../components/auth/AuthForm";

const EmployersLogin = () => {
  return (
    <Layout>
      <div className="bg-foundit-gray min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm type="employer" />
      </div>
    </Layout>
  );
};

export default EmployersLogin;
