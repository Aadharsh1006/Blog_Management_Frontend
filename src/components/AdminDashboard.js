  import React, { useEffect, useState, useCallback } from 'react';
  import { Container, Table, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
  import * as blogPostService from '../api/blogPostService';
  import { FaTrash, FaEdit } from 'react-icons/fa';
  import { useAuth } from '../context/AuthContext';

  export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { user: adminUser } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');

    const fetchUsers = useCallback(async () => {
      try {
        setLoading(true);
        const data = await blogPostService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleDelete = async (userId) => {
      if (window.confirm('Are you sure you want to permanently delete this user?')) {
          try {
              const res = await blogPostService.deleteUser(userId);
              setMessage(res.message);
              fetchUsers();
          } catch (err) {
              setError(err.response?.data?.message || 'Failed to delete user.');
          }
      }
    };

    const handleShowEditModal = (user) => {
      setEditingUser(user);
      setSelectedRole(user.role);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setEditingUser(null);
    };

    const handleSaveChanges = async () => {
      if (!editingUser) return;
      
      // DEBUG: Log the data being sent to the API
      console.log(`Attempting to update user ID: ${editingUser.id} to new role: ${selectedRole}`);

      try {
          await blogPostService.updateUserRole(editingUser.id, selectedRole);
          setMessage(`User ${editingUser.name}'s role updated successfully.`);
          fetchUsers();
          handleCloseModal();
      } catch (err) {
          setError('Failed to update role.');
      }
    };

    if (loading) return <Container className="mt-4">Loading user data...</Container>;
    
    return (
      <>
        <Container className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Admin Dashboard</h1>
          </div>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
          
          <h3 className="mb-3">User Management</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={
                        user.role === 'ADMIN' ? 'danger' :
                        user.role === 'AUTHOR' ? 'primary' : 'secondary'
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    {user.id !== adminUser.id && (
                      <>
                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShowEditModal(user)}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>
                          <FaTrash />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Role for {editingUser?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Select new role</Form.Label>
              <Form.Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="READER">Reader</option>
                <option value="AUTHOR">Author</option>
                <option value="ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }