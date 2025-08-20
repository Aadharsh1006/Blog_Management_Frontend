import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as blogPostService from '../api/blogPostService';
import { Container, Row, Col, Card, Button, Alert, Pagination, Form } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('date-desc');
  const postsPerPage = 6;

  const navigate = useNavigate();
  const { user } = useAuth();

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogPostService.getAllPosts();
      const postsWithAuthorId = (data || []).map((post, index) => ({ ...post, authorId: index + 1 }));
      setPosts(postsWithAuthorId);
    } catch (err) {
      setMessage(err.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await blogPostService.deletePost(id);
        setMessage('Blog post deleted successfully');
        loadPosts();
      } catch (err) {
        setMessage(err.toString());
      }
    }
  };

  const sortedPosts = useMemo(() => {
    const sortablePosts = [...posts];
    if (sortOrder === 'date-desc') {
      sortablePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'alpha-asc') {
      sortablePosts.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sortablePosts;
  }, [posts, sortOrder]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Container className="mt-4 text-center">Loading...</Container>;

  return (
    <Container className="my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
        <h1 className="mb-0" style={{ color: '#F57C00', fontWeight: '700' }}>Blog Feed</h1>
        <div className="d-flex align-items-center gap-3">
          <Form.Select 
            style={{ width: '200px' }} 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="date-desc">Sort by Newest</option>
            <option value="alpha-asc">Sort Alphabetically</option>
          </Form.Select>
          {(user?.role === 'AUTHOR' || user?.role === 'ADMIN') && (
            <Button variant="primary" onClick={() => navigate('/posts/new')}>
              <FaPlus className="me-2" />
              Create New Post
            </Button>
          )}
        </div>
      </div>

      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

      <Row>
        {currentPosts.length > 0 ? (
          currentPosts.map(post => (
            <Col md={6} lg={4} key={post.id} className="mb-4 d-flex align-items-stretch">
              <Card className="w-100 blog-card-custom">
                <Card.Body className="d-flex flex-column">
                  <Card.Title as="h3" className="blog-card-title">{post.title}</Card.Title>
                  <Card.Subtitle as="p" className="text-muted">
                    By {post.author} on {new Date(post.createdAt).toLocaleString()}
                  </Card.Subtitle>
                  <div className="d-flex justify-content-end mt-auto pt-3">
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => navigate(`/posts/${post.id}`)}>
                      <FaEye className="me-1" /> View
                    </Button>
                    {(user?.role === 'AUTHOR' && user?.id === post.authorId)? (
                      <>
                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => navigate(`/posts/${post.id}/edit`)}>
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(post.id)}>
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </>
                    ) : null}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col><p>No posts available.</p></Col>
        )}
      </Row>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item 
              key={index + 1} 
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </Container>
  );
}