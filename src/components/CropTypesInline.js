import { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const CropTypesInline = ({ onAdded }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    axios.post('https://farmer-tau.vercel.app/crop-types', { name })
      .then(() => {
        setName('');
        onAdded(); // Refresh crop types in parent
      });
  };

  return (
    <Form className="d-flex gap-2">
      <Form.Control
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter new crop type"
      />
      <Button onClick={handleAdd}>Add</Button>
    </Form>
  );
};

export default CropTypesInline;
