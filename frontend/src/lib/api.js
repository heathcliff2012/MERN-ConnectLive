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

export const sendFriendRequest = async (userId) => {
      const response = await axiosInstance.post(`/users/friend-request/${userId}`);
      return response.data;
    }