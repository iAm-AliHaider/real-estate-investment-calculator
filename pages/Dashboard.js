import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Flex, VStack } from '@chakra-ui/react';

export default function Dashboard() {
  return (
    <Box>
      <Heading mb={8} size="lg" color="gray.700">Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat p={6} bg="white" rounded="lg" shadow="md">
          <StatLabel>Total Cost</StatLabel>
          <StatNumber>$0</StatNumber>
        </Stat>
        <Stat p={6} bg="white" rounded="lg" shadow="md">
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>$0</StatNumber>
        </Stat>
        <Stat p={6} bg="white" rounded="lg" shadow="md">
          <StatLabel>Net Profit</StatLabel>
          <StatNumber>$0</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box bg="white" p={8} rounded="lg" shadow="md" minH="300px">
        <Heading size="md" mb={4} color="gray.600">Charts & Visualizations</Heading>
        {/* Chart components will go here */}
        <Flex align="center" justify="center" h="200px" color="gray.400">
          (Charts coming soon)
        </Flex>
      </Box>
    </Box>
  );
} 