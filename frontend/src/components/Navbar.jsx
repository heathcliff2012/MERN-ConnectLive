import React from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { Link, useLocation } from 'react-router';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getSearchUsers, logout } from '../lib/api';
import { toast } from 'react-hot-toast';
import ConnectLiveLogo from './ConnectLiveLogo';
import { BellIcon, LogOutIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navbar = ({showSearchBar = false}) => {

  const {authUser} = useAuthUser();

  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');
  const [searchQuery, setSearchQuery] = React.useState('');
  const queryClient = useQueryClient();
  const {mutate: logoutMutate} = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Logged out successfully');
    },
  });

  const {data: findUsers=[]} = useQuery({
    queryKey: ['findUsers', searchQuery],
    queryFn: () => getSearchUsers(searchQuery),
    enabled: Boolean(searchQuery),
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

          {/* Search Bar */}
          {
            showSearchBar && (
              <>
              <div className='block sm:w-64 md:w-80 lg:w-96 relative dropdown'>
              <label className="input bg-base-300">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
        <input type="search" required placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
      </label>
      <div className="dropdown-content bg-base-300 shadow rounded-box w-84">
        {findUsers.map(user => (
          <Link to = {`/user-profile/${user._id}`} key={user._id}>
              <div className="flex p-2 hover:bg-base-200 cursor-pointer" onClick={() => setSearchQuery('')}>
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.fullName} className="size-6 rounded-full border mr-3"/>
              ) : (
                <div className="size-6 rounded-full border mr-3 flex items-center justify-center">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
              {user.fullName}
            </div>
          </Link>
        ))}
      </div>
              </div>
      </>

            )
          }
        
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to = "/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="size-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          <Link to = {`/user-profile`}>
            <div className="avatar">
              <div className="w-7 rounded-full border hover:cursor-pointer">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
          </Link>

          <button className='btn btn-ghost btn-circle' onClick={() => logoutMutate()}>
            <LogOutIcon className="size-6 text-base-content opacity-70" />
          </button>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
