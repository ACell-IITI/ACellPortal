import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import { NavLink, useLocation, Link } from 'react-router-dom';
import SignUpButton from '../SignupUpButton/SignupUpButton';
import axios from 'axios';
import { Fade as Hamburger } from 'hamburger-react'
// import { Link } from 'react-router-dom';
import UserDropdown from '../UserDropdown/UserDropdown';


export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = window.innerWidth <= 900;
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const [offset, setOffset] = useState(0);
  const [hideNavbar, setHideNavbar] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get('http://localhost:8000/auth/check', {
          withCredentials: true,
        });
         console.log('Fetched role:', res.data);
        setRole(res.data.role);
      } catch (error) {
        console.log('Error in useEffect:', error);
        setRole(null);
      }finally {
      setLoading(false); 
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      setOffset(currentScrollY * 0.5);

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'KYA', path: '/KYA' },
    { name: 'Team', path: '/team' },
    {
      name: 'Publications',
      dropdown: [
        { name: 'Newsletter', path: '/Newsletter' },
        { name: 'Magazine', path: '/Magazine' },
      ],
    },
    { name: 'CV Review', path: '/cv-review' },
    { name: 'Mentors', path: '/verified-mentors' },
  ];

  if (role === 'admin') {
    navLinks.push({ name: 'Dashboard', path: '/admin-dashboard' });
  }

  const handleNavClick = () => setMenuOpen(false);

  const navbarClass = `navbar-root${hideNavbar ? ' navbar-hide' : ''}`;

  return (
    <nav
      className={navbarClass}
      style={{
        backgroundPosition: `center ${-offset}px`,
      }}
    >
      <div className="navbar-container">
        <div className="navbar-logo-title">
          <div className="logo-wrapper">
            <div className="box box1"></div>
            <div className="box box2"></div>

            <Link to="/" className="logo-link">
              <img
                src="/Media/cell.jpg"
                alt="Alumni Cell Logo"
                className="navbar-logo"
              />
            </Link>
          </div>
          <div className="nav-title">
            <div className="navbar-title">Alumni Cell</div>
            <div className="navbar-subtitle">
              Indian Institute of Technology, Indore
            </div>
          </div>
        </div>

        <div className="navbar-hamburger">
          <Hamburger toggled={menuOpen} toggle={setMenuOpen} />
        </div>

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

        <div className="signupbtn"> 
           {!loading && (role === 'admin' || role === 'alumni' ? <UserDropdown /> : <SignUpButton />)}
        </div>

      </div>
    </nav>
  );
}
