import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const FarmerCrops = () => {
  const { id } = useParams();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`https://farmer-tau.vercel.app/farmers/${id}/crops`);
        setCrops(response.data);
      } catch (err) {
        setError('Failed to fetch farmer crops');
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [id, token]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>Assigned Crops</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Crop Name</th>
            <th>Duration</th>
            <th>Estimated Yield</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(crop => (
            <tr key={crop.id}>
              <td>{crop.name}</td>
              <td>{crop.duration_days} days</td>
              <td>{crop.estimated_yield}</td>
              <td>{crop.current_stage || 'Not started'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FarmerCrops;