import {axiosInstance } from "./axios"

export const signup = async (signUpData) => {
      const response = await axiosInstance.post("/auth/signup", signUpData);
      return response.data;
    };

export const login = async (loginData) => {
      const response = await axiosInstance.post("/auth/login", loginData);
      return response.data;
    };

export const logout = async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    };

export const getAuthUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch(error){
        console.error("Error fetching auth user:", error);
        return null;
      }
    }

export const completeOnboarding = async (onboardingData) => {
      const response = await axiosInstance.post("/auth/onboarding", onboardingData);
      console.log("Onboarding response:", response.data);
      return response.data;
    };

export const getUserFriends = async () => {
      const response = await axiosInstance.get("/users/friends");
      return response.data;
    };

export const getRecomendedUsers = async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    };

export const getOutgoingFriendReqs = async () => {
      const response = await axiosInstance.get("/users/outgoing-friend-request");
      return response.data;
    };

export const getSearchUsers = async (query) => {
    try {
      const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
}

export const sendFriendRequest = async (userId) => {
    try {
      const response = await axiosInstance.post(`/users/friend-request/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }  
}

export const getFriendRequests = async () => {
    try {
      const response = await axiosInstance.get("/users/friend-request");
      return response.data;
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      throw error;
    }
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function declineFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/decline`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function getUserProfile() {
  try {
    const response = await axiosInstance.get("/users/user-profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function addPost(postData) {
  try {
    const response = await axiosInstance.post("/users/user-profile/add-post", postData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("Post added successfully:", postData);
    return response.data;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
}

export async function likePost(postId) {
  try {
    const response = await axiosInstance.post(`/users/user-profile/like-post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

export async function addComment({postId, text}) {
  try {
    const response = await axiosInstance.post(`/users/user-profile/comment/${postId}`, { text });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function getComments(postId) {
  try {
    const response = await axiosInstance.get(`/users/user-profile/comment/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export const addLikeToComment = async ({ postId, commentId }) => {
    const response = await axiosInstance.post(`/users/user-profile/comment/${postId}/${commentId}`);
    return response.data;
};

export async function getFriendPosts() {
  try {
      const response = await axiosInstance.get("/posts/friend-posts");
      return response.data;
  } catch (error) {
      console.error("Error fetching friend posts:", error);
      throw error;
  }
}

export async function getUserProfileData(userId) {
  try {
      const response = await axiosInstance.get(`/posts/user-profile-posts/${userId}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching user profile posts:", error);
      throw error;
  }
}

export const getExplorePosts = async ({ pageParam = null }) => {
    const response = await axiosInstance.get('/posts/explore-posts', {
        params: { 
            limit: 5, 
            cursor: pageParam 
        }
    });
    return response.data;
};

export const verifyEmail = async (code) => {
    const response = await axiosInstance.post(`/auth/verify-email`, { verificationCode: code });
    return response.data;
};

export const resendVerificationEmail = async () => {
    const response = await axiosInstance.post("/auth/resend-verification-email");
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async ({ token, password }) => { 
  try {
    const response = await axiosInstance.post(
      `/auth/reset-password/${token}`, 
      { password } 
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
    try {
        const response = await axiosInstance.post(`/posts/delete-post/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
};

export const deleteComment = async ({postId, commentId}) => {
    try {
        const response = await axiosInstance.post(`/posts/delete-comment/${postId}/${commentId}`);
        console.log("Delete comment response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};