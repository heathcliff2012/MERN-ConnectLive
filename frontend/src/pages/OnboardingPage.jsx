import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, Upload } from 'lucide-react';
import { MapPinIcon } from 'lucide-react';
import { ShipWheelIcon } from 'lucide-react';
import { LoaderIcon, ShuffleIcon } from 'lucide-react';

const OnboardingPage = () => {

  const {authUser} = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || generateRandomAvatar(), 
  });

  const {mutate: onboardingMutate, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully!");
      queryClient.invalidateQueries({queryKey: ['authUser']});
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.message || "Onboarding failed. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutate(formState);
  }
  const handleRefreshAvatar = () => {
    setFormState(prev => ({ ...prev, profilePic: generateRandomAvatar() }));
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const colors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${randomColor}`;
  };

   return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-3/4 max-w-3xl shadow-xl border border-primary/40">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden border">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* REFRESH BUTTON */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRefreshAvatar} className="btn btn-secondary">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
              {/* Image Upload */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRefreshAvatar} className="btn btn-secondary">
                  <Upload className="size-4 mr-2" />
                  Upload your Image
                </button>
              </div>
              </div>
              
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70 z-10" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            

            {/* SUBMIT BUTTON */}

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage
