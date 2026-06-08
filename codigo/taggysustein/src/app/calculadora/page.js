"use client";
import React, { useState } from "react";
import Painel from "@/components/Painel";
import CalculadoraForm from "@/components/CalculadoraForm";
import ResultadoCalculadora from "@/components/ResultadoCalculadora";
import BotaoFlutuanteCalculadora from "@/components/BotaoFlutuanteCalculadora";

export default function CalculadoraPage() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [resultado, setResultado] = useState(null); //objeto que contém a resposta do backend

  const handleOpenCalculator = () => setIsCalculatorOpen(true);
  const handleCloseCalculator = () => setIsCalculatorOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <Painel
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
          <BotaoFlutuanteCalculadora onClick={handleOpenCalculator} />
        )}
      </div>
    </div>
  );
}
