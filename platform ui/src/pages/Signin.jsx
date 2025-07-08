import React, { useState } from 'react';
import '../styles/Signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in submitted:', formData);
    setIsSignedIn(true);
    setTimeout(() => setIsSignedIn(false), 4000);
  };

  return (
    <div className="signin-container">
      {isSignedIn && (
        <div className="signin-success">
          <div className="checkmark">✓</div>
          <p>Signed in successfully!</p>
        </div>
      )}

      <form className={`signin-form ${isSignedIn ? 'fade-out' : ''}`} onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
