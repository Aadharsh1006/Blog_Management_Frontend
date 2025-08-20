import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as blogPostService from '../api/blogPostService';
import AnimatedHeaderText from './AnimatedHeaderText';

export default function BlogForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    author: '', 
    status: 'PUBLISHED' 
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      blogPostService.getPostById(id)
        .then(data => { 
          if(data) { 
            setFormData({ 
              title: data.title, 
              content: data.content, 
              author: data.author, 
              status: data.status || 'PUBLISHED'
            }); 
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    
    const postData = { 
      title: formData.title,
      content: formData.content,
      author: formData.author,
      status: formData.status,
      authorId: user.id 
    };
    
    const action = mode === 'create' 
      ? blogPostService.createPost(postData) 
      : blogPostService.updatePost(id, postData);
      
    try {
      await action;
      setMessage(`blog post ${mode === 'create' ? 'created' : 'updated'} successfully`);
      if (process.env.NODE_ENV !== 'test') {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.toString();
      setMessage(errorMessage);
    }
  };

  if (loading) return <Container className="mt-4 text-center">Loading...</Container>;

return (
    <>
      <div className="text-center p-5" style={{ background: 'linear-gradient(90deg, #FFC107, #FF9800)', color: 'white' }}>
        <AnimatedHeaderText 
          title={mode === 'create' ? 'Create a New Post' : 'Edit Post'}
          subtitleSequence={[
            'Share your thoughts with the world.', 2000,
            'Craft your next great article.', 2000,
          ]}
        />
      </div>
      <Container className="my-5">
        <Card className="p-4 mx-auto" style={{ maxWidth: '800px' }}>
          <Card.Body>
            {message && <Alert variant="info">{message}</Alert>}
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control data-testid="title-input" type="text" name="title" value={formData.title} onChange={handleChange} isInvalid={!!errors.title} />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="content">
                <Form.Label>Content</Form.Label>
                <Form.Control data-testid="content-input" as="textarea" rows={8} name="content" value={formData.content} onChange={handleChange} isInvalid={!!errors.content} />
                <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="author">
                <Form.Label>Author</Form.Label>
                <Form.Control data-testid="author-input" type="text" name="author" value={formData.author} onChange={handleChange} isInvalid={!!errors.author} />
                <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                  </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" className="me-2" onClick={() => navigate(-1)}><FaTimes className="me-2" />Cancel</Button>
                <Button variant="primary" type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}