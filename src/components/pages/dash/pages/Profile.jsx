import { useState } from "react";
import { updateData, STORE_USERS } from "../../../database/db";

export default function Profile() {
  // Mock user data (replace with API data later)

  const [storageUser, setStorageUser]= useState(JSON.parse(localStorage.getItem('user')))

  const [user, setUser] = useState({
    avatar: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", // Default avatar
    name: storageUser?.first_name,
    email: storageUser.email,
    password: "",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // TODO: Send updated data to API
    await updateData(STORE_USERS, storageUser.id, user)
    alert("Profile Updated Successfully!");
    setEditMode(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile</h2>

      {/* Avatar and User Info */}
      <div className="flex items-center gap-6">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-blue-100 hover:border-blue-200 transition-all duration-300"
        />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editMode && (
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}