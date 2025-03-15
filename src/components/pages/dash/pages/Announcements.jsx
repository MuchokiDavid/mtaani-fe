import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import {
  getAllData,
  updateData,
  addData,
  deleteData,
  STORE_ANNOUNCEMENTS,
  STORE_PROPERTIES,
} from "../../../database/db";
import storageUser from "../CurentUser";

// Delete announcement from IndexedDB
const deleteAnnouncement = async (id) => {
  await deleteData(STORE_ANNOUNCEMENTS, id);
};

export default function Announcement({ homeannouncements, homerooms }) {
  const [announcements, setAnnouncements] = useState(homeannouncements);
  const [properties, setProperty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    property: "",
    description: "",
    date: "",
  });
  const currentUser = storageUser;
  const navigate = useNavigate();

  const getRoom = () => {
    let room = homerooms.find(
      (room) => room.tenantEmail === currentUser["email"]
    );
    if (!room) {
      room = homerooms.find(
        (room) => room.tenantEmail === currentUser["email"]
      );
    }
    // console.log(room)
    return room;
  };

  // Get all property for a landlord
  const getProperties = async () => {
    const data = await getAllData(STORE_PROPERTIES);
    return data.filter(
      (property) => property['owner']['email'] === currentUser["email"]
    );
  };

  // Load IndexedDB on component mount
  useEffect(() => {
    const fetchProperty = async () => {
      const data = await getAllData(STORE_PROPERTIES);
      setProperty(data);
    };
    fetchProperty();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      let data = await getAllData(STORE_ANNOUNCEMENTS);
      let room = getRoom();
      if (currentUser.role === "tenant") {
        data = data.filter(
          (announcement) => announcement['property'] === room["property"]
        );
      } else {
        data = data.filter(
          async (announcement) =>{
            let allProperties= await getProperties()
            data= allProperties.find(
              (property) => property['name'] === announcement['property'])
          }
        );
      }
      console.log(data)
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add/edit announcement)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentAnnouncement) {
      // Edit existing announcement
      updateData(STORE_ANNOUNCEMENTS, currentAnnouncement.id, formData);
    } else {
      await addData(STORE_ANNOUNCEMENTS, formData);
    }
    // Refresh the list
    const data = await getAllData(STORE_ANNOUNCEMENTS);
    setAnnouncements(data);
    setIsModalOpen(false);
    setFormData({ title: "", description: "", date: "" });
    setCurrentAnnouncement(null);
  };

  const getRoomFromUser = (email = currentUser.email) => {};

  // Handle delete announcement
  const handleDelete = async (id) => {
    await deleteAnnouncement(id);
    // Refresh the list
    const data = await getAllData(STORE_ANNOUNCEMENTS);
    setAnnouncements(data);
  };

  // Open modal for adding/editing announcement
  const openModal = (announcement = null) => {
    setCurrentAnnouncement(announcement);
    if (announcement) {
      setFormData(announcement);
    } else {
      setFormData({ title: "", description: "", date: "" });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          {currentUser?.role === "tenant" ? (
            <p></p>
          ) : (
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
            >
              <Plus size={18} />
              Add Announcement
            </button>
          )}
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements && announcements.length > 0 ? (
            announcements &&
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {announcement.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Date: {announcement.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(announcement)}
                      className="text-blue-600 hover:text-blue-700 transition-all duration-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No announcements found.</p>
          )}
        </div>

        {/* Modal for Add/Edit Announcement */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 shadow-lg min-w-4xl">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {currentAnnouncement ? "Edit Announcement" : "Add Announcement"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property
                  </label>
                  <select
                    id="HeadlineAct"
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Please select</option>
                    {properties && properties.length > 0 ? (
                      properties.map((property) => (
                        <option key={property.id} value={property.name}>
                          {property.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No properties found</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    {currentAnnouncement ? "Save Changes" : "Add Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { Plus, Edit, Trash } from "lucide-react";

// export default function Announcement() {
//   // Mock announcements data
//   const [announcements, setAnnouncements] = useState([
//     {
//       id: 1,
//       title: "Maintenance Schedule",
//       description: "There will be a water supply interruption on October 15th from 9 AM to 5 PM.",
//       date: "2023-10-10",
//     },
//     {
//       id: 2,
//       title: "New Parking Rules",
//       description: "Starting November 1st, parking will be restricted to designated areas only.",
//       date: "2023-10-05",
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
//   const [formData, setFormData] = useState({ title: "", description: "", date: "" });

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission (add/edit announcement)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (currentAnnouncement) {
//       // Edit existing announcement
//       const updatedAnnouncements = announcements.map((ann) =>
//         ann.id === currentAnnouncement.id ? { ...ann, ...formData } : ann
//       );
//       setAnnouncements(updatedAnnouncements);
//     } else {
//       // Add new announcement
//       const newAnnouncement = { id: Date.now(), ...formData };
//       setAnnouncements([...announcements, newAnnouncement]);
//     }
//     setIsModalOpen(false);
//     setFormData({ title: "", description: "", date: "" });
//     setCurrentAnnouncement(null);
//   };

//   // Handle delete announcement
//   const handleDelete = (id) => {
//     const updatedAnnouncements = announcements.filter((ann) => ann.id !== id);
//     setAnnouncements(updatedAnnouncements);
//   };

//   // Open modal for adding/editing announcement
//   const openModal = (announcement = null) => {
//     setCurrentAnnouncement(announcement);
//     if (announcement) {
//       setFormData(announcement);
//     } else {
//       setFormData({ title: "", description: "", date: "" });
//     }
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
//           <button
//             onClick={() => openModal()}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
//           >
//             <Plus size={18} />
//             Add Announcement
//           </button>
//         </div>

//         {/* Announcements List */}
//         <div className="space-y-4">
//           {announcements.length > 0 ? (
//             announcements.map((announcement) => (
//               <div
//                 key={announcement.id}
//                 className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-800">{announcement.title}</h3>
//                     <p className="text-gray-600 mt-2">{announcement.description}</p>
//                     <p className="text-sm text-gray-500 mt-2">Date: {announcement.date}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => openModal(announcement)}
//                       className="text-blue-600 hover:text-blue-700 transition-all duration-300"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(announcement.id)}
//                       className="text-red-600 hover:text-red-700 transition-all duration-300"
//                     >
//                       <Trash size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No announcements found.</p>
//           )}
//         </div>

//         {/* Modal for Add/Edit Announcement */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 {currentAnnouncement ? "Edit Announcement" : "Add Announcement"}
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows="4"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
//                   >
//                     {currentAnnouncement ? "Save Changes" : "Add Announcement"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
