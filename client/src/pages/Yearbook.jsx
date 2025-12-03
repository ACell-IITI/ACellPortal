import React, { useEffect, useState } from "react";
import axios from "axios";

const Yearbook = () => {
  const [file, setFile] = useState(null);
  const [yearbooks, setYearbooks] = useState([]);

  useEffect(() => {
    fetchYearbooks();
  }, []);

  const fetchYearbooks = async () => {
    try {
      const res = await axios.get("/api/alumni/get-yearbooks");
      setYearbooks(res.data);
    } catch (err) {
      console.error("Error fetching yearbooks:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/alumni/upload-yearbook", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      fetchYearbooks();
    } catch (err) {
      console.error("Error uploading yearbook:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this yearbook?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/alumni/delete-yearbook/${id}`);
      fetchYearbooks();
    } catch (err) {
      console.error("Error deleting yearbook:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload Yearbook PDF</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Upload
        </button>
      </form>

      <h3 style={styles.heading}>Uploaded Yearbooks</h3>
      <ul style={styles.list}>
        {yearbooks.map((yearbook) => (
          <li key={yearbook._id} style={styles.item}>
            <a href={yearbook.pdfUrl} target="_blank" rel="noopener noreferrer">
              {yearbook.fileName}
            </a>
            <button
              onClick={() => handleDelete(yearbook._id)}
              style={styles.deleteButton}
            >
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
    marginBottom: "2rem",
  },
  input: {
    padding: "0.5rem",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
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
    marginBottom: "1rem",
    background: "#f5f5f5",
    padding: "1rem",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Yearbook;
