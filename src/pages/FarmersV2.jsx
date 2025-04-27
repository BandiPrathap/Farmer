import { useEffect, useState } from 'react';
import { Table, Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FarmersV2 = ({ onAssignCrop }) => {
    const [farmers, setFarmers] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [farmerToDelete, setFarmerToDelete] = useState(null);
    const [newFarmer, setNewFarmer] = useState({
        name: '',
        phone: '',
        password: '',
        location: '',
        crop_history: '',
        farmer_image: null,
    });
    const [registering, setRegistering] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const res = await axios.get('https://farmer-tau.vercel.app/farmer');
            setFarmers(res.data);
        } catch (err) {
            console.error('Failed to fetch farmers:', err);
            toast.error('Failed to fetch farmers');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistering(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', newFarmer.name);
            formData.append('phone', newFarmer.phone);
            formData.append('password', newFarmer.password);
            formData.append('location', newFarmer.location);
            formData.append('crop_history', newFarmer.crop_history);
            if (newFarmer.farmer_image) {
                formData.append('farmer_image', newFarmer.farmer_image);
            }

            await axios.post('https://farmer-tau.vercel.app/farmer/v2/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await fetchFarmers();
            setShowModal(false);
            setNewFarmer({
                name: '',
                phone: '',
                password: '',
                location: '',
                crop_history: '',
                farmer_image: null,
            });
            toast.success('Farmer registered successfully');
        } catch (err) {
            console.error(err);
            setError('Failed to register farmer');
            toast.error('Failed to register farmer');
        }

        setRegistering(false);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append('name', selectedFarmer.name);
            formData.append('phone', selectedFarmer.phone);
            formData.append('location', selectedFarmer.location);
            formData.append('crop_history', selectedFarmer.crop_history);
            if (selectedFarmer.farmer_image instanceof File) {
                formData.append('farmer_image', selectedFarmer.farmer_image);
            }

            await axios.put(`https://farmer-tau.vercel.app/farmer/v2/${selectedFarmer.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await fetchFarmers();
            setShowUpdateModal(false);
            toast.success('Farmer updated successfully');
        } catch (err) {
            console.error('Failed to update farmer:', err);
            toast.error('Failed to update farmer');
        }
        setUpdating(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://farmer-tau.vercel.app/farmer/${farmerToDelete.id}`);
            await fetchFarmers();
            setShowDeleteModal(false);
            toast.success('Farmer deleted successfully');
        } catch (err) {
            console.error('Failed to delete farmer:', err);
            toast.error('Failed to delete farmer');
        }
    };

    const filteredFarmers = farmers.filter((f) =>
        (f.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (f.phone || '').includes(search)
    );

    return (
        <>
            <ToastContainer />
            <h3>All Farmers</h3>
            <div className="d-flex justify-content-between mb-3">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Register Farmer
                </Button>
            </div>

            <Form.Control
                type="text"
                placeholder="Search by name or phone"
                className="mb-3"
                onChange={(e) => setSearch(e.target.value)}
            />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFarmers.map((farmer) => (
                        <tr key={farmer.id}>
                            <td>{farmer.name}</td>
                            <td>{farmer.phone}</td>
                            <td>{farmer.location}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onAssignCrop(farmer)}
                                >
                                    Assign Crop
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                        setSelectedFarmer(farmer);
                                        setShowUpdateModal(true);
                                    }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                        setFarmerToDelete(farmer);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Register Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Register New Farmer</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleRegister}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                value={newFarmer.name}
                                onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                required
                                value={newFarmer.phone}
                                onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                value={newFarmer.password}
                                onChange={(e) => setNewFarmer({ ...newFarmer, password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                value={newFarmer.location}
                                onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Crop History</Form.Label>
                            <Form.Control
                                value={newFarmer.crop_history}
                                onChange={(e) => setNewFarmer({ ...newFarmer, crop_history: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Farmer Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) =>
                                    setNewFarmer({ ...newFarmer, farmer_image: e.target.files[0] })
                                }
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={registering}>
                            {registering ? <Spinner animation="border" size="sm" /> : 'Register'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Update Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Farmer</Modal.Title>
                </Modal.Header>
                {selectedFarmer && (
                    <Form onSubmit={handleUpdate}>
                        <Modal.Body>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required
                                    value={selectedFarmer.name}
                                    onChange={(e) =>
                                        setSelectedFarmer({ ...selectedFarmer, name: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    required
                                    value={selectedFarmer.phone}
                                    onChange={(e) =>
                                        setSelectedFarmer({ ...selectedFarmer, phone: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    value={selectedFarmer.location}
                                    onChange={(e) =>
                                        setSelectedFarmer({ ...selectedFarmer, location: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Crop History</Form.Label>
                                <Form.Control
                                    value={selectedFarmer.crop_history}
                                    onChange={(e) =>
                                        setSelectedFarmer({ ...selectedFarmer, crop_history: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Farmer Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedFarmer({ ...selectedFarmer, farmer_image: e.target.files[0] })
                                    }
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updating}>
                                {updating ? <Spinner animation="border" size="sm" /> : 'Update'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>{farmerToDelete?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FarmersV2;
