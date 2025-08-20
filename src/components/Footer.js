import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5 shadow-sm">
      <Container>
        <p className="mb-0 small">&copy; {new Date().getFullYear()} Blog Management System</p>
      </Container>
    </footer>
  );
}
