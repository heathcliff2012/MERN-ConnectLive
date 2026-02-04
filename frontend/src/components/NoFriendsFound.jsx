import React from 'react'

const NoFriendsFound = ({title, body}) => {
  return (
    <div className='card bg-base-200 p-6 text-center'>
      <h3 className='font-semibold text-lg mb-2'>{title}</h3>
        <p className='text-base-content opacity-70'>{body}</p>
    </div>
  );
};

export default NoFriendsFound
