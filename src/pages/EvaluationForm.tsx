import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  SimpleGrid, 
  Input, 
  Button, 
  Text, 
  HStack, 
  Stack,
  Card,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext.tsx';

// Simplified component structure to avoid type issues with Chakra UI v3
// We'll replace complex components with simpler ones that are supported

interface ScenarioValue {
  numberOfUnits: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
  loanToValue: number;
  equityContribution: number;
  duration: number;
  governmentIncentive: number;
}

interface Scenario {
  label: string;
  values: ScenarioValue;
}

interface Assumptions {
  annualInterestRate: string;
  taxCommissionRate: string;
  operationalCost: string;
  offSalePercentage: string;
}

interface FormFields extends ScenarioValue {
  landCostPerSqm: string;
  unitSize: string;
  constructionCostPerUnit: string;
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

interface ComparisonResult extends CalculationResult {
  label: string;
}

const SCENARIOS: Scenario[] = [
  {
    label: 'Worst Case',
    values: {
      numberOfUnits: 10,
      costPerUnit: 400000,
      sellingPricePerUnit: 350000,
      loanToValue: 0.5,
      equityContribution: 0.5,
      duration: 36,
      governmentIncentive: 0,
    },
  },
  {
    label: 'Realistic Case',
    values: {
      numberOfUnits: 20,
      costPerUnit: 350000,
      sellingPricePerUnit: 420000,
      loanToValue: 0.6,
      equityContribution: 0.4,
      duration: 24,
      governmentIncentive: 0.05,
    },
  },
  {
    label: 'Optimistic Case',
    values: {
      numberOfUnits: 30,
      costPerUnit: 320000,
      sellingPricePerUnit: 500000,
      loanToValue: 0.7,
      equityContribution: 0.3,
      duration: 18,
      governmentIncentive: 0.1,
    },
  },
  {
    label: 'Saudi-Aligned Market Case',
    values: {
      numberOfUnits: 50,
      costPerUnit: 300000,
      sellingPricePerUnit: 480000,
      loanToValue: 0.65,
      equityContribution: 0.35,
      duration: 24,
      governmentIncentive: 0.15,
    },
  },
  {
    label: 'Loan-Heavy Case',
    values: {
      numberOfUnits: 25,
      costPerUnit: 340000,
      sellingPricePerUnit: 410000,
      loanToValue: 0.7,
      equityContribution: 0.3,
      duration: 24,
      governmentIncentive: 0,
    },
  },
  {
    label: 'No-Financing Case',
    values: {
      numberOfUnits: 15,
      costPerUnit: 370000,
      sellingPricePerUnit: 390000,
      loanToValue: 0,
      equityContribution: 1,
      duration: 36,
      governmentIncentive: 0,
    },
  },
];

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

export default function EvaluationForm() {
  // Form state
  const [scenario, setScenario] = useState<string>('');
  const [fields, setFields] = useState<FormFields>({
    numberOfUnits: '',
    costPerUnit: '',
    sellingPricePerUnit: '',
    loanToValue: '',
    equityContribution: '',
    duration: '',
    governmentIncentive: '',
    // legacy fields for compatibility
    landCostPerSqm: '',
    unitSize: '',
    constructionCostPerUnit: '',
    annualInterestRate: '8',
    taxCommissionRate: '5',
    operationalCost: '100000',
    offSalePercentage: '10',
  });
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  // For comparison
  const [compareScenarios, setCompareScenarios] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);

  // Auto-fill fields when scenario changes
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    setScenario(label);
    const found = SCENARIOS.find(s => s.label === label);
    if (found) {
      setFields(f => ({
        ...f,
        ...found.values,
        // legacy fields for compatibility
        landCostPerSqm: '',
        unitSize: '',
        constructionCostPerUnit: found.values.costPerUnit.toString(),
      }));
    }
  };

  // Handle comparison scenario selection
  const handleCompareChange = (values: string[]) => {
    setCompareScenarios(values);
    // Calculate results for all selected scenarios
    const assumptions = {
      annualInterestRate: fields.annualInterestRate,
      taxCommissionRate: fields.taxCommissionRate,
      operationalCost: fields.operationalCost,
      offSalePercentage: fields.offSalePercentage,
    };
    const results = values.map(label => {
      const scenario = SCENARIOS.find(s => s.label === label);
      if (!scenario) return null;
      return {
        label,
        ...calculateScenario(scenario.values, assumptions),
      };
    }).filter((result): result is ComparisonResult => result !== null);
    setComparisonResults(results);
  };

  const handleChange = (field: string, value: any) => {
    setFields(f => ({ ...f, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setSuccess('');
    
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
      setSuccess('Evaluation completed successfully');
    } catch (err) {
      setError('An error occurred during calculation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={8}>Real Estate Business Evaluation</Heading>
      
      {error && (
        <Box mb={4} p={3} bg="red.100" color="red.700" borderRadius="md">
          <Text>{error}</Text>
        </Box>
      )}
      
      {success && (
        <Box mb={4} p={3} bg="green.100" color="green.700" borderRadius="md">
          <Text>{success}</Text>
        </Box>
      )}
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Scenario Selection */}
          <Box p={5} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Pre-defined Scenarios</Heading>
            <Box mb={3}>
              <Text mb={2} fontWeight="medium">Choose a scenario</Text>
              <select
                value={scenario}
                onChange={handleScenarioChange}
              >
                {SCENARIOS.map((s) => (
                  <option key={s.label} value={s.label}>{s.label}</option>
                ))}
              </select>
            </Box>
            
            <Heading size="sm" mb={4}>Compare Multiple Scenarios</Heading>
            <Stack spacing={2}>
              {SCENARIOS.map((s) => (
                <Box key={s.label}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={compareScenarios.includes(s.label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleCompareChange([...compareScenarios, s.label]);
                        } else {
                          handleCompareChange(compareScenarios.filter(label => label !== s.label));
                        }
                      }}
                    />
                    <Text display="inline" ml={2}>{s.label}</Text>
                  </label>
                </Box>
              ))}
            </Stack>
          </Box>
          
          {/* Basic Info */}
          <Box p={5} borderWidth="1px" borderRadius="lg">
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
          <Box p={5} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Financing</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Loan-to-Value Ratio*</Text>
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
                <Text mb={2} fontWeight="medium">Equity Contribution Ratio*</Text>
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
          <Box p={5} borderWidth="1px" borderRadius="lg">
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
        <Box mt={10} p={5} borderWidth="1px" borderRadius="lg">
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
      
      {/* Comparison Results */}
      {comparisonResults.length > 0 && (
        <Box mt={10} p={5} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Scenario Comparison</Heading>
          <Box overflowX="auto">
            <VStack align="stretch" spacing={0}>
              <Flex borderBottomWidth="2px" p={2}>
                <Box flex="1" fontWeight="bold">Metric</Box>
                {comparisonResults.map((result) => (
                  <Box key={result.label} flex="1" fontWeight="bold" textAlign="right">
                    {result.label}
                  </Box>
                ))}
              </Flex>
              
              {METRICS.map((metric) => (
                <Flex key={metric.key} borderBottomWidth="1px" p={2}>
                  <Box flex="1" fontWeight="medium">{metric.label}</Box>
                  {comparisonResults.map((result) => (
                    <Box key={`${result.label}-${metric.key}`} flex="1" textAlign="right">
                      {metric.key.includes('Percentage') || metric.key === 'roi' || metric.key === 'annualizedReturn'
                        ? `${result[metric.key].toFixed(2)}%`
                        : `${result[metric.key].toLocaleString()} SAR`}
                    </Box>
                  ))}
                </Flex>
              ))}
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
} 