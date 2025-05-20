import React from 'react';
import { Form, Button } from 'react-bootstrap';

export const AddStageStep = ({
  formData,
  loading,
  handleInputChange,
  handleImageChange,
  setStep,
  handleStageSubmit
}) => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>Stage Image</Form.Label>
      <Form.Control
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {formData.stageImage && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(formData.stageImage)}
            alt="Stage Preview"
            style={{ maxWidth: '100%', maxHeight: 200 }}
          />
        </div>
      )}
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Growth Stage</Form.Label>
      <Form.Select
        name="stage"
        value={formData.stage}
        onChange={handleInputChange}
      >
        <option value="planted">Planted</option>
        <option value="growing">Growing</option>
        <option value="harvested">Harvested</option>
      </Form.Select>
    </Form.Group>

    <div className="d-flex justify-content-between">
      <Button variant="outline-secondary" onClick={() => setStep(2)}>
        Back
      </Button>
      <Button variant="success" onClick={handleStageSubmit} disabled={loading}>
        {loading ? 'Adding...' : 'Complete'}
      </Button>
    </div>
  </>
);