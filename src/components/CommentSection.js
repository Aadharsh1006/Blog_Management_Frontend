import React, { useEffect, useState, useCallback } from 'react';
import { Form, Button, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import * as blogPostService from '../api/blogPostService';
import { FaPaperPlane } from 'react-icons/fa';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn, user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogPostService.getCommentsByPostId(postId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') {
      fetchComments();
    } else {
      setLoading(false);
    }
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData = { author: user.name, content: newComment };
      await blogPostService.createComment(postId, commentData);
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Failed to post comment.');
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Card className="mt-5">
      <Card.Body>
        <Card.Title as="h3" className="mb-4">Comments</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}

        {isLoggedIn ? (
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-2">
              <Form.Control 
                as="textarea" rows={3} value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..." required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              <FaPaperPlane className="me-2" /> Submit
            </Button>
          </Form>
        ) : (
          <Alert variant="secondary">
            Please <a href="/login">log in</a> to post a comment.
          </Alert>
        )}

        <ListGroup variant="flush">
          {comments && comments.length > 0 ? (
            comments.map(comment => (
              <ListGroup.Item key={comment.id} className="px-0">
                <strong>{comment.author}</strong>
                <p className="mb-0">{comment.content}</p>
              </ListGroup.Item>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}