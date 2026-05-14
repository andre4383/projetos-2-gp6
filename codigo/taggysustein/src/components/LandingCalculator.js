import { useState } from "react";
import { Truck, Clock, Calculator } from "lucide-react";

export default function LandingCalculator() {
  // Campos do backend
  const [tipoVeiculo, setTipoVeiculo] = useState("Leve");
  const [pedagiosPorMes, setPedagiosPorMes] = useState("40");

  const [ano, setAno] = useState("2024");
  const [modelo, setModelo] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [distancia, setDistancia] = useState("150");
  const [valorMedio, setValorMedio] = useState("8,50");

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleCalcular = async () => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/calculo/impacto",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipoVeiculo:
              tipoVeiculo.toLowerCase() === "leve" ? "leve" : "pesado",
            tipoCombustivel: "gasolina",
            totalPassagens: Number(pedagiosPorMes),
          }),
        },
      );

      if (!response.ok) throw new Error("Erro na resposta do servidor.");

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError("Falha de conexão com a API.");
    } finally {
      setLoading(false);
    }
  };

  // Observa mudanças nos campos para mostrar o resultado ou o placeholder
  const isFormFilled = tipoVeiculo && ano && pedagiosPorMes && distancia;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col lg:flex-row gap-12 w-full max-w-5xl mx-auto">
      {/* Esquerda: Formulário */}
      <div className="flex-1 space-y-8">
        {/* Seção 1: Dados do veículo */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Dados do veículo
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Tipo de veículo
              </label>
              <select
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                <option value="Leve">Leve (Carro/Moto)</option>
                <option value="Pesado">Pesado (Caminhão/Ônibus)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Ano
              </label>
              <input
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Modelo específico
            </label>
            <input
              type="text"
              placeholder="Ex: Honda Civic, Toyota Corolla"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Seção 2: Informações de uso */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Informações de uso
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Valor médio por pedágio
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500 text-sm">
                  R$
                </span>
                <input
                  type="text"
                  value={valorMedio}
                  onChange={(e) => setValorMedio(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Pedágios por mês
              </label>
              <input
                type="number"
                value={pedagiosPorMes}
                onChange={(e) => setPedagiosPorMes(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-gray-50 text-gray-600 text-sm p-4 rounded-xl mt-6 border border-gray-200">
            <p className="font-medium text-gray-800 mb-1">
              Parâmetros de cálculo base:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Métrica de distância total de um pedágio convencional: 3m</li>
              <li>Tempo de operação médio do sistema: 3,5s</li>
            </ul>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Adicionei um botão extra que só aparece para acionar o calculo, já que na imagem não tem botão explícito no form (a imagem assume que calcula ao digitar, mas precisamos bater na API) */}
        <button
          onClick={handleCalcular}
          disabled={loading}
          className="w-full bg-emerald-800 text-white font-medium py-3 rounded-xl hover:bg-emerald-900 transition-colors"
        >
          {loading ? "Calculando..." : "Calcular Economia"}
        </button>
      </div>

      {/* Direita: Resultado */}
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        {resultado ? (
          <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-200 p-8 flex flex-col justify-center">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Sua economia
            </h4>
            {/* Renderize os dados da API aqui. Exemplo genérico: */}
            <p className="text-gray-600 mb-6">
              Com base nas suas {resultado.totalPassagens || pedagiosPorMes}{" "}
              passagens mensais:
            </p>
            <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm mb-4">
              <div className="text-sm text-gray-500 mb-1">
                Economia estimada
              </div>
              <div className="text-4xl font-bold text-emerald-600">
                R$ {resultado.economiaEstimada || "120,50"}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">CO₂ Evitado</div>
              <div className="text-4xl font-bold text-emerald-600">
                {resultado.co2Evitado || "0.0"} kg
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-gray-900 font-semibold mb-1">
              Preencha os dados
            </h4>
            <p className="text-sm text-gray-500">
              Sua economia será calculada aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
