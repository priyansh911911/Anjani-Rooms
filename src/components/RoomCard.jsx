import { useState, useEffect, useRef } from "react";
import MediaModal from "./MediaModal";

const CONTACT = {
  phone: "+919876543210",
  whatsapp: "919277380327",
};

export default function RoomCard({ room, location, checkIn, checkOut, nights }) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef(null);

  const media = [...room.images, ...(room.video ? [room.video] : [])];

  useEffect(() => {
    if (hovered || media.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setMediaIndex((i) => (i + 1) % media.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [hovered, media.length]);

  const isVideo = (src) => src.endsWith(".mp4") || src.endsWith(".webm");
  const totalPrice = nights > 0 ? room.price * nights : null;

  const openModal = (index) => { setModalStart(index); setModalOpen(true); };

  const whatsappMsg = encodeURIComponent(
    `Hi, I want to book the *${room.category}* in ${location}.\n` +
    `Room ID: ${room.roomId}\n` +
    (checkIn && checkOut
      ? `📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n🌙 Nights: ${nights}\n💰 Total: ₹${totalPrice}`
      : `Price: ₹${room.price}/night`)
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row overflow-hidden">

        {/* ── Image Carousel ── */}
        <div
          className="relative w-full md:w-72 h-52 flex-shrink-0 overflow-hidden group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Sliding strip */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${mediaIndex * 100}%)` }}
          >
            {media.map((src, i) => (
              <div key={i} className="w-full h-full flex-shrink-0 cursor-pointer" onClick={() => openModal(i)}>
                {isVideo(src) ? (
                  <video src={src} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={src} alt={room.category} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center pointer-events-none">
            <span className="text-white text-sm font-bold bg-black/60 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              View All Photos
            </span>
          </div>

          {/* Prev / Next arrows */}
          {media.length > 1 && (
            <>
              <button
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none transition-all opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i - 1 + media.length) % media.length); }}
              >‹</button>
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none transition-all opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i + 1) % media.length); }}
              >›</button>
            </>
          )}

          {/* Dot indicators */}
          {media.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMediaIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === mediaIndex ? "bg-white scale-125" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}

          {/* Location badge */}
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm">
            📍 {location}
          </span>

          {/* Photo count badge */}
          <span className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm">
            {room.video ? `🎬 ${room.images.length} Photos · 1 Video` : `🖼 ${media.length} Photo${media.length > 1 ? "s" : ""}`}
          </span>
        </div>

        {/* ── Details ── */}
        <div className="flex-1 flex flex-col justify-between p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{room.category}</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((a) => (
                  <span key={a} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-md font-medium">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
              ✓ Available
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Price */}
            <div>
              <div className="text-2xl font-bold text-gray-900 leading-none">
                ₹{room.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-400 ml-1">/ night</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Without Breakfast</div>
              <div className="text-sm font-semibold text-gray-700 mt-0.5">
                ₹{room.priceWithBreakfast.toLocaleString()}
                <span className="text-xs font-normal text-gray-400 ml-1">with Breakfast</span>
              </div>
              {totalPrice && (
                <div className="text-sm text-green-600 font-semibold mt-1">
                  ₹{totalPrice.toLocaleString()} for {nights} night{nights > 1 ? "s" : ""}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-0.5">+ taxes & fees</div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-all whitespace-nowrap shadow-md hover:shadow-lg"
              >
                📞 Call
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors whitespace-nowrap"
              >
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <MediaModal
          media={media}
          startIndex={modalStart}
          title={`${room.category} · ${location}`}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
