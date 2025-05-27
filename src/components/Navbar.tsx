import React from 'react';
import { Box, Flex, Link as ChakraLink, Button, Spacer, Heading } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
          <ChakraLink as={Link} to="/">
            ProjectVal
          </ChakraLink>
        </Heading>
      </Flex>

      <Spacer />

      <Box>
        {user ? (
          <>
            <ChakraLink as={Link} to="/evaluation" mr={4}>
              Evaluation
            </ChakraLink>
            <ChakraLink as={Link} to="/dashboard" mr={4}>
              Dashboard
            </ChakraLink>
            <Button colorScheme="teal" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <ChakraLink as={Link} to="/login" mr={4}>
              Login
            </ChakraLink>
            <ChakraLink as={Link} to="/register">
              Register
            </ChakraLink>
          </>
        )}
      </Box>
    </Flex>
  );
} 