import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState} from 'react'
import { getUserFriends, getOutgoingFriendReqs, getRecomendedUsers } from '../lib/api'
import { sendFriendRequest } from '../../../backend/src/controllers/user.controller';
import { Link } from 'react-router';
import { UserIcon } from 'lucide-react';

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
        outgoingIds.add(req.id);
      })
      setOutGoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);



  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className='text-2xl sm:text:3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to = "/notifications" className='btn btn-outline btn-sm'>
            <UserIcon className='size-4 mr-2' />
            Friend Requests
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
