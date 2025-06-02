
import React from "react";
import Layout from "../components/layout/Layout";
import AuthForm from "../components/auth/AuthForm";

const Login = () => {
  return (
    <Layout>
      <div className="bg-muted/30 dark:bg-gray-900 min-h-[calc(100vh-150px)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <AuthForm type="login" />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
