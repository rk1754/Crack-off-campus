import React from "react";
import Layout from "../components/layout/Layout";
import AuthForm from "../components/auth/AuthForm";

const Register = () => {
  return (
    <Layout>
      <div className="bg-foundit-gray min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm type="register" />
      </div>
    </Layout>
  );
};

export default Register;
