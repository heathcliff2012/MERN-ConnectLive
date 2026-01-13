import User from '../models/user.model.js';
import FriendRequest from '../models/FriendRequest.js';

export async function getRecomendedUsers(req, res) {

    try{
        const currentUSerId = req.user._id;
        const currentUser = req.user;

        const recomendedUsers = await User.find({
            $and:[
                {_id: { $ne: currentUSerId }},
                {_id: { $nin: currentUser.friends }},
                {_id:{$nin: currentUser.blocked}},
                {isOnboarded: true}
            ]
        })
        res.status(200).json(recomendedUsers);
    }catch(error){
        console.error("Get recomended users error:", error);
        res.status(500).json({ message: "Server error while fetching recomended users." });
    }
}

export async function getMyFriends(req, res) {

    try{
        const user = await User.findById(req.user._id)
        .populate('friends','fullName', 'profilePic');

        res.status(200).json(user.friends);
    }catch(error){
        console.error("Get my friends error:", error);
        res.status(500).json({ message: "Server error while fetching friends." });
    }
}

export async function sendFriendRequest(req, res) {
    try{
        const myId = req.user._id;
        const {id: recipientId} = req.params;

        if(myId.toString() === recipientId){
            return  res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient user not found." });
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        if(recipient.friendRequests.includes(myId)){
            return res.status(400).json({ message: "Friend request already sent to this user." });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        })

        if(existingRequest){
            return res.status(400).json({ message: "A friend request already exists between you and this user." });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);
    }catch(error){
        console.error("Send friend request error:", error);
        res.status(500).json({ message: "Server error while sending friend request." });
    }
}

export async function acceptFriendRequest(req, res) {

    try{
        const {id: requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({ message: "Friend request not found." });
        }

        if(friendRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted." });
    }catch(error){
        console.error("Accept friend request error:", error);
        res.status(500).json({ message: "Server error while accepting friend request." });
    }
}

export async function getFriendRequest(req, res) {
    try{
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: 'pending'
        }).populate('sender', 'fullName profilePic');

        const acceptReqs = await FriendRequest.find({
            sender: req.user._id,
            status: 'pending'
        }).populate('recipient', 'fullName profilePic');

        res.status(200).json({ incomingRequests, acceptReqs });
    }catch(error){
        console.error("Get friend requests error:", error);
        res.status(500).json({ message: "Server error while fetching friend requests." });
    }
}

export async function getOutgoingFriendRequest(req, res) {
    try{
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: 'pending'
        }).populate('recipient', 'fullName profilePic');

        res.status(200).json(outgoingRequests);
    }catch(error){
        console.error("Get outgoing friend requests error:", error);
        res.status(500).json({ message: "Server error while fetching outgoing friend requests." });
    }
}
