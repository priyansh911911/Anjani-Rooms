import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import api from "../api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = () =>
    api.getCategories(true).then((data) => setCategories(Array.isArray(data) ? data : []));

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!newName.trim()) return;
    setLoading(true);
    const res = await api.createCategory(newName.trim());
    setLoading(false);
    if (res._id) { setNewName(""); fetchCategories(); }
    else setError(res.message || "Failed to add");
  };

  const handleUpdate = async (id) => {
    setError("");
    const res = await api.updateCategory(id, { name: editName.trim() });
    if (res._id) { setEditId(null); setEditName(""); fetchCategories(); }
    else setError(res.message || "Failed to update");
  };

  const handleToggle = async (cat) => {
    await api.updateCategory(cat._id, { isActive: !cat.isActive });
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.deleteCategory(id);
    fetchCategories();
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Categories</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Main ── */}
        <div className="xl:col-span-2">
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm p-4 mb-4 flex gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
            />
            <button type="submit" disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
              + Add
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {categories.length === 0 ? (
              <p className="text-gray-400 text-sm p-6 text-center">No categories yet.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <li key={cat._id} className="flex items-center gap-3 px-4 py-3">
                    {editId === cat._id ? (
                      <>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-400"
                        />
                        <button onClick={() => handleUpdate(cat._id)}
                          className="text-xs font-bold text-green-600 hover:underline">Save</button>
                        <button onClick={() => setEditId(null)}
                          className="text-xs text-gray-400 hover:underline">Cancel</button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-gray-800">{cat.name}</span>
                        <button onClick={() => handleToggle(cat)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full transition-colors ${cat.isActive ? "bg-green-50 text-green-600 hover:bg-green-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                          {cat.isActive ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => { setEditId(cat._id); setEditName(cat.name); }}
                          className="text-blue-500 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(cat._id)}
                          className="text-red-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Side Panel ── */}
        <div className="bg-white rounded-xl shadow-sm p-5 h-fit">
          <h3 className="text-sm font-bold text-gray-900 mb-3">About Categories</h3>
          <ul className="flex flex-col gap-2 text-xs text-gray-500">
            <li>• Categories are used to filter rooms on the homepage</li>
            <li>• Inactive categories are hidden from guests</li>
            <li>• Examples: Standard, Deluxe, Super Deluxe, Suite</li>
            <li>• Deleting a category does not delete its rooms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
