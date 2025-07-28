import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { NavLink, useLocation } from 'react-router-dom';
import SignUpButton from '../SignupUpButton/SignupUpButton';
import axios from 'axios';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = () => setMenuOpen(false);
  const isMobile = window.innerWidth <= 900;

  const [role, setRole] = useState(null);
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth/check', {
          withCredentials: true,
        });
        setRole(res.data.role);
      } catch (error) {
        console.log('Error in useEffect:', error);
      }
    };

    fetchRole();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    {
      name: 'KYA',
      path: '/KYA',
    },
    { name: 'Team', path: '/team' },
    {
      name: 'Publications',
      dropdown: [
        { name: 'Newsletter', path: '/Newsletter' },
        { name: 'Magazine', path: '/Magazine' },
      ],
    },
    {
      name: 'CV Review',
      path: '/cv-review',
    },
    {
      name: 'Mentors',
      path: '/verified-mentors',
    },
  ];
  if (role === 'admin') {
    navLinks.push({ name: 'Dashboard', path: '/admin-dashboard' });
  }

  return (
    <nav className="navbar-root">
      <div className="navbar-container">
        <div className="navbar-logo-title">
          <img
            src="/Media/acell.png"
            alt="Alumni Cell Logo"
            className="navbar-logo"
          />
          <div>
            <div className="navbar-title">Alumni Cell</div>
            <div className="navbar-subtitle">
              Indian Institute of Technology, Indore
            </div>
          </div>
        </div>

        <button
          className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map((link) =>
            link.dropdown ? (
              <li key={link.name} className="navbar-link dropdown-parent">
                <div
                  className="dropdown-hover-wrapper"
                  onMouseEnter={() => !isMobile && setDropdownOpen(link.name)}
                  onMouseLeave={() => !isMobile && setDropdownOpen(null)}
                >
                  <span
                    className={`navbar-link-text ${
                      link.dropdown.some((d) =>
                        location.pathname.startsWith(d.path)
                      )
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      isMobile
                        ? setDropdownOpen(
                            dropdownOpen === link.name ? null : link.name
                          )
                        : undefined
                    }
                  >
                    {link.name}
                    <span className="navbar-dropdown-arrow"></span>
                  </span>
                  <ul
                    className={`navbar-dropdown ${
                      dropdownOpen === link.name ? 'open' : ''
                    }`}
                  >
                    {link.dropdown.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `navbar-dropdown-link${isActive ? ' active' : ''}`
                          }
                          onClick={() => {
                            setDropdownOpen(null);
                            handleNavClick();
                          }}
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={link.name} className="navbar-link">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `navbar-link-text${isActive ? ' active' : ''}`
                  }
                  end={link.path === '/'}
                  onClick={handleNavClick}
                >
                  {link.name}
                </NavLink>
              </li>
            )
          )}
        </ul>
        <SignUpButton />
      </div>
    </nav>
  );
}
