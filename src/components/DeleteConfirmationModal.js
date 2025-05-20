import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const DeleteConfirmationModal = ({ 
  show, 
  onHide, 
  crop, 
  confirmName, 
  setConfirmName, 
  onConfirm 
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Crop Deletion</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>To confirm deletion, please type the crop name: <strong>{crop?.name}</strong></p>
      <Form.Control
        type="text"
        value={confirmName}
        onChange={(e) => setConfirmName(e.target.value)}
        placeholder="Enter crop name"
      />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cancel
      </Button>
      <Button 
        variant="danger" 
        onClick={onConfirm}
        disabled={confirmName !== crop?.name}
      >
        Confirm Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteConfirmationModal;