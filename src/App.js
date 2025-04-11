// App.js
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import { People, Seed, ListTask, Clipboard } from 'react-bootstrap-icons';
import Farmers from './components/Farmers';
import CropTypes from './components/CropTypes';
import Crops from './components/Crops';
import AssignCrop from './components/AssignCrop';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Agri Admin</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/farmers">
              <People className="me-1" /> Farmers
            </Nav.Link>
            <Nav.Link as={Link} to="/crop-types">
              <Seed className="me-1" /> Crop Types
            </Nav.Link>
            <Nav.Link as={Link} to="/crops">
              <ListTask className="me-1" /> Crops
            </Nav.Link>
            <Nav.Link as={Link} to="/assign-crop">
              <Clipboard className="me-1" /> Assign Crops
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/crop-types" element={<CropTypes />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/assign-crop" element={<AssignCrop />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

function Dashboard() {
  return (
    <Row className="mt-5">
      <Col md={3} className="text-center">
        <div className="p-3 border rounded bg-light">
          <People size={40} />
          <h4 className="mt-2">Farmers</h4>
          <Link to="/farmers" className="btn btn-primary btn-sm">
            Manage Farmers
          </Link>
        </div>
      </Col>
      {/* Add similar blocks for other sections */}
    </Row>
  );
}

export default App;