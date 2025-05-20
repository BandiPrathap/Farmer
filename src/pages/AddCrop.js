// src/pages/AddCrop.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StepHeader } from '../components/AddCrop/StepHeader';
import { CropTypeStep } from '../components/AddCrop/CropTypeStep';
import { CropDetailsStep } from '../components/AddCrop/CropDetailsStep';
import { AddStageStep } from '../components/AddCrop/AddStageStep';
import axios from 'axios';

const AddCrop = () => {
  const [step, setStep] = useState(1);
  const [cropTypes, setCropTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [formData, setFormData] = useState({
    cropType: '',
    newType: '',
    duration: '',
    yield: '',
    price: '',
    risk: '',
    stageImage: '',
    stage: 'planted'
  });
  const [loading, setLoading] = useState(false);
  const [createdCropId, setCreatedCropId] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch crop types on mount
  useEffect(() => {
    const fetchCropTypes = async () => {
      try {
        const response = await fetch('https://farmer-tau.vercel.app/crop-types');
        if (!response.ok) throw new Error('Failed to fetch crop types');
        const data = await response.json();
        setCropTypes(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchCropTypes();
  }, []);

  const handleAddType = async () => {
    if (!formData.newType) {
      toast.error('Please enter a crop type name');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('https://farmer-tau.vercel.app/crop-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.newType })
      });
      
      if (!response.ok) throw new Error('Failed to add crop type');
      
      const newTypeData = await response.json();
      setCropTypes([...cropTypes, { id: newTypeData.id, name: formData.newType }]);
      setFormData({ ...formData, cropType: String(newTypeData.id), newType: '' });
      toast.success('Crop type added successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCropSubmit = async () => {
    if (!formData.cropType || !formData.duration || !formData.yield || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://farmer-tau.vercel.app/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_type_id: formData.cropType,
          duration_days: formData.duration,
          estimated_yield: formData.yield,
          estimated_price: formData.price,
          risk_profile: formData.risk,
          farmer_id: user.id
        })
      });

      if (!response.ok) throw new Error('Failed to create crop');
      
     const newCrop = await response.json();
     setCreatedCropId(newCrop.crop_id); // ✅ Correct property

      setStep(3);
      toast.success('Crop created successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStageSubmit = async () => {
  if (!formData.stageImage) {
    toast.error('Please upload an image');
    return;
  }

  try {
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('image', formData.stageImage); // image file
    formDataToSend.append('stage', formData.stage);      // stage string

    const response = await axios.post(
      `https://farmer-tau.vercel.app/crops/${createdCropId}/stages`,
      formDataToSend,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    toast.success('Stage added successfully!');
    navigate('/');
  } catch (error) {
    toast.error(error.response?.data?.error || error.message);
  } finally {
    setLoading(false);
  }
};


  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Store file object directly
  setFormData((prev) => ({ ...prev, stageImage: file }));
  toast.success('Image selected!');
};


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   return (
    <Container className="py-5">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body>
              <StepHeader step={step} />
              
              {step === 1 && (
                <CropTypeStep
                  formData={formData}
                  cropTypes={cropTypes}
                  loading={loading}
                  handleAddType={handleAddType}
                  handleInputChange={handleInputChange}
                  setStep={setStep}
                />
              )}

              {step === 2 && (
                <CropDetailsStep
                  formData={formData}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  setStep={setStep}
                  handleCropSubmit={handleCropSubmit}
                />
              )}

              {step === 3 && (
                <AddStageStep
                  formData={formData}
                  loading={loading}
                  handleInputChange={handleInputChange}
                  handleImageChange={handleImageChange}
                  setStep={setStep}
                  handleStageSubmit={handleStageSubmit}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCrop;