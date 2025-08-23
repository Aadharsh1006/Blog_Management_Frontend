import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import * as authService from '../api/blogPostService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'READER' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await authService.register(formData);
      setMessage('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <Container className="my-5">
        <Card
          className="p-4 mx-auto shadow-sm"
          style={{ maxWidth: '500px', borderRadius: '12px' }}
        >
          <Card.Body>
            {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Select Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="shadow-sm"
                >
                  <option value="READER">Reader</option>
                  <option value="AUTHOR">Author</option>
                  
                </Form.Select>
              </Form.Group>
              <div className="d-grid">
                <Button variant="warning" type="submit" disabled={loading} className="fw-semibold">
                  {loading ?
                    (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Registering...</>) :
                    (<><FaUserPlus className="me-2" />Register</>)
                  }
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <small>
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none fw-semibold text-warning">
                  Login here
                </Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
