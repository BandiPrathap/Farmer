import { useEffect, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const FarmerList = ({ onAssignCrop }) => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://farmer-tau.vercel.app/farmer')
      .then(res => setFarmers(res.data));
  }, []);

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.phone.includes(search)
  );

  return (
    <>
      <h3>All Farmers</h3>
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
    </>
  );
};

export default FarmerList;
