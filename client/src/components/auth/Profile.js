import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './Auth.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message when form is edited
    if (success) setSuccess('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Only validate password fields if they are shown and filled
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Prepare data to send
    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
    };
    
    // Only include password fields if they're being updated
    if (showPasswordFields && formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }
    
    try {
      const result = await updateProfile(updateData);
      if (result.success) {
        setSuccess('Profile updated successfully');
        setShowPasswordFields(false);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="auth-card">
        <div className="profile-header">
          <h2>Profile Settings</h2>
          <p className="welcome-message">
            Welcome back, <strong>{user.firstName}</strong>!
          </p>
        </div>
        
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter your first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="password-section">
            <button 
              type="button" 
              className="btn-text"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? 'Cancel' : 'Change Password'}
            </button>
            
            {showPasswordFields && (
              <div className="password-fields">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={errors.currentPassword ? 'error' : ''}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <span className="error-message">{errors.currentPassword}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={errors.newPassword ? 'error' : ''}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button 
              type="button" 
              className="btn btn-text"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
