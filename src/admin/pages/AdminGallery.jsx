import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";
import api from "../api";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const dropRef = useRef();

  const fetchGallery = () => {
    setLoading(true);
    api.getGallery().then((data) => {
      setImages(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchGallery(); }, []);

  useEffect(() => {
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newFiles]);

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setNewFiles((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!newFiles.length) return;
    setUploading(true);
    await api.uploadGalleryImages(newFiles);
    setNewFiles([]);
    setUploading(false);
    fetchGallery();
  };

  const handleDelete = async (url) => {
    if (!confirm("Remove this image from gallery?")) return;
    await api.deleteGalleryImage(url);
    fetchGallery();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Gallery</h1>
        {newFiles.length > 0 && (
          <button onClick={handleUpload} disabled={uploading}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors">
            {uploading ? "Uploading..." : `Upload ${newFiles.length} image${newFiles.length > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Upload panel */}
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">Add Images</p>
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => dropRef.current.querySelector("input").click()}
            className={`border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition-colors ${dragOver ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-gray-50"}`}
          >
            <input type="file" multiple accept="image/*" className="hidden"
              onChange={(e) => addFiles(e.target.files)} />
            <ImagePlus className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-500">Drag & drop or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · max 5MB each</p>
          </div>

          {previews.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">{previews.length} image{previews.length > 1 ? "s" : ""} selected</p>
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden aspect-square">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setNewFiles((f) => f.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleUpload} disabled={uploading}
                className="mt-3 w-full bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>

        {/* Gallery grid */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            {loading ? "Loading..." : `${images.length} image${images.length !== 1 ? "s" : ""} in gallery`}
          </p>
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-10">Loading...</p>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <ImagePlus className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No images yet. Upload some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((url) => (
                <div key={url} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => handleDelete(url)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
