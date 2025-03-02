import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";

export default function Rooms() {
  // Mock rooms data
  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomNumber: "101",
      property: "Sunset Apartments",
      tenant: "John Doe",
      status: "Occupied",
    },
    {
      id: 2,
      roomNumber: "102",
      property: "Sunset Apartments",
      tenant: "Jane Smith",
      status: "Vacant",
    },
    {
      id: 3,
      roomNumber: "201",
      property: "Ocean View Villas",
      tenant: "Alice Johnson",
      status: "Occupied",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    property: "",
    tenant: "",
    status: "Vacant",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add/edit room)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRoom) {
      // Edit existing room
      const updatedRooms = rooms.map((room) =>
        room.id === currentRoom.id ? { ...room, ...formData } : room
      );
      setRooms(updatedRooms);
    } else {
      // Add new room
      const newRoom = { id: Date.now(), ...formData };
      setRooms([...rooms, newRoom]);
    }
    setIsModalOpen(false);
    setFormData({ roomNumber: "", property: "", tenant: "", status: "Vacant" });
    setCurrentRoom(null);
  };

  // Handle delete room
  const handleDelete = (id) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
  };

  // Open modal for adding/editing room
  const openModal = (room = null) => {
    setCurrentRoom(room);
    if (room) {
      setFormData(room);
    } else {
      setFormData({ roomNumber: "", property: "", tenant: "", status: "Vacant" });
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
          {rooms.length > 0 ? (
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
                    <p className="text-gray-600 mt-2">Tenant: {room.tenant}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          room.status === "Occupied"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {room.status}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {currentRoom ? "Edit Room" : "Add Room"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <input
                    type="text"
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tenant
                  </label>
                  <input
                    type="text"
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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