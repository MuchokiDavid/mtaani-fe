import { useState, useEffect } from "react";
import { Home, Wrench, CheckCircle, FileText } from "lucide-react";
import { getAllData, STORE_MAINTENANCE } from "../../../database/db";
import { useNavigate } from "react-router-dom";
import storageUser from "../CurentUser";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    openRequests: 0,
    resolvedIssues: 0,
    recentReports: [],
  });
  const [maintenace, setMaintenance] = useState([]);
  const currentUser = storageUser;
  const navigate = useNavigate();

  useEffect(() => {
    async function getMaintenance() {
      setMaintenance(await getAllData(STORE_MAINTENANCE));
    }
    getMaintenance();
  }, []);
  
  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalProperties: 25,
        openRequests: 8,
        resolvedIssues: 32,
        recentReports: [
          "Leaking roof reported in Apartment 3B",
          "Water heater malfunction in Unit 12A",
          "Broken door lock in Townhouse 5",
        ],
      });
    }, 1000);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          Icon={Home}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Open Maintenance Requests"
          value={stats.openRequests}
          Icon={Wrench}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Resolved Issues"
          value={stats.resolvedIssues}
          Icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Recent Reports"
          value={stats.recentReports.length}
          Icon={FileText}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Recent Tenant Reports */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Maintenance Reports
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            {/* head */}
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Property
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Room
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* row 1 */}
              {maintenace?.length > 0 ? (
                maintenace.map((report, index) => (
                  <tr key={index} onClick={() => handleRowClick}>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {report.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {report.property}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {report.room}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {report.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-gray-500">
                  <td colSpan="100%">No recent reports</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, Icon, color, bgColor }) {
  return (
    <div
      className={`${bgColor} shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-200 ease-in-out`}
    >
      <div className={`p-3 rounded-full ${bgColor} ${color}`}>
        <Icon size={28} />
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
