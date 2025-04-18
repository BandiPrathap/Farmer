import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { Table, Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://farmer-tau.vercel.app/orders");
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const openModal = (order, type) => {
    setSelectedOrder(order);
    setModalType(type);
    setShowModal(true);

    if (type === 'quantity') setQuantityInput(order.quantity);
    if (type === 'status') setStatusInput(order.status);
  };

  const handleSave = async () => {
    if (!selectedOrder) return;
  
    const url = `https://farmer-tau.vercel.app/orders/${selectedOrder.order_id}`;
    setLoading(true); 
  
    try {
      if (modalType === 'quantity') {
        await axios.put(url, { quantity: quantityInput });
        toast.success("Quantity updated successfully!");
      } else if (modalType === 'status') {
        await axios.put(url, { status: statusInput });
        toast.success("Status updated successfully!");
      } else if (modalType === 'delete') {
        await axios.delete(url);
        toast.success("Order deleted successfully!");
      }
  
      setShowModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Failed to perform action:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };
  

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order.crop_name.toLowerCase().includes(search) ||
      order.farmer_name.toLowerCase().includes(search) ||
      order.farmer_phone.toLowerCase().includes(search) ||
      order.customer_name.toLowerCase().includes(search) ||
      order.customer_phone.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mt-4">
      <h2>Order Details</h2>

      {/* Search Input */}
      <Form.Control
        type="text"
        placeholder="Search by crop, farmer name, phone, customer name or phone"
        value={searchTerm}
        className="mb-3"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Orders Table */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Crop</th>
            <th>Farmer</th>
            <th>Customer</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.crop_name}</td>
              <td>{order.farmer_name} ({order.farmer_phone})</td>
              <td>{order.customer_name} ({order.customer_phone})</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => openModal(order, 'quantity')}
                >
                  Edit Quantity
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-1"
                  onClick={() => openModal(order, 'status')}
                >
                  Edit Status
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => openModal(order, 'delete')}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">No orders match your search.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Bootstrap Modal (react-bootstrap) */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'quantity' && 'Update Quantity'}
            {modalType === 'status' && 'Update Status'}
            {modalType === 'delete' && 'Confirm Deletion'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'quantity' && (
            <Form.Control
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
            />
          )}
          {modalType === 'status' && (
            <Form.Select
              value={statusInput}
              onChange={(e) => setStatusInput(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          )}
          {modalType === 'delete' && (
            <p>Are you sure you want to delete this order?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
          Cancel
        </Button>
        <Button variant={modalType === 'delete' ? "danger" : "primary"} onClick={handleSave} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : modalType === 'delete' ? 'Delete' : 'Save'}
        </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default OrderDetails;
