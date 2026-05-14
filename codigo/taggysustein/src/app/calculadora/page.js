"use client";
import React, { useState } from "react";
import Dashboard from "@/components/Dashboard";
import CalculadoraForm from "@/components/CalculadoraForm";
import ResultadoCalculadora from "@/components/ResultadoCalculadora";
import CalculatorFloatingButton from "@/components/CalculatorFloatingButton";

export default function CalculadoraPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleOpenCalculator = () => setIsCalculatorOpen(true);
  const handleCloseCalculator = () => setIsCalculatorOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <Dashboard
          onOpenExportModal={() => {}}
          onOpenCalculator={handleOpenCalculator}
        />

        {isCalculatorOpen && (
          <CalculadoraForm
            onCalculateSuccess={setResultado}
            onClose={handleCloseCalculator}
          />
        )}

        {resultado && (
          <div className="fixed bottom-6 left-6 z-50">
            <ResultadoCalculadora resultado={resultado} />
          </div>
        )}

        {!isCalculatorOpen && (
          <CalculatorFloatingButton onClick={handleOpenCalculator} />
        )}
      </div>
    </div>
  );
}
