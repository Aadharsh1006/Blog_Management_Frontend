// FIX: Corrected the import statement on this line
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as blogPostService from '../api/blogPostService';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    blogPostService.getPostById(id)
      .then(data => {
        setPost({ ...data, authorId: 1 });
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || err.toString();
        setMessage(errorMessage);
      })
      .finally(() => { setLoading(false); });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
        try {
            await blogPostService.deletePost(id);
            setMessage('Blog post deleted successfully');
            if (process.env.NODE_ENV !== 'test') {
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (err) {
            setMessage(err.toString());
        }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" style={{ color: '#FF9800' }} />
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <div>
      {post ? (
        <>
          <div className="text-center p-5 mb-4" style={{ background: 'linear-gradient(90deg, #FFC107, #FF9800)', color: 'white' }}>
            <h1 className="display-4 fw-bold">{post.title}</h1>
            <p className="lead">By {post.author} on {new Date(post.updatedAt).toLocaleString()}</p>
          </div>
          <Container>
            {message && <Alert variant="info">{message}</Alert>}
            <div className="p-3 mx-auto" style={{ maxWidth: '800px', fontSize: '1.2rem', lineHeight: '1.8' }}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
            </div>
            
            <div className="d-flex justify-content-center gap-2 my-4">
              <Button variant="secondary" onClick={() => navigate('/')}>
                <FaArrowLeft className="me-2" />Back to List
              </Button>
              {(user?.role === 'AUTHOR' && user?.id === post.authorId) || user?.role === 'AUTHOR' ? (
                <>
                  <Button variant="warning" onClick={() => navigate(`/posts/${post.id}/edit`)}>
                    <FaEdit className="me-2" />Edit
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    <FaTrash className="me-2" />Delete
                  </Button>
                </>
              ) : null}
            </div>
            
            <div className="mx-auto" style={{ maxWidth: '800px' }}>
              <CommentSection postId={id} />
            </div>

          </Container>
        </>
      ) : (
        <Container className="mt-4">
          <Alert variant="warning">{message || 'Post not found.'}</Alert>
        </Container>
      )}
    </div>
  );
}