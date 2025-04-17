import { useEffect, useState } from 'react';
import { Table, Form, Button, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function CropTypes() {
  const [cropTypes, setCropTypes] = useState([]);
  const [newCrop, setNewCrop] = useState('');
  const [editingCrop, setEditingCrop] = useState(null);
  const [error, setError] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);
  const [loading, setLoading] = useState(false);


  const { token } = useAuth();

  useEffect(() => {
    fetchCropTypes(); 
  }, [token]);

  const fetchCropTypes = async () => {
    try {
      const response = await axios.get('https://farmer-tau.vercel.app/crop-types');
      setCropTypes(response.data);
      localStorage.setItem('cropTypes', JSON.stringify(response.data));
    } catch (err) {
      setError('Failed to fetch crop types');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (editingCrop) {
        await axios.put(`https://farmer-tau.vercel.app/crop-types/${editingCrop.id}`, { name: newCrop });
        toast.success('Crop type updated successfully!');
      } else {
        await axios.post('https://farmer-tau.vercel.app/crop-types', { name: newCrop });
        toast.success('Crop type added successfully!');
      }
  
      // Re-fetch after change
      fetchCropTypes();
      setNewCrop('');
      setEditingCrop(null);
      setShowFormModal(false);
    } catch (err) {
      toast.error('Failed to save crop type');
    }finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://farmer-tau.vercel.app/crop-types/${cropToDelete.id}`);
      toast.success('Crop type deleted successfully!');
      
      // Re-fetch after deletion
      fetchCropTypes();
      setShowDeleteModal(false);
      setCropToDelete(null);
    } catch (err) {
      toast.error('Failed to delete crop type');
    }finally {
      setLoading(false);
    }
  };

  const handleEdit = (crop) => {
    setNewCrop(crop.name);
    setEditingCrop(crop);
    setShowFormModal(true);
  };

  

  return (
    <div>
      <h2>Crop Types Management</h2>

      <Button variant="primary" className="mb-3" onClick={() => { setNewCrop(''); setEditingCrop(null); setShowFormModal(true); }}>
        Add Crop Type
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cropTypes.map(crop => (
            <tr key={crop.id}>
              <td>{crop.id}</td>
              <td>{crop.name}</td>
              <td>
              <div className='d-flex gap-3'>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => window.location.href = `/crop/${crop.id}/farmers`}
                >
                  View Farmers
                </Button>
                  <FaEdit
                    style={{ cursor: 'pointer', marginRight: 10 }}
                    onClick={() => handleEdit(crop)}
                  />
                  <FaTrash
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => { setCropToDelete(crop); setShowDeleteModal(true); }}
                  />
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCrop ? 'Edit Crop Type' : 'Add Crop Type'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Crop Name</Form.Label>
              <Form.Control
                type="text"
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingCrop ? 'Update' : 'Add'}
            </Button>
            <Button variant="secondary" onClick={() => { setShowFormModal(false); setEditingCrop(null); }} disabled={loading}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{cropToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
          Cancel
        </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
}
