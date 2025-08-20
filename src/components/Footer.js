import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center p-3 mt-4">
      <Container>
        <p className="mb-0">&copy; {new Date().getFullYear()} Blog Management System</p>
      </Container>
    </footer>
  );
}