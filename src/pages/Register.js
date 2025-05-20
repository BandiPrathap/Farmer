// src/pages/Register.js
import { useState } from 'react';
import { Form, Button, Card, Container, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    location: '',
    crop_history: '',
    farmer_image: null,
  });



  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!/^\d{10}$/.test(formData.phone)) {
    toast.error('Invalid phone number format');
    return;
  }

  const data = new FormData();
  data.append('name', formData.name);
  data.append('phone', formData.phone);
  data.append('password', formData.password);
  data.append('location', formData.location);
  data.append('crop_history', formData.crop_history);
  if (formData.farmer_image) {
      data.append('farmer_image', formData.farmer_image);
    }


  setLoading(true);
  try {
    await api.post('/farmer/v2/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success('Registration successful! Please login');
    navigate('/login');
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Registration failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="w-100" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Farmer Registration</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Crop History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.crop_history}
                onChange={(e) => setFormData({ ...formData, crop_history: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Farmer Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, farmer_image: e.target.files[0] })
                }
              />
            </Form.Group>


            <Button className="w-100" type="submit" variant="success" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" role="status" className="me-2" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
