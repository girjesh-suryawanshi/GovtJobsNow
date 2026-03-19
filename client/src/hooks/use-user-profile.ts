import { useState, useEffect } from "react";

export interface UserProfile {
  dob: string;
  qualification: string;
  category: "General" | "OBC" | "SC" | "ST" | "EWS";
  gender: "Male" | "Female" | "Other";
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem("govt_jobs_user_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("govt_jobs_user_profile", JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem("govt_jobs_user_profile");
  };

  return { profile, saveProfile, clearProfile, isLoading };
}
