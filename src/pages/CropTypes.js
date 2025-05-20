// src/pages/CropTypes.js
import { useEffect, useState } from 'react';
import { Table, Button, Card, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

const CropTypes = () => {
  const [cropTypes, setCropTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newCrop, setNewCrop] = useState('');

  useEffect(() => {
    fetchCropTypes();
  }, []);

  const fetchCropTypes = async () => {
    try {
      const response = await api.get('/crop-types');
      setCropTypes(response.data);
    } catch (error) {
      toast.error('Error fetching crop types');
    }
  };

  const handleCreate = async () => {
    if (!newCrop) return;
    try {
      await api.post('/crop-types', { name: newCrop });
      setNewCrop('');
      fetchCropTypes();
      toast.success('Crop type added');
    } catch (error) {
      toast.error('Error adding crop type');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop type?')) {
      try {
        await api.delete(`/crop-types/${id}`);
        fetchCropTypes();
        toast.success('Crop type deleted');
      } catch (error) {
        toast.error('Error deleting crop type');
      }
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4>Crop Types Management</h4>
        <div className="d-flex gap-2">
          <Form.Control
            placeholder="New crop type"
            value={newCrop}
            onChange={(e) => setNewCrop(e.target.value)}
            style={{ width: '200px' }}
          />
          <Button variant="success" onClick={handleCreate}>
            <FaPlus /> Add
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Crop Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cropTypes.map(cropType => (
              <tr key={cropType.id}>
                <td>{cropType.id}</td>
                <td>
                  {editingId === cropType.id ? (
                    <Form.Control
                      value={cropType.name}
                      onChange={(e) => setCropTypes(cropTypes.map(ct => 
                        ct.id === cropType.id ? {...ct, name: e.target.value} : ct
                      ))}
                    />
                  ) : cropType.name}
                </td>
                <td>
                  {editingId === cropType.id ? (
                    <>
                      <Button variant="success" size="sm" onClick={async () => {
                        try {
                          await api.put(`/crop-types/${cropType.id}`, { name: cropType.name });
                          setEditingId(null);
                          toast.success('Crop type updated');
                        } catch (error) {
                          toast.error('Error updating crop type');
                        }
                      }}>
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" className="ms-2" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary" size="sm" onClick={() => setEditingId(cropType.id)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(cropType.id)}>
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CropTypes;