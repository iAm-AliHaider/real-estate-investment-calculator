import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  SimpleGrid, 
  Input, 
  Button, 
  Text, 
  Stack,
  Flex
} from '@chakra-ui/react';

interface ScenarioValue {
  numberOfUnits: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
  loanToValue: number;
  equityContribution: number;
  duration: number;
  governmentIncentive: number;
}

interface Assumptions {
  annualInterestRate: string;
  taxCommissionRate: string;
  operationalCost: string;
  offSalePercentage: string;
}

interface FormFields {
  numberOfUnits: string;
  costPerUnit: string;
  sellingPricePerUnit: string;
  loanToValue: string;
  equityContribution: string;
  duration: string;
  governmentIncentive: string;
  annualInterestRate: string;
  taxCommissionRate: string;
  operationalCost: string;
  offSalePercentage: string;
}

interface CalculationResult {
  totalDevelopmentCost: number;
  totalRevenue: number;
  totalGrossProfit: number;
  roi: number;
  equityRequirement: number;
  loanAmount: number;
  annualizedReturn: number;
  breakEvenUnitPrice: number;
  totalTaxCommission: number;
  operationalCost: number;
  netProfit: number;
}

const METRICS = [
  { key: 'totalDevelopmentCost', label: 'Total Development Cost (SAR)' },
  { key: 'totalRevenue', label: 'Total Revenue (SAR)' },
  { key: 'totalGrossProfit', label: 'Total Gross Profit (SAR)' },
  { key: 'roi', label: 'ROI (%)' },
  { key: 'equityRequirement', label: 'Equity Requirement (SAR)' },
  { key: 'loanAmount', label: 'Loan Amount (SAR)' },
  { key: 'annualizedReturn', label: 'Annualized Return (%)' },
  { key: 'breakEvenUnitPrice', label: 'Break-even Unit Price (SAR)' },
  { key: 'totalTaxCommission', label: 'Tax & Commission (SAR)' },
  { key: 'operationalCost', label: 'Operational Cost (SAR)' },
  { key: 'netProfit', label: 'Net Profit (SAR)' },
];

function calculateScenario(values: ScenarioValue, assumptions: Assumptions): CalculationResult {
  const n = Number(values.numberOfUnits);
  const costPerUnit = Number(values.costPerUnit);
  const sell = Number(values.sellingPricePerUnit);
  const ltv = Number(values.loanToValue);
  const eq = Number(values.equityContribution);
  const durationMonths = Number(values.duration);
  const govInc = Number(values.governmentIncentive);
  const rate = Number(assumptions.annualInterestRate) / 100;
  const years = durationMonths / 12;
  const tax = Number(assumptions.taxCommissionRate) / 100;
  const op = Number(assumptions.operationalCost);
  const off = Number(assumptions.offSalePercentage) / 100;

  const totalDevelopmentCost = n * costPerUnit * (1 - govInc);
  const totalRevenue = n * sell * (1 - off);
  const totalGrossProfit = totalRevenue - totalDevelopmentCost;
  const equityRequirement = eq * totalDevelopmentCost;
  const loanAmount = ltv * totalDevelopmentCost;
  const roi = equityRequirement === 0 ? 0 : (totalGrossProfit / equityRequirement) * 100;
  const annualizedReturn = equityRequirement === 0 ? 0 : (roi / years);
  const breakEvenUnitPrice = totalDevelopmentCost / n;
  const totalTaxCommission = totalRevenue * tax;
  const netProfit = totalGrossProfit - totalTaxCommission - op;

  return {
    totalDevelopmentCost,
    totalRevenue,
    totalGrossProfit,
    roi,
    equityRequirement,
    loanAmount,
    annualizedReturn,
    breakEvenUnitPrice,
    totalTaxCommission,
    operationalCost: op,
    netProfit,
  };
}

export default function SimpleCalculator() {
  // Form state
  const [fields, setFields] = useState<FormFields>({
    numberOfUnits: '20',
    costPerUnit: '350000',
    sellingPricePerUnit: '420000',
    loanToValue: '0.6',
    equityContribution: '0.4',
    duration: '24',
    governmentIncentive: '0.05',
    annualInterestRate: '8',
    taxCommissionRate: '5',
    operationalCost: '100000',
    offSalePercentage: '10',
  });
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    if (!fields.numberOfUnits || !fields.costPerUnit || !fields.sellingPricePerUnit) {
      setError('Please fill out all required fields');
      return false;
    }
    
    if (parseFloat(fields.loanToValue) + parseFloat(fields.equityContribution) !== 1) {
      setError('Loan-to-Value and Equity Contribution must add up to 100%');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Calculate results
      const assumptions = {
        annualInterestRate: fields.annualInterestRate,
        taxCommissionRate: fields.taxCommissionRate,
        operationalCost: fields.operationalCost,
        offSalePercentage: fields.offSalePercentage,
      };
      
      const calculationResult = calculateScenario(
        {
          numberOfUnits: Number(fields.numberOfUnits),
          costPerUnit: Number(fields.costPerUnit),
          sellingPricePerUnit: Number(fields.sellingPricePerUnit),
          loanToValue: Number(fields.loanToValue),
          equityContribution: Number(fields.equityContribution),
          duration: Number(fields.duration),
          governmentIncentive: Number(fields.governmentIncentive),
        },
        assumptions
      );
      
      setResult(calculationResult);
    } catch (err) {
      setError('An error occurred during calculation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Heading mb={8} textAlign="center">Real Estate Calculator</Heading>
      
      {error && (
        <Box mb={4} p={3} bg="red.100" color="red.700" borderRadius="md">
          <Text>{error}</Text>
        </Box>
      )}
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Basic Info */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
            <Heading size="md" mb={4}>Basic Information</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Number of Units*</Text>
                <Input
                  type="number"
                  value={fields.numberOfUnits}
                  onChange={(e) => setFields({ ...fields, numberOfUnits: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Cost Per Unit (SAR)*</Text>
                <Input
                  type="number"
                  value={fields.costPerUnit}
                  onChange={(e) => setFields({ ...fields, costPerUnit: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Selling Price Per Unit (SAR)*</Text>
                <Input
                  type="number"
                  value={fields.sellingPricePerUnit}
                  onChange={(e) => setFields({ ...fields, sellingPricePerUnit: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Duration (months)*</Text>
                <Input
                  type="number"
                  value={fields.duration}
                  onChange={(e) => setFields({ ...fields, duration: e.target.value })}
                />
              </Box>
            </SimpleGrid>
          </Box>
          
          {/* Financing */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
            <Heading size="md" mb={4}>Financing</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Loan-to-Value Ratio* (0-1)</Text>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={fields.loanToValue}
                  onChange={(e) => setFields({ ...fields, loanToValue: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Equity Contribution Ratio* (0-1)</Text>
                <Input
                  type="number" 
                  min={0}
                  max={1}
                  step={0.1}
                  value={fields.equityContribution}
                  onChange={(e) => setFields({ ...fields, equityContribution: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Government Incentive (0-1)</Text>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={fields.governmentIncentive}
                  onChange={(e) => setFields({ ...fields, governmentIncentive: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Annual Interest Rate (%)</Text>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={fields.annualInterestRate}
                  onChange={(e) => setFields({ ...fields, annualInterestRate: e.target.value })}
                />
              </Box>
            </SimpleGrid>
          </Box>
          
          {/* Additional Costs */}
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
            <Heading size="md" mb={4}>Additional Costs & Settings</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Tax & Commission Rate (%)</Text>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={fields.taxCommissionRate}
                  onChange={(e) => setFields({ ...fields, taxCommissionRate: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Operational Costs (SAR)</Text>
                <Input
                  type="number"
                  min={0}
                  value={fields.operationalCost}
                  onChange={(e) => setFields({ ...fields, operationalCost: e.target.value })}
                />
              </Box>
              
              <Box>
                <Text mb={2} fontWeight="medium">Off-Sale Percentage (%)</Text>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={fields.offSalePercentage}
                  onChange={(e) => setFields({ ...fields, offSalePercentage: e.target.value })}
                />
              </Box>
            </SimpleGrid>
          </Box>
          
          <Button 
            type="submit" 
            colorScheme="blue" 
            size="lg" 
            isLoading={loading}
          >
            Calculate
          </Button>
        </VStack>
      </form>
      
      {/* Results */}
      {result && (
        <Box mt={10} p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
          <Heading size="md" mb={4}>Evaluation Results</Heading>
          <VStack align="stretch" spacing={2}>
            {METRICS.map((metric) => (
              <Flex key={metric.key} justify="space-between" p={2} borderBottomWidth="1px">
                <Text fontWeight="bold">{metric.label}</Text>
                <Text>
                  {metric.key.includes('Percentage') || metric.key === 'roi' || metric.key === 'annualizedReturn'
                    ? `${result[metric.key].toFixed(2)}%`
                    : `${result[metric.key].toLocaleString()} SAR`}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
} 