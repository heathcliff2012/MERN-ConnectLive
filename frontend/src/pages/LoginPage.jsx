
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useState } from 'react';
import { login } from '../lib/api';
import { toast } from 'react-hot-toast';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';

const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const queryClient = useQueryClient();

 const {mutate: loginMutate, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("login completed successfully!");
      queryClient.invalidateQueries({queryKey: ['authUser']})
    }
 })

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutate(loginData);
  }

  return (
    <div className = "h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className='w-full lg:w-1/2 flex flex-col gap-6 p-4 sm:p-6'>
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary"/>
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
              ConnectLive
            </span>
          </div>
          {error && (<div className="alert alert-error shadow-lg mb-4">
                      <span>{error.response?.data?.message || "An error occurred" }</span>
                    </div>)}

          <div className='w-full'>
            <form action="" method="post" onSubmit={handleLogin}>
              <div className='space-y-4'>
                <div className="">
                  <h2 className='text-xl font-semibold'>Welcome Back!</h2>
                  <p className='text-md opacity-70'>Please enter your login details</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label> 
                  <input 
                    type="text" 
                    placeholder="JohnDoe@example.com" 
                    className="input input-bordered w-full" 
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label> 
                  <input 
                    type="password" 
                    placeholder="********" 
                    className="input input-bordered w-full" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                </div>

                <button type="submit" disabled={isPending} className="btn btn-primary w-full">
                  {isPending ? (<span className='loading loading-spinner loading-xs'>Logging in...</span>) : "Login"}
                </button>

                <div className="text-center mt-4">
                <p className="text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary font-semibold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div className="hidden lg:block lg:w-1/2 bg-primary/10">
          <img 
            src="../public/signup.svg" 
            alt="Login Illustration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage

