import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Plus,
  Check,
  Trash2,
  ExternalLink,
  Upload,
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Briefcase,
  Eye,
  Settings,
  Bell,
} from 'lucide-react';
import { API_BASE_URL } from '../api/alumni';
import RegistrationForm from '../Components/RegistrationForm/RegistrationForm';
import {
  FaEnvelope,
  FaLinkedin,
  FaUser,
  FaGraduationCap,
  FaWrench,
  FaCogs,
} from 'react-icons/fa';
import '../Components/MentorCard/MentorCard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // For Mentors
  const [mentors, setMentors] = useState([]);
  // to view mentors profiles
  const [mentorsData, setMentorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mentors');
  //CV Review
  const [submittedCVs, setSubmittedCVs] = useState([]);
  const [unseenCVCount, setUnseenCVCount] = useState(0);

  const fileInputRef = useRef(null);

  //to fetch mentors
  const fetchMentors = async () => {
    try {
      const res = await axios.get('http://localhost:8000/mentors/get', {
        withCredentials: true,
      });
      setMentorsData(res.data);
    } catch (error) {
      console.log(
        'Error while sending request to verified mentors route',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  //to delete mentor
  async function deleteMentor(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s profile?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/admin/delete-mentor/${id}`);
      fetchMentors();
    } catch (err) {
      console.error('Error deleting profile', err);
    }
  }

  useEffect(() => {
    // const fetchRoleAndMentors = async () => {
    //   try {
    //     const res2 = await axios.get(`${API_BASE_URL}/admin/pending-mentors`);
    //     setMentors(res2.data);
    //   } catch (error) {
    //     console.log('Error in useEffect:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchRoleAndMentors();

    fetchMentors();
  }, []);

  // Fetching CV submissions
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res3 = await axios.get(`${API_BASE_URL}/cv/getCV`);
        setSubmittedCVs(res3.data);

        // Count unseen CVs (logic: all are unseen unless already in list)
        if (res3.data.length > submittedCVs.length) {
          setUnseenCVCount(res3.data.length - submittedCVs.length);
        }
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Poll every 30s
    fetchCVs();
    const interval = setInterval(fetchCVs, 30000);
    return () => clearInterval(interval);
  }, [submittedCVs]);

  useEffect(() => {
    if (activeTab === 'cvs') {
      setUnseenCVCount(0);
    }
  }, [activeTab]);

  // const handleMentorsSubmit = async (e, alumniId) => {
  //   e.preventDefault();
  //   try {
  //     await axios.patch(`${API_BASE_URL}/admin/verify-alumni/${alumniId}`);
  //     alert('Alumni verified successfully.');

  //     const res2 = await axios.get(`${API_BASE_URL}/admin/pending-mentors`);
  //     setMentors(res2.data);
  //   } catch (err) {
  //     console.error('Error verifying alumni:', err);
  //     alert('Error verifying alumni.');
  //   }
  // };

  // For KYA
  const [profiles, setProfiles] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
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
      const res = await axios.get(`${API_BASE_URL}/admin/get-kya-profiles`);
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
    // Clear error for this field when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    // Clear image error when user selects a file
    if (formErrors.profilePic) {
      setFormErrors({ ...formErrors, profilePic: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Name.trim()) {
      errors.Name = 'Name is required';
    }

    if (!formData.Batch) {
      errors.Batch = 'Please select a batch';
    }

    if (!formData.CurrRole.trim()) {
      errors.CurrRole = 'Current role is required';
    }

    if (!formData.Achievement.trim()) {
      errors.Achievement = 'Achievement is required';
    }

    if (!formData.ShortBio.trim()) {
      errors.ShortBio = 'Short bio is required';
    }

    if (!imageFile) {
      errors.profilePic = 'Profile picture is required';
    }

    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
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
        `${API_BASE_URL}/admin/add-kya-profile`,
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
      setFormErrors({});
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
      await axios.delete(`${API_BASE_URL}/admin/delete-kya-profile/${id}`);
      fetchKyaProfiles();
    } catch (err) {
      console.error('Error deleting profile', err);
    }
  };

  const tabs = [
    {
      id: 'mentors',
      label: 'Mentor Verification',
      icon: Users,
      count: mentors.length,
    },
    {
      id: 'cvs',
      label: 'CV Reviews',
      icon: FileText,
      count: submittedCVs.length,
    },
    {
      id: 'profiles',
      label: 'Alumni Profiles',
      icon: Award,
      count: profiles.length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage mentors, reviews, and alumni profiles
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
                  onClick={() => {
                    setActiveTab('cvs'); // Switch to CV Reviews tab
                    setUnseenCVCount(0); // Reset notifications
                  }}
                >
                  <Bell className="w-6 h-6" />
                  {unseenCVCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {unseenCVCount}
                    </span>
                  )}
                </button>
              </div>
              {/* <button
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => navigate('/admin-settings')}
              >
                <Settings className="w-6 h-6" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            // <div>
            //   <div className="flex items-center justify-between mb-6">
            //     <h2 className="text-2xl font-semibold text-slate-900">Mentor Verification</h2>
            //     <div className="text-sm text-slate-500">
            //       {mentors.length} pending verifications
            //     </div>
            //   </div>

            //   {mentors.length === 0 ? (
            //     <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            //       <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            //       <h3 className="text-lg font-medium text-slate-900 mb-2">No pending mentors</h3>
            //       <p className="text-slate-600">All mentor applications have been processed.</p>
            //     </div>
            //   ) : (
            //     <div className="grid gap-6">
            //       {mentors.map(({ alumni, mentor }, index) => (
            //         <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            //           <div className="p-6">
            //             <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            //               {/* Profile Image */}
            //               {mentor && mentor.profilePic && (
            //                 <div className="flex-shrink-0">
            //                   <img
            //                     src={mentor.profilePic}
            //                     alt={`${mentor.name}'s profile`}
            //                     className="w-24 h-24 rounded-full object-cover border-4 border-slate-100"
            //                   />
            //                 </div>
            //               )}

            //               <div className="flex-1 space-y-6">
            //                 {/* Alumni Section */}
            //                 <div>
            //                   <div className="flex items-center mb-3">
            //                     <User className="w-5 h-5 text-blue-600 mr-2" />
            //                     <h3 className="text-lg font-semibold text-slate-900">Alumni Information</h3>
            //                   </div>
            //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //                     <div className="flex items-center">
            //                       <span className="text-sm text-slate-500 w-16">Name:</span>
            //                       <span className="text-sm font-medium text-slate-900">{alumni.alumniName}</span>
            //                     </div>
            //                     <div className="flex items-center">
            //                       <Mail className="w-4 h-4 text-slate-400 mr-2" />
            //                       <span className="text-sm text-slate-600">{alumni.alumniEmail}</span>
            //                     </div>
            //                     <div className="flex items-center">
            //                       <span className="text-sm text-slate-500 w-16">Status:</span>
            //                       <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            //                         alumni.status === 'pending'
            //                           ? 'bg-yellow-100 text-yellow-800'
            //                           : 'bg-green-100 text-green-800'
            //                       }`}>
            //                         {alumni.status}
            //                       </span>
            //                     </div>
            //                   </div>
            //                 </div>

            //                 {/* Mentor Section */}
            //                 <div>
            //                   <div className="flex items-center mb-3">
            //                     <Award className="w-5 h-5 text-green-600 mr-2" />
            //                     <h3 className="text-lg font-semibold text-slate-900">Mentor Profile</h3>
            //                   </div>

            //                   {mentor ? (
            //                     <div className="space-y-4">
            //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //                         <div>
            //                           <span className="text-sm text-slate-500">Title:</span>
            //                           <p className="text-sm font-medium text-slate-900">{mentor.title}</p>
            //                         </div>
            //                         <div>
            //                           <span className="text-sm text-slate-500">Name:</span>
            //                           <p className="text-sm font-medium text-slate-900">{mentor.name}</p>
            //                         </div>
            //                         <div>
            //                           <span className="text-sm text-slate-500">Degree:</span>
            //                           <p className="text-sm font-medium text-slate-900">{mentor.degreeBranchYear}</p>
            //                         </div>
            //                         <div>
            //                           <span className="text-sm text-slate-500">Contact:</span>
            //                           <p className="text-sm font-medium text-slate-900">{mentor.contactNumber}</p>
            //                         </div>
            //                       </div>

            //                       <div>
            //                         <span className="text-sm text-slate-500">About:</span>
            //                         <p className="text-sm text-slate-700 mt-1">{mentor.about}</p>
            //                       </div>

            //                       <div>
            //                         <span className="text-sm text-slate-500">Skills:</span>
            //                         <div className="flex flex-wrap gap-2 mt-1">
            //                           {mentor.skills.map((skill, index) => (
            //                             <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
            //                               {skill}
            //                             </span>
            //                           ))}
            //                         </div>
            //                       </div>

            //                       <div>
            //                         <span className="text-sm text-slate-500">LinkedIn:</span>
            //                         <a
            //                           href={mentor.linkedinId}
            //                           target="_blank"
            //                           rel="noopener noreferrer"
            //                           className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 ml-2"
            //                         >
            //                           View Profile <ExternalLink className="w-3 h-3 ml-1" />
            //                         </a>
            //                       </div>
            //                     </div>
            //                   ) : (
            //                     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            //                       <p className="text-red-800 text-sm">No mentor profile submitted yet.</p>
            //                     </div>
            //                   )}
            //                 </div>
            //               </div>
            //             </div>

            //             {/* Actions */}
            //             {alumni.status === 'pending' && mentor && (
            //               <div className="mt-6 pt-6 border-t border-slate-200">
            //                 <form onSubmit={(e) => handleMentorsSubmit(e, alumni._id)}>
            //                   <button
            //                     type="submit"
            //                     className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            //                   >
            //                     <Check className="w-4 h-4 mr-2" />
            //                     Verify Alumni
            //                   </button>
            //                 </form>
            //               </div>
            //             )}
            //           </div>
            //         </div>
            //       ))}
            //     </div>
            //   )}
            // </div>

            //added mentors form here
            // registration form for mentors
            <>
              <RegistrationForm />
              {/* //showing all mentors */}
              <h1 className="text-4xl">Mentors</h1>
              <div>
                {mentorsData.map((mentor) => (
                  <div className="mentor-card">
                    <div className="card-header">
                      <img
                        src={mentor.profilePic}
                        alt={mentor.name}
                        className="profile-photo"
                      />
                      <h3 className="mentor-name">{mentor.name}</h3>
                      <p className="mentor-degree">{mentor.degree}</p>
                      <div className="graduation-details">
                        <FaGraduationCap className="graduation-cap" />
                        <p className="graduation-year">
                          Class of {mentor.graduationYear}
                        </p>
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="section">
                        <h4 className="section-title">
                          <FaUser className="icon" />
                          About
                        </h4>
                        <p className="about-text">{mentor.about}</p>
                      </div>

                      <div className="section">
                        <h4 className="section-title">
                          <FaCogs className="icon" />
                          Skills
                        </h4>
                        <div className="skills-container">
                          {mentor.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="section">
                        <div className="contact-info">
                          {/* <div className="contact-item">
                            <FaEnvelope className="icon" />
                            <a
                              href={`mailto:${mentor.email}`}
                              className="contact-link"
                            >
                              {mentor.email}
                            </a>
                          </div> */}
                          <div className="contact-item">
                            <FaLinkedin className="icon" />
                            <a
                              href={mentor.linkedinId}
                              target="_blank"
                              rel="noopener n oreferrer"
                              className="contact-link"
                            >
                              LinkedIn
                            </a>
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                deleteMentor(mentor._id, mentor.name)
                              }
                              className="text-red-600 font-bold"
                            >
                              DELETE MENTOR
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CVs Tab */}
          {activeTab === 'cvs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  CV Reviews
                </h2>
                <div className="text-sm text-slate-500">
                  {submittedCVs.length} submissions
                </div>
              </div>

              {submittedCVs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No CVs submitted
                  </h3>
                  <p className="text-slate-600">
                    CV submissions will appear here for review.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {submittedCVs.map((cv, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="font-medium text-slate-900">
                              {cv.Name}
                            </span>
                            <span className="mx-2 text-slate-300">•</span>
                            <span className="text-sm text-slate-600">
                              {cv.Roll_No}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-600">
                              {cv.Student_Email}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="text-sm text-slate-600">
                              {cv.Target_Profile}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <a
                            href={cv.CV_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View CV
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Alumni Profiles
                </h2>
                <div className="text-sm text-slate-500">
                  {profiles.length} profiles
                </div>
              </div>

              {/* Add Profile Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Add New Alumni Profile
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrors.Name
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-300'
                        }`}
                        placeholder="Enter full name"
                      />
                      {formErrors.Name && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.Name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Batch
                      </label>
                      <select
                        name="Batch"
                        value={formData.Batch}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrors.Batch
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-300'
                        }`}
                      >
                        <option value="">Select Batch</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {formErrors.Batch && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.Batch}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Current Role
                      </label>
                      <input
                        type="text"
                        name="CurrRole"
                        value={formData.CurrRole}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrors.CurrRole
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-300'
                        }`}
                        placeholder="e.g., Software Engineer at Google"
                      />
                      {formErrors.CurrRole && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.CurrRole}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Achievement
                      </label>
                      <input
                        type="text"
                        name="Achievement"
                        value={formData.Achievement}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrors.Achievement
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-300'
                        }`}
                        placeholder="Key achievement or recognition"
                      />
                      {formErrors.Achievement && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.Achievement}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Short Bio
                    </label>
                    <textarea
                      name="ShortBio"
                      value={formData.ShortBio}
                      onChange={handleChange}
                      required
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                        formErrors.ShortBio
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300'
                      }`}
                      placeholder="Brief description about the alumni..."
                    />
                    {formErrors.ShortBio && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.ShortBio}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />

                    <div className="flex items-center space-x-6">
                      {imageFile ? (
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Profile Preview"
                          className={`w-24 h-24 rounded-full object-cover border-4 cursor-pointer hover:border-blue-300 transition-colors ${
                            formErrors.profilePic
                              ? 'border-red-300'
                              : 'border-slate-100'
                          }`}
                          onClick={() => fileInputRef.current.click()}
                          title="Click to change image"
                        />
                      ) : (
                        <div
                          onClick={() => fileInputRef.current.click()}
                          className={`w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors ${
                            formErrors.profilePic
                              ? 'border-red-300 bg-red-50'
                              : 'border-slate-300'
                          }`}
                        >
                          <Upload className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current.click()}
                          className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {imageFile ? 'Change Image' : 'Upload Image'}
                        </button>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {formErrors.profilePic && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.profilePic}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Profile
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Profiles */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Existing Profiles
                </h3>
                {profiles.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
                    <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No profiles yet
                    </h3>
                    <p className="text-slate-600">
                      Add the first alumni profile above.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {profiles.map((profile) => (
                      <div
                        key={profile._id}
                        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                      >
                        <div className="flex items-start space-x-4">
                          {profile.profilePic && (
                            <img
                              src={profile.profilePic}
                              alt={`${profile.Name}'s profile`}
                              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900">
                                  {profile.Name}
                                </h4>
                                <div className="flex items-center mt-1 space-x-4 text-sm text-slate-600">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Batch {profile.Batch}
                                  </div>
                                  <div className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1" />
                                    {profile.CurrRole}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                    <Award className="w-3 h-3 mr-1" />
                                    {profile.Achievement}
                                  </span>
                                </div>
                                <p className="text-slate-600 text-sm mt-3">
                                  {profile.ShortBio}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleDelete(profile._id, profile.Name)
                                }
                                className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
