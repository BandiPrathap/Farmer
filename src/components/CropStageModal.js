// src/components/CropStageModal.js
import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '../services/api';
import { toast } from 'react-toastify';

const CropStageModal = ({ show, onHide, crop, refresh }) => {
  const [formData, setFormData] = useState({
    crop_type_id: '',
    duration_days: '',
    estimated_yield: '',
    estimated_price: '',
    risk_profile: '',
    farmer_id: ''
  });

  useEffect(() => {
    if (crop) {
      setFormData({
        crop_type_id: crop.crop_type_id,
        duration_days: crop.duration_days,
        estimated_yield: crop.estimated_yield,
        estimated_price: crop.estimated_price,
        risk_profile: crop.risk_profile,
        farmer_id: crop.farmer_id
      });
    }
  }, [crop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (crop) {
        await api.put(`/crops/${crop.id}`, formData);
      } else {
        await api.post('/crops', formData);
      }
      refresh();
      onHide();
      toast.success(`Crop ${crop ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Error ${crop ? 'updating' : 'creating'} crop`);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{crop ? 'Edit Crop' : 'Add New Crop'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Crop Type ID</Form.Label>
            <Form.Control
              type="number"
              value={formData.crop_type_id}
              onChange={(e) => setFormData({ ...formData, crop_type_id: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (Days)</Form.Label>
            <Form.Control
              type="number"
              value={formData.duration_days}
              onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estimated Yield</Form.Label>
            <Form.Control
              value={formData.estimated_yield}
              onChange={(e) => setFormData({ ...formData, estimated_yield: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estimated Price</Form.Label>
            <Form.Control
              type="number"
              value={formData.estimated_price}
              onChange={(e) => setFormData({ ...formData, estimated_price: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Risk Profile</Form.Label>
            <Form.Control
              as="textarea"
              value={formData.risk_profile}
              onChange={(e) => setFormData({ ...formData, risk_profile: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <Button variant="success" type="submit">Save Changes</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CropStageModal;