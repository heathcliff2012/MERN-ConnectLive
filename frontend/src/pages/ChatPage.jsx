import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import CallButton from '../components/CallButton.jsx';  

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { getStreamToken } from '../lib/api';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {

  const {id:targetUserId} = useParams();

  const [chatClient, setChatClient] = React.useState(null);
  const [channel, setChannel] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const {authUser} = useAuthUser();

  const {data:tokenData} = useQuery({
    queryKey:['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

   useEffect(() => {

    if (!authUser || !tokenData?.token) return;

    const initChat = async () => {
      try{
        console.log("Initializing chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join('-');

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);

      }catch(error){
        console.error("Error initializing chat client:", error);
        toast.error("Failed to load chat. Please try again later.");
      }finally{
        setIsLoading(false);
      }
  };

  initChat();
},[tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      toast.success("Video call invitation sent!");
      channel.sendMessage({
        text: `📞 Video Call Invitation: Join me for a video call! Click here: ${callUrl}`,
      });
    }
  }

  const getCallUrl = () => {
    const callUrl = `${window.location.origin}/call/${channel.id}`;
    return callUrl;
  }

  if(isLoading || !chatClient || !channel){
    return (
      <ChatLoader />
    )
  }


  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <Link to={getCallUrl()}>
              <CallButton handleVideoCall={handleVideoCall} />
            </Link>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
