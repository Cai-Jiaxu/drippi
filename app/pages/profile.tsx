'use client'

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

type ProfileData = {
  gender: string;
  telegram_handle: string;
  phone_number: string;
};

export default function Profile() {
  const { user } = useUser(); // Google-auth data from Clerk
  const { getToken } = useAuth(); // JWT for API calls

  const [profile, setProfile] = useState<ProfileData>({
    gender: "",
    telegram_handle: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  // Load profile data from your Django backend
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Google-auth user data */}
      <div className="mb-6">
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Telegram Handle</label>
          <input
            type="text"
            value={profile.telegram_handle}
            onChange={(e) =>
              setProfile({ ...profile, telegram_handle: e.target.value })
            }
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone Number (optional)</label>
          <input
            type="tel"
            value={profile.phone_number}
            onChange={(e) =>
              setProfile({ ...profile, phone_number: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
