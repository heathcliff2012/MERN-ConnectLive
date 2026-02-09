import React from 'react'
import { useState } from 'react'
import {LockKeyhole, Mail, ShipWheelIcon, UserRound} from "lucide-react"
import { Link } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

const SignUpPage = () => {

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const queryClient = useQueryClient();

  const {mutate: signupMutate, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']})
});

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutate(signUpData);

  }

  return (
    <div className = "h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full lg:max-w-1/2 mx-auto bg-base-100 p-4 rounded-xl shadow-lg overflow-hidden gap">
      <div className='w-full lg:w-1/2 flex flex-col justify-center gap-6 p-4'>
        <div className="mb-4 flex items-center justify-start gap-2">
          <ShipWheelIcon className="size-9 text-primary"/>
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider'>
            ConnectLive
          </span>
        </div>

        {error && <div className="alert alert-error shadow-lg mb-4">
                    <span>{error.response?.data?.message || "An error occurred" }</span>
                  </div>}

        <div className='w-full'>
          <form action="" method="post" onSubmit={handleSignup}>
            <div className='space-y-4'>
              <div>
                <h2 className='text-xl font-semibold'>Create an account</h2>
                <p className='text-sm opacity-70'>
                  Please fill in the information below to create your account.
                </p>
              </div>

              <div className='space-y-3'>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Full Name</span>
                    </label>
                    <div className="relative">
                        {/* 1. Added 'z-10' to ensure it sits on top of the input background */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <UserRound className="size-5 text-primary/70"/>
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            className="input input-bordered w-full pl-10" 
                            value={signUpData.fullName}
                            onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                            required 
                        />
                    </div>
                </div>
              </div>

              <div className='space-y-3'>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <div className="relative">
                        {/* 1. Added 'z-10' to ensure it sits on top of the input background */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <Mail className="size-5 text-primary/70"/>
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="john.doe@example.com" 
                            className="input input-bordered w-full pl-10" 
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                            required 
                        />
                    </div>
                </div>
                
                <div className='space-y-3'>
                  <div className="form-control w-full">
                      <label className="label">
                          <span className="label-text">Password</span>
                      </label>
                      <div className="relative">
                          {/* 1. Added 'z-10' to ensure it sits on top of the input background */}
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                              <LockKeyhole className="size-5 text-primary/70"/>
                          </div>
                          
                          <input 
                              type="password" 
                              placeholder="Create a password" 
                              className="input input-bordered w-full pl-10" 
                              value={signUpData.password}
                              onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                              required 
                          />
                      </div>
                  </div>
                  <PasswordStrengthMeter password={signUpData.password} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">{isPending ? "Creating Account..." : "Create Account"}</button>
              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
        </div>
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center m-[-30px]]'>
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/signup.svg" alt="Sign Up Illustration" className="w-full h-full"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
