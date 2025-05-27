import React, { useState, useEffect } from 'react';

interface CalculatorState {
  numberOfUnits: number;
  unitSize: number;
  landCostPerSqm: number;
  constructionCostPerUnit: number;
  sellingPricePerUnit: number;
  equityPercentage: number;
  interestRate: number;
  loanTerm: number;
  operationalCosts: number;
  marketingCosts: number;
}

interface Results {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  roi: number;
  paybackPeriod: number;
  breakEvenUnits: number;
}

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    numberOfUnits: 700,
    unitSize: 95,
    landCostPerSqm: 13263,
    constructionCostPerUnit: 320000,
    sellingPricePerUnit: 1300000,
    equityPercentage: 30,
    interestRate: 7,
    loanTerm: 1.5,
    operationalCosts: 5000000,
    marketingCosts: 2000000,
  });

  const [results, setResults] = useState<Results>({
    totalRevenue: 0,
    totalCosts: 0,
    grossProfit: 0,
    roi: 0,
    paybackPeriod: 0,
    breakEvenUnits: 0,
  });

  useEffect(() => {
    const totalLandCost = state.numberOfUnits * state.unitSize * state.landCostPerSqm;
    const totalConstructionCost = state.numberOfUnits * state.constructionCostPerUnit;
    const totalProjectCost = totalLandCost + totalConstructionCost + state.operationalCosts + state.marketingCosts;
    const totalRevenue = state.numberOfUnits * state.sellingPricePerUnit;
    const grossProfit = totalRevenue - totalProjectCost;
    const equityInvestment = totalProjectCost * (state.equityPercentage / 100);
    const roi = equityInvestment > 0 ? (grossProfit / equityInvestment) * 100 : 0;
    const paybackPeriod = grossProfit > 0 ? equityInvestment / (grossProfit / state.loanTerm) : 0;
    const profitPerUnit = state.sellingPricePerUnit - (totalProjectCost / state.numberOfUnits);
    const breakEvenUnits = profitPerUnit > 0 ? totalProjectCost / profitPerUnit : 0;

    setResults({
      totalRevenue,
      totalCosts: totalProjectCost,
      grossProfit,
      roi,
      paybackPeriod,
      breakEvenUnits,
    });
  }, [state]);

  const updateState = (key: keyof CalculatorState, value: number) => {
    setState((prev: CalculatorState) => ({ ...prev, [key]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl text-white">📊</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Business Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced financial analysis and planning tool for strategic business decisions
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-xl text-white">💰</span>
              </div>
              <div className="text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity">📈</div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Total Revenue</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(results.totalRevenue)}</div>
            <p className="text-sm text-gray-500">
              {state.numberOfUnits} units × {formatCurrency(state.sellingPricePerUnit)}
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                results.grossProfit >= 0 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                <span className="text-xl text-white">{results.grossProfit >= 0 ? '📊' : '📉'}</span>
              </div>
              <div className={`opacity-60 group-hover:opacity-100 transition-opacity ${
                results.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {results.grossProfit >= 0 ? '📈' : '📉'}
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Gross Profit</h3>
            <div className={`text-3xl font-bold mb-2 ${results.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(results.grossProfit)}
            </div>
            <p className="text-sm text-gray-500">Revenue minus total costs</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                results.roi >= 15 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  : results.roi >= 10
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                <span className="text-xl text-white">🎯</span>
              </div>
              <div className={`opacity-60 group-hover:opacity-100 transition-opacity ${
                results.roi >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>%</div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">ROI</h3>
            <div className={`text-3xl font-bold mb-2 ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(results.roi)}
            </div>
            <p className="text-sm text-gray-500">Return on investment</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl text-white">⏰</span>
              </div>
              <div className="text-purple-600 opacity-60 group-hover:opacity-100 transition-opacity">📅</div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Payback Period</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{results.paybackPeriod.toFixed(1)} years</div>
            <p className="text-sm text-gray-500">Time to recover investment</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-lg text-white">⚙️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Project Parameters</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">🏢</span>
                Project Details
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Number of Units</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.numberOfUnits}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('numberOfUnits', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">units</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Unit Size</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.unitSize}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('unitSize', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">sqm</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Land Cost per sqm</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.landCostPerSqm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('landCostPerSqm', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">SAR</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Construction Cost per Unit</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.constructionCostPerUnit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('constructionCostPerUnit', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">SAR</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">💰</span>
                Financial Parameters
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Selling Price per Unit</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.sellingPricePerUnit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('sellingPricePerUnit', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">SAR</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Equity Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.equityPercentage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('equityPercentage', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">%</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={state.interestRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('interestRate', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">%</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Loan Term</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={state.loanTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('loanTerm', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">years</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-3">📊</span>
                Additional Costs
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Operational Costs</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.operationalCosts}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('operationalCosts', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">SAR</div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Marketing Costs</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={state.marketingCosts}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateState('marketingCosts', Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-200 text-gray-900 font-medium"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">SAR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-lg text-white">📈</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Financial Analysis</h2>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Financial Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-blue-600">{formatCurrency(results.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Costs</span>
                  <span className="font-bold text-gray-800">{formatCurrency(results.totalCosts)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-bold">Gross Profit</span>
                  <span className={`font-bold text-xl ${results.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.grossProfit)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit Margin</span>
                  <span className="font-bold">
                    {results.totalRevenue > 0 ? formatPercentage((results.grossProfit / results.totalRevenue) * 100) : '0%'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI</span>
                  <span className={`font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(results.roi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-even Units</span>
                  <span className="font-bold">{Math.ceil(results.breakEvenUnits)} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-bold">{results.paybackPeriod.toFixed(1)} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break-even %</span>
                  <span className="font-bold">
                    {((results.breakEvenUnits / state.numberOfUnits) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 border-t border-gray-200">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="text-2xl">📊</span>
            <span className="text-lg font-semibold text-gray-700">Business Calculator</span>
          </div>
          <p className="text-gray-500 text-sm">
            Professional financial analysis tool • Real-time calculations • Strategic insights
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-400">
            <span>Built with React & TypeScript</span>
            <span>•</span>
            <span>Powered by Tailwind CSS</span>
            <span>•</span>
            <span>© 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 