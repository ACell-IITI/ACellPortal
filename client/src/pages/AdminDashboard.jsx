import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  BookOpen,
  BookOpenText,
} from "lucide-react";
import { API_BASE_URL } from "../api/alumni";
import RegistrationForm from "../Components/RegistrationForm/RegistrationForm";
import {
  FaEnvelope,
  FaLinkedin,
  FaUser,
  FaGraduationCap,
  FaWrench,
  FaCogs,
} from "react-icons/fa";
import "../Components/MentorCard/MentorCard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  // For Mentors
  const [mentors, setMentors] = useState([]);
  // to view mentors profiles
  const [mentorsData, setMentorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mentors");
  //CV Review
  //const [submittedCVs, setSubmittedCVs] = useState([]);
  //const [unseenCVCount, setUnseenCVCount] = useState(0);

  // SPONSORS
  const [sponsors, setSponsors] = useState([]);
  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    type: "",
  });

  const [sponsorLogo, setSponsorLogo] = useState(null);
  const sponsorLogoRef = useRef(null);

  // ALUMNI CONTRIBUTIONS
  const [alumniContributions, setAlumniContributions] = useState([]);
  const [contributionForm, setContributionForm] = useState({
    name: "",
    batch: "",
  });
  const [contributionPhoto, setContributionPhoto] = useState(null);
  const contributionPhotoRef = useRef(null);

  const fetchSponsors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sponsors/sponsors`);
      setSponsors(res.data);
    } catch (err) {
      console.error("Error fetching sponsors:", err);
    }
  };

  const fetchAlumniContributions = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/get-alumni-contributions`,
      );
      setAlumniContributions(res.data);
    } catch (err) {
      console.error("Error fetching alumni contributions:", err);
    }
  };

  useEffect(() => {
    fetchSponsors();
    fetchAlumniContributions();
  }, []);

  const handleSponsorLogoChange = (e) => {
    setSponsorLogo(e.target.files[0]);
  };

  const handleAddSponsor = async (e) => {
    e.preventDefault();

    if (!sponsorForm.name || !sponsorForm.type || !sponsorLogo) {
      alert("All fields including logo are required");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", sponsorForm.name);
      data.append("type", sponsorForm.type);
      data.append("logo", sponsorLogo);

      await axios.post(`${API_BASE_URL}/api/sponsors/admin/add-sponsor`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSponsorForm({ name: "", type: "" });
      setSponsorLogo(null);
      fetchSponsors();
    } catch (err) {
      console.error("Error adding sponsor:", err);
    }
  };

  const handleDeleteSponsor = async (id, name) => {
    if (!window.confirm(`Delete sponsor "${name}"?`)) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/sponsors/admin/delete-sponsor/${id}`,
      );
      fetchSponsors();
    } catch (err) {
      console.error("Error deleting sponsor:", err);
    }
  };

  const handleContributionPhotoChange = (e) => {
    setContributionPhoto(e.target.files[0]);
  };

  const handleAddAlumniContribution = async (e) => {
    e.preventDefault();

    if (
      !contributionForm.name ||
      !contributionForm.batch ||
      !contributionPhoto
    ) {
      alert("Please fill all fields and upload a photo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", contributionForm.name);
      formData.append("batch", contributionForm.batch);
      formData.append("photo", contributionPhoto);

      await axios.post(
        `${API_BASE_URL}/api/admin/add-alumni-contribution`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Alumni contribution added successfully!");
      setContributionForm({ name: "", batch: "" });
      setContributionPhoto(null);
      fetchAlumniContributions();
    } catch (err) {
      console.error("Error adding alumni contribution:", err);
      alert("Error adding alumni contribution.");
    }
  };

  const handleDeleteAlumniContribution = async (id, name) => {
    if (!window.confirm(`Delete alumni contribution for "${name}"?`)) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/delete-alumni-contribution/${id}`,
      );
      fetchAlumniContributions();
    } catch (err) {
      console.error("Error deleting alumni contribution:", err);
    }
  };

  //Gallery
  const [gallery, setGallery] = useState([]);
  const [galleryImageFile, setGalleryImageFile] = useState(null);
  const fileInputRefGallery = useRef(null);

  const fileInputRef = useRef(null);

  // when file is selected
  const handleImageChangeGallery = (e) => {
    setGalleryImageFile(e.target.files[0]);
  };

  // submit new image
  const handleSubmitGallery = async (e) => {
    e.preventDefault();

    if (!galleryImageFile) return;

    const formData = new FormData();
    formData.append("image", galleryImageFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setGallery((prev) => [data, ...prev]); // add new photo on top
      setGalleryImageFile(null); // reset file
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error("Error fetching gallery:", err));
  }, []);

  // delete photo
  const handleDeleteGallery = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
      });
      setGallery((prev) => prev.filter((photo) => photo._id !== id));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  //to fetch mentors
  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/mentors/get`, {
        withCredentials: true,
      });
      setMentorsData(res.data);
    } catch (error) {
      console.log(
        "Error while sending request to verified mentors route",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  //to delete mentor
  async function deleteMentor(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s profile?`,
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-mentor/${id}`);
      fetchMentors();
    } catch (err) {
      console.error("Error deleting profile", err);
    }
  }

  useEffect(() => {
    // const fetchRoleAndMentors = async () => {
    //   try {
    //     const res2 = await axios.get(`${API_BASE_URL}/api/admin/pending-mentors`);
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
  {
    /*useEffect(() => {
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
  */
  }

  // const handleMentorsSubmit = async (e, alumniId) => {
  //   e.preventDefault();
  //   try {
  //     await axios.patch(`${API_BASE_URL}/api/admin/verify-alumni/${alumniId}`);
  //     alert('Alumni verified successfully.');

  //     const res2 = await axios.get(`${API_BASE_URL}/api/admin/pending-mentors`);
  //     setMentors(res2.data);
  //   } catch (err) {
  //     console.error('Error verifying alumni:', err);
  //     alert('Error verifying alumni.');
  //   }
  // };

  // For Programs and Events
  const [programs, setPrograms] = useState([]);
  const [imageFilepro, setImageFilepro] = useState(null);
  const [formErrorspro, setFormErrorspro] = useState({});
  const [formDataprogram, setFormDataprogram] = useState({
    type: "program",
    image: "",
    title: "",
    date: "",
    time: "",
    venue: "",
    attendance: "",
    about: "",
  });

  // For Upcoming Events
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [imageFileUpcoming, setImageFileUpcoming] = useState(null);
  const [formErrorsUpcoming, setFormErrorsUpcoming] = useState({});
  const [formDataUpcoming, setFormDataUpcoming] = useState({
    type: "upcoming-event",
    image: "",
    title: "",
    date: "",
    venue: "",
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/get-programs`);
        setPrograms(res.data.data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/admin/get-upcoming-events`,
        );
        setUpcomingEvents(res.data.data);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
      }
    };

    fetchPrograms();
    fetchUpcomingEvents();
  }, []);

  const handleChangeprogram = (e) => {
    setFormDataprogram({ ...formDataprogram, [e.target.name]: e.target.value });

    if (formErrorspro[e.target.name]) {
      setFormErrorspro({ ...formErrorspro, [e.target.name]: "" });
    }
  };

  const handleImageChangeprogram = (e) => {
    setImageFilepro(e.target.files[0]);

    if (formErrorspro.image) {
      setFormErrorspro({ ...formErrorspro, image: "" });
    }
  };

  const validateProgramForm = () => {
    const errors = {};
    if (!formDataprogram.title.trim()) errors.title = "Title is required";
    if (!formDataprogram.date.trim()) errors.date = "Date is required";
    if (!formDataprogram.time.trim()) errors.time = "Time is required";
    if (!formDataprogram.venue.trim()) errors.venue = "Venue is required";
    if (!formDataprogram.attendance.trim())
      errors.attendance = "Attendance is required";
    if (!formDataprogram.about.trim()) errors.about = "Description is required";
    if (!imageFilepro) errors.image = "Program/Event image is required";
    return errors;
  };

  const handleSubmitprogram = async (e) => {
    e.preventDefault();
    const errors = validateProgramForm();
    if (Object.keys(errors).length > 0) {
      setFormErrorspro(errors);
      return;
    }

    try {
      const data = new FormData();
      data.append("type", formDataprogram.type);
      data.append("title", formDataprogram.title);
      data.append("date", formDataprogram.date);
      data.append("time", formDataprogram.time);
      data.append("venue", formDataprogram.venue);
      data.append("attendance", formDataprogram.attendance); // ✅ NEW
      data.append("about", formDataprogram.about); // ✅ NEW
      data.append("image", imageFilepro);

      await axios.post(`${API_BASE_URL}/api/admin/add-program`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Program/Event added successfully!");

      setFormDataprogram({
        type: "program",
        image: "",
        title: "",
        date: "",
        time: "",
        venue: "",
        attendance: "",
        about: "",
      });
      setImageFilepro(null);
      setFormErrorspro({});

      const res = await axios.get(`${API_BASE_URL}/api/admin/get-programs`);
      setPrograms(res.data.data);
    } catch (err) {
      console.error("Error adding program:", err);
    }
  };

  const handleDeleteProgram = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-program/${id}`);
      const resPrograms = await axios.get(
        `${API_BASE_URL}/api/admin/get-programs`,
      );
      setPrograms(resPrograms.data.data);
    } catch (err) {
      console.error("Error deleting program:", err);
    }
  };

  const handleDeleteUpcomingEvent = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/delete-upcoming-event/${id}`,
      );
      const resUpcoming = await axios.get(
        `${API_BASE_URL}/api/admin/get-upcoming-events`,
      );
      setUpcomingEvents(resUpcoming.data.data);
    } catch (err) {
      console.error("Error deleting upcoming event:", err);
    }
  };

  // Handlers for Upcoming Events
  const handleChangeUpcoming = (e) => {
    setFormDataUpcoming({
      ...formDataUpcoming,
      [e.target.name]: e.target.value,
    });

    if (formErrorsUpcoming[e.target.name]) {
      setFormErrorsUpcoming({ ...formErrorsUpcoming, [e.target.name]: "" });
    }
  };

  const handleImageChangeUpcoming = (e) => {
    setImageFileUpcoming(e.target.files[0]);

    if (formErrorsUpcoming.image) {
      setFormErrorsUpcoming({ ...formErrorsUpcoming, image: "" });
    }
  };

  const validateUpcomingForm = () => {
    const errors = {};
    if (!formDataUpcoming.title.trim()) errors.title = "Title is required";
    if (!formDataUpcoming.date.trim()) errors.date = "Date is required";
    if (!formDataUpcoming.venue.trim()) errors.venue = "Venue is required";
    if (!imageFileUpcoming) errors.image = "Event image is required";
    return errors;
  };

  const handleSubmitUpcoming = async (e) => {
    e.preventDefault();
    const errors = validateUpcomingForm();
    if (Object.keys(errors).length > 0) {
      setFormErrorsUpcoming(errors);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formDataUpcoming.title);
      data.append("date", formDataUpcoming.date);
      data.append("venue", formDataUpcoming.venue);
      data.append("image", imageFileUpcoming);

      await axios.post(`${API_BASE_URL}/api/admin/add-upcoming-event`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upcoming Event added successfully!");

      setFormDataUpcoming({
        type: "upcoming-event",
        image: "",
        title: "",
        date: "",
        venue: "",
      });
      setImageFileUpcoming(null);
      setFormErrorsUpcoming({});

      const resPrograms = await axios.get(
        `${API_BASE_URL}/api/admin/get-programs`,
      );
      setPrograms(resPrograms.data.data);

      const resUpcoming = await axios.get(
        `${API_BASE_URL}/api/admin/get-upcoming-events`,
      );
      setUpcomingEvents(resUpcoming.data.data);
    } catch (err) {
      console.error("Error adding upcoming event:", err);
    }
  };

  // For KYA
  const [profiles, setProfiles] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    Name: "",
    Batch: "",
    CurrRole: "",
    Achievement: "",
    ShortBio: "",
    profilePic: "",
    LinkedInPostLink: "",
  });

  const fetchKyaProfiles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/get-kya-profiles`);
      setProfiles(res.data.data);
    } catch (err) {
      console.error("Error fetching profiles", err);
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
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    // Clear image error when user selects a file
    if (formErrors.profilePic) {
      setFormErrors({ ...formErrors, profilePic: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Name.trim()) {
      errors.Name = "Name is required";
    }

    if (!formData.Batch) {
      errors.Batch = "Please select a batch";
    }

    if (!formData.CurrRole.trim()) {
      errors.CurrRole = "Current role is required";
    }

    if (!formData.Achievement.trim()) {
      errors.Achievement = "Achievement is required";
    }

    if (!formData.ShortBio.trim()) {
      errors.ShortBio = "Short bio is required";
    }

    if (!imageFile) {
      errors.profilePic = "Profile picture is required";
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
      data.append("Name", formData.Name);
      data.append("Batch", formData.Batch);
      data.append("CurrRole", formData.CurrRole);
      data.append("Achievement", formData.Achievement);
      data.append("ShortBio", formData.ShortBio);
      data.append("LinkedInPostLink", formData.LinkedInPostLink);
      console.log(formData.LinkedInPostLink);
      if (imageFile) {
        data.append("profilePic", imageFile);
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/admin/add-kya-profile`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      fetchKyaProfiles();

      setFormData({
        Name: "",
        Batch: "",
        CurrRole: "",
        Achievement: "",
        ShortBio: "",
        LinkedInPostLink: "",
      });
      setImageFile(null);
      setFormErrors({});
    } catch (err) {
      console.error("Error adding profile:", err);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s profile?`,
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-kya-profile/${id}`);
      fetchKyaProfiles();
    } catch (err) {
      console.error("Error deleting profile", err);
    }
  };

  // STATE VARIABLES
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const [newsletterFile, setNewsletterFile] = useState(null);
  const [newsletters, setNewsletters] = useState([]);
  const [magazineTitle, setMagazineTitle] = useState("");
  const [magazineFile, setMagazineFile] = useState(null);
  const [magazines, setMagazines] = useState([]);

  // YEARBOOK STATE VARIABLES (dynamic multi-option & cover images)
  const [yearbookTitle, setYearbookTitle] = useState("");
  const [yearbookOptions, setYearbookOptions] = useState([
    { title: "", pdfUrl: "", imageFile: null }
  ]);
  const [yearbooks, setYearbooks] = useState([]);
  const [addingOptionForId, setAddingOptionForId] = useState(null);
  const [newOptTitle, setNewOptTitle] = useState("");
  const [newOptLink, setNewOptLink] = useState("");
  const [newOptFile, setNewOptFile] = useState(null);

  // FETCH EXISTING pdfs
  useEffect(() => {
    fetchNewsletters();
    fetchMagazines();
    fetchYearbooks(); // fetch yearbooks as well
  }, []);

  const fetchNewsletters = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/get-newsletters`);
      setNewsletters(res.data.data);
    } catch (err) {
      console.error("Error fetching newsletters:", err);
    }
  };

  const fetchMagazines = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/get-magazines`);
      setMagazines(res.data.data);
    } catch (err) {
      console.error("Error fetching magazines:", err);
    }
  };

  // FETCH YEARBOOKS (mirror magazines)
  const fetchYearbooks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/get-yearbooks`);
      setYearbooks(res.data.data);
    } catch (err) {
      console.error("Error fetching yearbooks:", err);
    }
  };

  //HANDLE UPLOAD
  const handleNewsletterUpload = async (e) => {
    e.preventDefault();
    if (!newsletterTitle || !newsletterFile) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("title", newsletterTitle);
    formData.append("pdf", newsletterFile);

    try {
      await axios.post(`${API_BASE_URL}/api/admin/add-newsletter`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Newsletter uploaded!");
      setNewsletterTitle("");
      setNewsletterFile(null);
      fetchNewsletters();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    } finally {
      // Reset file input
      const fileInput = document.getElementById("newsletterFileInput");
      if (fileInput) fileInput.value = "";
    }
  };

  //HANDLE DELETE
  const handleDeleteNewsletter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this newsletter?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-newsletter/${id}`, {
        withCredentials: true,
      });

      alert("Newsletter deleted successfully!");
      fetchNewsletters();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete newsletter!");
    }
  };

  //HANDLE MAGAZINE UPLOAD
  const handleMagazineUpload = async (e) => {
    e.preventDefault();
    if (!magazineTitle || !magazineFile) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("title", magazineTitle);
    formData.append("pdf", magazineFile);

    try {
      await axios.post(`${API_BASE_URL}/api/admin/add-magazine`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Magazine uploaded!");
      setMagazineTitle("");
      setMagazineFile(null);
      fetchMagazines();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    } finally {
      //Reset file input
      const fileInput = document.getElementById("magazineFileInput");
      if (fileInput) fileInput.value = "";
    }
  };
  //HANDLE DELETE
  const handleDeleteMagazine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this magazine?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-magazine/${id}`, {
        withCredentials: true,
      });

      alert("Magazine deleted successfully!");
      fetchMagazines();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete magazine!");
    }
  };

  // YEARBOOK HANDLERS
  const handleAddOptionRow = () => {
    setYearbookOptions((prev) => [
      ...prev,
      { title: "", pdfUrl: "", imageFile: null }
    ]);
  };

  const handleRemoveOptionRow = (index) => {
    setYearbookOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, field, value) => {
    setYearbookOptions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleYearbookUpload = async (e) => {
    e.preventDefault();
    if (!yearbookTitle) return alert("Please enter Yearbook Title/Year");

    const validOptions = yearbookOptions.filter(
      (opt) => opt.title.trim() && opt.pdfUrl.trim()
    );

    if (validOptions.length === 0) {
      return alert("Please add at least one valid option with Title and Drive Link");
    }

    const formData = new FormData();
    formData.append("title", yearbookTitle);
    formData.append(
      "options",
      JSON.stringify(
        validOptions.map((opt) => ({
          title: opt.title,
          pdfUrl: opt.pdfUrl,
        }))
      )
    );

    validOptions.forEach((opt, idx) => {
      if (opt.imageFile) {
        formData.append(`option_image_${idx}`, opt.imageFile);
      }
    });

    try {
      await axios.post(`${API_BASE_URL}/api/admin/add-yearbook`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Yearbook added successfully!");
      setYearbookTitle("");
      setYearbookOptions([{ title: "", pdfUrl: "", imageFile: null }]);
      fetchYearbooks();
    } catch (err) {
      console.error("Upload error:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error";
      alert("Upload failed: " + errMsg);
    }
  };

  const handleAddOptionToYearbook = async (yearbookId) => {
    if (!newOptTitle || !newOptLink) {
      return alert("Option title and link are required");
    }

    const formData = new FormData();
    formData.append("title", newOptTitle);
    formData.append("pdfUrl", newOptLink);
    if (newOptFile) {
      formData.append("coverImage", newOptFile);
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/add-yearbook-option/${yearbookId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert("Option added to yearbook!");
      setAddingOptionForId(null);
      setNewOptTitle("");
      setNewOptLink("");
      setNewOptFile(null);
      fetchYearbooks();
    } catch (err) {
      console.error("Error adding option:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error";
      alert("Failed to add option: " + errMsg);
    }
  };

  const handleDeleteYearbookOption = async (yearbookId, optionId) => {
    if (!window.confirm("Are you sure you want to delete this option?")) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/delete-yearbook-option/${yearbookId}/${optionId}`,
        { withCredentials: true }
      );
      alert("Option deleted!");
      fetchYearbooks();
    } catch (err) {
      console.error("Delete option error:", err);
      alert("Failed to delete option!");
    }
  };

  // HANDLE DELETE YEARBOOK
  const handleDeleteYearbook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entire yearbook?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-yearbook/${id}`, {
        withCredentials: true,
      });

      alert("Yearbook deleted successfully!");
      fetchYearbooks();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete yearbook!");
    }
  };

  const tabs = [
    {
      id: "mentors",
      label: "Mentor Verification",
      icon: Users,
      count: mentors.length,
    },
    {
      id: "programs",
      label: "Events",
      icon: Users,
      count: programs.length,
    },
    {
      id: "upcoming-events",
      label: "Upcoming Events",
      icon: Calendar,
      count: upcomingEvents.length,
    },
    {
      id: "profiles",
      label: "KYA Profiles",
      icon: Award,
      count: profiles.length,
    },
    {
      id: "gallery",
      label: "Add to gallery",
      icon: Upload,
    },
    {
      id: "newsletters",
      label: "Newsletters",
      icon: BookOpenText,
      // count: newsletters.length,
    },
    {
      id: "magazines",
      label: "Magazines",
      icon: BookOpen,
      // count: magazines.length,
    },
    {
      id: "yearbooks",
      label: "Yearbooks",
      icon: BookOpenText,
    },
    {
      id: "sponsors",
      label: "Sponsors",
      icon: Award,
      count: sponsors.length,
    },
    {
      id: "alumni-contributions",
      label: "Alumni Contributions",
      icon: Users,
      count: alumniContributions.length,
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage mentors, reviews, and KYA profiles
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/*<button
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative"
                  onClick={() => {
                    setActiveTab('cvs'); // Switch to CV Reviews tab
                    setUnseenCVCount(0); // Reset notifications
                    setActiveTab('mentors'); // Switch to CV Reviews tab
                    (0); // Reset notifications
                  }}
                >
                  <Bell className="w-6 h-6" />
                  {unseenCVCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {unseenCVCount}
                    </span>
                  )}
                </button>
                </button>*/}
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
        <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-xl mb-8 border border-slate-200 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg 
                  text-[10px] sm:text-sm md:text-base font-medium 
                  transition-all duration-200 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
            >
              {/* icon – hide on very small screens */}
              <tab.icon className="hidden sm:block w-4 h-4 mr-2" />

              {tab.label}

              {tab.count > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center 
                      min-w-[1.5rem] h-5 px-1.5 text-[10px] font-semibold 
                      rounded-full ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-200 text-slate-600"
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
          {activeTab === "mentors" && (
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

          {/* Programs/Events Tab */}
          {activeTab === "programs" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Events
                </h2>
                <div className="text-sm text-slate-500"></div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Add New Event
                </h3>

                <form onSubmit={handleSubmitprogram} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formDataprogram.type}
                        onChange={handleChangeprogram}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      >
                        <option value="event">Event</option>
                        <option value="program">Program</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-4">
                        Event Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChangeprogram}
                        ref={fileInputRef}
                        className="hidden"
                      />

                      <div className="flex items-center space-x-6">
                        {imageFilepro ? (
                          <img
                            src={URL.createObjectURL(imageFilepro)}
                            alt="Program Preview"
                            className={`w-24 h-24 rounded-full object-cover border-4 cursor-pointer hover:border-blue-300 transition-colors ${
                              formErrorspro.image
                                ? "border-red-300"
                                : "border-slate-100"
                            }`}
                            onClick={() => fileInputRef.current.click()}
                            title="Click to change image"
                          />
                        ) : (
                          <div
                            onClick={() => fileInputRef.current.click()}
                            className={`w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors ${
                              formErrorspro.image
                                ? "border-red-300 bg-red-50"
                                : "border-slate-300"
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
                            {imageFilepro ? "Change Image" : "Upload Image"}
                          </button>
                          <p className="text-xs text-slate-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                      {formErrorspro.image && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrorspro.image}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formDataprogram.title}
                        onChange={handleChangeprogram}
                        required
                        placeholder="Enter title"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formDataprogram.venue}
                        onChange={handleChangeprogram}
                        required
                        placeholder="Enter venue"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        name="date"
                        value={formDataprogram.date}
                        onChange={handleChangeprogram}
                        required
                        placeholder="e.g. July 6, 2025"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Time
                      </label>
                      <input
                        type="text"
                        name="time"
                        value={formDataprogram.time}
                        onChange={handleChangeprogram}
                        required
                        placeholder="e.g. 6:00 PM"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Attendance
                      </label>
                      <input
                        type="text"
                        name="attendance"
                        value={formDataprogram.attendance}
                        onChange={handleChangeprogram}
                        required
                        placeholder="e.g. 120 students"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrorspro.attendance
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
                        }`}
                      />
                      {formErrorspro.attendance && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrorspro.attendance}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="about"
                        value={formDataprogram.about}
                        onChange={handleChangeprogram}
                        rows={4}
                        placeholder="Enter a short description of the program/event"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrorspro.about
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
                        }`}
                      />
                      {formErrorspro.about && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrorspro.about}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Add Event / Program
                    </button>
                  </div>
                </form>
              </div>
              <h1 className="text-4xl mb-4">Programs / Events</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => (
                  <div
                    key={program._id}
                    className=" border  p-4 rounded-lg shadow"
                  >
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="text-xl font-semibold">{program.type}</h3>
                    <h3 className="text-xl font-semibold">{program.title}</h3>
                    <p className="text-sm text-gray-500">
                      📅 {program.date} ⏰ {program.time}
                    </p>
                    <p className="text-sm text-gray-500">📍 {program.venue}</p>
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          handleDeleteProgram(program._id, program.title)
                        }
                        className="text-red-600 font-bold mt-2"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events Tab */}
          {activeTab === "upcoming-events" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Upcoming Events
                </h2>
                <div className="text-sm text-slate-500"></div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Add New Upcoming Event
                </h3>

                <form onSubmit={handleSubmitUpcoming} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Event Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChangeUpcoming}
                        ref={fileInputRef}
                        className="hidden"
                      />

                      <div className="flex items-center space-x-6">
                        {imageFileUpcoming ? (
                          <img
                            src={URL.createObjectURL(imageFileUpcoming)}
                            alt="Event Preview"
                            className={`w-24 h-24 rounded-full object-cover border-4 cursor-pointer hover:border-blue-300 transition-colors ${
                              formErrorsUpcoming.image
                                ? "border-red-300"
                                : "border-slate-100"
                            }`}
                            onClick={() => fileInputRef.current.click()}
                            title="Click to change image"
                          />
                        ) : (
                          <div
                            onClick={() => fileInputRef.current.click()}
                            className={`w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors ${
                              formErrorsUpcoming.image
                                ? "border-red-300 bg-red-50"
                                : "border-slate-300"
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
                            {imageFileUpcoming
                              ? "Change Image"
                              : "Upload Image"}
                          </button>
                          <p className="text-xs text-slate-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                      {formErrorsUpcoming.image && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrorsUpcoming.image}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formDataUpcoming.title}
                        onChange={handleChangeUpcoming}
                        required
                        placeholder="Enter event title"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        name="venue"
                        value={formDataUpcoming.venue}
                        onChange={handleChangeUpcoming}
                        required
                        placeholder="Enter venue"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        name="date"
                        value={formDataUpcoming.date}
                        onChange={handleChangeUpcoming}
                        required
                        placeholder="e.g. July 6, 2025"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow border-slate-300"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Add Upcoming Event
                    </button>
                  </div>
                </form>
              </div>
              <h1 className="text-4xl mb-4">Upcoming Events</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className=" border  p-4 rounded-lg shadow"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-500">📅 {event.date}</p>
                    <p className="text-sm text-gray-500">📍 {event.venue}</p>
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          handleDeleteUpcomingEvent(event._id, event.title)
                        }
                        className="text-red-600 font-bold mt-2"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* newsletters tab */}
          {activeTab === "newsletters" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upload Newsletter</h2>
              <form onSubmit={handleNewsletterUpload} className="space-y-4">
                <input
                  type="text"
                  placeholder="Newsletter Title"
                  value={newsletterTitle}
                  onChange={(e) => setNewsletterTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <input
                  type="file"
                  id="newsletterFileInput"
                  accept="application/pdf"
                  onChange={(e) => setNewsletterFile(e.target.files[0])}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Upload Newsletter
                </button>
              </form>

              <h3 className="text-xl mt-8 mb-4">All Newsletters</h3>
              <ul>
                {newsletters.map((nl) => (
                  <li
                    key={nl._id}
                    className="mb-2 flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <a
                      href={nl.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {nl.title}
                    </a>

                    <button
                      onClick={() => handleDeleteNewsletter(nl._id)}
                      className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* magazines tab */}
          {activeTab === "magazines" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upload Magazine</h2>
              <form onSubmit={handleMagazineUpload} className="space-y-4">
                <input
                  type="text"
                  placeholder="Magazine Title"
                  value={magazineTitle}
                  onChange={(e) => setMagazineTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
                <input
                  type="file"
                  id="magazineFileInput"
                  accept="application/pdf"
                  onChange={(e) => setMagazineFile(e.target.files[0])}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Upload Magazine
                </button>
              </form>

              <h3 className="text-xl mt-8 mb-4">All Magazines</h3>
              <ul>
                {magazines.map((mg) => (
                  <li
                    key={mg._id}
                    className="mb-2 flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <a
                      href={mg.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {mg.title}
                    </a>

                    <button
                      onClick={() => handleDeleteMagazine(mg._id)}
                      className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* yearbooks tab */}
          {activeTab === "yearbooks" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Add Yearbook Collection / Year</h2>
              <form onSubmit={handleYearbookUpload} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yearbook Title / Year (e.g. "Yearbook 2024" or "Batch of 2024")
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yearbook 2024"
                    value={yearbookTitle}
                    onChange={(e) => setYearbookTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gray-800">Yearbook Options (e.g. UG, PG, Full)</h3>
                    <button
                      type="button"
                      onClick={handleAddOptionRow}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1.5 rounded-md font-medium transition"
                    >
                      + Add Option
                    </button>
                  </div>

                  {yearbookOptions.map((opt, index) => (
                    <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-600">Option #{index + 1}</span>
                        {yearbookOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionRow(index)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Option Name (e.g. UG Yearbook)</label>
                          <input
                            type="text"
                            placeholder="Option Name"
                            value={opt.title}
                            onChange={(e) => handleOptionChange(index, "title", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Google Drive Link</label>
                          <input
                            type="url"
                            placeholder="Drive Link"
                            value={opt.pdfUrl}
                            onChange={(e) => handleOptionChange(index, "pdfUrl", e.target.value)}
                            className="w-full px-3 py-1.5 border rounded text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Cover Image (Optional)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleOptionChange(index, "imageFile", e.target.files[0])}
                            className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
                >
                  Create Yearbook Entry
                </button>
              </form>

              <h3 className="text-xl font-bold mt-10 mb-4 text-gray-800">All Yearbooks</h3>
              <div className="space-y-4">
                {yearbooks && yearbooks.length > 0 ? (
                  yearbooks.map((yb) => (
                    <div
                      key={yb._id}
                      className="bg-white border rounded-xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="text-xl font-bold text-[#0F2A5A]">{yb.title}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAddingOptionForId(addingOptionForId === yb._id ? null : yb._id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
                          >
                            {addingOptionForId === yb._id ? "Cancel" : "+ Add Option"}
                          </button>
                          <button
                            onClick={() => handleDeleteYearbook(yb._id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition"
                          >
                            Delete Entire Year
                          </button>
                        </div>
                      </div>

                      {/* Inline Add Option Form */}
                      {addingOptionForId === yb._id && (
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg space-y-3">
                          <h5 className="font-semibold text-sm text-emerald-900">Add Option to "{yb.title}"</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Option Name (e.g. PG Yearbook)"
                              value={newOptTitle}
                              onChange={(e) => setNewOptTitle(e.target.value)}
                              className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                            />
                            <input
                              type="url"
                              placeholder="Google Drive Link"
                              value={newOptLink}
                              onChange={(e) => setNewOptLink(e.target.value)}
                              className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setNewOptFile(e.target.files[0])}
                              className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-emerald-700"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddOptionToYearbook(yb._id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-md transition"
                          >
                            Save Option
                          </button>
                        </div>
                      )}

                      {/* List of Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        {yb.options && yb.options.length > 0 ? (
                          yb.options.map((opt) => (
                            <div key={opt._id} className="flex flex-col bg-gray-50 border rounded-lg p-3 justify-between">
                              <div className="space-y-2">
                                {opt.imageUrl ? (
                                  <img
                                    src={opt.imageUrl}
                                    alt={opt.title}
                                    className="w-full h-32 object-cover rounded-md shadow-sm"
                                  />
                                ) : (
                                  <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                                    No Image
                                  </div>
                                )}
                                <div className="font-semibold text-sm text-gray-800">{opt.title}</div>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs">
                                <a
                                  href={opt.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 font-medium hover:underline truncate max-w-[140px]"
                                >
                                  View Link
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteYearbookOption(yb._id, opt._id)}
                                  className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                  Delete Option
                                </button>
                              </div>
                            </div>
                          ))
                        ) : yb.pdfUrl ? (
                          /* Legacy Single Option Fallback */
                          <div className="flex flex-col bg-gray-50 border rounded-lg p-3 justify-between">
                            <div className="font-semibold text-sm text-gray-800">{yb.title} (Single Link)</div>
                            <a
                              href={yb.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-medium hover:underline text-xs mt-2"
                            >
                              View Link
                            </a>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No options added yet.</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No yearbooks added yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === "profiles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  KYA Profiles
                </h2>
                <div className="text-sm text-slate-500">
                  {profiles.length} profiles
                </div>
              </div>

              {/* Add Profile Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Add New KYA Profile
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
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
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
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
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
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
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
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
                        }`}
                        placeholder="Key achievement or recognition"
                      />
                      {formErrors.Achievement && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.Achievement}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Linked In Post Link
                      </label>
                      <input
                        type="url"
                        name="LinkedInPostLink"
                        value={formData.LinkedInPostLink}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                          formErrors.LinkedInPostLink
                            ? "border-red-300 bg-red-50"
                            : "border-slate-300"
                        }`}
                        placeholder="Key achievement or recognition"
                      />
                      {formErrors.LinkedInPostLink && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.LinkedInPostLink}
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
                          ? "border-red-300 bg-red-50"
                          : "border-slate-300"
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
                              ? "border-red-300"
                              : "border-slate-100"
                          }`}
                          onClick={() => fileInputRef.current.click()}
                          title="Click to change image"
                        />
                      ) : (
                        <div
                          onClick={() => fileInputRef.current.click()}
                          className={`w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors ${
                            formErrors.profilePic
                              ? "border-red-300 bg-red-50"
                              : "border-slate-300"
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
                          {imageFile ? "Change Image" : "Upload Image"}
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
                        <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-4 sm:space-y-0">
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
                                <div className="flex flex-col sm:flex-row items-start mt-1 space-x-4 text-sm text-slate-600">
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

          {/* Gallery Section */}
          {activeTab === "gallery" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Gallery
                </h2>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Upload New Photo
                </h3>

                <form onSubmit={handleSubmitGallery} className="space-y-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChangeGallery}
                    ref={fileInputRefGallery}
                    required
                    className="hidden"
                  />

                  <div className="flex items-center space-x-6">
                    {galleryImageFile ? (
                      <img
                        src={URL.createObjectURL(galleryImageFile)}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-4 cursor-pointer hover:border-blue-300"
                        onClick={() => fileInputRefGallery.current.click()}
                      />
                    ) : (
                      <div
                        onClick={() => fileInputRefGallery.current.click()}
                        className="w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer hover:border-blue-400"
                      >
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRefGallery.current.click()}
                        className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Upload Image
                      </button>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Add to Gallery
                    </button>
                  </div>
                </form>
              </div>

              <h1 className="text-4xl mb-4">Gallery Photos</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((photo) => (
                  <div key={photo._id} className="border p-2 rounded-lg shadow">
                    <img
                      src={photo.image}
                      alt="gallery"
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="mt-2 flex justify-between">
                      <button
                        onClick={() => handleDeleteGallery(photo._id)}
                        className="text-red-600 font-bold text-sm"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsors Section */}
          {activeTab === "sponsors" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Manage Sponsors</h2>

              {/* Add Sponsor Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Sponsor</h3>

                <form
                  onSubmit={handleAddSponsor}
                  className="grid md:grid-cols-3 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Sponsor Name"
                    value={sponsorForm.name}
                    onChange={(e) =>
                      setSponsorForm({ ...sponsorForm, name: e.target.value })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <input
                    type="text"
                    placeholder="Sponsor Type"
                    value={sponsorForm.type}
                    onChange={(e) =>
                      setSponsorForm({ ...sponsorForm, type: e.target.value })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    ref={sponsorLogoRef}
                    onChange={handleSponsorLogoChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-4">
                    {sponsorLogo ? (
                      <img
                        src={URL.createObjectURL(sponsorLogo)}
                        alt="Sponsor Logo Preview"
                        className="w-20 h-20 rounded-lg object-contain border cursor-pointer"
                        onClick={() => sponsorLogoRef.current.click()}
                      />
                    ) : (
                      <div
                        onClick={() => sponsorLogoRef.current.click()}
                        className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400"
                      >
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => sponsorLogoRef.current.click()}
                      className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
                    >
                      Upload Logo
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Add Sponsor
                  </button>
                </form>
              </div>

              {/* Sponsors List */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.map((sponsor) => (
                  <div
                    key={sponsor._id}
                    className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold">{sponsor.name}</h4>
                      <p className="text-sm text-gray-500">{sponsor.type}</p>
                      <img
                        src={sponsor.icon}
                        alt={sponsor.name}
                        className="w-14 h-14 object-contain mt-2"
                      />
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteSponsor(sponsor._id, sponsor.name)
                      }
                      className="text-red-600 font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alumni Contributions Section */}
          {activeTab === "alumni-contributions" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Manage Alumni Contributions
              </h2>

              {/* Add Alumni Contribution Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Add New Alumni Contribution
                </h3>

                <form
                  onSubmit={handleAddAlumniContribution}
                  className="grid md:grid-cols-3 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Alumni Name"
                    value={contributionForm.name}
                    onChange={(e) =>
                      setContributionForm({
                        ...contributionForm,
                        name: e.target.value,
                      })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <input
                    type="number"
                    placeholder="Batch Year"
                    value={contributionForm.batch}
                    onChange={(e) =>
                      setContributionForm({
                        ...contributionForm,
                        batch: e.target.value,
                      })
                    }
                    className="border rounded px-4 py-2"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    ref={contributionPhotoRef}
                    onChange={handleContributionPhotoChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-4">
                    {contributionPhoto ? (
                      <img
                        src={URL.createObjectURL(contributionPhoto)}
                        alt="Alumni Photo Preview"
                        className="w-20 h-20 rounded-lg object-contain border cursor-pointer"
                        onClick={() => contributionPhotoRef.current.click()}
                      />
                    ) : (
                      <div
                        onClick={() => contributionPhotoRef.current.click()}
                        className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400"
                      >
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => contributionPhotoRef.current.click()}
                      className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200 text-sm"
                    >
                      Upload Photo
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Add Alumni Contribution
                  </button>
                </form>
              </div>

              {/* Alumni Contributions List */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alumniContributions.map((contribution) => (
                  <div
                    key={contribution._id}
                    className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold">{contribution.name}</h4>
                      <p className="text-sm text-gray-500">
                        Batch {contribution.batch}
                      </p>
                      <img
                        src={contribution.photo}
                        alt={contribution.name}
                        className="w-14 h-14 object-contain mt-2 rounded"
                      />
                    </div>

                    <button
                      onClick={() =>
                        handleDeleteAlumniContribution(
                          contribution._id,
                          contribution.name,
                        )
                      }
                      className="text-red-600 font-bold"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
