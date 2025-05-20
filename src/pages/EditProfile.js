// src/pages/EditProfile.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faMapMarker, faHistory } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const EditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        crop_history: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);
        setFormData({
            name: storedUser.name || '',
            phone: storedUser.phone || '',
            location: storedUser.location || '',
            crop_history: storedUser.crop_history || '',
        });
    }, [navigate]);

    // Remove handleImageUpload and Cloudinary logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { ...formData };

            // If you want to handle image upload to your own backend, add logic here

            const response = await axios.patch(
                `https://farmer-tau.vercel.app/farmers/${user.id}`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            // Update local storage and state
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update profile');
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <Container className="py-5">
            <ToastContainer />
            <Card className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">Edit Profile</h2>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfileImage(e.target.files[0])}
                                disabled
                            />
                            {user.farmer_image && (
                                <div className="mt-2">
                                    <img
                                        src={user.farmer_image}
                                        alt="Current Profile"
                                        className="img-thumbnail"
                                        style={{ width: '150px', height: '150px' }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Full Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FontAwesomeIcon icon={faPhone} className="me-2" />
                                Phone Number
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FontAwesomeIcon icon={faMapMarker} className="me-2" />
                                Location
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FontAwesomeIcon icon={faHistory} className="me-2" />
                                Crop History
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.crop_history}
                                onChange={(e) => setFormData({ ...formData, crop_history: e.target.value })}
                            />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={() => navigate('/profile')}>
                                Cancel
                            </Button>
                            <Button variant="success" type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditProfile;
