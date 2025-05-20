import React from 'react';

export const StepHeader = ({ step }) => (
  <div className="text-center mb-4">
    <h3>
      Add New Crop
      <small className="d-block text-muted mt-2">Step {step} of 3</small>
    </h3>
  </div>
);