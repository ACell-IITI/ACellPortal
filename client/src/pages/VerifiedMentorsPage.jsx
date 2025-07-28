import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifiedMentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get('http://localhost:8000/mentors/verified', {
          withCredentials: true,
        });
        setMentors(res.data);
      } catch (error) {
        console.log(
          'Error while sending request to verified mentors route',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {mentors.map((mentor, idx) => (
        <div key={idx} className="border p-4 rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">{mentor.title}</h2>
          <p>
            <strong>Name:</strong> {mentor.name}
          </p>
          <p>
            <strong>Degree:</strong> {mentor.degreeBranchYear}
          </p>
          <p>
            <strong>Email:</strong> {mentor.email}
          </p>
          <p>
            <strong>Contact:</strong> {mentor.contactNumber}
          </p>
          <p>
            <strong>About:</strong> {mentor.about}
          </p>
          <p>
            <strong>Skills:</strong> {mentor.skills}
          </p>
          <p>
            <strong>LinkedIn:</strong>{' '}
            <a href={mentor.linkedinId} target="_blank" rel="noreferrer">
              {mentor.linkedinId}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default VerifiedMentorsPage;
