import React from 'react';
import { Box, Heading, Text, SimpleGrid, Flex, VStack } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext.tsx';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Box p={8}>
      <Heading mb={6}>Dashboard</Heading>
      
      <Text mb={8}>Welcome back, {user?.email || 'User'}!</Text>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Project Overview</Heading>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Active Projects</Text>
            <Text fontSize="2xl">3</Text>
            <Text fontSize="sm" color="gray.600">2 pending evaluation</Text>
          </VStack>
        </Box>
        
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Financial Summary</Heading>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Total Investment</Text>
            <Text fontSize="2xl">2.5M SAR</Text>
            <Text fontSize="sm" color="gray.600">Expected ROI: 12%</Text>
          </VStack>
        </Box>
        
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Timeline</Heading>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Next Milestone</Text>
            <Text fontSize="2xl">Phase 2 Completion</Text>
            <Text fontSize="sm" color="gray.600">Due in 45 days</Text>
          </VStack>
        </Box>
      </SimpleGrid>
      
      <Flex justifyContent="center">
        <Text fontSize="sm" color="gray.500">
          This is a placeholder dashboard. Real data would be integrated with backend services.
        </Text>
      </Flex>
    </Box>
  );
} 