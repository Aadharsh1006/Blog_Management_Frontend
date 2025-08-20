// src/components/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import * as authService from '../api/blogPostService';
import AnimatedHeaderText from './AnimatedHeaderText';

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
      <div className="text-center p-5" style={{ background: 'linear-gradient(90deg, #FFC107, #FF9800)', color: 'white' }}>
        <AnimatedHeaderText 
          title="Register"
          subtitleSequence={[
            'Create an account to join our community.', 2000,
            'Share your thoughts and ideas.', 2000,
          ]}
        />
      </div>
      <Container className="my-5">
        <Card className="p-4 mx-auto" style={{ maxWidth: '500px' }}>
          <Card.Body>
            {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="role">
                <Form.Label>Select Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="READER">Reader</option>
                  <option value="AUTHOR">Author</option>
                  <option value="ADMIN">Admin</option>
                </Form.Select>
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner as="span" animation="border" size="sm" /> : <><FaUserPlus className="me-2" />Register</>}
                </Button>
              </div>
            </Form>
            <div className="text-center mt-3">
              <small>Already have an account? <Link to="/login">Login here</Link></small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
