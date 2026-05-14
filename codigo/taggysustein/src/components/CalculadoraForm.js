import { useState } from "react";

export default function CalculadoraForm({ onCalculateSuccess }) {
  const [tipoVeiculo, setTipoVeiculo] = useState("leve");
  const [tipoCombustivel, setTipoCombustivel] = useState("gasolina");
  const [totalPassagens, setTotalPassagens] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalcular = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    onCalculateSuccess(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/calculo/impacto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipoVeiculo,
            tipoCombustivel,
            totalPassagens,
          }),
        },
      );

      if (!response.ok) throw new Error("Erro na resposta do servidor.");

      const data = await response.json();
      onCalculateSuccess(data);
    } catch (err) {
      setError(
        "Falha de conexão com a API. Verifique se o servidor está ativo.",
      );
      onCalculateSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-auto mt-10 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Calculadora de Emissão de CO₂</h2>
      </div>

      <form onSubmit={handleCalcular} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Veículo</label>
          <select
            value={tipoVeiculo}
            onChange={(e) => setTipoVeiculo(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 cursor-pointer"
          >
            <option value="leve">Leve (Carro)</option>
            <option value="pesado">Pesado (Caminhão/Ônibus)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Combustível</label>
          <select
            value={tipoCombustivel}
            onChange={(e) => setTipoCombustivel(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 cursor-pointer"
          >
            <option value="gasolina">Gasolina</option>
            <option value="etanol">Etanol</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Total de Passagens</label>
          <input
            type="number"
            min="1"
            value={totalPassagens}
            onChange={(e) => setTotalPassagens(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20"
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00a651] hover:bg-[#008f47] text-white font-medium text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a651]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
        >
          {loading ? "Calculando..." : "Calcular Impacto"}
        </button>
      </form>
    </div>
  );
}
