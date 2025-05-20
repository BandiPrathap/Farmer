import React from 'react';
import { Form, Button } from 'react-bootstrap';

export const CropDetailsStep = ({
  formData,
  loading,
  handleInputChange,
  setStep,
  handleCropSubmit
}) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Duration (Days)</Form.Label>
      <Form.Control
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Estimated Yield (kg)</Form.Label>
      <Form.Control
        type="number"
        name="yield"
        value={formData.yield}
        onChange={handleInputChange}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Estimated Price (₹)</Form.Label>
      <Form.Control
        type="number"
        step="0.01"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Risk Profile</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        name="risk"
        value={formData.risk}
        onChange={handleInputChange}
      />
    </Form.Group>

    <div className="d-flex justify-content-between">
      <Button variant="outline-secondary" onClick={() => setStep(1)}>
        Back
      </Button>
      <Button variant="success" onClick={handleCropSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Save Crop'}
      </Button>
    </div>
  </>
);