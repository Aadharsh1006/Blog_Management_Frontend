import React, { useEffect, useState, useCallback } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as blogPostService from '../api/blogPostService';
import { Container, Table, Button,Badge, Alert } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

export default function AuthorDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAuthorPosts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await blogPostService.getPostsByAuthor(user.id);
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAuthorPosts();
  }, [fetchAuthorPosts]);

  

  if (loading) return <Container className="mt-4">Loading dashboard...</Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Author Dashboard</h1>
        <Button variant="primary" onClick={() => navigate('/posts/new')}>
          <FaPlus className="me-2" /> New Post
        </Button>
      </div>
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <Badge bg={post.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                    {post.status}
                  </Badge>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">You haven't created any posts yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
