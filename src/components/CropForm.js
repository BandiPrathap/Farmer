import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap'; // If using react-bootstrap
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CropForm = ({ cropTypes, onCreated, farmer_id}) => {
    const [form, setForm] = useState({
      crop_type_id: '',
      duration_days: '',
      estimated_yield: '',
      estimated_price: '',
      risk_profile: '',
      farmer_id:farmer_id
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post('https://farmer-tau.vercel.app/crops', form)
        .then(() => {
          toast.success("Crop created successfully!");
          onCreated();
          setForm({
            crop_type_id: '',
            duration_days: '',
            estimated_yield: '',
            estimated_price: '',
            risk_profile: '',
            farmer_id:''
          });
        }).catch((error) => {
          console.error("Error creating crop:", error);
          toast.error("Failed to create crop. Please try again.");
        });
    };
  
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Select required value={form.crop_type_id}
          onChange={(e) => setForm({...form, crop_type_id: e.target.value})}>
          <option value="">Select Crop Type</option>
          {cropTypes.map(ct => (
            <option key={ct.id} value={ct.id}>{ct.name}</option>
          ))}
        </Form.Select>
        <Form.Control
          type="number" placeholder="Duration (days)"
          value={form.duration_days}
          onChange={(e) => setForm({...form, duration_days: e.target.value})}
          className="mt-2"
        />
        <Form.Control
          placeholder="Estimated Yield"
          value={form.estimated_yield}
          onChange={(e) => setForm({...form, estimated_yield: e.target.value})}
          className="mt-2"
        />
        <Form.Control
          placeholder="Estimated Price"
          value={form.estimated_price}
          onChange={(e) => setForm({...form, estimated_price: e.target.value})}
          className="mt-2"
        />
        <Form.Control
          placeholder="Risk Profile"
          value={form.risk_profile}
          onChange={(e) => setForm({...form, risk_profile: e.target.value})}
          className="mt-2 mb-2"
        />
        <Button type="submit">Create Crop</Button>
      </Form>
    );
  };
  
  export default CropForm;
  