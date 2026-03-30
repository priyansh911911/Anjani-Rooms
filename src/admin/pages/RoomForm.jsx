import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, X, Trash2 } from "lucide-react";
import api from "../api";

const AMENITY_OPTIONS = ["AC", "WiFi", "TV", "Geyser", "Balcony", "River View", "Temple View", "City View", "Mini Bar", "Work Desk", "Lounge Access", "Meeting Room Access"];

const emptyForm = {
  location: "", area: "", category: "", price: "", priceWithBreakfast: "",
  amenities: [], video: "", availableFrom: "", availableTo: "", isActive: true,
};

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const dropRef = useRef();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // cloudinary URLs
  const [newFiles, setNewFiles] = useState([]);              // File objects
  const [previews, setPreviews] = useState([]);              // blob preview URLs
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.getRoom(id).then((room) => {
      if (room._id) {
        setForm({
          location: room.location, area: room.area || "", category: room.category,
          price: room.price, priceWithBreakfast: room.priceWithBreakfast,
          amenities: room.amenities, video: room.video || "",
          availableFrom: room.availableFrom ? room.availableFrom.slice(0, 10) : "",
          availableTo: room.availableTo ? room.availableTo.slice(0, 10) : "",
          isActive: room.isActive,
        });
        setExistingImages(room.images || []);
      }
    });
  }, [id, isEdit]);

  // Generate previews whenever newFiles changes
  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setNewFiles((prev) => [...prev, ...valid]);
  };

  const removeNewFile = (index) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== index));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const toggleAmenity = (a) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));

  const handleDeleteExisting = async (url) => {
    if (!confirm("Remove this image?")) return;
    await api.deleteImage(id, url);
    setExistingImages((imgs) => imgs.filter((i) => i !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), priceWithBreakfast: Number(form.priceWithBreakfast) };
      let room = isEdit ? await api.updateRoom(id, payload) : await api.createRoom(payload);
      if (room.message && !room.roomId) throw new Error(room.message);

      if (newFiles.length > 0) {
        setUploading(true);
        await api.uploadImages(room.roomId, newFiles);
        setUploading(false);
      }
      navigate("/admin/rooms");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{isEdit ? "Edit Room" : "Add New Room"}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Main Form ── */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Location *</label>
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input" placeholder="e.g. Gorakhpur" />
          </div>
          <div>
            <label className="label">Area</label>
            <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
              className="input" placeholder="e.g. Golghar" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="label">Category *</label>
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input">
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Price / night (₹) *</label>
            <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input" placeholder="2000" />
          </div>
          <div>
            <label className="label">Price with Breakfast (₹)</label>
            <input type="number" min="0" value={form.priceWithBreakfast} onChange={(e) => setForm({ ...form, priceWithBreakfast: e.target.value })}
              className="input" placeholder="2300" />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="label">Amenities</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {AMENITY_OPTIONS.map((a) => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${form.amenities.includes(a) ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-500 border-gray-200 hover:border-red-300"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="label">Video URL</label>
          <input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })}
            className="input" placeholder="https://..." />
        </div>

        {/* ── Images Section ── */}
        <div>
          <label className="label">Room Images</label>

          {/* Existing images */}
          {isEdit && existingImages.length > 0 && (
            <div className="mt-2 mb-3">
              <p className="text-xs text-gray-400 mb-2">Uploaded images — hover to remove</p>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((url) => (
                  <div key={url} className="relative group w-24 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleDeleteExisting(url)}
                      className="absolute inset-0 bg-black/60 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag & drop upload area */}
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => dropRef.current.querySelector("input").click()}
            className={`mt-1 border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors ${dragOver ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-gray-50"}`}
          >
            <input type="file" multiple accept="image/*" className="hidden"
              onChange={(e) => addFiles(e.target.files)} />
            <div className="text-3xl mb-2"><ImagePlus className="w-8 h-8 mx-auto text-gray-400" /></div>
            <p className="text-sm font-medium text-gray-600">Drag & drop images here</p>
            <p className="text-xs text-gray-400 mt-1">or click to browse · JPG, PNG, WEBP · max 5MB each</p>
          </div>

          {/* New file previews */}
          {previews.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">{previews.length} image{previews.length > 1 ? "s" : ""} ready to upload — click ✕ to remove</p>
              <div className="flex flex-wrap gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Available From</label>
            <input type="date" value={form.availableFrom}
              onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
              className="input" />
          </div>
          <div>
            <label className="label">Available To</label>
            <input type="date" value={form.availableTo} min={form.availableFrom}
              onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
              className="input" />
          </div>
        </div>
        <p className="text-xs text-gray-400 -mt-3">Leave empty to always show as available</p>

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isActive" checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 accent-red-500" />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible on site)</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading || uploading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
              {uploading ? "Uploading images..." : loading ? "Saving..." : isEdit ? "Update Room" : "Create Room"}
            </button>
            <button type="button" onClick={() => navigate("/admin/rooms")}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>

        {/* ── Side Panel ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Tips</h3>
            <ul className="flex flex-col gap-2 text-xs text-gray-500">
              <li>• Use a clear location name like <span className="font-semibold text-gray-700">Varanasi</span></li>
              <li>• Add multiple high-quality images for better visibility</li>
              <li>• Set availability dates only if the room has a fixed window</li>
              <li>• Leave availability empty to always show as available</li>
              <li>• Mark inactive to hide a room without deleting it</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <h3 className="text-sm font-bold text-red-700 mb-2">Amenities Guide</h3>
            <ul className="flex flex-col gap-1.5 text-xs text-red-600">
              <li>• AC, WiFi, TV are the most searched filters</li>
              <li>• River View & Temple View attract premium guests</li>
              <li>• Work Desk is popular for business travelers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
