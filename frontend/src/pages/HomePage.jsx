import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState} from 'react'
import { getUserFriends, getOutgoingFriendReqs, getRecomendedUsers,sendFriendRequest } from '../lib/api'
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';

const HomePage = () => {

  const queryClient = useQueryClient();
  const [outGoingRequestsIds, setOutGoingRequestsIds] = useState(new Set()); 

  const {data: friends=[], isLoading: isLoadingFriends} = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends
  });

  const {data: recomendedUsers=[], isLoading: isLoadingRecommendedUsers} = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: getRecomendedUsers
  });

  const {data: outgoingFriendReqs=[], isLoading: isLoadingOutgoingFriendReqs} = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs
  });

  const {mutate: sendRequestMutate, isPending} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['outgoingFriendReqs']});
    }
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if(outgoingFriendReqs && outgoingFriendReqs.length > 0){
      outgoingFriendReqs.forEach(req => {
        outgoingIds.add(req.recipient._id);
      })
      setOutGoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);




  return (
    <div className='p-4 sm:p-6 md:p-8 h-fit bg-base-100 min-h-screen'>
      <div className="container mx-auto space-y-10 w-10/11">
        <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to = "/notifications" className='btn btn-outline btn-sm'>
            <UserIcon className='size-4 mr-2' />
            Friend Requests
          </Link>
        </div>

        {isLoadingFriends ? (
          <div className="flex justify-center py-12">
            <span className='loading loading-spinner loading-lg'/>
          </div>
          
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map(friend => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New People</h2>
                <p className="opacity-70">
                  Discover and connect with people who share your interests!
                </p>
              </div>
            </div>
          </div>

          {isLoadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className='loading loading-spinner loading-lg'/>
            </div>
            ) : recomendedUsers.length === 0 ? (
              <div className='card bg-base-200 p-6 text-center rounded-md'>
                <h3 className='font-semibold text-lg mb-2'>No new users to recommend.</h3>
                <p className='text-base-content opacity-70'>Check back later for new people!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recomendedUsers.map(user => {
                  const isRequestSent = outGoingRequestsIds.has(user._id);

                  return (
                    <div key={user._id} className='bg-base-200 hover:shadow-md transition-all duration-300 rounded-lg cursor-pointer' onClick={() => handleRedirectToProfile(user._id)}>
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="avatar size-16 rounded-full border">
                            <img src={user.profilePic} alt={user.fullName} className='rounded-full'/>
                          </div>
                          <div>
                            <h3 className='font-semibold text-lg truncate'>{user.fullName}</h3>
                            {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className='size-4 mr-1' />
                              <span>{user.location}</span>
                            </div>
                            )}
                          </div>
                        </div>

                        {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          isRequestSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutate(user._id)}
                        disabled={isRequestSent || isPending}
                      >
                        {isRequestSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;