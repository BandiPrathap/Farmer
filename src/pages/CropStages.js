import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Card, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faLeaf } from '@fortawesome/free-solid-svg-icons';

const CropStages = () => {
  const { cropId } = useParams();
  const [stages, setStages] = useState([]);
  const [cropDetails, setCropDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStage, setNewStage] = useState({ stage: 'planted', images: [] });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  const fetchStages = async () => {
    try {
      const response = await fetch(`https://farmer-tau.vercel.app/crops/${cropId}/stages`);
      if (!response.ok) throw new Error('Failed to fetch stages');
      const data = await response.json();
      setCropDetails(data);
      // Filter out invalid stages with null or empty data
      const validStages = data.images.filter(stage => stage.stage && stage.image_url);
      setStages(validStages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStages();
}, [cropId]);



  const handleAddStage = async () => {
  if (!newStage.images.length) {
    toast.error('Please select at least one image');
    return;
  }

  try {
    setUploading(true);

    // Upload one image at a time (backend handles only one)
    for (const file of newStage.images) {
      const formData = new FormData();
      formData.append('image', file); // this must match `req.files.image` in backend
      formData.append('stage', newStage.stage);

      const response = await fetch(`https://farmer-tau.vercel.app/crops/${cropId}/stages`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add stage');
      }
    }

    toast.success('Stage(s) added successfully!');
    setShowAddModal(false);
    setNewStage({ stage: 'planted', images: [] });

    // Refresh stages list
    const response = await fetch(`https://farmer-tau.vercel.app/crops/${cropId}/stages`);
    const data = await response.json();
    const validStages = data.images.filter(stage => stage.stage && stage.image_url);
    setStages(validStages);

  } catch (error) {
    toast.error(error.message);
  } finally {
    setUploading(false);
  }
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5 mx-3">
        Error: {error}
      </Alert>
    );
  }

  return (
    <Container className="py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">
          <FontAwesomeIcon icon={faLeaf} className="me-2" />
          {cropDetails?.name} Stages
        </h2>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add New Stage
        </Button>
      </div>

      {stages.length === 0 ? (
        <Alert variant="info" className="text-center">
          No stages found for this crop yet. Please add a new stage.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {stages.map((stage, index) => (
            <Col key={index}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={stage.image_url}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="text-capitalize">{stage.stage}</Card.Title>
                  <Card.Text>
                    Added on: {new Date(stage.uploaded_at).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Stage Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Stage</Form.Label>
              <Form.Select
                value={newStage.stage}
                onChange={(e) => setNewStage({ ...newStage, stage: e.target.value })}
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="harvested">Harvested</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewStage({ ...newStage, images: [...e.target.files] })}
              />
              <Form.Text className="text-muted">
                Select images for this stage (max 5)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddStage} disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CropStages;