import { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

const CropTypesInline = ({ onAdded }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    axios.post('https://farmer-tau.vercel.app/crop-types', { name })
      .then(() => {
        setName('');
        onAdded();
      })
      .catch(err => {
        console.error('Error adding crop type:', err);
        alert('Failed to add crop type.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form onSubmit={handleAdd} className="d-flex gap-2">
      <Form.Control
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter new crop type"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </Button>
    </Form>
  );
};

export default CropTypesInline;
