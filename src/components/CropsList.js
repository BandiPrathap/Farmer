import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import CropCard from './CropCard';

const CropsList = ({ crops, onEdit, onDelete, onViewStages, onViewOrders }) => (
  <Row xs={1} md={2} lg={3} className="g-4">
    {crops.length === 0 ? (
      <Col>
        <Alert variant="info" className="text-center">
          No crops found. Start by adding your first crop!
        </Alert>
      </Col>
    ) : (
      crops.map((crop) => (
        <Col key={crop.id}>
          <CropCard
            crop={crop}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewStages={onViewStages}
            onViewOrders={onViewOrders}
          />
        </Col>
      ))
    )}
  </Row>
);

export default CropsList;