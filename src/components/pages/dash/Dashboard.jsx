import { Route, Routes, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Home from "./pages/DashboardHome";
import Announcements from "./pages/Announcements";
import Rooms from "./pages/Rooms";
import Property from "./pages/Property";
import Maintenance from "./pages/Maintenance";
import Profile from "./pages/Profile";
import storageUser from "./CurentUser";
import {
  getAllData,
  STORE_MAINTENANCE,
  STORE_ANNOUNCEMENTS,
  STORE_BOOKINGS,
  STORE_PROPERTIES,
  STORE_ROOMS,
  STORE_USERS,
} from "../../database/db";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const storageUser = JSON.parse(localStorage.getItem("user"));
  // Define all navigation links
  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/property", label: "Property" },
    { to: "/dashboard/rooms", label: "Rooms" },
    { to: "/dashboard/maintenance", label: "Maintenance" },
    { to: "/dashboard/announcements", label: "Announcements" },
    { to: "/dashboard/profile", label: "Profile" },
  ];

  // Filter out Rooms and Property links if the user is a Tenant
  const filteredNavLinks =
    storageUser && storageUser.role === "tenant"
      ? navLinks.filter(
          (link) => link.label !== "Rooms" && link.label !== "Property"
        )
      : navLinks;

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 md:w-64 bg-gray-900 text-white transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Property Pro
      </div>
      <nav className="mt-4">
        {filteredNavLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-2 px-4 ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const currentUser = storageUser;
  const [announcements, setAnnouncements] = useState([]);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await getAllData(STORE_ANNOUNCEMENTS);
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getAllData(STORE_ROOMS);
      setRooms(data);
    };
    fetchRooms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content - Push right when sidebar is visible */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 
      ${sidebarOpen ? "ml-64" : "md:ml-64 ml-0"}`}
      >
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <button onClick={toggleSidebar} className="md:hidden">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-bold">Dashboard</h1>

          {/* Add logout button at the end */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        </header>

        <main className="p-4 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            {currentUser?.role !== "tenant" && (
              <>
                <Route path="property" element={<Property />} />
                <Route path="rooms" element={<Rooms />} />
              </>
            )}
            <Route
              path="announcements"
              element={
                <Announcements
                  homeannouncements={announcements}
                  homerooms={rooms}
                />
              }
            />
            {/* Conditionally render Rooms and Property routes */}
            {/* <Route path="rooms" element={<Rooms />} />
            <Route path="property" element={<Property />} /> */}
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
