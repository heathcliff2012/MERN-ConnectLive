import { Query, QueryClient, useQuery } from '@tanstack/react-query';
import React from 'react'
import {  getUserProfile } from '../lib/api';
import { CircleFadingPlusIcon, MapPinIcon } from 'lucide-react';
import { Link } from 'react-router';
import Posts from '../components/Posts';

const UserProfilePage = () => {

   const {data: userProfile, isLoading} = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile
    });


  return (
    <div className='min-h-screen w-full flex flex-col bg-base-100'>
        <section className="container mx-auto p-4 mt-6 justify-center w-full">
            <div className="flex">
            <div className="avatar mb-4 ">
                <div className="size-20 sm:size-32 rounded-full border">
                <img src={userProfile?.profilePic} alt={userProfile?.fullName} />
                </div>
            </div>
                <div className="ml-6 flex flex-col justify-center">
                    <h1 className="text-2xl sm:text-3xl font-bold">{userProfile?.fullName}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <MapPinIcon className='size-5 text-base-content opacity-70 mt-1'/>
                        <span className="text-base-content opacity-70 mt-1">{userProfile?.location}</span>
                    </div>
                    <div>
                        <p className="mt-2 text-base-content opacity-80">{userProfile?.bio}</p>
                    </div>
                </div>
                <div className="ml-[30%] flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold mb-4">Friends</h2>
                    {isLoading ? (
                    <div className="flex justify-center py-12">
                        <span className='loading loading-spinner loading-lg'/>
                        </div>
                    ) : (
                        <div className="text-2xl opacity-70">{userProfile?.friends?.length}</div>
                    )}
                </div>
                <div className="ml-[30%] flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold mb-4">Posts</h2>
                    {isLoading ? (
                    <div className="flex justify-center py-12">
                        <span className='loading loading-spinner loading-lg'/>
                        </div>
                    ) : (
                        <div className="text-2xl opacity-70">{userProfile?.posts?.length}</div>
                    )}
                </div>
            </div>
        </section>
        <section className="container mx-auto p-4 mt-6 justify-center w-full bg-base-300 h-25 rounded-md">
            <Link to = "/add-post">
                <CircleFadingPlusIcon className='size-10 text-base-content opacity-70 mx-auto hover:cursor-pointer '/>
                <div className="text-center mt-2 text-base-content opacity-70">Add a new post</div>
            </Link>
        </section>

        {/* Posts Section */}
        <section className="container mx-auto p-4 mt-6 justify-center w-full">
            <div>
                <h2 className="text-2xl font-bold mb-4">Posts</h2>
                {isLoading ? (
                <div className="flex justify-center py-12">
                    <span className='loading loading-spinner loading-lg'/>
                    </div>
                ) : (
                userProfile?.posts?.length === 0 ? (
                    <p className="text-base-content opacity-70">No posts to display.</p>
                    ) : (
                        userProfile?.posts?.map(post => (
                            <Posts key={post._id} post={post} userProfile={userProfile}/>
                        ))
                    )
                )}
            </div>
        </section>
    </div>
  )
}

export default UserProfilePage
