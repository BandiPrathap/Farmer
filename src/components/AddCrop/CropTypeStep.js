import React from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';

export const CropTypeStep = ({
  formData,
  cropTypes,
  loading,
  handleAddType,
  handleInputChange,
  setStep
}) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Select Existing Crop Type</Form.Label>
      <Form.Select
        name="cropType"
        value={formData.cropType}
        onChange={handleInputChange}
        disabled={loading}
      >
        <option value="">Choose...</option>
        {cropTypes.map(type => (
          <option key={type.id} value={String(type.id)}>
            {type.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>

    <div className="text-center mb-3">OR</div>

    <Form.Group className="mb-3">
      <Form.Label>Add New Crop Type</Form.Label>
      <div className="d-flex gap-2">
        <Form.Control
          type="text"
          name="newType"
          placeholder="Enter new crop type"
          value={formData.newType}
          onChange={handleInputChange}
          disabled={loading}
        />
        <Button 
          variant="outline-success" 
          onClick={handleAddType}
          disabled={loading || !formData.newType.trim()}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Adding...
            </>
          ) : 'Add Type'}
        </Button>
      </div>
    </Form.Group>

    <div className="d-flex justify-content-end">
      <Button
        variant="success"
        onClick={() => setStep(2)}
        disabled={!formData.cropType}
      >
        Next
      </Button>
    </div>
  </>
);
