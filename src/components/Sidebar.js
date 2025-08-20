import React from 'react';
import { Card } from 'react-bootstrap';

export default function Sidebar() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>About Me</Card.Title>
        <Card.Text>
          Welcome to my personal blog! Here I share my thoughts on technology, coding, and everything in between.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}