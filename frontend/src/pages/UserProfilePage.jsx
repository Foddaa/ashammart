import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { UserContext } from "@/context/AuthContext";

const ProfileInfoPage = () => {
  const { Token } = useContext(UserContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!Token) {
      navigate("/login");
      return;t
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
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
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
      };
      const res = await api.put("/api/client/updateClient", updatedProfile);
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 p-8 text-center text-neutral-400 text-sm tracking-wider">
        Loading profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white border border-neutral-200 p-8 text-center text-red-500 text-sm">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-none p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
        <h1 className="text-xl font-light tracking-wide text-neutral-900">
          Profile Info
        </h1>
        <button
          onClick={handleEditToggle}
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

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
    </div>
  );
};

export default ProfileInfoPage;