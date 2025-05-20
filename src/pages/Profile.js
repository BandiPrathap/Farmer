// src/pages/FarmerProfile.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faIdCard, 
  faPhone, 
  faMapMarkerAlt, 
  faHistory, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        const response = await fetch(
          `https://farmer-tau.vercel.app/farmer/${parsedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch farmer details');
        }

        const farmerData = await response.json();
        setUser(farmerData);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!user) return <Alert variant="danger" className="mt-5">Please login to view this page</Alert>;

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '90vh' }}>
      <Card className="w-100 profile-card shadow-lg" style={{ maxWidth: '800px', borderRadius: '20px' }}>
        <Card.Body className="p-4">
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative">
              <img
                src={user.farmer_image || 'https://via.placeholder.com/150'}
                alt="Farmer"
                className="mb-3 rounded-circle shadow"
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  border: '4px solid white'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>

            <h3 className="mt-3 mb-4 text-success">{user.name}</h3>
            
            <ListGroup variant="flush" className="w-100">
              <ListGroup.Item className="d-flex align-items-center">
                <FontAwesomeIcon icon={faIdCard} className="text-success me-3" />
                <div>
                  <strong>User ID:</strong> {user.id}
                </div>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex align-items-center">
                <FontAwesomeIcon icon={faPhone} className="text-success me-3" />
                <div>
                  <strong>Phone:</strong> {user.phone}
                </div>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex align-items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-success me-3" />
                <div>
                  <strong>Location:</strong> {user.location}
                </div>
              </ListGroup.Item>
              
              <ListGroup.Item className="d-flex align-items-center">
                <FontAwesomeIcon icon={faHistory} className="text-success me-3" />
                <div>
                  <strong>Crop History:</strong> {user.crop_history}
                </div>
              </ListGroup.Item>
            </ListGroup>
          </div>

          <div className="d-flex gap-3 justify-content-center mt-4">
            <Button 
              variant="outline-success" 
              className="rounded-pill px-4"
              onClick={() => navigate('/edit-profile')}
            >
              Edit Profile
            </Button>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="rounded-pill px-4 d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;