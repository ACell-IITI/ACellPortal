import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AboutEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`http://localhost:8000/admin/about-eventProgram/${id}`);
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

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found.</div>;

  return (
    <div>
      <h1>{event.title}</h1>

      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Venue:</strong> {event.venue}</p>

      {event.attendance && (
        <p><strong>Attendance:</strong> {event.attendance}</p>
      )}

      {event.about && (
        <>
          <h2>About</h2>
          <p>{event.about}</p>
        </>
      )}
    </div>
  );
};

export default AboutEvent;
