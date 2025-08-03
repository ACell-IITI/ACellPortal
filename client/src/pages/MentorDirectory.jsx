// MentorDirectory.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import MentorCard from '../Components/MentorCard/MentorCard';
import { mentorData } from '../lib/mentorData';
import './MentorDirectory.css';

const MentorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const filteredMentors = mentorData.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mentor.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesYear = selectedYear === '' || mentor.graduationYear === selectedYear;
    return matchesSearch && matchesYear;
  });

  const graduationYears = [...new Set(mentorData.map(mentor => mentor.graduationYear))].sort();

  return (
    <div className="mentor-directory">
      <div className="directory-container">
        <div className="directory-header">
          <h1 className="directory-title">Mentor Directory</h1>
          <p className="directory-subtitle">
            Connect with our distinguished mentors and explore their professional journeys
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
              {graduationYears.map(year => (
                <option key={year} value={year}>Class of {year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredMentors.length} of {mentorData.length} mentors
        </div>

        {filteredMentors.length > 0 ? (
          <div className="mentor-grid">
            {filteredMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
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