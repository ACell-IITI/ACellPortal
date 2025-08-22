// MentorDirectory.js
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import MentorCard from '../Components/MentorCard/MentorCard';
// import { mentorData } from '../lib/mentorData';
import './MentorDirectory.css';
import axios from 'axios';

const MentorDirectory = () => {
  const [mentorsData, setMentorsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
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

    fetchMentors();
  }, []);

  const filteredMentors = mentorsData.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesYear =
      selectedYear === '' || mentor.graduationYear === selectedYear;
    return matchesSearch && matchesYear;
  });

  const graduationYears = [
    ...new Set(mentorsData.map((mentor) => mentor.graduationYear)),
  ].sort();

  if (loading) return <div>Loading...</div>;
  if(!mentorsData) return <div>No Mentors Found</div>

  return (
    <div className="mentor-directory">
      <div className="directory-container">
        <div className="directory-header">
          <h1 className="directory-title">Mentor Directory</h1>
          <p className="directory-subtitle">
            Connect with our distinguished mentors and explore their
            professional journeys
          </p>
        </div>

        <div className="filters-section">
          <div className="filters-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, degree, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              <option value="">All Graduation Years</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  Class of {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredMentors.length} of {mentorsData.length} mentors
        </div>

        {filteredMentors.length > 0 ? (
          <div className="mentor-grid">
            {filteredMentors.map((mentor) => (
              <MentorCard key={Number(mentor._id)} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3 className="no-results-title">No mentors found</h3>
            <p className="no-results-text">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDirectory;
