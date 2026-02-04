import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, {useEffect, useMemo} from 'react'
import { getFriendPosts, getExplorePosts } from '../lib/api'
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard from '../components/FriendCard.jsx';
import NoFriendsFound from '../components/NoFriendsFound.jsx';
import Posts from '../components/Posts.jsx';
import { useInView } from 'react-intersection-observer';

const HomePage = () => {

  const { ref, inView } = useInView();

  const {data: friendPosts =[], isLoading: isLoadingFriendPosts} = useQuery({
    queryKey: ['friendPosts'],
    queryFn: getFriendPosts
  });

  const {
    data,              // Contains 'pages' array
    isLoading,         // True only for the very first load
    isFetchingNextPage,// True when loading more pages
    fetchNextPage,     // Function to trigger the next load
    hasNextPage,       // Boolean: Is there more data to load?
  } = useInfiniteQuery({
    queryKey: ['explorePosts'],
    queryFn: getExplorePosts, // This now calls api.js with { pageParam }
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      // The backend returns { posts: [...], nextCursor: "date-string" }
      // If nextCursor is missing/null, return undefined to stop.
      return lastPage.nextCursor || undefined; 
    },
  });

  const allExplorePosts = data?.pages?.flatMap(page => {
      if (!page) return [];
      return Array.isArray(page) ? page : page.posts || [];
  }) || [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className='min-h-screen w-full flex flex-col bg-base-100'>
        <section className="container mx-auto p-4 mt-6 justify-center w-full">
            <h2 className="text-2xl font-bold mb-4">Recent Friend Posts</h2>
            {isLoadingFriendPosts ? (
              <div className="flex justify-center py-12">
                <span className='loading loading-spinner loading-lg'/>
              </div>
            ) : friendPosts.length === 0 ? (
              <NoFriendsFound title="No Recent posts from friends yet." body = "Start connecting with friends to see their posts here!" />
            ) : (
              friendPosts.map((post) => (
                <div key={post._id} className="mb-6 p-4 bg-base-100 rounded-lg shadow">
                  <Posts post={post} userProfile={post.user} />
                </div>
              ))
            )}
        </section>

        {/* --- EXPLORE POSTS --- */}
      <section className="container mx-auto p-4 mt-6 justify-center w-full">
        <h2 className="text-2xl font-bold mb-4">Explore Posts</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ) : (
          <>
            {/* 👇 Render using our safe 'allExplorePosts' variable */}
            {allExplorePosts.map((post) => (
               <div key={post._id} className="mb-6 p-4 bg-base-100 rounded-lg shadow">
                 <Posts post={post} userProfile={post.user} />
               </div>
            ))}

            {/* Empty State Check */}
            {allExplorePosts.length === 0 && (
               <NoFriendsFound title="No posts to explore." body="Check back later!" />
            )}
          </>
        )}

        {/* --- SCROLL TRIGGER --- */}
        <div ref={ref} className="flex justify-center py-8">
            {isFetchingNextPage && <span className='loading loading-spinner loading-md'/>}
            
            {/* "No more posts" message */}
            {!hasNextPage && allExplorePosts.length > 0 && (
                <span className="text-sm opacity-50">No more posts to load</span>
            )}
        </div>

      </section>
    </div>
  );
};

export default HomePage;