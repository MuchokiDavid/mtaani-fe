import { useState, useEffect, use } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import {
  addData,
  getAllData,
  deleteData,
  updateData,
  getDataById,
  STORE_ROOMS,
  STORE_PROPERTIES,
  STORE_USERS,
} from "../../../database/db";

// Add room to IndexedDB
const addRoom = async (room) => {
  await addData(STORE_ROOMS, room);
};

// Get all rooms from IndexedDB
const getAllRooms = async () => {
  const db = await initDB();
  const tx = db.transaction("rooms", "readonly");
  const store = tx.objectStore("rooms");
  return store.getAll();
};

// Update room in IndexedDB
const updateRoom = async (id, updatedRoom) => {
  await updateData(STORE_ROOMS, id, updatedRoom);
};

// Delete room from IndexedDB
const deleteRoom = async (id) => {
  await deleteData(STORE_ROOMS, id);
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    property: "",
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    status: "Vacant",
  });
  const [property, setProperty] = useState({});

  // Load rooms from IndexedDB on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getAllData(STORE_ROOMS);
      setRooms(data);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getAllData(STORE_PROPERTIES);
      setProperties(data);
    };
    fetchProperties();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add/edit room)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentRoom) {
      // Edit existing room
      const updated_room= await updateRoom(currentRoom.id, formData);
      if (updated_room) {
        const userObject = {
          userName: formData.tenantName,
          email: formData.tenantEmail,
          phone: formData.tenantPhone,
          role: "tenant",
          password: "000000",
        };
        await addData(STORE_USERS, userObject);
      }
      
    } else {
      // Add new room
      if (formData.tenantEmail) {
        const userObject = {
          userName: formData.tenantName,
          email: formData.tenantEmail,
          phone: formData.tenantPhone,
          role: "tenant",
          password: "000000",
        };
        await addData(STORE_USERS, userObject);
      }
      await addRoom(formData);
    }
    console.log(formData);
    // Refresh the list
    const data = await getAllData(STORE_ROOMS);
    setRooms(data);
    setIsModalOpen(false);
    setFormData({ roomNumber: "", property: "", status: "Vacant" });
    setCurrentRoom(null);
  };

  // Handle delete room
  const handleDelete = async (id) => {
    await deleteRoom(id);
    // Refresh the list
    const data = await getAllData(STORE_ROOMS);
    setRooms(data);
  };

  // Get data by id
  const handleDataById = async (id) => {
    const data = await getDataById(STORE_PROPERTIES, id);
    setProperty(data);
    // console.log(data);
    return data;
  };
  // console.log(property)

  // Open modal for adding/editing room
  const openModal = (room = null) => {
    setCurrentRoom(room);
    if (room) {
      setFormData(room);
    } else {
      setFormData({
        roomNumber: "",
        property: "",
        tenant: "",
        status: "Vacant",
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
          >
            <Plus size={18} />
            Add Room
          </button>
        </div>

        {/* Rooms List */}
        <div className="space-y-4">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Property: {room.property}
                    </p>
                    <p className="text-gray-600 mt-2">
                      Tenant: {room.tenantName}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          room.tenantEmail === ""
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {room.tenantEmal == "" ? "Vacant" : "Occupied"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(room)}
                      className="text-blue-600 hover:text-blue-700 transition-all duration-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No rooms found.</p>
          )}
        </div>

        {/* Modal for Add/Edit Room */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 shadow-lg min-w-4xl">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {currentRoom ? "Edit Room" : "Add Room"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-2">
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Room Number
                      </label>
                      <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
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
                        Tenant Name
                      </label>
                      <input
                        type="text"
                        name="tenantName"
                        value={formData.tenantName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tenant Email
                      </label>
                      <input
                        type="email"
                        name="tenantEmail"
                        value={formData.tenantEmail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tenant Phone
                    </label>
                    <input
                      type="text"
                      name="tenantPhone"
                      value={formData.tenantPhone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Vacant">Vacant</option>
                        <option value="Occupied">Occupied</option>
                      </select>
                    </div>
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
                    {currentRoom ? "Save Changes" : "Add Room"}
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
