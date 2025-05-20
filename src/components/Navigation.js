// src/components/Navigation.js
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUser, FaSeedling, FaList, FaBox } from 'react-icons/fa';


const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Style for active navigation links
  const getActiveStyle = (isActive) => ({
    borderBottom: isActive ? '3px solid white' : 'none',
    fontWeight: isActive ? '600' : 'normal',
    transition: 'all 0.3s ease',
  });

  return (
    <Navbar bg="success" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          FarmKart
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-nav" />
        
        <Navbar.Collapse id="main-nav">
          {/* Right-aligned navigation items */}
          <Nav className="ms-auto align-items-lg-center">
            {user && (
              <>
                <Nav.Link 
                  as={NavLink} 
                  to="/" 
                  className="position-relative mx-2"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaHome className="me-1" />
                  Home
                </Nav.Link>

                <Nav.Link 
                  as={NavLink} 
                  to="/profile"
                  className="position-relative mx-2"
                  style={({ isActive }) => getActiveStyle(isActive)}
                >
                  <FaUser className="me-1" />
                  Profile
                </Nav.Link>

                {/* Logout Button */}
                <Button 
                  variant="outline-light" 
                  className="ms-lg-3 mt-2 mt-lg-0"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;