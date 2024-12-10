import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const image = "https://api.iiitu.ac.in/uploads/gallery/IMG_09491726633560530-294898103.webp";

function Admin_Login({setChange,setusername}) {
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/v1/admin/loginAdmin', formData);
    
      // Ensure the response contains the necessary data
      if (response.data && response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;


        // Display success message
        toast.success('Login Successful!');
        
        // Store tokens securely (consider alternatives for sensitive data)
        localStorage.setItem('admin_accessToken', accessToken);
        localStorage.setItem('admin_refreshToken', refreshToken);
        
        // Update username state

        setusername(user.username);
        setChange((prev)=>!prev);
        // Redirect to the home page
        navigate('/')
        
        console.log(refreshToken);
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login. Please try again.');
    }
    
  };

  return (
    <div className={styles.container}>
      {/* Left side: Image */}
      <div className={styles.carousel}>
        <img
          src={image}
          alt="Carousel"
          className={styles.image}
        />
      </div>

      {/* Right side: Login Form */}
      <div className={styles.loginForm}>
        <h2 className={styles.header}>Welcome to Admin Panel</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              className={styles.input}
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.info}>
          If you don't know credentials please contact site owners. The score updation requires
          admin username and password.
        </div>
      </div>
    </div>
  );
}

export default Admin_Login;
