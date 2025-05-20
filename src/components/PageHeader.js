import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSeedling } from '@fortawesome/free-solid-svg-icons';

const PageHeader = ({ title, buttonText, onButtonClick }) => (
  <div className="d-flex flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
    <h2 className="text-success m-0">
      <FontAwesomeIcon icon={faSeedling} className="me-2" />
      {title}
    </h2>
    <div className="d-flex gap-2">
      <Button
        variant="success"
        onClick={onButtonClick}
        className="d-flex align-items-center"
      >
        <FontAwesomeIcon icon={faPlus} className="me-2" />
        <span>{buttonText}</span>
      </Button>
    </div>
  </div>
);

export default PageHeader;