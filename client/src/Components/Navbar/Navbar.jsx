import { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import { NavLink, useLocation, Link } from 'react-router-dom';
// import SignUpButton from '../SignupUpButton/SignupUpButton';
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
        const res = await axios.get('http://alumnicell.iiti.ac.in:8000/auth/check', {
          withCredentials: true,
        });
         console.log('Fetched role:', res.data);
        setRole(res.data.role);
      } catch (error) {
        console.log('Error in useEffect:', error);
        setRole(null);
      } finally {
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

    {
      name: 'Publications',
      dropdown: [
        { name: 'Newsletter', path: '/Newsletter' },
        { name: 'Magazine', path: '/Magazine' },
        { name: 'Yearbook', path: '/Yearbook' },
      ],
    },
    { name: 'Mentors', path: '/verified-mentors' },
    { name: 'Alumini Contributors', path: '/alumni-contribution' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'Team', path: '/team' },
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
        whiteSpace: 'nowrap',
      }}
    >
      <div className="navbar-container" style={{ whiteSpace: 'nowrap' }}>
        <div className="navbar-logo-title" style={{ whiteSpace: 'nowrap' }}>
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

          <div className="nav-title" style={{ whiteSpace: 'nowrap' }}>
            <div className="navbar-title" style={{ whiteSpace: 'nowrap' }}>
              Alumni Cell
            </div>
            <div
              className="navbar-subtitle"
              style={{ whiteSpace: 'nowrap' }}
            >
              Indian Institute of Technology, Indore
            </div>
          </div>
        </div>

        <div className="navbar-hamburger">
          <Hamburger toggled={menuOpen} toggle={setMenuOpen} />
        </div>

        <ul
          className={`navbar-links${menuOpen ? ' open' : ''}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {navLinks.map((link) =>
            link.dropdown ? (
              <li
                key={link.name}
                className="navbar-link dropdown-parent"
                style={{ whiteSpace: 'nowrap' }}
              >
                <div
                  className="dropdown-hover-wrapper"
                  onMouseEnter={() => !isMobile && setDropdownOpen(link.name)}
                  onMouseLeave={() => !isMobile && setDropdownOpen(null)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <span
                    className={`navbar-link-text ${
                      link.dropdown.some((d) =>
                        location.pathname.startsWith(d.path)
                      )
                        ? 'active'
                        : ''
                    }`}
                    style={{ whiteSpace: 'nowrap' }}
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
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {link.dropdown.map((item) => (
                      <li key={item.path} style={{ whiteSpace: 'nowrap' }}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `navbar-dropdown-link${isActive ? ' active' : ''}`
                          }
                          style={{ whiteSpace: 'nowrap' }}
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
              <li
                key={link.name}
                className="navbar-link"
                style={{ whiteSpace: 'nowrap' }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `navbar-link-text${isActive ? ' active' : ''}`
                  }
                  end={link.path === '/'}
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={handleNavClick}
                >
                  {link.name}
                </NavLink>
              </li>
            )
          )}
        </ul>

        <div className="signupbtn" style={{ whiteSpace: 'nowrap' }}> 
          {!loading && role === "admin" ? <UserDropdown /> : null}
        </div>
      </div>
    </nav>
  );
}
