import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/alumni";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/get-programs`);
        const onlyEvents = res.data.data.filter(item => item.type === "event");
        setEvents(onlyEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Events</h1>
          <p className="text-lg text-gray-600">
            Explore our sessions and expert-led discussions to boost your professional journey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => window.location.href = `/about-eventProgram/${event._id}`}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/Media/placeholder.jpg'; // Fallback image
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                  {event.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  📅 {event.date}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  ⏰ {event.time}
                </p>
                <p className="text-xs md:text-sm text-gray-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'}}>
                  📍 {event.venue}
                </p>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;