import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await login(formData);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials. Please try again.';
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
                  placeholder="Enter your password"
                  required
                  className="shadow-sm"
                />
              </Form.Group>
              <div className="d-grid">
                <Button variant="warning" type="submit" disabled={loading} className="fw-semibold">
                  {loading ?
                    (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Loading...</>) :
                    (<><FaSignInAlt className="me-2" />Login</>)
                  }
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <small>
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none fw-semibold text-warning">
                  Register here
                </Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
