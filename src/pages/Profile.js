// src/pages/FarmerProfile.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faPhone, faUserTag, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user:', err);
        navigate('/login');
      }
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <Alert variant="danger" className="mt-5">Please login to view this page</Alert>;

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '90vh' }}>
      <Card className="w-100 profile-card shadow-lg" style={{ maxWidth: '800px', borderRadius: '20px' }}>
        {/* <Card.Header className="bg-success text-white text-center py-4">
          <h2 className="mb-0 fw-bold">Farmer Profile</h2>
        </Card.Header> */}
        
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
                  border: '4px solid white',
                  // transform: 'translateY(-50%)'
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
                <FontAwesomeIcon icon={faUserTag} className="text-success me-3" />
                <div>
                  <strong>Role:</strong> <span className="text-capitalize">{user.role}</span>
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