import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ClockIcon, MapPinIcon, MessageSquareIcon, UserCheckIcon,BellIcon } from 'lucide-react'
import { getFriendRequests, acceptFriendRequest, declineFriendRequest } from '../lib/api'
import NoNotificationsFound from '../components/NoNotificationsFound.jsx'

const NotificationsPage = () => {
   
  const query = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const {mutate: acceptFriendRequestMutate, isAcceptingPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ['friendRequests'] });
      query.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const {mutate: declineFriendRequestMutate, isDecliningPending } = useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ['friendRequests'] });
      query.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptReqs || [];


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} className='rounded-full border' />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <MapPinIcon className="h-4 w-4 text-secondary inline-block mr-1" />
                              <span className="text-sm text-secondary">{request.sender.location || "Location not set"}</span>
                            </div>
                          </div>

                          <div className='flex gap-2 sm:gap-4'>
                            <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptFriendRequestMutate(request._id)}
                            disabled={isAcceptingPending}
                          >
                            Accept
                          </button>
                          <button
                            className="btn bg-red-700 border border-red-700 btn-sm"
                            onClick={() => declineFriendRequestMutate(request._id)}
                            disabled={isDecliningPending}
                          >
                            Decline
                          </button>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    console.log(notification),
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                              className='rounded-full border'
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                            <p className="text-sm my-1">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>

                  ))}
                </div>
              </section>
            )}

              {(incomingRequests.length === 0 && acceptedRequests.length === 0) && (
                <NoNotificationsFound />
              )}
            </>
          )}
        </div>
    </div>
  )
}

export default NotificationsPage
