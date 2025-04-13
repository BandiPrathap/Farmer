import { useEffect, useState } from 'react';
import { Table, Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Farmers = ({ onAssignCrop }) => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    phone: '',
    password: '',
    location: '',
    crop_history: ''
  });
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  // Load data from localStorage or fetch from API
  useEffect(() => {
    const storedFarmers = localStorage.getItem('farmers');
    if (storedFarmers) {
      setFarmers(JSON.parse(storedFarmers));
    } else {
      axios.get('https://farmer-tau.vercel.app/farmer')
        .then(res => setFarmers(res.data));
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
  
    try {
      await axios.post('https://farmer-tau.vercel.app/farmer/register', newFarmer);
  
      localStorage.removeItem('farmers');
      const res = await axios.get('https://farmer-tau.vercel.app/farmer');
      setFarmers(res.data);
  
      setShowModal(false);
      setNewFarmer({ name: '', phone: '', password: '', location: '', crop_history: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to register farmer');
    }
  
    setRegistering(false);
  };
  

  const filteredFarmers = farmers.filter(f =>
    (f.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (f.phone || '').includes(search)
  );  


  return (
    <>
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

      <Table striped bordered>
        <thead>
          <tr><th>Name</th><th>Phone</th><th>Location</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredFarmers.map(farmer => (
            <tr key={farmer.id}>
              <td>{farmer.name}</td>
              <td>{farmer.phone}</td>
              <td>{farmer.location}</td>
              <td>
                <Button onClick={() => onAssignCrop(farmer)}>Assign Crop</Button>
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
                required
                value={newFarmer.location}
                onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Crop History</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newFarmer.crop_history}
                onChange={(e) => setNewFarmer({ ...newFarmer, crop_history: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={registering}>
              {registering ? <Spinner animation="border" size="sm" /> : 'Register'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Farmers;
