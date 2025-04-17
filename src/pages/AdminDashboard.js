import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal} from 'react-bootstrap';
import Farmers from './Farmers'
import CropForm from '../components/CropForm';
import CropTypesInline from '../components/CropTypesInline';

const AdminDashboard = () => {
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropTypes, setCropTypes] = useState([]);

  const fetchCropTypes = () => {
    axios.get('https://farmer-tau.vercel.app/crop-types')
      .then(res => setCropTypes(res.data));
  };

  useEffect(() => {
    fetchCropTypes();
  }, []);

  const handleAssignCrop = (farmer) => {
    setSelectedFarmer(farmer);
    setShowCropModal(true);
  };

  const handleCropCreated = () => {
    setShowCropModal(false);
  };

  return (
    <div className="p-4">
      <Farmers onAssignCrop={handleAssignCrop} />

      {/* Assign Crop Modal */}
      <Modal show={showCropModal} onHide={() => setShowCropModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Crop to {selectedFarmer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <CropForm
          cropTypes={cropTypes}
          onCreated={handleCropCreated}
          farmer_id={selectedFarmer?.id}
        />

          <hr />
          <h5>Add Crop Type</h5>
          <CropTypesInline onAdded={fetchCropTypes} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
