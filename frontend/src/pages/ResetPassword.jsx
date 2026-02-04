import React, { useCallback, useState } from 'react'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { forgotPassword, resetPassword } from '../lib/api';
import { toast } from 'react-hot-toast';
import { LockKeyhole, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';


const ResetPassword = () => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate();
    const { token } = useParams();

    const {mutate: resetPasswordMutate, isPending, error} = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate('/login');
    }
 })

    const handleSubmit = (e) => {
        e.preventDefault();
          if(password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
        resetPasswordMutate({ token, password });
    }
    

  return (
    <div className='h-full w-full flex flex-col items-center justify-center' data-theme="forest">
      <div className="card">
        <div className="card-body flex flex-col items-center justify-center border border-primary/25 shadow-lg rounded-lg p-8">
        <>
            <h2 className="card-title text-2xl text-primary">Reset Password</h2>
            <p className='text-center'>Enter new password</p>
            {error && (<div className="alert alert-error shadow-lg mb-4">
                      <span>{error.response?.data?.message || "An error occurred" }</span>
                    </div>)}
            <div className="card-actions justify-center mt-4">
                <form className="space-y-6 gap-2" onSubmit={handleSubmit}>
                  <div className="flex gap-3 justify-between">
                    <div className="relative">
                        <LockKeyhole className="absolute  left-6 top-1/2 -translate-y-1/2 opacity-50 size-5 z-10 text-primary"/>
                    </div>
                    <input
                        type="password"
                        placeholder="New password"
                        className="input input-bordered w-72 pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                  </div>
                  <div className="flex gap-3 justify-between">
                    <div className="relative">
                        <LockKeyhole className="absolute  left-6 top-1/2 -translate-y-1/2 opacity-50 size-5 z-10 text-primary"/>
                    </div>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        className="input input-bordered w-72 pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                  </div>
                  <div className="flex w-full justify-center items-center">
                    <button className="btn btn-primary btn-wide" disabled={isPending}>Reset Password</button>
                  </div>
                  
                </form>
            </div>
        </>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;
