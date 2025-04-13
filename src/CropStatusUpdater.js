import React, { useState } from 'react';
import axios from 'axios';

const CropStatusUpdater = ({ cropId }) => {
  const [imageFile, setImageFile] = useState(null);
  const [stage, setStage] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleStageChange = (e) => {
    setStage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setImageUrl('');

    if (!imageFile || !stage) {
      setError('Please select an image and enter a growth stage');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('stage', stage);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:3000/crops/${cropId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message);
      setImageUrl(response.data.image_url);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Crop Status</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Crop Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="stage">Growth Stage:</label>
          <input
            type="text"
            id="stage"
            value={stage}
            onChange={handleStageChange}
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Status'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {message && (
        <div>
          <p style={{ color: 'green' }}>{message}</p>
          {imageUrl && (
            <div>
              <p>New Image:</p>
              <img src={imageUrl} alt="Updated crop" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropStatusUpdater;