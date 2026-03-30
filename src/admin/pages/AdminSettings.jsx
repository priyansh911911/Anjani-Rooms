import { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import api from "../api";

export default function AdminSettings() {
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    api.getProfileImage().then((data) => setProfileImage(data?.imageUrl || null));
  }, []);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    const data = await api.uploadProfileImage(file);
    if (data?.imageUrl) setProfileImage(data.imageUrl);
    setUploadingImg(false);
  };
  const [msg, setMsg] = useState({ text: "", error: false });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm)
      return setMsg({ text: "New passwords do not match", error: true });
    setLoading(true);
    const res = await api.changePassword(form.currentPassword, form.newPassword);
    setLoading(false);
    if (res.message === "Password updated successfully") {
      setMsg({ text: "Password updated successfully ✅", error: false });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } else {
      setMsg({ text: res.message || "Failed", error: true });
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 mb-0">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Image</h2>
          <div className="flex items-center gap-5">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-red-100" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-400">AS</div>
            )}
            <div>
              <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleProfileUpload} />
              <button
                onClick={() => fileRef.current.click()}
                disabled={uploadingImg}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                {uploadingImg ? "Uploading..." : "Upload Photo"}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">Shown on the About page · JPG, PNG, WEBP</p>
            </div>
          </div>
        </div>

        {/* Password Form */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {["currentPassword", "newPassword", "confirm"].map((field) => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                </label>
                <input type="password" required value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
              </div>
            ))}
            {msg.text && <p className={`text-sm ${msg.error ? "text-red-500" : "text-green-600"}`}>{msg.text}</p>}
            <button type="submit" disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* ── Side Panel ── */}
        <div className="bg-white rounded-xl shadow-sm p-5 h-fit">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Security Tips</h3>
          <ul className="flex flex-col gap-2 text-xs text-gray-500">
            <li>• Use at least 8 characters</li>
            <li>• Mix uppercase, lowercase & numbers</li>
            <li>• Avoid using your name or email</li>
            <li>• Change your password regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
