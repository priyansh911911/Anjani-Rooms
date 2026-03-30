import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BedDouble, MapPin, Tag, CheckCircle } from "lucide-react";
import api from "../api";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRooms().then((data) => {
      setRooms(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const locations = [...new Set(rooms.map((r) => r.location))];
  const categories = [...new Set(rooms.map((r) => r.category))];

  const stats = [
    { label: "Total Rooms", value: rooms.length, icon: BedDouble, color: "bg-blue-50 text-blue-600" },
    { label: "Locations", value: locations.length, icon: MapPin, color: "bg-green-50 text-green-600" },
    { label: "Categories", value: categories.length, icon: Tag, color: "bg-purple-50 text-purple-600" },
    { label: "Active Rooms", value: rooms.filter((r) => r.isActive).length, icon: CheckCircle, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/admin/rooms/new" className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + Add Room
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Recent rooms */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Rooms</h2>
              <Link to="/admin/rooms" className="text-sm text-red-500 hover:underline">View all</Link>
            </div>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-left">Room ID</th>
                    <th className="px-5 py-3 text-left">Location</th>
                    <th className="px-5 py-3 text-left">Category</th>
                    <th className="px-5 py-3 text-left">Price</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rooms.slice(0, 5).map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{room.roomId}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{room.location}</td>
                      <td className="px-5 py-3 text-gray-600">{room.category}</td>
                      <td className="px-5 py-3 text-gray-900">₹{room.price.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${room.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {room.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {rooms.slice(0, 5).map((room) => (
                <div key={room._id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-gray-400">{room.roomId}</p>
                    <p className="text-sm font-semibold text-gray-900">{room.category}</p>
                    <p className="text-xs text-gray-500">{room.location} · ₹{room.price.toLocaleString()}/night</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${room.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {room.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
