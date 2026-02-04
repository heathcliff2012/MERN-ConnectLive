import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, {useMemo} from 'react'
import { getUserFriends, getOutgoingFriendReqs, getRecomendedUsers,sendFriendRequest, getFriendRequests } from '../lib/api.js'
import { Link, useNavigate } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';

const FriendsPage = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

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

  // This replaces your 'outgoingRequestsIds' state
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




  return (
    <div className='p-4 sm:p-6 md:p-8 h-fit bg-base-100 min-h-screen'>
      <div className="container mx-auto space-y-10 w-10/11">
        <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className='bg-primary rounded-full size-3 relative sm:bottom-3 left-[97%] sm:left-[98%] lg:left-[99%]  z-10'></div>
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
          <NoFriendsFound title = 'No friends found.' body = 'Start connecting with people by sending friend requests!'/>
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
                  const isRequestSent = outgoingIds.has(user._id);
                  const isReceivedRequest = incomingIds.has(user._id);

                  return (
                    <div key={user._id} className='bg-base-200 hover:shadow-md transition-all duration-300 rounded-lg cursor-pointer'>
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="avatar size-16 rounded-full border">
                            <img src={user.profilePic} alt={user.fullName} className='rounded-full' onClick={() => navigate(`/user-profile/${user._id}`)} />
                          </div>
                          <div>
                            <h3 className='font-semibold text-lg truncate hover:underline cursor-pointer' onClick={() => navigate(`/user-profile/${user._id}`)}>{user.fullName}</h3>
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
                          (isRequestSent || isReceivedRequest) ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutate(user._id)}
                        disabled={isRequestSent || isReceivedRequest || isPending}
                      >
                        {isRequestSent || isReceivedRequest ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            {isRequestSent ? "Request Sent" : "Request Received"}
                          </>
                        ) : (
                          isLoadingOutgoingFriendReqs || isLoadingIncomingFriendReqs ? (
                            <span className='loading loading-spinner'/>
                          ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        ))}
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

export default FriendsPage;