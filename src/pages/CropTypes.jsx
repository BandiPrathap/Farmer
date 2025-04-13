import { useEffect, useState } from 'react';
import { Table, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function CropTypes() {
  const [cropTypes, setCropTypes] = useState([]);
  const [newCrop, setNewCrop] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchCropTypes = async () => {
      try {
        const response = await axios.get('https://farmer-tau.vercel.app/crop-types');
        setCropTypes(response.data);
      } catch (err) {
        setError('Failed to fetch crop types');
      }
    };
    fetchCropTypes();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://farmer-tau.vercel.app/crop-types', { name: newCrop });
      setNewCrop('');
      setCropTypes([...cropTypes, { name: newCrop }]);
    } catch (err) {
      setError('Failed to add crop type');
    }
  };

  return (
    <div>
      <h2>Crop Types Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>New Crop Type</Form.Label>
          <Form.Control
            type="text"
            value={newCrop}
            onChange={(e) => setNewCrop(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Add Crop Type</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {cropTypes.map(crop => (
            <tr key={crop.id}>
              <td>{crop.id}</td>
              <td>{crop.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}