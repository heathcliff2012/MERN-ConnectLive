import { Query, QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import { getFriendRequests, getOutgoingFriendReqs, getUserProfileData, sendFriendRequest, } from '../lib/api';
import { CircleFadingPlusIcon, Heart, MapPin, MapPinIcon, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';
import Posts from '../components/Posts';
import useAuthUser from '../hooks/useAuthUser';

const ProfilePage = () => {

    const currentUser = useAuthUser();
    const {id} = useParams();

    const queryClient = useQueryClient();

   const {data: userProfile, isLoading} = useQuery({
    queryKey: ['Profile', id],
    queryFn: () => getUserProfileData(id),
    onSuccess: () => queryClient.invalidateQueries(['Profile', id]),
    });

    const {data: outgoingFriendReqs=[], isLoading: isLoadingOutgoingFriendReqs} = useQuery({
        queryKey: ['outgoingFriendReqs'],
        queryFn: getOutgoingFriendReqs
      });
    
    const {data: incomingFriendReqs, isLoading: isLoadingIncomingFriendReqs} = useQuery({
        queryKey: ['incomingFriendReqs'],
        queryFn: getFriendRequests
      });
    
      const {mutate: sendRequestMutate, isPending} = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['outgoingFriendReqs']});
        }
      });

      const outgoingIds = useMemo(() => {
        const ids = new Set();
        if (outgoingFriendReqs?.length > 0) {
          outgoingFriendReqs.forEach(req => ids.add(req.recipient._id));
        }
        return ids;
      }, [outgoingFriendReqs]);
      
      // This replaces your 'incomingIds' state
      const incomingIds = useMemo(() => {
        const ids = new Set();
        // Safe navigation checks handled here
        if (incomingFriendReqs?.incomingRequests?.length > 0) {
          incomingFriendReqs.incomingRequests.forEach(req => ids.add(req.sender._id));
        }
        return ids;
      }, [incomingFriendReqs]);

    const isRequestSent = outgoingIds.has(id);
    const isReceivedRequest = incomingIds.has(id);
    const isFriend = userProfile?.friends?.includes(currentUser.authUser._id);



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
            <div className="flex items-center gap-4 mt-4">
                {isFriend ? (
                    <div className="btn btn-wide btn-outline btn-disabled">Friends</div>
                ) : (
                    isRequestSent ? (
                        <div className="btn btn-wide btn-outline btn-disabled">Request Sent</div>
                    ) : isReceivedRequest ? (
                    <div className="btn btn-wide btn-outline">Request Received</div>
                    ) : (
                    <div className="btn btn-wide btn-outline" onClick = {() => sendRequestMutate(userProfile._id)}>Add Friend</div>
                    )
                )}
                <div className="btn btn-wide bg-primary text-base-200">Message</div>
            </div>
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

export default ProfilePage

