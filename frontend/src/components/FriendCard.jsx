import { MapPinIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const FriendCard = ({ friend }) => {
  return (
    <div className='bg-base-200 hover:shadow-md transition-shadow rounded-xl'>
      <div className="card-body p-4">
        {/*USer info*/}
        <div className="hover:underline cursor-pointer">
          <Link to = {`/user-profile/${friend._id}`} className='items-center gap-3 mb-4 flex'>
            <div className="avatar size-12">
                <img src={friend.profilePic} alt="Profile picture" className='rounded-full border'/>
            </div>
            <div className="flex-1">
              <h3 className='font-semibold truncate'>{friend.fullName}</h3>
              {friend.location && (
              <div className="flex items-center text-sm opacity-70 mt-1">
            <MapPinIcon className='size-4 mr-1' />
            <span>{friend.location}</span>
          </div>
          )}
            </div>
          </Link>
          

        </div>
        <Link to = {`/chat/${friend._id}`} className='btn btn-outline w-full'>
            Message
        </Link>
      </div>
    </div>
  )
}

export default FriendCard
