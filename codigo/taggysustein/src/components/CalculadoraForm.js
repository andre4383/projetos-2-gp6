import { useState } from "react";

const currentYear = new Date().getFullYear();

export default function CalculadoraForm({ onCalculateSuccess, onClose }) {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [marcaVeiculo, setMarcaVeiculo] = useState("");
  const [modeloVeiculo, setModeloVeiculo] = useState("");
  const [anoVeiculo, setAnoVeiculo] = useState(currentYear);
  const [totalPassagensPedagio, setTotalPassagensPedagio] = useState(0);
  const [totalPassagensEstacionamento, setTotalPassagensEstacionamento] =
    useState(0);
  const [fuelType, setFuelType] = useState("GASOLINA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalcular = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    onCalculateSuccess(null);

    try {
      const response = await fetch("http://localhost:8080/api/v1/calculo/b2c", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomeCompleto,
          email,
          marcaVeiculo,
          modeloVeiculo,
          anoVeiculo: Number(anoVeiculo),
          totalPassagensPedagio: Number(totalPassagensPedagio),
          totalPassagensEstacionamento: Number(totalPassagensEstacionamento),
          fuelType,
        }),
      });

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

  const inputClass =
    "w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#065f46] focus:ring-2 focus:ring-[#065f46]/20";

  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-auto mt-10 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Calculadora de Emissão de CO₂
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
            aria-label="Fechar calculadora"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleCalcular} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nome Completo
          </label>
          <input
            type="text"
            required
            placeholder="Ex: João Silva"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            E-mail
          </label>
          <input
            type="email"
            required
            placeholder="Ex: joao@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Marca do Veículo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Toyota"
              value={marcaVeiculo}
              onChange={(e) => setMarcaVeiculo(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Modelo do Veículo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Corolla"
              value={modeloVeiculo}
              onChange={(e) => setModeloVeiculo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ano do Veículo
          </label>
          <input
            type="number"
            required
            min="1900"
            max={currentYear + 1}
            value={anoVeiculo}
            onChange={(e) => setAnoVeiculo(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passagens de Pedágio
            </label>
            <input
              type="number"
              required
              min="0"
              value={totalPassagensPedagio}
              onChange={(e) => setTotalPassagensPedagio(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Passagens de Estacionamento
            </label>
            <input
              type="number"
              required
              min="0"
              value={totalPassagensEstacionamento}
              onChange={(e) => setTotalPassagensEstacionamento(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tipo de Combustível
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="GASOLINA">Gasolina</option>
            <option value="DIESEL">Diesel</option>
          </select>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#065f46] hover:bg-[#044e3a] text-white font-medium text-sm py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#065f46]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
        >
          {loading ? "Calculando..." : "Calcular Impacto"}
        </button>
      </form>
    </div>
  );
}
