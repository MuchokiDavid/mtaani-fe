import { useState, useEffect } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import {
  addData,
  getAllData,
  updateData,
  deleteData,
  STORE_MAINTENANCE,
  STORE_PROPERTIES,
  STORE_ROOMS,
} from "../../../database/db";
import storageUser from "../CurentUser";
import { useNavigate } from "react-router-dom";

export default function Maintenance() {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [formData, setFormData] = useState({
    property: "",
    room: "",
    description: "",
    status: "Pending",
    landlordId: "", // Added landlordId to associate requests with landlords
  });
  const currentUser = storageUser;
  const navigate = useNavigate();

  // Fetch maintenance requests based on user role
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllData(STORE_MAINTENANCE);

      if (currentUser.role === "Landlord") {
        // Filter requests for the landlord's properties
        const properties = await getAllData(STORE_PROPERTIES);
        const landlordProperties = properties.filter(
          (property) => property.owner.email === currentUser.email
        );
        const landlordPropertyNames = landlordProperties.map((prop) => prop.name);

        const filteredRequests = data.filter((request) =>
          landlordPropertyNames.includes(request.property)
        );
        setMaintenanceRequests(filteredRequests);
      } else if (currentUser?.role === "tenant") {
        // Filter requests for the tenant's room
        const rooms = await getAllData(STORE_ROOMS);
        const tenantRoom = rooms.find(
          (room) => room.tenantEmail === currentUser.email
        );

        if (tenantRoom) {
          const filteredRequests = data.filter(
            (request) => request.room === tenantRoom.name
          );
          setMaintenanceRequests(filteredRequests);
        } else {
          setMaintenanceRequests([]); // No room assigned
        }
      }
    };
    fetchData();
  }, [currentUser]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (add/edit maintenance request)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add landlordId for tenant requests
    if (currentUser.role === "tenant") {
      const rooms = await getAllData(STORE_ROOMS);
      const tenantRoom = rooms.find(
        (room) => room.tenantEmail === currentUser['email']
      );
      if (tenantRoom) {
        const properties = await getAllData(STORE_PROPERTIES);
        const property = properties.find(
          (prop) => prop.name === tenantRoom.property
        );
        if (property) {
          formData.landlordId = property?.owner?.email;
          formData.property = property?.name; // Set property name
          formData.room = tenantRoom.name; // Set room name
        }
      }
    }

    // Log form data for debugging
    console.log("Form Data:", formData);

    try {
      if (currentRequest) {
        // Edit existing request
        await updateData(STORE_MAINTENANCE, currentRequest.id, formData);
      } else {
        // Add new request
        await addData(STORE_MAINTENANCE, formData);
      }

      // Refresh the list
      const data = await getAllData(STORE_MAINTENANCE);
      setMaintenanceRequests(data);
      setIsModalOpen(false);
      setFormData({
        property: "",
        room: "",
        description: "",
        status: "Pending",
        landlordId: "",
      });
      setCurrentRequest(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle delete maintenance request
  const handleDelete = async (id) => {
    await deleteData(STORE_MAINTENANCE, id);
    // Refresh the list
    const data = await getAllData(STORE_MAINTENANCE);
    setMaintenanceRequests(data);
  };

  // Open modal for adding/editing maintenance request
  const openModal = (request = null) => {
    setCurrentRequest(request);
    if (request) {
      setFormData(request);
    } else {
      setFormData({
        property: "",
        room: "",
        description: "",
        status: "Pending",
        landlordId: "",
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Maintenance Requests
          </h1>

          {currentUser?.role === "Landlord" ? (
            <p></p>
          ) : (
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300"
            >
              <Plus size={18} />
              Add Request
            </button>
          )}
        </div>

        {/* Maintenance Requests List */}
        <div className="space-y-4">
          {maintenanceRequests && maintenanceRequests.length > 0 ? (
            maintenanceRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {request.property} - Room {request.room}
                    </h3>
                    <p className="text-gray-600 mt-2">{request.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          request.status === "Completed"
                            ? "text-green-600"
                            : request.status === "In Progress"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {request.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(request)}
                      className="text-blue-600 hover:text-blue-700 transition-all duration-300"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="text-red-600 hover:text-red-700 transition-all duration-300"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No maintenance requests found.</p>
          )}
        </div>

        {/* Modal for Add/Edit Maintenance Request */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 shadow-lg">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {currentRequest ? "Edit Request" : "Add Request"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={currentUser.role === "Tenant"} // Disable for tenants
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={currentUser.role === "Tenant"} // Disable for tenants
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
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
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
                    {currentRequest ? "Save Changes" : "Add Request"}
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