'use client'

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Image from "next/image";

type ProfileData = {
  gender: string;
  telegram_handle: string;
  phone_number: string;
};

export default function Profile() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    gender: "",
    telegram_handle: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data = await res.json();
        setProfile({
          gender: data.gender || "",
          telegram_handle: data.telegram_handle || "",
          phone_number: data.phone_number || "",
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [getToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="font-medium">Error loading profile:</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-800 dark:to-blue-700 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-gray-300 shadow-lg overflow-hidden">
                <Image
                  src={user?.imageUrl || "/default-profile.png"}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
                <p className="text-purple-100 dark:text-purple-200 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Personal Info */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-600">
                  Personal Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        required
                        className="h-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone_number}
                        onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                        className="h-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="9123 1234"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telegram Handle (optional)
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center h-10 px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        value={profile.telegram_handle}
                        onChange={(e) => setProfile({ ...profile, telegram_handle: e.target.value })}
                        className="h-10 flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full md:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : "Update Profile"}
                    </button>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-600">
                  Account Stats
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-2 border-b border-gray-200 dark:border-gray-600">
                  Verification
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email Verified</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
