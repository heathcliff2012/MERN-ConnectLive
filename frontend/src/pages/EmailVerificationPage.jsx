import React, { use, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyEmail } from '../lib/api';
import { toast } from 'react-hot-toast';

const EmailVerificationPage = () => {

    const [code, setCode] = useState(['','','','','','']);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const authUser = useAuthUser().authUser;
    const queryClient = useQueryClient();

    const {mutate: verifyEmailMutate, isPending, error} = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success("email verified successfully!");
      queryClient.invalidateQueries({queryKey: ['authUser']})
    }
 })

    const handleChange = (index, value) => {
        if (/^\d*$/.test(value)) { // Only allow digits
            const newCode = [...code];

            newCode[index] = value.slice(-1); // Take only the last digit
            setCode(newCode);
            // Move to next input if a digit was entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    }
    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !code[index] && index > 0) {
            const newCode = [...code];
            newCode[index - 1] = '';
            setCode(newCode);
            inputRefs.current[index - 1].focus();
        }
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const codeString = code.join('');
        verifyEmailMutate(codeString);
        
    }, [code, verifyEmailMutate]);

    useEffect(() => {
      if (code.every(digit => digit !== '')) {
        handleSubmit(new Event('submit'));
      }
    }, [code, handleSubmit]);
    

  return (
    <div className='h-full w-full flex flex-col items-center justify-center' data-theme="forest">
      <div className="card">
        <div className="card-body flex flex-col items-center justify-center border border-primary/25 shadow-lg rounded-lg p-8">
            <h2 className="card-title text-2xl">Email Verification</h2>
            <p className='text-center'>Enter the six digit verification code sent to your email</p>
            {error && (<div className="alert alert-error shadow-lg mb-4">
                      <span>{error.response?.data?.message || "An error occurred" }</span>
                    </div>)}
            <div className="card-actions justify-center mt-4">
                <form className="space-y-6 gap-2" onSubmit={handleSubmit}>
                  <div className="flex gap-3 justify-between">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref ={el => inputRefs.current[index] = el}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => { handleChange(index, e.target.value); }}
                        onKeyDown={(e) => { handleKeyDown(index, e); }}
                        className="input input-bordered w-11 text-center bg-base-200 gap-2 text-xl text-white rounded-md"
                      />
                    ))}
                  </div>
                  <div className="flex w-full justify-center  items-center">
                    <button className="btn btn-primary">Verify Email</button>
                  </div>
                  
                </form>
                  
            </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPage
