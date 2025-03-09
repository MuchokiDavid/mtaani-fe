import { useState, useEffect } from "react";
import { Home, Wrench, CheckCircle, FileText } from "lucide-react";
import { getAllData, STORE_MAINTENANCE } from "../../../database/db";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    openRequests: 0,
    resolvedIssues: 0,
    recentReports: [],
  });
  const [maintenace, setMaintenance] = useState([])

  useEffect(() => {
    async function getMaintenance() {
      setMaintenance(await getAllData(STORE_MAINTENANCE))
    }
    getMaintenance()
  }, [])

  console.log(maintenace)

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
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h2>

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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Maintenance Reports</h3>
        <div className="overflow-x-auto">
          <table className="table table-md min-w-full text-left">
            {/* head */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Property</th>
                <th>Room</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {maintenace.length > 0 ? (
                maintenace.map((report, index) => (
                  <tr>
                    <th>{report.id}</th>
                    <td>{report.property}</td>
                    <td>{report.room}</td>
                    <td>{report.description}</td>
                  </tr>
                ))
              ) : (
                <tr className="text-gray-500">No recent reports</tr>
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