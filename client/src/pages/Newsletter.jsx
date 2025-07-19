import React, { useState } from "react";

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Date: "",
    Description: "",
    File: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "File") {
      setFormData({ ...formData, File: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated "upload" for now
    const newNewsletter = {
      ...formData,
      _id: Date.now().toString(),
      FileURL: URL.createObjectURL(formData.File), // temporary preview link
    };

    setNewsletters([...newsletters, newNewsletter]);

    setFormData({
      Title: "",
      Date: "",
      Description: "",
      File: null,
    });

    // Reset file input
    document.getElementById("fileInput").value = "";
  };

  const handleDelete = (id, title) => {
    const confirmDelete = window.confirm(`Delete "${title}"?`);
    if (!confirmDelete) return;
    setNewsletters(newsletters.filter((n) => n._id !== id));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Newsletter</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="Title"
          value={formData.Title}
          onChange={handleChange}
          placeholder="Newsletter Title"
          required
          style={styles.input}
        />
        <input
          type="date"
          name="Date"
          value={formData.Date}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="Description"
          value={formData.Description}
          onChange={handleChange}
          placeholder="Short Description"
          required
          style={styles.input}
        />
        <input
          type="file"
          id="fileInput"
          name="File"
          accept="application/pdf"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Add Newsletter
        </button>
      </form>

      <h3 style={styles.heading}>All Newsletters</h3>
      {newsletters.length === 0 ? (
        <p>No newsletters added yet.</p>
      ) : (
        <ul style={styles.list}>
          {newsletters.map((nl) => (
            <li key={nl._id} style={styles.item}>
              <strong>{nl.Title}</strong> ({nl.Date})<p>{nl.Description}</p>
              <a href={nl.FileURL} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
              <br />
              <button
                onClick={() => handleDelete(nl._id, nl.Title)}
                style={styles.delete}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "0.6rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "1rem",
    backgroundColor: "#f9f9f9",
  },
  delete: {
    marginTop: "0.5rem",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Newsletter;
