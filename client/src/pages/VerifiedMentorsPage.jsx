import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MentorDirectory from './MentorDirectory';

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
   <MentorDirectory/>
  );
};

export default VerifiedMentorsPage;
