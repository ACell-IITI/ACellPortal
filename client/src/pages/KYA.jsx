import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const KYA = () => {
  const [profiles, setProfiles] = useState([]);

  const fetchKyaProfiles = async () => {
    try {
      const res = await axios.get(
        'http://alumnicell.iiti.ac.in:8000/admin/get-kya-profiles'
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
    },
    deleteButton: {
      padding: '0.4rem 0.8rem',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div>
      <h3 style={styles.heading}>Existing Profiles</h3>
      <ul style={styles.profileList}>
        {profiles.map((profile) => (
          <li key={profile._id} style={styles.profileItem}>
            {profile.profilePic && (
              <img
                src={profile.profilePic}
                alt={`${profile.Name}'s profile`}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginBottom: '1rem',
                }}
              />
            )}
            <strong>{profile.Name}</strong> (Batch {profile.Batch}) -{' '}
            {profile.CurrRole}
            <p>{profile.Achievement}</p>
            <p>{profile.ShortBio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KYA;
