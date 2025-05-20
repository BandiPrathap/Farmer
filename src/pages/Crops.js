// src/pages/Crops.js
import { useEffect, useState } from 'react';
import { Table, Button, Card, Form, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';
import CropStageModal from '../components/CropStageModal';

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await api.get('/crops/${user.id}');
      setCrops(response.data);
    } catch (error) {
      toast.error('Error fetching crops');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await api.delete(`/crops/${id}`);
        fetchCrops();
        toast.success('Crop deleted successfully');
      } catch (error) {
        toast.error('Error deleting crop');
      }
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Crop Management</h4>
        <Button variant="success" onClick={() => setShowStageModal(true)}>
          <FaPlus /> Add Crop
        </Button>
      </Card.Header>
      <Card.Body>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Crop Name</th>
              <th>Duration</th>
              <th>Yield</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crops.map(crop => (
              <tr key={crop.id}>
                <td>{crop.name}</td>
                <td>{crop.duration_days} days</td>
                <td>{crop.estimated_yield}</td>
                <td>₹{crop.estimated_price}</td>
                <td>
                  <Badge bg={crop.status === 'registered' ? 'success' : 'warning'}>
                    {crop.status}
                  </Badge>
                </td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => {
                    setSelectedCrop(crop);
                    setShowStageModal(true);
                  }}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(crop.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <CropStageModal
        show={showStageModal}
        onHide={() => {
          setShowStageModal(false);
          setSelectedCrop(null);
        }}
        crop={selectedCrop}
        refresh={fetchCrops}
      />
    </Card>
  );
};

export default Crops;