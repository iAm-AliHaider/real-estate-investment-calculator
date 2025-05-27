import React, { useState, useEffect } from 'react';
import { DollarSign, Home, Construction, TrendingUp, TrendingDown, Percent, Wallet, Banknote, Landmark, LineChart, Building, PiggyBank, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
}

interface MetricDisplayProps {
  label: string;
  value: number;
  isPrimary?: boolean;
  isPositive?: boolean;
  icon: React.ElementType | string;
}

const BusinessEvaluationCalculator: React.FC = () => {
  // State for input values, initialized with values from the provided data
  const [numberOfUnits, setNumberOfUnits] = useState<number>(700);
  const [unitSizeSqm, setUnitSizeSqm] = useState<number>(95);
  const [landCostPerSqm, setLandCostPerSqm] = useState<number>(13263);
  const [constructionCostPerUnit, setConstructionCostPerUnit] = useState<number>(320000);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<number>(1300000);
  const [equityPercentage, setEquityPercentage] = useState<number>(0.3);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(0.07);
  const [loanTermYears, setLoanTermYears] = useState<number>(1.5);
  const [taxCommissionRate, setTaxCommissionRate] = useState<number>(0.07502);
  const [operationalCosts, setOperationalCosts] = useState<number>(5000000);
  const [offSalePercentage, setOffSalePercentage] = useState<number>(0.0);

  // State for calculated output values
  const [totalLandCost, setTotalLandCost] = useState<number>(0);
  const [totalConstructionCost, setTotalConstructionCost] = useState<number>(0);
  const [totalProjectCost, setTotalProjectCost] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);
  const [equityInvestment, setEquityInvestment] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [estimatedInterestPayment, setEstimatedInterestPayment] = useState<number>(0);
  const [netProfitAfterInterest, setNetProfitAfterInterest] = useState<number>(0);
  const [roi, setRoi] = useState<number>(0);
  const [roe, setRoe] = useState<number>(0);
  const [operatingCashFlow, setOperatingCashFlow] = useState<number>(0);
  const [financingCashFlow, setFinancingCashFlow] = useState<number>(0);
  const [netCashFlow, setNetCashFlow] = useState<number>(0);

  useEffect(() => {
    // Ensure all inputs are numbers to prevent calculation errors
    const numUnits = Number(numberOfUnits);
    const unitSqm = Number(unitSizeSqm);
    const landCost = Number(landCostPerSqm);
    const constCost = Number(constructionCostPerUnit);
    const sellPrice = Number(sellingPricePerUnit);
    const equityPct = Number(equityPercentage);
    const interestRate = Number(annualInterestRate);
    const loanTerm = Number(loanTermYears);
    const taxRate = Number(taxCommissionRate);
    const opCosts = Number(operationalCosts);
    const offSalePct = Number(offSalePercentage);

    // Perform calculations
    const calculatedTotalLandCost = numUnits * unitSqm * landCost * (1 + taxRate);
    const calculatedTotalConstructionCost = numUnits * constCost;
    const calculatedTotalProjectCost = calculatedTotalLandCost + calculatedTotalConstructionCost;
    const calculatedTotalRevenue = numUnits * sellPrice;
    const calculatedGrossProfit = calculatedTotalRevenue - calculatedTotalProjectCost;
    const calculatedProfitMargin = calculatedTotalRevenue > 0 ? calculatedGrossProfit / calculatedTotalRevenue : 0;
    const calculatedEquityInvestment = calculatedTotalProjectCost * equityPct;
    const calculatedLoanAmount = calculatedTotalProjectCost * (1 - equityPct);
    const calculatedEstimatedInterestPayment = calculatedLoanAmount * interestRate * loanTerm;
    
    const calculatedNetProfitAfterInterest = calculatedGrossProfit - calculatedEstimatedInterestPayment - opCosts;

    const calculatedRoi = calculatedTotalProjectCost > 0 ? calculatedNetProfitAfterInterest / calculatedTotalProjectCost : 0;
    const calculatedRoe = calculatedEquityInvestment > 0 ? calculatedNetProfitAfterInterest / calculatedEquityInvestment : 0;

    // Calculate Cash Flow Metrics
    const revenueAfterOffSale = calculatedTotalRevenue * (1 - offSalePct);
    const calculatedOperatingCashFlow = revenueAfterOffSale - (calculatedTotalLandCost + calculatedTotalConstructionCost + opCosts);
    const calculatedFinancingCashFlow = calculatedEquityInvestment + calculatedLoanAmount;
    const calculatedNetCashFlow = calculatedOperatingCashFlow + calculatedFinancingCashFlow - calculatedEstimatedInterestPayment;

    // Update state with calculated values
    setTotalLandCost(calculatedTotalLandCost);
    setTotalConstructionCost(calculatedTotalConstructionCost);
    setTotalProjectCost(calculatedTotalProjectCost);
    setTotalRevenue(calculatedTotalRevenue);
    setGrossProfit(calculatedGrossProfit);
    setProfitMargin(calculatedProfitMargin);
    setEquityInvestment(calculatedEquityInvestment);
    setLoanAmount(calculatedLoanAmount);
    setEstimatedInterestPayment(calculatedEstimatedInterestPayment);
    setNetProfitAfterInterest(calculatedNetProfitAfterInterest);
    setRoi(calculatedRoi);
    setRoe(calculatedRoe);
    setOperatingCashFlow(calculatedOperatingCashFlow);
    setFinancingCashFlow(calculatedFinancingCashFlow);
    setNetCashFlow(calculatedNetCashFlow);
  }, [
    numberOfUnits, unitSizeSqm, landCostPerSqm, constructionCostPerUnit,
    sellingPricePerUnit, equityPercentage, annualInterestRate, loanTermYears,
    taxCommissionRate, operationalCosts, offSalePercentage
  ]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR' }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, type = "number", step, min, max }) => (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out"
      />
    </div>
  );

  const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, isPrimary = false, isPositive = true, icon: Icon }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm transform transition-all duration-200 ease-in-out hover:scale-[1.02]
      ${isPrimary ? 'bg-indigo-600 text-white' : isPositive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
      <div className="flex items-center">
        {typeof Icon === 'string' ? (
          <span className={`mr-3 text-lg font-bold ${isPrimary ? 'text-white' : isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Icon}
          </span>
        ) : (
          <Icon className={`mr-3 ${isPrimary ? 'text-white' : isPositive ? 'text-green-600' : 'text-red-600'}`} size={24} />
        )}
        <span className={`font-medium ${isPrimary ? 'text-white' : ''}`}>{label}:</span>
      </div>
      <span className={`font-bold text-lg ${isPrimary ? 'text-white' : ''}`}>
        {label.includes('Percentage') ? formatPercentage(value) : formatCurrency(value)}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-4 sm:p-8">
      {/* Header */}
      <header className="bg-white rounded-xl shadow-lg p-6 mb-8 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-4 tracking-tight">Business Evaluation Calculator</h1>
        <p className="text-center text-gray-600 text-lg">
          Adjust the key factor values to instantly evaluate your business plan's financial outcomes.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 border-b-2 border-indigo-200 pb-4">Input Key Factors</h2>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="units" label="Number of Units" value={numberOfUnits} onChange={setNumberOfUnits} />
                <InputField id="unitSize" label="Unit Size (sqm)" value={unitSizeSqm} onChange={setUnitSizeSqm} />
                <InputField id="landCostPerSqm" label="Land Cost per sqm (SAR)" value={landCostPerSqm} onChange={setLandCostPerSqm} />
                <InputField id="constructionCostPerUnit" label="Construction Cost per Unit (SAR)" value={constructionCostPerUnit} onChange={setConstructionCostPerUnit} />
                <InputField id="sellingPricePerUnit" label="Selling Price per Unit (SAR)" value={sellingPricePerUnit} onChange={setSellingPricePerUnit} />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Assumptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="equityPercentage" label="Equity Percentage" value={equityPercentage} onChange={setEquityPercentage} step="0.01" min="0" max="1" />
                <InputField id="annualInterestRate" label="Annual Interest Rate" value={annualInterestRate} onChange={setAnnualInterestRate} step="0.001" min="0" />
                <InputField id="loanTermYears" label="Loan Term (Years)" value={loanTermYears} onChange={setLoanTermYears} />
                <InputField id="taxCommissionRate" label="Tax and Commission Rate" value={taxCommissionRate} onChange={setTaxCommissionRate} step="0.00001" min="0" />
                <InputField id="operationalCosts" label="Operational Costs (SAR)" value={operationalCosts} onChange={setOperationalCosts} />
                <InputField id="offSalePercentage" label="Off-Sale Percentage" value={offSalePercentage} onChange={setOffSalePercentage} step="0.01" min="0" max="1" />
              </div>
            </div>
          </div>
        </section>

        {/* Output Section */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8 border-b-2 border-indigo-200 pb-4">Calculated Business Metrics</h2>
          <div className="space-y-6">
            <MetricDisplay label="Total Land Cost" value={totalLandCost} icon={Landmark} />
            <MetricDisplay label="Total Construction Cost" value={totalConstructionCost} icon={Construction} />
            <MetricDisplay label="Total Project Cost" value={totalProjectCost} isPrimary={true} icon="SAR" />
            <MetricDisplay label="Total Revenue" value={totalRevenue} isPositive={true} icon={LineChart} />
            <MetricDisplay label="Gross Profit" value={grossProfit} isPositive={grossProfit >= 0} icon={grossProfit >= 0 ? TrendingUp : TrendingDown} />
            <MetricDisplay label="Profit Margin" value={profitMargin} isPositive={profitMargin >= 0} icon={Percent} />
            <MetricDisplay label="Equity Investment" value={equityInvestment} icon={Wallet} />
            <MetricDisplay label="Loan Amount" value={loanAmount} icon={Banknote} />
            <MetricDisplay label="Estimated Interest Payment" value={estimatedInterestPayment} isPositive={false} icon={DollarSign} />
            <MetricDisplay label="Net Profit After Interest" value={netProfitAfterInterest} isPositive={netProfitAfterInterest >= 0} icon={netProfitAfterInterest >= 0 ? TrendingUp : TrendingDown} />
            <MetricDisplay label="Return on Investment (ROI)" value={roi} isPositive={roi >= 0} icon={Building} />
            <MetricDisplay label="Return on Equity (ROE)" value={roe} isPositive={roe >= 0} icon={PiggyBank} />
            <MetricDisplay label="Operating Cash Flow" value={operatingCashFlow} isPositive={operatingCashFlow >= 0} icon={operatingCashFlow >= 0 ? ArrowUpCircle : ArrowDownCircle} />
            <MetricDisplay label="Financing Cash Flow" value={financingCashFlow} isPositive={financingCashFlow >= 0} icon={ArrowUpCircle} />
            <MetricDisplay label="Net Cash Flow" value={netCashFlow} isPositive={netCashFlow >= 0} icon={netCashFlow >= 0 ? TrendingUp : TrendingDown} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default BusinessEvaluationCalculator; 