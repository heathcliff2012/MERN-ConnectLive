import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router';
import React, { useState } from 'react'
import { addComment, addLikeToComment, getComments, likePost } from '../lib/api';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';

const Posts = ({ post, userProfile }) => {

    const query = useQueryClient();
    const currentUser = useAuthUser();

    // 1. We keep the state to control the "Open/Close" logic
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [text, setCommentData] = useState('');

    const {data: commentsData, isLoading: commentsLoading} = useQuery({
        queryKey: ['comments', post._id],
        queryFn: () => getComments(post._id),
        enabled: commentsOpen, // Fetch only when opened
    });

    const {mutate: addCommentMutate } = useMutation({
        mutationFn: addComment,
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['posts'] });
            query.invalidateQueries({ queryKey: ['comments', post._id, ] });
            toast.success('Comment added successfully');
            setCommentData(''); // Clear input on success
        },
    });

    const {mutate: likeCommentMutate } = useMutation({
        mutationFn: addLikeToComment,
        onSuccess: () => {
          query.invalidateQueries({ queryKey: ['comments', post._id] });
        },
      });

    const {mutate: likePostMutate } = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
      query.invalidateQueries({ queryKey: ['userProfileData']});
      query.invalidateQueries({ queryKey: ['profile']});
      query.invalidateQueries({ queryKey: ['userProfile']});
      query.invalidateQueries({ queryKey: ['explorePosts']});
      query.invalidateQueries({ queryKey: ['friendsPosts']});
    },
  });

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        addCommentMutate({postId: post._id, text: text});
    }


    return (
        <div 
            key={post._id} 
            // 👇 CHANGE 1: Dynamic Max-Width and Flex Direction
            // - duration-500: Smoothly animates the card growing wider
            // - md:flex-row: Side-by-side on desktop
            // - max-w-lg vs max-w-4xl: The card gets wider when comments are open
            className={`
                card bg-base-200 shadow-sm mx-auto mb-6 transition-all duration-500 ease-in-out
                flex flex-col md:flex-row overflow-hidden
                w-full ${commentsOpen ? 'md:max-w-5xl' : 'max-w-lg'}
            `}
        >
            {/* --- LEFT SIDE: POST CONTENT --- */}
            {/* On desktop, this takes full width if comments closed, or shrinks/stays fixed if open */}
            <div className="flex-shrink-0 w-full md:w-auto md:min-w-[30rem] md:flex-1">
                <div className="card-body p-4 h-full">
                    {/* Header */}
                    <Link to={`/user-profile/${userProfile._id}`} className="hover:underline cursor-pointer">
                        <div className="flex items-center mb-4">
                            <div className="avatar size-8 rounded-full mr-3">
                                <img src={userProfile.profilePic || "/avatar-placeholder.png"} className="rounded-full border"/>
                            </div>
                            <span className="font-bold">{userProfile.fullName}</span>
                        </div>
                    </Link>

                    {/* Content */}
                    <div>
                        <h2 className="card-title text-lg">{post?.text}</h2>
                        <p className="text-sm">{post?.body}</p>
                    </div>
                    
                    {/* Image */}
                    {post?.image && (
                    <figure className="mt-2">
                        <img
                            src={post?.image}
                            alt="Post image" 
                            className="rounded-xl w-full object-cover max-h-96" 
                        />    
                    </figure>
                    )}

                    {/* Actions */}
                    <div className="flex flex-row relative gap-4 mt-auto align-bottom">
                        <div className="cursor-pointer active:scale-105 flex items-center" onClick={() => likePostMutate(post._id)}>
                            <Heart className={`size-5 ${post?.likes?.includes(currentUser?.authUser?._id) ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-500'}`}/>
                            <span className="ml-1 text-sm opacity-70">{post?.likes?.length}</span>
                        </div>
                        <div className="cursor-pointer active:scale-105 flex items-center" onClick={() => setCommentsOpen(!commentsOpen)}>
                            <MessageCircle className={`size-5 hover:text-blue-500 ${commentsOpen ? 'text-blue-500 fill-blue-500' : 'text-gray-500'}`}/>
                            <span className="ml-1 text-sm opacity-70">{commentsData?.length}</span>
                        </div>
                    </div>      
                    <div className="mt-2 text-xs opacity-50">Posted on: {new Date(post?.createdAt).toLocaleDateString()}</div>
                </div>

            </div>

            {/* --- RIGHT SIDE: COMMENT SECTION --- */}
            {/* - We removed {comments && ...} so the div isLikedPost always there (for animation).
                - MOBILE: Animates Height (max-h-0 -> max-h-screen)
                - DESKTOP: Animates Width (max-w-0 -> max-w-sm)
            */}
            <div className={`
                transition-all duration-500 ease-in-out bg-base-200 md:border-l border-t border-base-300
                ${commentsOpen 
                    ? 'max-h-[500px] opacity-100 md:max-w-sm md:w-96' // OPEN STATE
                    : 'max-h-0 opacity-0 md:max-w-0 md:w-0 overflow-hidden' // CLOSED STATE
                }
            `}>
                <div className="h-full flex flex-col w-full md:w-96"> {/* Fixed width inner container prevents text squashing during anim */}
                    
                    {/* Header */}
                    <div className="p-3 bg-base-200 shadow-sm z-10">
                        <h3 className="text-sm font-semibold">Comments ({commentsData?.length || 0})</h3>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {commentsLoading && (
                            <div className="flex justify-center py-4">
                                <span className='loading loading-spinner loading-md'/>
                            </div>
                        )}
                        
                        {!commentsLoading && commentsData?.length === 0 && (
                            <div className="text-center text-sm opacity-50 py-4">No comments yet.</div>
                        )}

                        {!commentsLoading && commentsData?.map((comment) => (
                            <div key={comment._id} className="p-3 bg-base-100 rounded-lg text-sm">
                                <div className="flex items-center mb-1">
                                    <div className="avatar size-6 rounded-full mr-2">
                                         <img src={comment.user.profilePic || "/avatar-placeholder.png"} className="rounded-full"/>
                                    </div>
                                    <span className="font-bold text-xs">{comment.user.fullName}</span>
                                </div>
                                <p className=" break-words">{comment.text}</p>
                                <div className="flex items-center gap-2 mt-2 cursor-pointer" onClick={() => likeCommentMutate({postId: post._id, commentId: comment._id})}> 
                                    <Heart className={`size-3 inline-block mr-1 ${comment.likes?.includes(currentUser?.authUser?._id) > 0 ? 'fill-red-500 text-red-500' : 'text-gray-300'} `}/>
                                    <span className="text-xs opacity-70 mr-3" >{comment.likes?.length || 0}</span>
                                    <div className="text-xs opacity-70 justify-start" >{new Date(comment.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area (Pinned to bottom) */}
                    <div className="p-3 border-t border-base-300 bg-base-100">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={text}
                                placeholder="Write a comment..."
                                className="input input-sm input-bordered w-full"
                                onChange={(e) => setCommentData(e.target.value)}
                            />
                            <button onClick={handleAddComment} disabled={!text.trim()}>
                                <Send className={`size-5 ${text.trim() ? 'text-blue-500 cursor-pointer' : 'text-gray-300'}`}/>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Posts