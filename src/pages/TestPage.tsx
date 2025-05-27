import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function TestPage() {
  return (
    <Box p={8}>
      <Heading>Test Page</Heading>
      <Text mt={4}>This is a test page to verify routing is working.</Text>
    </Box>
  );
} 