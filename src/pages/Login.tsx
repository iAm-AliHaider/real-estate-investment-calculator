import React from 'react';
import { Box, Heading, Input, Button, VStack, Text, Link as ChakraLink, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) setError(res.message || 'Login failed');
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box bg="white" p={8} rounded="lg" shadow="lg" minW="350px">
        <Heading mb={6} size="lg" color="gray.700" textAlign="center">Login</Heading>
        {error && (
          <Box mb={4} p={3} bg="red.100" color="red.700" borderRadius="md">
            <Text>{error}</Text>
          </Box>
        )}
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Box w="full">
            <Text mb={2} fontWeight="medium">Email*</Text>
            <Input placeholder="Email" type="email" size="lg" value={email} onChange={e => setEmail(e.target.value)} />
          </Box>
          <Box w="full">
            <Text mb={2} fontWeight="medium">Password*</Text>
            <Input placeholder="Password" type="password" size="lg" value={password} onChange={e => setPassword(e.target.value)} />
          </Box>
          <Button colorScheme="blue" size="lg" w="full" type="submit" isLoading={loading}>Login</Button>
        </VStack>
        <Text mt={4} textAlign="center" color="gray.500">
          Don't have an account?{' '}
          <ChakraLink as={Link} to="/register" color="blue.500" fontWeight="medium">Register</ChakraLink>
        </Text>
      </Box>
    </Flex>
  );
} 