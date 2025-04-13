import { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const CropTypes = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');

  const fetchTypes = () => {
    axios.get('https://farmer-tau.vercel.app/crop-types').then(res => setTypes(res.data));
  };

  useEffect(() => { fetchTypes(); }, []);

  const handleAdd = () => {
    axios.post('https://farmer-tau.vercel.app/crop-types', { name })
      .then(() => {
        fetchTypes();
        setName('');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`https://farmer-tau.vercel.app/crop-types/${id}`).then(fetchTypes);
  };

  return (
    <>
      <h3>Crop Types</h3>
      <Form inline className="mb-3 d-flex">
        <Form.Control
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Add crop type"
        />
        <Button onClick={handleAdd}>Add</Button>
      </Form>
      <Table striped>
        <thead><tr><th>Name</th><th>Action</th></tr></thead>
        <tbody>
          {types.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td><Button variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CropTypes;
