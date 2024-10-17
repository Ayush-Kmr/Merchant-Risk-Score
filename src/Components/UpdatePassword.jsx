import React, { useState } from 'react';
import './UpdatePassword.css'; // Optional: create a CSS file for styling
import axios from 'axios'; // Make sure axios is installed

const UpdatePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdated, setIsUpdated] = useState(false); // State to control visibility of the success message

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    const token = localStorage.getItem('jwtToken');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/merchant/update-password', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the JWT token in the Authorization header
        }
      });

      if (response.status === 200) {
        setSuccessMessage('Password updated successfully!');
        setIsUpdated(true); // Show success message
        // Clear fields after successful update
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Failed to update password. Please try again.');
      console.error(err);
    }
  };

  const handleOk = () => {
    setIsUpdated(false); // Hide success message
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {isUpdated ? (
          <div>
            <h2>Password Updated Successfully</h2>
            <button onClick={handleOk}>OK</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Update Password</h2>
            <div>
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                placeholder="Enter your old password"
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter your new password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your new password"
              />
            </div>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <button type="submit">Update Password</button>
            <button onClick={onClose} style={{ marginTop: '10px' }}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
