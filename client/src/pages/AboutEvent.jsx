import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AboutEvent.css";
import { API_BASE_URL } from "../api/alumni";

const AboutEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/about-eventProgram/${id}`,
      );
      const data = await res.json();

      setEvent(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading event:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) return <div className="eventas-loader">Loading...</div>;
  if (!event) return <div className="eventas-error">Event not found.</div>;

  return (
    <div className="eventas-container">
      <div className="eventas-card">
        <h1 className="eventas-title">{event.title}</h1>

        <div className="eventas-info">
          <p>
            <span>Date:</span> {event.date}
          </p>
          <p>
            <span>Time:</span> {event.time}
          </p>
          <p>
            <span>Venue:</span> {event.venue}
          </p>

          {event.attendance && (
            <p>
              <span>Attendance:</span> {event.attendance}
            </p>
          )}
        </div>

        {event.about && (
          <div className="eventas-about">
            <h2>About the Event</h2>
            <p>{event.about}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutEvent;
