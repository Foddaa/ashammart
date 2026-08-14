import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import api from "@/api/axiosInstance";

import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfilePage = () => {
  const { Token, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    addressId: "",
  });

  useEffect(() => {
    if (!Token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/client/getProfile");

        const user = res.data;
        setProfile(user);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          city: user.address?.city || "",
          address: user.address?.description || "",
          addressId: user.address?.id || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [Token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel – reset to original profile data
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.address?.city || "",
        address: profile.address?.description || "",
        addressId: profile.address?.id || "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        ...profile,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          id: parseInt(formData.addressId) || 0,
          city: formData.city,
          description: formData.address,
        },
      };

      const res = await axios.put(`${BASE_URL}/api/client/updateClient`, updatedProfile, {
        headers: { Authorization: `Bearer ${Token}` },
      });

      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-neutral-400 text-sm tracking-wider">
        Loading profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500 text-sm">
        Failed to load profile data.
      </div>
    );
  }

  const cities = [
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Sharqia", "Monufia",
    "Qalyubia", "Gharbia", "Kafr El Sheikh", "Beheira", "Faiyum", "Beni Suef",
    "Minya", "Asyut", "Sohag", "Qena", "Luxor", "Aswan", "Damietta",
    "Port Said", "Ismailia", "Suez", "North Sinai", "South Sinai", "New Valley",
    "Matrouh", "Red Sea"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white border border-neutral-200 rounded-none p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
          <h1 className="text-xl font-light tracking-wide text-neutral-900">
            My Profile
          </h1>
          <button
            onClick={handleEditToggle}
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
              />
            ) : (
              <p className="text-sm text-neutral-800">{profile.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
              />
            ) : (
              <p className="text-sm text-neutral-800">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm"
              />
            ) : (
              <p className="text-sm text-neutral-800">{profile.phone}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              City
            </label>
            {isEditing ? (
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm bg-white appearance-none"
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-neutral-800">{formData.city || "Not set"}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Detailed Address
            </label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm resize-none"
              />
            ) : (
              <p className="text-sm text-neutral-800">{formData.address || "Not set"}</p>
            )}
          </div>

          {/* Save Button (only when editing) */}
          {isEditing && (
            <div className="pt-4 border-t border-neutral-200">
              <button
                onClick={handleSave}
                className="w-full py-2 bg-neutral-900 text-white text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Logout Button - always visible when not editing */}
        {!isEditing && (
          <div className="pt-6 mt-6 border-t border-neutral-200">
            <button
              onClick={handleLogout}
              className="w-full py-2 border border-neutral-300 text-neutral-600 text-sm uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;