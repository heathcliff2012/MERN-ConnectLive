import React from 'react'
import { useState } from 'react'

const SignUpPage = () => {

  const [signUpData, setSignUpData] = React.useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleSignup = (e) => {
    e.preventDefault();
  }

  return (
    <div className = "h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary" />
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        Hello from SignUpPage
      </div>
    </div>
  )
}

export default SignUpPage
