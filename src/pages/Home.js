import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from '../components/PageHeader';
import CropsList from '../components/CropsList';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Home = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch(
          `https://farmer-tau.vercel.app/crops?farmer_id=${user.id}`
        );
        if (!response.ok) throw new Error('Failed to fetch crops');
        const data = await response.json();
        setCrops(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCrops();
    } else {
      navigate('/login');
    }
  }, [navigate, user]);

  const handleDeleteClick = (crop) => {
    setSelectedCrop(crop);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCrop || deleteConfirmName !== selectedCrop.name) {
      toast.error('Please type the crop name correctly to confirm deletion');
      return;
    }

    try {
      const response = await fetch(`https://farmer-tau.vercel.app/crops/${selectedCrop.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete crop');
      }

      setCrops(crops.filter(crop => crop.id !== selectedCrop.id));
      toast.success('Crop deleted successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setSelectedCrop(null);
      setDeleteConfirmName('');
    }
  };

  const handleEditCrop = (cropId) => {
    navigate(`/edit-crop/${cropId}`);
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
      
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        crop={selectedCrop}
        confirmName={deleteConfirmName}
        setConfirmName={setDeleteConfirmName}
        onConfirm={confirmDelete}
      />

      <PageHeader
        title="My Crops"
        buttonText="Add New Crop"
        onButtonClick={() => navigate('/add-crop')}
      />

      <CropsList
        crops={crops}
        onEdit={handleEditCrop}
        onDelete={handleDeleteClick}
        onViewStages={(id) => navigate(`/crops/${id}/stages`)}
        onViewOrders={(id) => navigate(`/crops/${id}/orders`)}
      />
    </Container>
  );
};

export default Home;