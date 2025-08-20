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
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="app-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Blog Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {isLoggedIn ? (
              <>
                {user.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin" className="fw-bold nav-link-custom">
                    <FaUserShield className="me-1" /> Admin
                  </Nav.Link>
                )}
                {user.role === 'AUTHOR' && (
                  <Nav.Link as={Link} to="/dashboard" className="fw-bold nav-link-custom">
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Nav.Link>
                )}
                <Navbar.Text className="mx-3 text-dark">
                  Welcome, {user?.name || 'User'}
                </Navbar.Text>
                <Button variant="outline-secondary" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline-primary" onClick={() => navigate('/login')}>
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