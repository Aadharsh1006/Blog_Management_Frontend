// src/components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AnimatedHeaderText from './AnimatedHeaderText';

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
      <div className="text-center p-5" style={{ background: 'linear-gradient(90deg, #FFC107, #FF9800)', color: 'white' }}>
        <AnimatedHeaderText 
          title="Login"
          subtitleSequence={[
            'Access your account to continue.', 2000,
            'Manage your posts and engage.', 2000,
          ]}
        />
      </div>
      <Container className="my-5">
        <Card className="p-4 mx-auto" style={{ maxWidth: '500px' }}>
          <Card.Body>
            {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner as="span" animation="border" size="sm" /> : <><FaSignInAlt className="me-2" />Login</>}
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <small>Don't have an account? <Link to="/register">Register here</Link></small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
