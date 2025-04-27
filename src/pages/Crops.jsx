import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';

const Crops = () => {
    const [crops, setCrops] = useState([]);
    const [selectedCropId, setSelectedCropId] = useState(null);
    const [farmers, setFarmers] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [stage, setStage] = useState('');
    const [message, setMessage] = useState('');
    const [loadingFarmers, setLoadingFarmers] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCropStages, setSelectedCropStages] = useState([]);
    const [showStageModal, setShowStageModal] = useState(false);

  useEffect(() => {
    axios.get('https://farmer-tau.vercel.app/crops')
      .then(res => setCrops(res.data))
      .catch(() => setError('Failed to fetch crops'));
  }, []);

  const fetchFarmersByCrop = async (cropId) => {
    setLoadingFarmers(true);
    try {
      const res = await axios.get(`https://farmer-tau.vercel.app/crops/${cropId}/farmers`);
      const farmersData = Array.isArray(res.data) ? res.data : [res.data];
      setFarmers(farmersData);
      setSelectedCropId(cropId);
    } catch {
      setError('Failed to fetch farmers for crop');
    }
    setLoadingFarmers(false);
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleStageChange = (e) => {
    setStage(e.target.value);
  };

  const handleAddCropStage = async (e,cropId) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!imageFile || !stage) {
      setError('Please select an image and enter a growth stage');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('stage', stage);
    try {
      setIsLoading(true);


      // const response = await axios.post(`https://farmer-tau.vercel.app/crops/${cropId}`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      const response = await axios.post(`https://farmer-tau.vercel.app/crops/${cropId}/stages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }finally {
      setIsLoading(false);
    }
  };

  const handleViewStages = async (cropId) => {
    setError('');
    try {
      const res = await axios.get(`https://farmer-tau.vercel.app/crops/${cropId}/stages`);
      setSelectedCropStages(res.data.images || []);
      setSelectedCropId(cropId);
      setShowStageModal(true);
    } catch {
      setError('Failed to fetch crop stages');
    }
  };
  


  const selectedCrop = crops.find(c => c.id === selectedCropId);

  return (
    <div>
      <h2>Crops Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Crop List */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Crop Name</th>
            <th>Duration</th>
            <th>Yield</th>
            <th>Risk Profile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(crop => (
            <tr key={crop.id} className={selectedCropId === crop.id ? 'table-primary' : ''}>
              <td>{crop.id}</td>
              <td>{crop.name || 'N/A'}</td>
              <td>{crop.duration_days} days</td>
              <td>{crop.estimated_yield}</td>
              <td>{crop.risk_profile}</td>
              <td>
                <Button onClick={() => fetchFarmersByCrop(crop.id)} variant="info" size="sm" className="me-2">
                  View Farmers
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setSelectedCropId(crop.id);
                    setShowModal(true); // Open modal
                  }}
                >
                  Add Stage
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewStages(crop.id)}
                >
                  View Stages
                </Button>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      
      {/* Modal for Add Stage Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Stage to Crop #{selectedCropId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit = {(e)=>handleAddCropStage(e,selectedCropId)}>
            <Form.Group className="mb-2">
              <Form.Label>Crop Image</Form.Label>
              <Form.Control
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Growth Stage</Form.Label>
              <Form.Select
                value = {stage}
                id="stage"
                onChange={handleStageChange}
                disabled={isLoading}
              >
                <option value="">Select a stage</option>
                <option value="planted">Planted</option>
                <option value="harvested">Harvested</option>
                <option value="failed">Failed</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="success"
              type = "submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" animation="border" /> : 'Add Stage'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showStageModal} onHide={() => setShowStageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Stages of Crop #{selectedCropId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCropStages.length > 0 ? (
            selectedCropStages.map((stage, index) => (
              <div key={index} className="mb-3">
                <strong>Stage: </strong>{stage.stage}
                <div>
                  <img
                    src={stage.image_url}
                    alt={stage.stage}
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '5px' }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No stages available for this crop.</p>
          )}
        </Modal.Body>
      </Modal>


      {/* Farmers List */}
      {selectedCropId && (
        <div className="mt-4">
          <h4>
            Farmers Assigned to Crop #{selectedCropId}
            {selectedCrop?.crop_type?.name && ` (${selectedCrop.crop_type.name})`}
          </h4>
          {loadingFarmers ? (
            <Spinner animation="border" size="sm" />
          ) : farmers.length > 0 ? (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td>{farmer.name}</td>
                    <td>{farmer.phone}</td>
                    <td>{farmer.location}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No farmers assigned to this crop.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Crops;
