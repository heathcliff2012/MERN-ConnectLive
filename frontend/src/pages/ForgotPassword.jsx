import React, { useCallback, useState } from 'react'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { forgotPassword } from '../lib/api';
import { toast } from 'react-hot-toast';
import { LockKeyhole, Mail } from 'lucide-react';


const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [isResetLinkSent, setIsResetLinkSent] = useState(false)

    const {mutate: forgotPasswordMutate, isPending, error} = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("email sent successfully!");
    }
 })

    const handleSubmit = (e) => {
        e.preventDefault();
        forgotPasswordMutate(email);
        setIsResetLinkSent(true);
    }
    

  return (
    <div className='h-full w-full flex flex-col items-center justify-center' data-theme="forest">
      <div className="card">
        <div className="card-body flex flex-col items-center justify-center border border-primary/25 shadow-lg rounded-lg p-8">
        {
            !isResetLinkSent ?  (
        <>
            <h2 className="card-title text-2xl text-primary">Forgot Password</h2>
            <p className='text-center'>Enter your email to receive a password reset link</p>
            {error && (<div className="alert alert-error shadow-lg mb-4">
                      <span>{error.response?.data?.message || "An error occurred" }</span>
                    </div>)}
            <div className="card-actions justify-center mt-4">
                <form className="space-y-6 gap-2" onSubmit={handleSubmit}>
                  <div className="flex gap-3 justify-between">
                    <div className="relative">
                        <Mail className="absolute  left-6 top-1/2 -translate-y-1/2 opacity-50 size-5 z-10 text-primary"/>
                    </div>
                    <input
                        type="email"
                        placeholder="Your email"
                        className="input input-bordered w-72 pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                  </div>
                  <div className="flex w-full justify-center items-center">
                    <button className="btn btn-primary btn-wide">Send Reset Link</button>
                  </div>
                  
                </form>
            </div>
        </>
            ) : (
        <>
            <h2 className="card-title text-2xl text-primary">Reset Link Sent!</h2>
            <p className='text-center'>If an account with that email exists, a password reset link has been sent. Please check your inbox.</p>
        </>
            )
}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
