import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import api from "../api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchRooms = () => {
    setLoading(true);
    api.getRooms().then((data) => {
      setRooms(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async (roomId) => {
    if (!confirm(`Delete room ${roomId}?`)) return;
    await api.deleteRoom(roomId);
    fetchRooms();
  };

  const handleToggleActive = async (room) => {
    await api.updateRoom(room.roomId, { isActive: !room.isActive });
    fetchRooms();
  };

  const locations = ["All", ...new Set(rooms.map((r) => r.location))];
  const categories = ["All", ...new Set(rooms.map((r) => r.category))];

  const filtered = rooms.filter((r) => {
    const matchSearch = r.roomId.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchLoc = filterLocation === "All" || r.location === filterLocation;
    const matchCat = filterCategory === "All" || r.category === filterCategory;
    return matchSearch && matchLoc && matchCat;
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Rooms ({filtered.length})</h1>
        <Link to="/admin/rooms/new" className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + Add Room
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by ID, location, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 flex-1 min-w-48"
        />
        <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400">
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 p-6">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 p-6 text-center">No rooms found.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Room ID</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Images</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{room.roomId}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{room.location}</td>
                      <td className="px-4 py-3 text-gray-600">{room.category}</td>
                      <td className="px-4 py-3 text-gray-900">₹{room.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{room.images.length} imgs</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleActive(room)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer transition-colors ${room.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                          {room.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/rooms/${room.roomId}/edit`}
                            className="text-blue-500 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></Link>
                          <button onClick={() => handleDelete(room.roomId)}
                            className="text-red-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((room) => (
                <div key={room._id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-mono text-xs text-gray-400">{room.roomId}</p>
                      <p className="text-sm font-semibold text-gray-900">{room.category}</p>
                      <p className="text-xs text-gray-500">{room.location} · ₹{room.price.toLocaleString()}/night · {room.images.length} imgs</p>
                    </div>
                    <button onClick={() => handleToggleActive(room)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 transition-colors ${room.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {room.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/admin/rooms/${room.roomId}/edit`}
                      className="text-xs text-blue-500 font-medium flex items-center gap-1"><Pencil className="w-3 h-3" /> Edit</Link>
                    <button onClick={() => handleDelete(room.roomId)}
                      className="text-xs text-red-400 font-medium flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
