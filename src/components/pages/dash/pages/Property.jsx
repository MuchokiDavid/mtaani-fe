import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { addData, getAllData, updateData, deleteData, STORE_PROPERTIES } from "../../../database/db";
import storageUser from "../CurentUser";



// Add property to IndexedDB
const addProperty = async (property) => {
  addData(STORE_PROPERTIES, property)
};

// Update property in IndexedDB
const updateProperty = async (id, updatedProperty) => {
  updateData(STORE_PROPERTIES, id, updatedProperty)
};

// Delete property from IndexedDB
const deleteProperty = async (id) => {
  deleteData(STORE_PROPERTIES, id)
};

export default function Property() {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const currentUser = storageUser
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    isAvailable: true,
    owner: ""
  });


  // Load properties from IndexedDB on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getAllData(STORE_PROPERTIES)
      setProperties(data);
    };
    fetchProperties();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,      
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission (add/edit property)
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.owner = currentUser
    if (currentProperty) {
      // Edit existing property
      await updateProperty(currentProperty.id, formData);
    } else {
      // Add new property
      await addProperty(formData);
    }
    // Refresh the list
    const data = await getAllData(STORE_PROPERTIES);
    setProperties(data);
    setIsModalOpen(false);
    setFormData({ name: "", location: "", description: "", isAvailable: true });
    setCurrentProperty(null);
  };

  // Handle delete property
  const handleDelete = async (id) => {
    await deleteProperty(id);
    // Refresh the list
    const data = await getAllData(STORE_PROPERTIES);
    setProperties(data);
  };

  // Open modal for adding/editing property
  const openModal = (property = null) => {
    setCurrentProperty(property);
    if (property) {
      setFormData(property);
    } else {
      setFormData({ name: "", location: "", description: "", isAvailable: true });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
          >
            <Plus size={18} />
            Add Property
          </button>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {property.name}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Location: {property.location}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Description: {property.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          property.isAvailable ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {property.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(property)}
                      className="text-blue-600 hover:text-blue-700 transition-all duration-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No properties found.</p>
          )}
        </div>

        {/* Modal for Add/Edit Property */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {currentProperty ? "Edit Property" : "Add Property"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
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
                    Availability
                  </label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Available</span>
                  </div>
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
                    {currentProperty ? "Save Changes" : "Add Property"}
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



// import { useState } from "react";
// import { Plus, Edit, Trash } from "lucide-react";

// export default function Property() {
//   // Mock properties data
//   const [properties, setProperties] = useState([
//     {
//       id: 1,
//       name: "Sunset Apartments",
//       location: "123 Beach Road, Miami",
//       description: "Luxury apartments with ocean views.",
//       isAvailable: true,
//     },
//     {
//       id: 2,
//       name: "Ocean View Villas",
//       location: "456 Coastal Drive, Miami",
//       description: "Spacious villas with private pools.",
//       isAvailable: false,
//     },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentProperty, setCurrentProperty] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     location: "",
//     description: "",
//     isAvailable: true,
//   });

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle form submission (add/edit property)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (currentProperty) {
//       // Edit existing property
//       const updatedProperties = properties.map((property) =>
//         property.id === currentProperty.id ? { ...property, ...formData } : property
//       );
//       setProperties(updatedProperties);
//     } else {
//       // Add new property
//       const newProperty = { id: Date.now(), ...formData };
//       setProperties([...properties, newProperty]);
//     }
//     setIsModalOpen(false);
//     setFormData({ name: "", location: "", description: "", isAvailable: true });
//     setCurrentProperty(null);
//   };

//   // Handle delete property
//   const handleDelete = (id) => {
//     const updatedProperties = properties.filter((property) => property.id !== id);
//     setProperties(updatedProperties);
//   };

//   // Open modal for adding/editing property
//   const openModal = (property = null) => {
//     setCurrentProperty(property);
//     if (property) {
//       setFormData(property);
//     } else {
//       setFormData({ name: "", location: "", description: "", isAvailable: true });
//     }
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
//           <button
//             onClick={() => openModal()}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
//           >
//             <Plus size={18} />
//             Add Property
//           </button>
//         </div>

//         {/* Properties List */}
//         <div className="space-y-4">
//           {properties.length > 0 ? (
//             properties.map((property) => (
//               <div
//                 key={property.id}
//                 className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-800">
//                       {property.name}
//                     </h3>
//                     <p className="text-gray-600 mt-2">
//                       Location: {property.location}
//                     </p>
//                     <p className="text-gray-600 mt-2">
//                       Description: {property.description}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-2">
//                       Status:{" "}
//                       <span
//                         className={`font-semibold ${
//                           property.isAvailable ? "text-green-600" : "text-red-600"
//                         }`}
//                       >
//                         {property.isAvailable ? "Available" : "Unavailable"}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => openModal(property)}
//                       className="text-blue-600 hover:text-blue-700 transition-all duration-300"
//                     >
//                       <Edit size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(property.id)}
//                       className="text-red-600 hover:text-red-700 transition-all duration-300"
//                     >
//                       <Trash size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">No properties found.</p>
//           )}
//         </div>

//         {/* Modal for Add/Edit Property */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 {currentProperty ? "Edit Property" : "Add Property"}
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Description
//                   </label>
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
//                   <label className="block text-sm font-medium text-gray-700">
//                     Availability
//                   </label>
//                   <div className="flex items-center mt-2">
//                     <input
//                       type="checkbox"
//                       name="isAvailable"
//                       checked={formData.isAvailable}
//                       onChange={handleChange}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-gray-700">Available</span>
//                   </div>
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
//                     {currentProperty ? "Save Changes" : "Add Property"}
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