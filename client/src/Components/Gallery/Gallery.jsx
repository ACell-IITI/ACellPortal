import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/alumni";

export default function Gallery() {
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/gallery`)
      .then((res) => res.json())
      .then((data) => setRecentPhotos(data));
  }, []);

  return (
    <div className="w-[90%] max-w-6xl mx-auto my-10">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Gallery Wall
      </h2>

      {/* Masonry Layout */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {recentPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative mb-3 break-inside-avoid overflow-hidden rounded-2xl shadow-md group"
          >
            <img
              src={photo.image}
              alt={`Gallery item ${index + 1}`}
              className="w-full h-auto rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setSelectedImage(photo.image)} 
            />
          </div>
        ))}
      </div>

      {/*  zoom to full screen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setSelectedImage(null)} //  click to close zoom
        >
          <img
            src={selectedImage}
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-xl"
            alt="Zoomed"
          />
        </div>
      )}
    </div>
  );
}
