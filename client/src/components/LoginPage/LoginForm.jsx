import { useRef } from 'react';
import InputField from './InputField';
import PasswordField from './PasswordField';
import '../../styles/LoginPage/LoginForm.css';
// import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { API_BASE_URL } from '../../api/alumni';

const LoginForm = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alumniEmail = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/alumni/login`,
        {
          alumniEmail,
          password,
        },
        { withCredentials: true }
      );
      console.log('Logged in successfully:', res.data);
      window.location.href="/admin-dashboard";
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img
          src="/assets/alumni cell logo.jpg"
          alt="Alumni Logo"
          className="logo-img"
        />
        <h2 className="login-title">LOGIN PORTAL</h2>
        <img
          src="/assets/IIT_Indore_Logo.png"
          alt="IIT Logo"
          className="logo-img"
        />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <InputField
          label="Email ID"
          type="email"
          inputRef={emailRef}
          onKeyDown={(e) => handleKeyDown(e, passwordRef)}
        />
        <PasswordField
          inputRef={passwordRef}
          onKeyDown={(e) => handleKeyDown(e, null)}
        />
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>

      <div className="google-login-wrapper">
      {/* <GoogleLogin
        type={'standard'}
        theme={'filled-blue'}
        size={'large'}
        text={'signin_with'}
        shape={'pill'}
        logo_alignment={'center'}
        onSuccess={async (credentialResponse) => {
          const res = await axios.post(
            `${API_BASE_URL}/api/auth/google`,
            {
              token: credentialResponse.credential,
            },
            { withCredentials: true }
          );
          console.log('User logged in:', res.data);
          window.location.href="/";
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      /> */}
      </div>
      {/* <div className="login-footer">
        <h6 className="signup-warning">
          Not a Member?{' '}
          <Link to="/signup" className="signup-link">
            Sign-Up Now
          </Link>
        </h6>
      </div> */}
    </div>
  );
};

export default LoginForm;
