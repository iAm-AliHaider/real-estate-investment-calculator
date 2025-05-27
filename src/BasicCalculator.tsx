import React, { useState, useEffect, useRef } from 'react';
import './BasicCalculator.css';

interface ScenarioValue {
  numberOfUnits: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
  loanToValue: number;
  equityContribution: number;
  duration: number;
  governmentIncentive: number;
  landCostPerSqm: number;
  unitSizeInSqm: number;
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
  landCostPerSqm: string;
  unitSizeInSqm: string;
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
  totalLandCost: number;
  costPerSqm: number;
  sellingPricePerSqm: number;
}

// Add after the FormFields interface
interface Currency {
  code: string;
  name: string;
  symbol: string;
  conversionRate: number; // Rate relative to SAR (base)
}

// Icons as SVG components
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
  </svg>
);

const CalculateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.5 3a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5zm0 3a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5zm.5 3.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5zm-.5 2.5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5z"/>
    <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2zM4 1v14H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm1 0h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5V1z"/>
  </svg>
);

const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
    <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg>
);

// Tooltip component
const Tooltip = ({ text }: { text: string }) => (
  <span className="tooltip">
    <span className="tooltip-icon"><InfoIcon /></span>
    <span className="tooltip-text">{text}</span>
  </span>
);

const METRICS = [
  { key: 'totalDevelopmentCost', label: 'Total Development Cost' },
  { key: 'totalLandCost', label: 'Total Land Cost' },
  { key: 'totalRevenue', label: 'Total Revenue' },
  { key: 'totalGrossProfit', label: 'Total Gross Profit', isProfit: true },
  { key: 'roi', label: 'ROI (%)', isProfit: true },
  { key: 'equityRequirement', label: 'Equity Requirement' },
  { key: 'loanAmount', label: 'Loan Amount' },
  { key: 'annualizedReturn', label: 'Annualized Return (%)', isProfit: true },
  { key: 'costPerSqm', label: 'Construction Cost Per Sqm' },
  { key: 'sellingPricePerSqm', label: 'Selling Price Per Sqm' },
  { key: 'breakEvenUnitPrice', label: 'Break-even Unit Price' },
  { key: 'totalTaxCommission', label: 'Tax & Commission' },
  { key: 'operationalCost', label: 'Operational Cost' },
  { key: 'netProfit', label: 'Net Profit', isProfit: true },
];

// Key metrics for summary display
const SUMMARY_METRICS = ['netProfit', 'roi', 'totalDevelopmentCost', 'totalLandCost', 'costPerSqm', 'breakEvenUnitPrice'];

// Add these preset scenarios after the existing METRICS array
const PRESET_SCENARIOS = [
  {
    name: 'Conservative',
    description: 'A low-risk investment approach',
    values: {
      numberOfUnits: '15',
      costPerUnit: '380000',
      sellingPricePerUnit: '420000',
      loanToValue: '0.5',
      equityContribution: '0.5',
      duration: '36',
      governmentIncentive: '0.05',
      annualInterestRate: '6',
      taxCommissionRate: '5',
      operationalCost: '80000',
      offSalePercentage: '15',
      landCostPerSqm: '1000',
      unitSizeInSqm: '120',
    }
  },
  {
    name: 'Balanced',
    description: 'A moderate risk-reward approach',
    values: {
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
      landCostPerSqm: '1200',
      unitSizeInSqm: '100',
    }
  },
  {
    name: 'Aggressive',
    description: 'A high-risk, high-reward approach',
    values: {
      numberOfUnits: '30',
      costPerUnit: '320000',
      sellingPricePerUnit: '450000',
      loanToValue: '0.7',
      equityContribution: '0.3',
      duration: '18',
      governmentIncentive: '0.1',
      annualInterestRate: '10',
      taxCommissionRate: '4',
      operationalCost: '120000',
      offSalePercentage: '5',
      landCostPerSqm: '1500',
      unitSizeInSqm: '90',
    }
  },
  {
    name: 'Custom',
    description: 'Your custom scenario',
    values: null
  },
];

function calculateScenario(values: ScenarioValue, assumptions: Assumptions): CalculationResult {
  const n = Number(values.numberOfUnits);
  const costPerUnit = Number(values.costPerUnit);
  const sell = Number(values.sellingPricePerUnit);
  const ltv = Number(values.loanToValue);
  const eq = Number(values.equityContribution);
  const durationMonths = Number(values.duration);
  const govInc = Number(values.governmentIncentive);
  const landCost = Number(values.landCostPerSqm);
  const unitSize = Number(values.unitSizeInSqm);
  // Not using rate in calculations currently
  // const rate = Number(assumptions.annualInterestRate) / 100;
  const years = durationMonths / 12;
  const tax = Number(assumptions.taxCommissionRate) / 100;
  const op = Number(assumptions.operationalCost);
  const off = Number(assumptions.offSalePercentage) / 100;

  const totalLandCost = landCost * unitSize * n;
  const totalDevelopmentCost = (n * costPerUnit * (1 - govInc)) + totalLandCost;
  const totalRevenue = n * sell * (1 - off);
  const totalGrossProfit = totalRevenue - totalDevelopmentCost;
  const equityRequirement = eq * totalDevelopmentCost;
  const loanAmount = ltv * totalDevelopmentCost;
  const roi = equityRequirement === 0 ? 0 : (totalGrossProfit / equityRequirement) * 100;
  const annualizedReturn = equityRequirement === 0 ? 0 : (roi / years);
  const breakEvenUnitPrice = totalDevelopmentCost / n;
  const totalTaxCommission = totalRevenue * tax;
  const netProfit = totalGrossProfit - totalTaxCommission - op;
  const costPerSqm = costPerUnit / unitSize;
  const sellingPricePerSqm = sell / unitSize;

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
    totalLandCost,
    costPerSqm,
    sellingPricePerSqm
  };
}

// Add ShareIcon and ResetIcon right after the PrintIcon component
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
  </svg>
);

const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
  </svg>
);

// Add interfaces for custom scenarios
interface CustomScenario {
  id: string;
  name: string;
  description: string;
  values: FormFields;
}

// Add icons for the sidebar
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
);

// Add interface for comparison data
interface ComparisonScenarioData {
  id: string;
  name: string;
  result: CalculationResult;
}

// Add comparison tab icon
const CompareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2z"/>
  </svg>
);

const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
  </svg>
);

// Main component with additional state
export default function BasicCalculator() {
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
    landCostPerSqm: '1200',
    unitSizeInSqm: '100',
  });
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [activePreset, setActivePreset] = useState<string>('Balanced');
  const [activeTab, setActiveTab] = useState<'calculator' | 'results' | 'compare'>('calculator');
  const resultsTabRef = useRef<HTMLButtonElement>(null);

  // New state for custom scenarios
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
  const [isCreatingScenario, setIsCreatingScenario] = useState<boolean>(false);
  const [isEditingScenario, setIsEditingScenario] = useState<string | null>(null);
  const [newScenarioName, setNewScenarioName] = useState<string>('');
  const [newScenarioDescription, setNewScenarioDescription] = useState<string>('');

  // New state for comparison
  const [comparisonData, setComparisonData] = useState<ComparisonScenarioData[]>([]);
  const [selectedScenariosForComparison, setSelectedScenariosForComparison] = useState<string[]>([]);

  // Currency state
  const [currencies] = useState<Currency[]>([
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', conversionRate: 1 },
    { code: 'USD', name: 'US Dollar', symbol: '$', conversionRate: 0.27 },
    { code: 'EUR', name: 'Euro', symbol: '€', conversionRate: 0.24 },
    { code: 'GBP', name: 'British Pound', symbol: '£', conversionRate: 0.21 },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', conversionRate: 0.98 },
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  // Validate form before submission
  const validate = () => {
    const errors: {[key: string]: string} = {};
    let isValid = true;

    // Validate Project Details
    if (!fields.numberOfUnits || Number(fields.numberOfUnits) <= 0) {
      errors.numberOfUnits = 'Number of units is required and must be positive';
      isValid = false;
    }
    if (!fields.costPerUnit || Number(fields.costPerUnit) <= 0) {
      errors.costPerUnit = 'Cost per unit is required and must be positive';
      isValid = false;
    }
    if (!fields.sellingPricePerUnit || Number(fields.sellingPricePerUnit) <= 0) {
      errors.sellingPricePerUnit = 'Selling price is required and must be positive';
      isValid = false;
    }
    if (!fields.duration || Number(fields.duration) <= 0) {
      errors.duration = 'Duration is required and must be positive';
      isValid = false;
    }
    if (!fields.landCostPerSqm || Number(fields.landCostPerSqm) < 0) {
      errors.landCostPerSqm = 'Land cost per sqm is required and must be non-negative';
      isValid = false;
    }
    if (!fields.unitSizeInSqm || Number(fields.unitSizeInSqm) <= 0) {
      errors.unitSizeInSqm = 'Unit size is required and must be positive';
      isValid = false;
    }

    // Validate Financing
    if (!fields.loanToValue || Number(fields.loanToValue) < 0 || Number(fields.loanToValue) > 1) {
      errors.loanToValue = 'Loan-to-Value must be between 0 and 1';
      isValid = false;
    }
    if (!fields.equityContribution || Number(fields.equityContribution) < 0 || Number(fields.equityContribution) > 1) {
      errors.equityContribution = 'Equity Contribution must be between 0 and 1';
      isValid = false;
    }
    if (Math.abs(Number(fields.loanToValue) + Number(fields.equityContribution) - 1) > 0.001) {
      errors.loanToValue = 'Loan-to-Value and Equity Contribution must add up to 1';
      errors.equityContribution = 'Loan-to-Value and Equity Contribution must add up to 1';
      isValid = false;
    }
    
    setFieldErrors(errors);
    setError(isValid ? '' : 'Please correct all errors before calculating');
    return isValid;
  };

  const handleCalculate = (e: React.FormEvent) => {
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
          landCostPerSqm: Number(fields.landCostPerSqm),
          unitSizeInSqm: Number(fields.unitSizeInSqm),
        },
        assumptions
      );
      
      setResult(calculationResult);
      // Directly set the active tab to results
      setActiveTab('results');
    } catch (err) {
      setError('An error occurred during calculation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getValueClass = (value: number, isProfit?: boolean) => {
    if (!isProfit) return '';
    return value >= 0 ? 'positive-value' : 'negative-value';
  };

  const handlePrint = () => {
    window.print();
  };

  // Load custom scenarios from localStorage on component mount
  useEffect(() => {
    const savedScenarios = localStorage.getItem('customScenarios');
    if (savedScenarios) {
      try {
        setCustomScenarios(JSON.parse(savedScenarios));
      } catch (e) {
        console.error('Failed to load custom scenarios:', e);
      }
    }
  }, []);

  // Save custom scenarios to localStorage when they change
  useEffect(() => {
    if (customScenarios.length > 0) {
      localStorage.setItem('customScenarios', JSON.stringify(customScenarios));
    }
  }, [customScenarios]);

  // Load URL parameters if present
  const urlParamsRef = useRef<URLSearchParams | null>(null);
  const fieldsKeysRef = useRef<string[]>([]);
  
  useEffect(() => {
    // Check for URL parameters (for shared scenarios)
    urlParamsRef.current = new URLSearchParams(window.location.search);
    fieldsKeysRef.current = Object.keys(fields);
    
    if (urlParamsRef.current.has('numberOfUnits')) {
      // Parse URL parameters and set form fields
      const urlFields: Partial<FormFields> = {};
      
      for (const key of fieldsKeysRef.current) {
        if (urlParamsRef.current.has(key)) {
          urlFields[key as keyof FormFields] = urlParamsRef.current.get(key) || '';
        }
      }
      
      setFields(prev => ({ ...prev, ...urlFields }));
      setActivePreset('Custom');
    }
  }, []);
  
  // Format currency amounts based on selected currency (without currency symbol)
  const formatAmount = (amount: number): string => {
    return (amount * selectedCurrency.conversionRate).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Handle sharing calculations
  const handleShare = () => {
    // Create a URL with query parameters containing the current form values
    const baseUrl = window.location.href.split('?')[0];
    const queryParams = new URLSearchParams();
    
    // Add each form field to the query parameters
    Object.entries(fields).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    
    // Create the shareable URL
    const shareableUrl = `${baseUrl}?${queryParams.toString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl)
      .then(() => {
        alert('Shareable link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        prompt('Copy this link to share your calculation:', shareableUrl);
      });
  };
  
  // Reset the calculator to default values
  const resetCalculator = () => {
    // Reset to default values (using the Balanced preset)
    const balancedPreset = PRESET_SCENARIOS.find(p => p.name === 'Balanced');
    if (balancedPreset && balancedPreset.values) {
      setFields(balancedPreset.values);
      setActivePreset('Balanced');
    }
    setResult(null);
    setError('');
  };

  // Add scenario management functions
  const startCreatingScenario = () => {
    setIsCreatingScenario(true);
    setNewScenarioName('');
    setNewScenarioDescription('');
  };

  const cancelCreatingScenario = () => {
    setIsCreatingScenario(false);
    setIsEditingScenario(null);
  };

  const saveNewScenario = () => {
    if (!newScenarioName.trim()) {
      alert('Please enter a name for your scenario');
      return;
    }

    const newScenario: CustomScenario = {
      id: Date.now().toString(),
      name: newScenarioName,
      description: newScenarioDescription || 'Custom scenario',
      values: { ...fields }
    };

    setCustomScenarios(prev => [...prev, newScenario]);
    setIsCreatingScenario(false);
    setActivePreset(newScenarioName);
  };

  const startEditingScenario = (id: string) => {
    const scenarioToEdit = customScenarios.find(s => s.id === id);
    if (scenarioToEdit) {
      setIsEditingScenario(id);
      setNewScenarioName(scenarioToEdit.name);
      setNewScenarioDescription(scenarioToEdit.description);
    }
  };

  const saveEditedScenario = () => {
    if (!isEditingScenario) return;
    
    setCustomScenarios(prev => prev.map(s => 
      s.id === isEditingScenario 
        ? { 
            ...s, 
            name: newScenarioName, 
            description: newScenarioDescription,
            values: { ...fields }
          } 
        : s
    ));
    
    setIsEditingScenario(null);
    setActivePreset(newScenarioName);
  };

  const deleteScenario = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      setCustomScenarios(prev => prev.filter(s => s.id !== id));
      
      // If the deleted scenario was active, switch to Balanced
      if (customScenarios.find(s => s.id === id)?.name === activePreset) {
        applyPreset('Balanced');
      }
    }
  };

  // Modified applyPreset to handle custom scenarios
  const applyPreset = (presetName: string) => {
    // First check built-in presets
    const preset = PRESET_SCENARIOS.find(p => p.name === presetName);
    if (preset && preset.values) {
      setFields(preset.values);
      setActivePreset(presetName);
      return;
    }
    
    // Then check custom scenarios
    const customScenario = customScenarios.find(s => s.name === presetName);
    if (customScenario) {
      setFields(customScenario.values);
      setActivePreset(presetName);
      return;
    }
    
    // For "Custom" preset, keep current values but change active preset
    setActivePreset(presetName);
  };

  // Render the preset buttons with enhanced UI
  const renderPresetButtons = () => {
    // Calculate key metrics if we have a result
    const renderSidebarMetrics = () => {
      if (!result) return null;
      
      return (
        <div className="sidebar-metrics">
          <div className="sidebar-metrics-title">Key Metrics</div>
          <div className="sidebar-metric-item">
            <div className="sidebar-metric-label">ROI</div>
            <div className={`sidebar-metric-value ${result.roi >= 0 ? 'positive' : 'negative'}`}>
              {result.roi.toFixed(2)}%
            </div>
          </div>
          <div className="sidebar-metric-item">
            <div className="sidebar-metric-label">Net Profit</div>
            <div className={`sidebar-metric-value ${result.netProfit >= 0 ? 'positive' : 'negative'}`}>
              {formatAmount(result.netProfit)}
            </div>
          </div>
          <div className="sidebar-metric-item">
            <div className="sidebar-metric-label">Break-even Price</div>
            <div className="sidebar-metric-value">
              {formatAmount(result.breakEvenUnitPrice)}
            </div>
          </div>
        </div>
      );
    };
    
    return (
      <>
        {result && activeTab === 'results' && renderSidebarMetrics()}
        
        <div className="presets-container">
          <div className="presets-title">
            Investment Scenarios
            <div className="presets-title-actions">
              <button 
                type="button" 
                className="preset-action-button"
                onClick={startCreatingScenario}
                title="Create new scenario"
              >
                <AddIcon />
              </button>
            </div>
          </div>
          
          <div className="preset-buttons">
            {/* Standard presets */}
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={`preset-button ${activePreset === preset.name ? 'active' : ''}`}
                onClick={() => applyPreset(preset.name)}
                title={preset.description}
              >
                <span>{preset.name}</span>
              </button>
            ))}
            
            {/* Custom scenarios */}
            {customScenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`preset-button ${activePreset === scenario.name ? 'active' : ''}`}
                onClick={() => applyPreset(scenario.name)}
                title={scenario.description}
              >
                <span>{scenario.name}</span>
                <div className="preset-button-actions">
                  <button 
                    type="button" 
                    className="preset-button-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingScenario(scenario.id);
                    }}
                    title="Edit scenario"
                  >
                    <EditIcon />
                  </button>
                  <button 
                    type="button" 
                    className="preset-button-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteScenario(scenario.id);
                    }}
                    title="Delete scenario"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </button>
            ))}
          </div>
          
          {/* Scenario creation form */}
          {isCreatingScenario && (
            <div className="scenario-form">
              <div className="scenario-form-title">Create New Scenario</div>
              <div className="scenario-form-group">
                <label htmlFor="scenario-name">Scenario Name</label>
                <input 
                  type="text" 
                  id="scenario-name" 
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Downtown High-Rise"
                />
              </div>
              <div className="scenario-form-group">
                <label htmlFor="scenario-description">Description (optional)</label>
                <input 
                  type="text" 
                  id="scenario-description" 
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  placeholder="Brief description of this scenario"
                />
              </div>
              <div className="scenario-form-actions">
                <button 
                  type="button" 
                  className="scenario-form-button scenario-cancel-button"
                  onClick={cancelCreatingScenario}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="scenario-form-button scenario-save-button"
                  onClick={saveNewScenario}
                >
                  Save Scenario
                </button>
              </div>
            </div>
          )}
          
          {/* Scenario editing form */}
          {isEditingScenario && (
            <div className="scenario-form">
              <div className="scenario-form-title">Edit Scenario</div>
              <div className="scenario-form-group">
                <label htmlFor="scenario-name-edit">Scenario Name</label>
                <input 
                  type="text" 
                  id="scenario-name-edit" 
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                />
              </div>
              <div className="scenario-form-group">
                <label htmlFor="scenario-description-edit">Description</label>
                <input 
                  type="text" 
                  id="scenario-description-edit" 
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                />
              </div>
              <div className="scenario-form-actions">
                <button 
                  type="button" 
                  className="scenario-form-button scenario-cancel-button"
                  onClick={cancelCreatingScenario}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="scenario-form-button scenario-save-button"
                  onClick={saveEditedScenario}
                >
                  Update Scenario
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="buttons-container">
          <button 
            type="submit" 
            form="calculator-form"
            className="calculate-button"
            disabled={loading || isCreatingScenario || isEditingScenario}
          >
            <CalculateIcon /> {loading ? 'Calculating...' : 'Calculate Results'}
          </button>
        </div>
      </>
    );
  };

  // Render the results section
  const renderResults = () => {
    if (!result) return null;

    return (
      <div className="results-section">
        <div className="dashboard-header">
          <div>
            <h2 className="dashboard-title">Investment Analysis Dashboard</h2>
            <p className="dashboard-subtitle">
              Comprehensive analysis of your real estate investment
            </p>
          </div>
          <div className="header-actions">
            <button 
              type="button"
              className="comparison-action-btn comparison-export-btn"
              onClick={saveToComparison}
              title="Add to comparison"
            >
              <CompareIcon /> Add to Comparison
            </button>
          </div>
        </div>
        
        <div className="dashboard-controls">
          <div className="currency-selector">
            <label htmlFor="currency-select">Currency:</label>
            <select 
              id="currency-select"
              value={selectedCurrency.code}
              onChange={(e) => {
                const selected = currencies.find(c => c.code === e.target.value);
                if (selected) setSelectedCurrency(selected);
              }}
              className="currency-select"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <span className="currency-info">
            All values shown in {selectedCurrency.name} ({selectedCurrency.code})
          </span>
        </div>

        <div className="results-content">
          {/* Key Performance Metrics */}
          <div className="performance-metrics">
            <div className={`metric-card ${result.netProfit >= 0 ? 'positive' : 'negative'}`}>
              <div className="metric-title">Net Profit</div>
              <div className={`metric-value ${result.netProfit >= 0 ? 'positive' : 'negative'}`}>
                {formatAmount(result.netProfit)}
              </div>
              <div className="metric-context">
                Overall project profitability
              </div>
            </div>
            
            <div className={`metric-card ${result.roi >= 0 ? 'positive' : 'negative'}`}>
              <div className="metric-title">ROI</div>
              <div className={`metric-value ${result.roi >= 0 ? 'positive' : 'negative'}`}>
                {result.roi.toFixed(2)}%
              </div>
              <div className="metric-context">
                Return on investment percentage
              </div>
            </div>
            
            <div className="metric-card neutral">
              <div className="metric-title">Break-even Price</div>
              <div className="metric-value">
                {formatAmount(result.breakEvenUnitPrice)}
              </div>
              <div className="metric-context">
                Per unit to cover all costs
              </div>
            </div>
          </div>

          {/* Project Summary Section */}
          <div className="project-summary">
            <div className="summary-card">
              <div className="summary-header">
                <h3 className="summary-title">Total Development Cost</h3>
                <div className="summary-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
                    <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/>
                  </svg>
                </div>
              </div>
              <div className="summary-value">{formatAmount(result.totalDevelopmentCost)}</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-header">
                <h3 className="summary-title">Land Cost</h3>
                <div className="summary-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                </div>
              </div>
              <div className="summary-value">{formatAmount(result.totalLandCost)}</div>
            </div>
          </div>

          {/* Analysis Panels */}
          <div className="analysis-grid">
            <div className="analysis-panel">
              <div className="panel-header">
                <h3 className="panel-title">Project Economics</h3>
              </div>
              <div className="panel-body">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>Total Revenue</td>
                      <td>{formatAmount(result.totalRevenue)}</td>
                    </tr>
                    <tr>
                      <td>Gross Profit</td>
                      <td className={result.totalGrossProfit >= 0 ? 'positive-cell' : 'negative-cell'}>
                        {formatAmount(result.totalGrossProfit)}
                      </td>
                    </tr>
                    <tr>
                      <td>Tax & Commission</td>
                      <td>{formatAmount(result.totalTaxCommission)}</td>
                    </tr>
                    <tr>
                      <td>Operational Cost</td>
                      <td>{formatAmount(result.operationalCost)}</td>
                    </tr>
                    <tr>
                      <td>Net Profit</td>
                      <td className={result.netProfit >= 0 ? 'positive-cell' : 'negative-cell'}>
                        {formatAmount(result.netProfit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="analysis-panel">
              <div className="panel-header">
                <h3 className="panel-title">Financial Analysis</h3>
              </div>
              <div className="panel-body">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>ROI (%)</td>
                      <td className={result.roi >= 0 ? 'positive-cell' : 'negative-cell'}>
                        {result.roi.toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Annualized Return (%)</td>
                      <td className={result.annualizedReturn >= 0 ? 'positive-cell' : 'negative-cell'}>
                        {result.annualizedReturn.toFixed(2)}%
                      </td>
                    </tr>
                    <tr>
                      <td>Equity Requirement</td>
                      <td>{formatAmount(result.equityRequirement)}</td>
                    </tr>
                    <tr>
                      <td>Loan Amount</td>
                      <td>{formatAmount(result.loanAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="analysis-panel">
              <div className="panel-header">
                <h3 className="panel-title">Unit Economics</h3>
              </div>
              <div className="panel-body">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>Construction Cost Per Sqm</td>
                      <td>{formatAmount(result.costPerSqm)}</td>
                    </tr>
                    <tr>
                      <td>Selling Price Per Sqm</td>
                      <td>{formatAmount(result.sellingPricePerSqm)}</td>
                    </tr>
                    <tr>
                      <td>Break-even Unit Price</td>
                      <td>{formatAmount(result.breakEvenUnitPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="analysis-panel">
              <div className="panel-header">
                <h3 className="panel-title">Project Inputs</h3>
              </div>
              <div className="panel-body">
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td>Number of Units</td>
                      <td>{fields.numberOfUnits}</td>
                    </tr>
                    <tr>
                      <td>Unit Size (sqm)</td>
                      <td>{fields.unitSizeInSqm}</td>
                    </tr>
                    <tr>
                      <td>Project Duration</td>
                      <td>{fields.duration} months</td>
                    </tr>
                    <tr>
                      <td>Off-Sale Percentage</td>
                      <td>{fields.offSalePercentage}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="dashboard-actions">
            <button type="button" className="print-button" onClick={handlePrint}>
              <PrintIcon /> Print Report
            </button>
            <button type="button" className="share-button" onClick={handleShare}>
              <ShareIcon /> Share Analysis
            </button>
            <button type="button" className="reset-button" onClick={resetCalculator}>
              <ResetIcon /> Reset Calculator
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the tabs navigation
  const renderTabs = () => {
    return (
      <div className="calculator-tabs">
        <button 
          type="button" 
          className={`calculator-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          Calculator
        </button>
        <button 
          type="button"
          ref={resultsTabRef}
          className={`calculator-tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => result ? setActiveTab('results') : null}
          disabled={!result}
        >
          Results
        </button>
        <button 
          type="button"
          className={`calculator-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => comparisonData.length > 0 ? setActiveTab('compare') : null}
          disabled={comparisonData.length === 0}
        >
          Compare Scenarios
        </button>
      </div>
    );
  };

  // Add useEffect to watch for result changes
  useEffect(() => {
    if (result) {
      // When result is set, switch to results tab
      setActiveTab('results');
    }
  }, [result]);

  // Save current result to comparison data
  const saveToComparison = () => {
    if (!result) return;
    
    // Check if we already have this scenario in comparison data
    const existingIndex = comparisonData.findIndex(item => item.name === activePreset);
    
    if (existingIndex !== -1) {
      // Update existing data
      setComparisonData(prev => {
        const newData = [...prev];
        newData[existingIndex] = {
          id: newData[existingIndex].id,
          name: activePreset,
          result: { ...result }
        };
        return newData;
      });
    } else {
      // Add new data
      setComparisonData(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: activePreset,
          result: { ...result }
        }
      ]);
    }
    
    // Auto-select this scenario for comparison
    if (!selectedScenariosForComparison.includes(activePreset)) {
      setSelectedScenariosForComparison(prev => [...prev, activePreset]);
    }
    
    // Switch to compare tab
    setActiveTab('compare');
  };

  // Toggle scenario selection for comparison
  const toggleScenarioSelection = (scenarioName: string) => {
    if (selectedScenariosForComparison.includes(scenarioName)) {
      setSelectedScenariosForComparison(prev => 
        prev.filter(name => name !== scenarioName)
      );
    } else {
      setSelectedScenariosForComparison(prev => [...prev, scenarioName]);
    }
  };

  // Export comparison as CSV
  const exportComparisonCSV = () => {
    if (comparisonData.length === 0) return;
    
    // Filter to only selected scenarios
    const selectedData = comparisonData.filter(item => 
      selectedScenariosForComparison.includes(item.name)
    );
    
    if (selectedData.length === 0) return;
    
    // Create CSV header
    let csvContent = "Metric,";
    selectedData.forEach((scenario, index) => {
      csvContent += scenario.name;
      if (index < selectedData.length - 1) csvContent += ",";
    });
    csvContent += "\n";
    
    // Add metrics rows
    METRICS.forEach(metric => {
      csvContent += metric.label + ",";
      selectedData.forEach((scenario, index) => {
        const value = scenario.result[metric.key as keyof CalculationResult];
        let displayValue = metric.key === 'roi' || metric.key === 'annualizedReturn' 
          ? value.toFixed(2) + "%"
          : (value * selectedCurrency.conversionRate).toLocaleString();
        
        csvContent += displayValue;
        if (index < selectedData.length - 1) csvContent += ",";
      });
      csvContent += "\n";
    });
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'scenario_comparison.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render the comparison tab content
  const renderComparisonTab = () => {
    if (comparisonData.length === 0) {
      return (
        <div className="comparison-container">
          <div className="comparison-header">
            <h2 className="comparison-title">No Scenarios to Compare</h2>
          </div>
          <p>Calculate a scenario first, then add it to comparison.</p>
        </div>
      );
    }
    
    // Filter the selected scenarios
    const selectedData = comparisonData.filter(item => 
      selectedScenariosForComparison.includes(item.name)
    );
    
    return (
      <div className="comparison-container">
        <div className="comparison-header">
          <h2 className="comparison-title">Compare Investment Scenarios</h2>
          <div className="header-actions">
            <button 
              type="button"
              className="comparison-action-btn comparison-export-btn"
              onClick={exportComparisonCSV}
              disabled={selectedData.length === 0}
              title="Export to CSV"
            >
              <TableIcon /> Export to CSV
            </button>
          </div>
        </div>
        
        <div className="comparison-selector">
          {comparisonData.map(scenario => (
            <label 
              key={scenario.id}
              className={`scenario-checkbox ${selectedScenariosForComparison.includes(scenario.name) ? 'active' : ''}`}
            >
              <input 
                type="checkbox"
                checked={selectedScenariosForComparison.includes(scenario.name)}
                onChange={() => toggleScenarioSelection(scenario.name)}
              />
              {scenario.name}
            </label>
          ))}
        </div>
        
        {selectedData.length > 0 ? (
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  {selectedData.map(scenario => (
                    <th key={scenario.id}>{scenario.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="comparison-metric-group">
                  <td colSpan={selectedData.length + 1}>Key Metrics</td>
                </tr>
                {METRICS.filter(m => SUMMARY_METRICS.includes(m.key)).map(metric => (
                  <tr key={metric.key}>
                    <td>{metric.label}</td>
                    {selectedData.map(scenario => {
                      const value = scenario.result[metric.key as keyof CalculationResult];
                      const isProfit = metric.isProfit;
                      const valueClass = isProfit ? (value >= 0 ? 'positive-value' : 'negative-value') : '';
                      
                      return (
                        <td key={`${scenario.id}-${metric.key}`} className={valueClass}>
                          {metric.key === 'roi' || metric.key === 'annualizedReturn'
                            ? `${value.toFixed(2)}%`
                            : formatAmount(value)
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                <tr className="comparison-metric-group">
                  <td colSpan={selectedData.length + 1}>Project Economics</td>
                </tr>
                {METRICS.filter(m => ['totalRevenue', 'totalDevelopmentCost', 'totalGrossProfit'].includes(m.key)).map(metric => (
                  <tr key={metric.key}>
                    <td>{metric.label}</td>
                    {selectedData.map(scenario => {
                      const value = scenario.result[metric.key as keyof CalculationResult];
                      const isProfit = metric.isProfit;
                      const valueClass = isProfit ? (value >= 0 ? 'positive-value' : 'negative-value') : '';
                      
                      return (
                        <td key={`${scenario.id}-${metric.key}`} className={valueClass}>
                          {formatAmount(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                <tr className="comparison-metric-group">
                  <td colSpan={selectedData.length + 1}>Financial Analysis</td>
                </tr>
                {METRICS.filter(m => ['roi', 'annualizedReturn', 'equityRequirement', 'loanAmount'].includes(m.key)).map(metric => (
                  <tr key={metric.key}>
                    <td>{metric.label}</td>
                    {selectedData.map(scenario => {
                      const value = scenario.result[metric.key as keyof CalculationResult];
                      const isProfit = metric.isProfit;
                      const valueClass = isProfit ? (value >= 0 ? 'positive-value' : 'negative-value') : '';
                      
                      return (
                        <td key={`${scenario.id}-${metric.key}`} className={valueClass}>
                          {metric.key === 'roi' || metric.key === 'annualizedReturn'
                            ? `${value.toFixed(2)}%`
                            : formatAmount(value)
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                <tr className="comparison-metric-group">
                  <td colSpan={selectedData.length + 1}>Unit Economics</td>
                </tr>
                {METRICS.filter(m => ['costPerSqm', 'sellingPricePerSqm', 'breakEvenUnitPrice'].includes(m.key)).map(metric => (
                  <tr key={metric.key}>
                    <td>{metric.label}</td>
                    {selectedData.map(scenario => (
                      <td key={`${scenario.id}-${metric.key}`}>
                        {formatAmount(scenario.result[metric.key as keyof CalculationResult])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Select at least one scenario to compare</p>
        )}
      </div>
    );
  };

  return (
    <div className="calculator-container">
      <div className="app-header">
        <div>
          <h1 className="calculator-title">RealCal by IT Associates</h1>
          <p className="calculator-subtitle">
            Professional Real Estate Investment Calculator
          </p>
        </div>
      </div>
      
      <div className="dashboard-sidebar">
        {renderPresetButtons()}
      </div>
      
      <div className="dashboard-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {renderTabs()}
        
        <div className={`calculator-tab-content ${activeTab === 'calculator' ? 'active' : ''}`}>
          <form id="calculator-form" onSubmit={handleCalculate}>
            <div className="dashboard-grid">
              {/* Project Details */}
              <div className="section-card">
                <h2 className="section-title">
                  Project Details
                  <span className="info-icon" title="Enter details about your real estate project">
                    <InfoIcon />
                  </span>
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="required-field">
                      Number of Units
                      <Tooltip text="The total number of units in your real estate project" />
                    </label>
                    <input
                      type="number"
                      value={fields.numberOfUnits}
                      onChange={(e) => setFields({ ...fields, numberOfUnits: e.target.value })}
                      className={fieldErrors.numberOfUnits ? 'invalid' : ''}
                      required
                    />
                    {fieldErrors.numberOfUnits && (
                      <div className="input-error">{fieldErrors.numberOfUnits}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="required-field">
                      Unit Size
                      <Tooltip text="The size of each unit in square meters" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={fields.unitSizeInSqm}
                        onChange={(e) => setFields({ ...fields, unitSizeInSqm: e.target.value })}
                        className={fieldErrors.unitSizeInSqm ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">sqm</span>
                    </div>
                    {fieldErrors.unitSizeInSqm && (
                      <div className="input-error">{fieldErrors.unitSizeInSqm}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="required-field">
                      Land Cost Per Sqm
                      <Tooltip text="The cost of land per square meter" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={fields.landCostPerSqm}
                        onChange={(e) => setFields({ ...fields, landCostPerSqm: e.target.value })}
                        className={fieldErrors.landCostPerSqm ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">SAR</span>
                    </div>
                    {fieldErrors.landCostPerSqm && (
                      <div className="input-error">{fieldErrors.landCostPerSqm}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="required-field">
                      Cost Per Unit
                      <Tooltip text="The construction cost for each unit (excluding land)" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={fields.costPerUnit}
                        onChange={(e) => setFields({ ...fields, costPerUnit: e.target.value })}
                        className={fieldErrors.costPerUnit ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">SAR</span>
                    </div>
                    {fieldErrors.costPerUnit && (
                      <div className="input-error">{fieldErrors.costPerUnit}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="required-field">
                      Selling Price Per Unit
                      <Tooltip text="The expected selling price for each unit" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={fields.sellingPricePerUnit}
                        onChange={(e) => setFields({ ...fields, sellingPricePerUnit: e.target.value })}
                        className={fieldErrors.sellingPricePerUnit ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">SAR</span>
                    </div>
                    {fieldErrors.sellingPricePerUnit && (
                      <div className="input-error">{fieldErrors.sellingPricePerUnit}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="required-field">
                      Project Duration
                      <Tooltip text="The expected duration of the project from start to completion" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        value={fields.duration}
                        onChange={(e) => setFields({ ...fields, duration: e.target.value })}
                        className={fieldErrors.duration ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">months</span>
                    </div>
                    {fieldErrors.duration && (
                      <div className="input-error">{fieldErrors.duration}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Financing */}
              <div className="section-card">
                <h2 className="section-title">
                  Financing
                  <span className="info-icon" title="Enter details about project financing">
                    <InfoIcon />
                  </span>
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="required-field">
                      Loan-to-Value Ratio
                      <Tooltip text="The ratio of loan amount to the total value of the property (0-1)" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        value={fields.loanToValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFields({ 
                            ...fields, 
                            loanToValue: value,
                            equityContribution: (1 - parseFloat(value)).toFixed(2)
                          });
                        }}
                        className={fieldErrors.loanToValue ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">ratio</span>
                    </div>
                    {fieldErrors.loanToValue && (
                      <div className="input-error">{fieldErrors.loanToValue}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="required-field">
                      Equity Contribution Ratio
                      <Tooltip text="The ratio of your own capital investment to the total value (0-1)" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        value={fields.equityContribution}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFields({ 
                            ...fields, 
                            equityContribution: value,
                            loanToValue: (1 - parseFloat(value)).toFixed(2)
                          });
                        }}
                        className={fieldErrors.equityContribution ? 'invalid' : ''}
                        required
                      />
                      <span className="input-unit">ratio</span>
                    </div>
                    {fieldErrors.equityContribution && (
                      <div className="input-error">{fieldErrors.equityContribution}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Government Incentive
                      <Tooltip text="Any government incentives that reduce the development cost (0-1)" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        max="0.5"
                        step="0.01"
                        value={fields.governmentIncentive}
                        onChange={(e) => setFields({ ...fields, governmentIncentive: e.target.value })}
                      />
                      <span className="input-unit">ratio</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Annual Interest Rate
                      <Tooltip text="The annual interest rate on your financing" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        step="0.5"
                        value={fields.annualInterestRate}
                        onChange={(e) => setFields({ ...fields, annualInterestRate: e.target.value })}
                      />
                      <span className="input-unit">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Costs */}
              <div className="section-card">
                <h2 className="section-title">
                  Additional Costs & Settings
                  <span className="info-icon" title="Enter additional costs and settings">
                    <InfoIcon />
                  </span>
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      Tax & Commission Rate
                      <Tooltip text="Combined tax and sales commission rate" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={fields.taxCommissionRate}
                        onChange={(e) => setFields({ ...fields, taxCommissionRate: e.target.value })}
                      />
                      <span className="input-unit">%</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Operational Costs
                      <Tooltip text="Total operational costs for the project" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={fields.operationalCost}
                        onChange={(e) => setFields({ ...fields, operationalCost: e.target.value })}
                      />
                      <span className="input-unit">SAR</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      Off-Sale Percentage
                      <Tooltip text="Expected percentage of units that won't be sold" />
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="1"
                        value={fields.offSalePercentage}
                        onChange={(e) => setFields({ ...fields, offSalePercentage: e.target.value })}
                      />
                      <span className="input-unit">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <div className={`calculator-tab-content ${activeTab === 'results' ? 'active' : ''}`}>
          {result && renderResults()}
        </div>
        
        <div className={`calculator-tab-content ${activeTab === 'compare' ? 'active' : ''}`}>
          {renderComparisonTab()}
        </div>
      </div>
    </div>
  );
} 