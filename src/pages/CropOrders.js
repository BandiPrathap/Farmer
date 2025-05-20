// src/pages/CropOrders.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBox, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CropOrders = () => {
    const { cropId } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [cropDetails, setCropDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [cropResponse, ordersResponse] = await Promise.all([
                    fetch(`https://farmer-tau.vercel.app/crops/${cropId}`),
                    fetch(`https://farmer-tau.vercel.app/orders?crop_id=${cropId}`)
                ]);

                if (!cropResponse.ok || !ordersResponse.ok) throw new Error('Failed to fetch data');
                
                const cropData = await cropResponse.json();
                const ordersData = await ordersResponse.json();
                
                setCropDetails(cropData);
                setOrders(ordersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [cropId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-5 mx-3">
                Error: {error}
            </Alert>
        );
    }

    return (
        <Container className="py-4">
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-success">
                    <FontAwesomeIcon icon={faBox} className="me-2" />
                    {cropDetails?.name} Orders
                </h2>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {orders.length === 0 ? (
                    <Col>
                        <Alert variant="info" className="text-center">
                            No orders found for this crop
                        </Alert>
                    </Col>
                ) : (
                    orders.map((order) => (
                        <Col key={order.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                                    <div>Order #{order.id}</div>
                                    <Badge bg="light" text="dark" className="text-capitalize">
                                        {order.status}
                                    </Badge>
                                </Card.Header>
                                
                                <Card.Body>
                                    <ListGroup variant="flush" className="small">

                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <FontAwesomeIcon icon={faBox} className="me-2 text-muted" />
                                                Quantity
                                            </div>
                                            <span className="fw-bold">{order.quantity} kg</span>
                                        </ListGroup.Item>

                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <FontAwesomeIcon icon={faCalendar} className="me-2 text-muted" />
                                                Order Date
                                            </div>
                                            <span className="fw-bold">{formatDate(order.order_date)}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>

                                <Card.Footer className="bg-light border-top-0">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => navigate(`/orders/${order.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default CropOrders;
