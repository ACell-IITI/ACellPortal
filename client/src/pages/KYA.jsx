import React, { useEffect, useState } from "react";
import axios from "axios";

const KYA = () => {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Batch: "",
    CurrRole: "",
    Achievement: "",
    ShortBio: "",
  });
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await axios.get("/api/alumni/get/mentor-profiles");
      console.log("Fetched profiles:", res.data);
      setProfiles(res.data);
    } catch (err) {
      console.error("Error fetching profiles", err);
      setProfiles([]);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/alumni/add/mentor-profile", formData);
      fetchProfiles();
      setFormData({
        Name: "",
        Batch: "",
        CurrRole: "",
        Achievement: "",
        ShortBio: "",
      });
    } catch (err) {
      console.error("Error adding profile:", err);
    }
  };
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s profile?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/alumni/delete/mentor-profile/${id}`);
      fetchProfiles();
    } catch (err) {
      console.error("Error deleting profile", err);
    }
  };
  return (
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
        <input
          name="Batch"
          value={formData.Batch}
          onChange={handleChange}
          placeholder="Batch"
          required
          type="number"
          style={styles.input}
        />
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
        <button type="submit" style={styles.button}>
          Add Profile
        </button>
      </form>

      <h3 style={styles.heading}>Existing Profiles</h3>
      <ul style={styles.profileList}>
        {profiles.map((profile) => (
          <li key={profile.id} style={styles.profileItem}>
            <strong>{profile.Name}</strong>(Batch{profile.Batch})-
            {profile.CurrRole}
            <p>{profile.Achievement}</p>
            <p>{profile.ShortBio}</p>
            <button onClick={() => handleDelete(profile._id, profile.Name)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "auto",
  },
  heading: {
    marginBottom: "1rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "0.8rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "0.5rem",
    marginBottom: "0.8rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "60px",
  },
  button: {
    padding: "0.6rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  profileList: {
    listStyle: "none",
    padding: 0,
  },
  profileItem: {
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#f9f9f9",
  },
  deleteButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default KYA;
