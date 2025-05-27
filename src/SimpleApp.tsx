import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Heading, Text, Flex, Button } from '@chakra-ui/react';

function HomePage() {
  return (
    <Box p={8}>
      <Heading>Home Page</Heading>
      <Text mt={4}>Welcome to the simple test app</Text>
    </Box>
  );
}

function AboutPage() {
  return (
    <Box p={8}>
      <Heading>About Page</Heading>
      <Text mt={4}>This is a test page to verify routing is working</Text>
    </Box>
  );
}

function Navigation() {
  return (
    <Flex bg="teal.500" p={4} color="white">
      <Button as={Link} to="/" colorScheme="teal" variant="ghost" mr={4}>Home</Button>
      <Button as={Link} to="/about" colorScheme="teal" variant="ghost">About</Button>
    </Flex>
  );
}

function SimpleApp() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default SimpleApp; 