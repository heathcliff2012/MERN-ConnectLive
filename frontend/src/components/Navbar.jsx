import React from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { toast } from 'react-hot-toast';
import ConnectLiveLogo from './ConnectLiveLogo';
import { BellIcon, LogOutIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {

  const {authUser} = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');

  const queryClient = useQueryClient();

  const {mutate: logoutMutate} = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Logged out successfully');
    },
  });

  if (!authUser) {
    return null;
  }

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-3">
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className = "flex items-center gap-2.5">
                <ConnectLiveLogo />
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to = "/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="size-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />


          <div className="avatar">
            <div className="w-7 rounded-full border hover:cursor-pointer">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          <button className='btn btn-ghost btn-circle' onClick={() => logoutMutate()}>
            <LogOutIcon className="size-6 text-base-content opacity-70" />
          </button>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
