"use client";
import { useCallback, useEffect, useState } from "react";

export default function EMICalculator({ price = 1000 }) {
  const [loanAmount, setLoanAmount] = useState(price);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculateEMI = useCallback(() => {
    const principal = loanAmount - downPayment;
    const rate = interestRate / 100 / 12;
    const time = loanTerm;

    if (principal <= 0) {
      setMonthlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      return;
    }

    const emi =
      (principal * rate * Math.pow(1 + rate, time)) /
      (Math.pow(1 + rate, time) - 1);
    const totalAmount = emi * time;
    const interestAmount = totalAmount - principal;

    setMonthlyPayment(emi);
    setTotalPayment(totalAmount);
    setTotalInterest(interestAmount);
  }, [loanAmount, downPayment, interestRate, loanTerm]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-screen w-full overflow-y-scroll bg-gray-50 py-6 px-4 sm:py-8 sm:px-6 lg:py-12 lg:px-8">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a237e] font-roboto mb-2">
          Carsense Loan Calculator
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-roboto px-2">
          Calculate your monthly car payments with our easy-to-use loan
          calculator
        </p>
      </div>
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm sm:text-base text-gray-700 font-roboto">
                    Vehicle Price
                  </label>
                  <span className="text-sm sm:text-base text-gray-600 font-semibold">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="150000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a237e] touch-manipulation"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">
                    $1,000
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    $150,000
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm sm:text-base text-gray-700 font-roboto">
                    Down Payment
                  </label>
                  <span className="text-sm sm:text-base text-gray-600 font-semibold">
                    {formatCurrency(downPayment)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={loanAmount}
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a237e] touch-manipulation"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">$0</span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm sm:text-base text-gray-700 font-roboto">
                    Interest Rate (%)
                  </label>
                  <span className="text-sm sm:text-base text-gray-600 font-semibold">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a237e] touch-manipulation"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">0%</span>
                  <span className="text-xs sm:text-sm text-gray-500">20%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm sm:text-base text-gray-700 font-roboto">
                    Loan Term
                  </label>
                  <span className="text-sm sm:text-base text-gray-600 font-semibold">
                    {loanTerm} months
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="12"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a237e] touch-manipulation"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">
                    12 months
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    84 months
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mt-6 xl:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a237e] font-roboto mb-4 sm:mb-6 text-center xl:text-left">
                Loan Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 font-roboto">
                    Vehicle Price
                  </p>
                  <p className="text-base sm:text-xl font-bold text-[#1a237e] font-roboto">
                    {formatCurrency(loanAmount)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 font-roboto">
                    Down Payment
                  </p>
                  <p className="text-base sm:text-xl font-bold text-[#1a237e] font-roboto">
                    {formatCurrency(downPayment)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 font-roboto">
                    Loan Amount
                  </p>
                  <p className="text-base sm:text-xl font-bold text-[#1a237e] font-roboto">
                    {formatCurrency(loanAmount - downPayment)}
                  </p>
                </div>
                <div className="text-center sm:text-left col-span-2 sm:col-span-1 border-t pt-4 sm:border-t-0 sm:pt-0">
                  <p className="text-sm sm:text-base text-gray-600 font-roboto">
                    Monthly Payment
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-[#1a237e] font-roboto">
                    {formatCurrency(monthlyPayment)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 font-roboto">
                    Total Interest
                  </p>
                  <p className="text-base sm:text-xl font-bold text-[#1a237e] font-roboto">
                    {formatCurrency(totalInterest)}
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-gray-600 font-roboto">
                    Total Payment
                  </p>
                  <p className="text-base sm:text-xl font-bold text-[#1a237e] font-roboto">
                    {formatCurrency(totalPayment)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
