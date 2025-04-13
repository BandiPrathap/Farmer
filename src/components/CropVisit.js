import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap'; // If using react-bootstrap


const CropVisit = ({ cropId }) => {
    const [form, setForm] = useState({
      stage: '',
      image_url: ''
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      axios.post(`https://farmer-tau.vercel.app/crops/${cropId}`, form)
        .then(() => alert("Updated successfully"));
    };
  
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Select required value={form.stage}
          onChange={e => setForm({ ...form, stage: e.target.value })}>
          <option value="">Select Stage</option>
          <option value="planted">Planted</option>
          <option value="harvested">Harvested</option>
          <option value="failed">Failed</option>
        </Form.Select>
        <Form.Control
          placeholder="Image URL"
          className="mt-2 mb-2"
          value={form.image_url}
          onChange={e => setForm({...form, image_url: e.target.value})}
        />
        <Button type="submit">Submit Visit</Button>
      </Form>
    );
  };
  
  export default CropVisit;
  