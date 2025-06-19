// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// You might need to create this action if you want to update Redux state
// import { setUser } from '../redux/slices/authSlice';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const apiBaseUrl = "http://localhost:8000";
  const apiConfig = { headers: { token: `${localStorage.getItem("token")}` } };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, username: user.user.username }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
  
    setFormData((prev) => ({
      ...prev,
      username: user.user.username,
      password: "",
      confirmPassword: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    
    const updatePayload = { username: formData.username };
    if (formData.password) {
      updatePayload.password = formData.password;
    }

    try {
      const { data } = await axios.put(
        `${apiBaseUrl}/users/profile`,
        updatePayload,
        apiConfig
      );

      // Update localStorage to keep user info consistent across the app
      const updatedUser = { ...user, user: data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Optional: If using Redux, dispatch an action to update the state
      // dispatch(setUser(updatedUser));

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 bg-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-green-400 font-medium";
  const buttonClasses =
    "border-2 border-black w-full px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:bg-zinc-400 disabled:shadow-none disabled:cursor-not-allowed";

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-amber-50 min-h-screen pt-24 pb-24 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white border-4 border-black p-8 shadow-[10px_10px_0px_#000]">
        <h1 className="text-3xl font-black text-black mb-6">My Profile</h1>

        {error && (
          <div className="bg-red-400 border-2 border-black text-black font-bold p-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-400 border-2 border-black text-black font-bold p-3 mb-4">
            {success}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div className="font-medium">
              <p className="text-sm text-zinc-600">Username</p>
              <p className="text-xl font-bold">{user.user.username}</p>
            </div>
            <div className="font-medium">
              <p className="text-sm text-zinc-600">Email</p>
              <p className="text-xl font-bold">{user.user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className={`${buttonClasses} bg-green-400 hover:bg-green-500 mt-6`}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-bold text-sm block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="font-bold text-sm block mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="font-bold text-sm block mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Leave blank to keep current"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className={`${buttonClasses} bg-zinc-300 hover:bg-zinc-400 w-1/3`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${buttonClasses} bg-blue-400 hover:bg-blue-500 w-2/3`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
