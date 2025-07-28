import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [mentors, setMentors] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleAndMentors = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth/check', {
          withCredentials: true,
        });
        setRole(res.data.role);

        const res2 = await axios.get(
          'http://localhost:8000/admin/pending-mentors'
        );
        setMentors(res2.data);
      } catch (error) {
        console.log('Error in useEffect:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAndMentors();
  }, []);

  const handleSubmit = async (e, alumniId) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:8000/admin/verify-alumni/${alumniId}`
      );
      alert('Alumni verified successfully.');

      const res2 = await axios.get(
        'http://localhost:8000/admin/pending-mentors'
      );
      setMentors(res2.data);
    } catch (err) {
      console.error('Error verifying alumni:', err);
      alert('Error verifying alumni.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {mentors.map(({ alumni, mentor }, index) => (
        <div key={index} className="p-4 border rounded my-4 shadow-md">
          <h2 className="text-xl font-semibold text-blue-700">Alumni</h2>
          <p>
            <strong>Name:</strong> {alumni.alumniName}
          </p>
          <p>
            <strong>Email:</strong> {alumni.alumniEmail}
          </p>
          <p>
            <strong>Status:</strong> {alumni.status}
          </p>

          <h2 className="text-xl font-semibold text-green-700 mt-4">Mentor</h2>
          {mentor ? (
            <>
              <p>
                <strong>Title:</strong> {mentor.title}
              </p>
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
                <a target='_blank' href={mentor.linkedinId}>{mentor.linkedinId}</a>
              </p>

              {alumni.status === 'pending' && (
                <form
                  onSubmit={(e) => handleSubmit(e, alumni._id)}
                  className="mt-3"
                >
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Verify Alumni
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className="text-red-600 mt-2">
              No mentor profile submitted yet.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
