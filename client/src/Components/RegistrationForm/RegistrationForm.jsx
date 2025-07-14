import React, { useState } from 'react';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    yourName: '',
    degreeDeptYear: '',
    rollNumber: '',
    email: '',
    contactNumber: '',
    city: '',
    state: '',
    country: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.yourName) newErrors.yourName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Thank you for registering!');
      setFormData({
        title: '',
        yourName: '',
        degreeDeptYear: '',
        rollNumber: '',
        email: '',
        contactNumber: '',
        city: '',
        state: '',
        country: ''
      });
    }
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
          <label>Your Name:</label>
          <input type="text" name="yourName" value={formData.yourName} onChange={handleChange} />
          {errors.yourName && <p className="error">{errors.yourName}</p>}
        </div>

        <div className="form-group">
          <label>Degree/Dept./Year (Applicable for Alumni of IITI):</label>
          <input type="text" name="degreeDeptYear" value={formData.degreeDeptYear} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Roll Number:</label>
          <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email <span className="required">*</span>:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Contact Number <span className="required">*</span>:</label>
          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
        </div>

        <div className="form-group">
          <label>City:</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>State:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Country:</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-button">Submit</button>

      </form>
    </div>
  );
};

export default RegistrationForm;
