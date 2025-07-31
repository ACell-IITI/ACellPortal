import React, { useState, useRef } from 'react'; // Import useRef
import './RegistrationForm.css';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    degreeBranchYear: '',
    contactNumber: '',
    about: '',
    skills: '',
    linkedinId: '',
  });

  const [profileImageFile, setProfileImageFile] = useState(null); 
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        newErrors.contactNumber = 'Enter a valid 10-digit phone number';
      }
    }

    if (!formData.about) {
      newErrors.about = 'About field is required';
    }

    if (!formData.skills) {
      newErrors.skills = 'Skills field is required';
    }

    if (!formData.linkedinId) {
      newErrors.linkedinId = 'LinkedIn ID is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (profileImageFile) {
        data.append('profilePic', profileImageFile); 
      }

      try {
        const res = await axios.post(
          'http://localhost:8000/alumni/add-mentor',
          data,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        alert(res.data.message);
      } catch (error) {
        console.log('Error while sending req to add mentor: ', error);
        alert('Operation Failed!');
      }
      setFormData({
        title: '',
        name: '',
        degreeBranchYear: '',
        email: '',
        contactNumber: '',
        about: '',
        skills: '',
        linkedinId: '',
      });
      setProfileImageFile(null); 
    }
  };

  const profileImageStyles = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '1rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#555',
    textAlign: 'center',
    padding: '5px'
  };

  const placeholderImageStyles = {
    ...profileImageStyles,
    border: '1px dashed #aaa',
    backgroundColor: '#f0f0f0',
  };

  return (
    <div className="form-container">
      <h2>Mentorship Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <select name="title" value={formData.title} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Ms.">Ms.</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Your Name: <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label>
            Email: <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>
            Degree/Branch/Year (Applicable for Alumni of IITI):{' '}
            <span className="required">*</span>
          </label>
          <input
            type="text"
            name="degreeBranchYear"
            value={formData.degreeBranchYear}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            Contact Number: <span className="required">*</span>
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          {errors.contactNumber && (
            <p className="error">{errors.contactNumber}</p>
          )}
        </div>

        <div className="form-group">
          <label>
            About Yourself: <span className="required">*</span>
          </label>
          <textarea 
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows="4"
          ></textarea>
          {errors.about && <p className="error">{errors.about}</p>}
        </div>

        <div className="form-group">
          <label>
            LinkedIn ID (Link): <span className="required">*</span>
          </label>
          <input
            type="text"
            name="linkedinId"
            value={formData.linkedinId}
            onChange={handleChange}
          />
          {errors.linkedinId && <p className="error">{errors.linkedinId}</p>}
        </div>

        <div className="form-group">
          <label>
            Skills/Expertise: <span className="required">*</span>
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
          />
          {errors.skills && <p className="error">{errors.skills}</p>}
        </div>

        {/* Profile Picture Upload Section */}
        <div className="form-group">
          <label>Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          {profileImageFile ? (
            <img
              src={URL.createObjectURL(profileImageFile)}
              alt="Profile Preview"
              style={profileImageStyles}
              onClick={() => fileInputRef.current.click()} 
              title="Click to change image"
            />
          ) : (
            <div
              style={placeholderImageStyles}
              onClick={() => fileInputRef.current.click()} 
              title="Click to upload image"
            >
              Click to Upload Profile Pic
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;