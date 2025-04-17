import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Alert, Spinner, Button } from 'react-bootstrap';

export default function FarmersByCrop() {
  const { id } = useParams();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await axios.get(`https://farmer-tau.vercel.app/farmer-crops/${id}/farmers`);
        setFarmers(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Failed to fetch farmers');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [id]);

  if (loading) return <Spinner animation="border" className="mt-5" />;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (farmers.length === 0) return <Alert variant="warning" className="mt-5">No farmers found for this crop type.</Alert>;

  return (
    <div>
      <h2>Farmers for Crop ID: {id}</h2>
      <Button className="mb-3" onClick={() => window.history.back()}>Back</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Crop History</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer) => (
            <tr key={farmer.id}>
              <td>{farmer.id}</td>
              <td>{farmer.name}</td>
              <td>{farmer.phone}</td>
              <td>{farmer.location}</td>
              <td>{farmer.crop_history}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
