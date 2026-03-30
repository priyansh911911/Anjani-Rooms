import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import api from "../admin/api";

const brands = [
  { name: "Chokhi Dhani", note: "Five Star Property" },
  { name: "Radisson", note: "Mahipalpur, Delhi" },
  { name: "The Yellow Chilli", note: "by Sanjeev Kapoor" },
  { name: "Lords of Drinks", note: "" },
  { name: "Fortune Group", note: "Park Plaza, Noida Sector 58" },
  { name: "Brys Fort Hotel", note: "Ansal Group of Hotels" },
];

const specializations = [
  "Guest experience & service excellence",
  "Banquet & event management",
  "Food & beverage operations",
  "Team leadership & training",
  "Hotel pre-opening & setup",
];

export default function About() {
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    api.getGallery().then((data) => setGallery(Array.isArray(data) ? data : []));
    api.getProfileImage().then((data) => setProfileImage(data?.imageUrl || null));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏨</span>
            <span className="text-lg font-bold text-gray-900 tracking-wide">
              ANJANI<span className="text-red-500">ROOMS</span>.COM
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg whitespace-nowrap">
            ← Back
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Top: Profile + Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center flex flex-col items-center justify-center">
            {profileImage ? (
              <img src={profileImage} alt="Anjani Singh" className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-red-100" />
            ) : (
              <div className="w-40 h-40 rounded-full bg-red-100 flex items-center justify-center text-3xl font-bold text-red-500 mb-4">
                AS
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Anjani Singh</h1>
            <p className="text-sm text-red-500 font-semibold mt-1">Founder – AnjaniRooms.com</p>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              With over 20 years of experience in the hospitality industry, bringing deep expertise in
              hotel operations, restaurant management, banquet services, and bar management.
            </p>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex-1">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Vision</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Through AnjaniRooms.com, the vision is to deliver high-quality hospitality services,
                comfortable stays, and memorable guest experiences across Varanasi, Prayagraj, Ayodhya,
                and beyond — making premium hospitality accessible to every traveler.
              </p>
            </div>
            <div className="bg-red-500 rounded-2xl p-6 text-center flex items-center justify-center flex-1">
              <p className="text-white font-semibold text-lg italic">
                &ldquo;Hospitality is not just service, it&rsquo;s an experience.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Brands + Specializations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Worked With</h2>
            <div className="flex flex-col gap-3">
              {brands.map(({ name, note }) => (
                <div key={name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{name}</span>
                    {note && <span className="text-xs text-gray-400 ml-2">· {note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Specializations</h2>
            <div className="flex flex-col gap-3">
              {specializations.map((s) => (
                <div key={s} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {gallery.map((url, i) => (
                <div key={url} onClick={() => setLightbox(i)}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}>
            <X className="w-7 h-7" />
          </button>
          <button className="absolute left-4 text-white p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + gallery.length) % gallery.length); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <img src={gallery[lightbox]} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % gallery.length); }}>
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

    </div>
  );
}
