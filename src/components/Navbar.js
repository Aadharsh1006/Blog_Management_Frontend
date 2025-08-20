import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaTachometerAlt, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function NavbarComponent() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" bg="warning" variant="dark" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          Blog Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-2">
            
            {isLoggedIn ? (
              <>
                {user.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin" className="fw-bold text-dark d-flex align-items-center">
                    <FaUserShield className="me-1" /> Admin
                  </Nav.Link>
                )}
                {user.role === 'AUTHOR' && (
                  <Nav.Link as={Link} to="/dashboard" className="fw-bold text-dark d-flex align-items-center">
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Nav.Link>
                )}
                <Navbar.Text className="text-dark mx-3">
                  Welcome, <span className="fw-semibold">{user?.name || 'User'}</span>
                </Navbar.Text>
                <Button variant="dark" size="sm" onClick={handleLogout} className="d-flex align-items-center">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="dark" onClick={() => navigate('/login')} className="d-flex align-items-center">
                <FaSignInAlt className="me-2" />
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
