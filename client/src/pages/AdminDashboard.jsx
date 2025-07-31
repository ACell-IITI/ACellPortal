import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  // For Mentors
  const [mentors, setMentors] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

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

  const handleMentorsSubmit = async (e, alumniId) => {
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

  //For KYA
  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: 'auto',
    },
    heading: {
      marginBottom: '1rem',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '2rem',
    },
    input: {
      padding: '0.5rem',
      marginBottom: '0.8rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    textarea: {
      padding: '0.5rem',
      marginBottom: '0.8rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minHeight: '60px',
    },
    button: {
      padding: '0.6rem',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    profileList: {
      listStyle: 'none',
      padding: 0,
    },
    profileItem: {
      border: '1px solid #ccc',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    profileImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '50%',
    },
    deleteButton: {
      padding: '0.4rem 0.8rem',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
  };

  const [profiles, setProfiles] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Batch: '',
    CurrRole: '',
    Achievement: '',
    ShortBio: '',
    profilePic: '',
  });

  const fetchKyaProfiles = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8000/admin/get-kya-profiles'
      );
      setProfiles(res.data.data);
    } catch (err) {
      console.error('Error fetching profiles', err);
      setProfiles([]);
    }
  };

  useEffect(() => {
    fetchKyaProfiles();
  }, []);

  const years = [];
  for (let year = 2013; year <= 2025; year++) {
    years.push(year);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('Name', formData.Name);
      data.append('Batch', formData.Batch);
      data.append('CurrRole', formData.CurrRole);
      data.append('Achievement', formData.Achievement);
      data.append('ShortBio', formData.ShortBio);
      if (imageFile) {
        data.append('profilePic', imageFile);
      }

      const res = await axios.post(
        'http://localhost:8000/admin/add-kya-profile',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      fetchKyaProfiles();

      setFormData({
        Name: '',
        Batch: '',
        CurrRole: '',
        Achievement: '',
        ShortBio: '',
      });
      setImageFile(null);
    } catch (err) {
      console.error('Error adding profile:', err);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s profile?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:8000/admin/delete-kya-profile/${id}`
      );
      fetchKyaProfiles();
    } catch (err) {
      console.error('Error deleting profile', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div>
        <h2 className="text-2xl">MENTORS</h2>
        {mentors.map(({ alumni, mentor }, index) => (
          <div
            key={index}
            className="p-4 border rounded my-4 shadow-md flex items-start gap-4"
          >
            {/* Added image preview here */}
            {mentor && mentor.profilePic && (
              <img
                src={mentor.profilePic}
                alt={`${mentor.name}'s profile`}
                className="w-24 h-24 object-cover rounded-full flex-shrink-0"
              />
            )}
            <div>
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

              <h2 className="text-xl font-semibold text-green-700 mt-4">
                Mentor
              </h2>
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
                    <a
                      target="_blank"
                      href={mentor.linkedinId}
                      rel="noopener noreferrer"
                    >
                      {mentor.linkedinId}
                    </a>
                  </p>

                  {alumni.status === 'pending' && (
                    <form
                      onSubmit={(e) => handleMentorsSubmit(e, alumni._id)}
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
          </div>
        ))}
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Add Alumni Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Name"
            required
            style={styles.input}
          />
          <label htmlFor="Batch">Batch: </label>
          <select
            name="Batch"
            id="batch"
            value={formData.Batch}
            onChange={handleChange}
            className=""
            style={styles.input}
          >
            <option value="">Select Batch</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input
            name="CurrRole"
            value={formData.CurrRole}
            onChange={handleChange}
            placeholder="Current Role"
            required
            style={styles.input}
          />
          <input
            name="Achievement"
            value={formData.Achievement}
            onChange={handleChange}
            placeholder="Achievement"
            required
            style={styles.input}
          />
          <textarea
            name="ShortBio"
            value={formData.ShortBio}
            onChange={handleChange}
            placeholder="Short Bio"
            required
            style={styles.input}
          />
          <label>Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
            id="imageInput"
            ref={fileInputRef}
            hidden={true}
          />

          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Profile Preview"
              style={{
                ...styles.profileImage,
                cursor: 'pointer',
                marginBottom: '1rem',
              }}
              onClick={() => fileInputRef.current.click()}
              title="Click to change image"
            />
          ) : (
            <div
              style={{
                ...styles.profileImage,
                border: '1px dashed #ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current.click()}
              title="Click to upload image"
            >
              Upload Image
            </div>
          )}

          <button type="submit" style={styles.button}>
            Add Profile
          </button>
        </form>

        <h3 style={styles.heading}>Existing Profiles</h3>
        <ul style={styles.profileList}>
          {profiles.map((profile) => (
            <li key={profile._id} style={styles.profileItem}>
              {profile.profilePic && (
                <img
                  src={profile.profilePic}
                  alt={`${profile.Name}'s profile`}
                  style={styles.profileImage}
                />
              )}
              <div>
                <strong>{profile.Name}</strong> (Batch {profile.Batch}) -{' '}
                {profile.CurrRole}
                <p>{profile.Achievement}</p>
                <p>{profile.ShortBio}</p>
                <button
                  onClick={() => handleDelete(profile._id, profile.Name)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
