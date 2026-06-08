"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Leaf, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SearchableSelect from "./SearchableSelect";

export default function CalculadoraLanding() {
  const containerRef = useRef(null);
  const [pedagiosPorMes, setPedagiosPorMes] = useState("0");
  const [estacionamentosPorMes, setEstacionamentosPorMes] = useState("0");
  const [fuelType, setFuelType] = useState("GASOLINA");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // FIPE
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);

  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [anoSelecionado, setAnoSelecionado] = useState("");

  const [marcaNome, setMarcaNome] = useState("");
  const [modeloNome, setModeloNome] = useState("");
  const [anoNome, setAnoNome] = useState("");

  const [loadingFipe, setLoadingFipe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCalcular = async () => {
    if (
      !nome ||
      !email ||
      !anoSelecionado ||
      !modeloSelecionado ||
      !marcaSelecionada ||
      !pedagiosPorMes ||
      !estacionamentosPorMes ||
      !fuelType
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setIsErrorModalOpen(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      setIsErrorModalOpen(true);
      return;
    }
    setLoading(true);
    setError(null);

    let anoCalculo = parseInt(anoNome.substring(0, 4)) || 2024;
    if (anoNome.toLowerCase().includes("zero"))
      anoCalculo = new Date().getFullYear();

    try {
      const payload = {
        nomeCompleto: nome,
        email: email,
        marcaVeiculo: marcaNome,
        modeloVeiculo: modeloNome,
        anoVeiculo:
          anoNome === "Zero km" ? new Date().getFullYear() : parseInt(anoNome),
        totalPassagensPedagio: parseInt(pedagiosPorMes) || 0,
        totalPassagensEstacionamento: parseInt(estacionamentosPorMes) || 0,
        fuelType: fuelType,
      };

      const response = await fetch("http://127.0.0.1:8080/api/v1/calculo/b2c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorText = await response.text();
        try {
          const jsonError = JSON.parse(errorText);
          if (jsonError.message || jsonError.error) {
            errorText = jsonError.message || jsonError.error;
          }
        } catch (e) {}
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      const resultadoCompleto = {
        gramasCo2Evitados: data.gramasCo2Evitados,
        arvoresEquivalentes: data.arvoresEquivalentes,
        litrosCombustivelEvitados: data.litrosCombustivelEvitados,
        gramasPapelEvitados: data.gramasPapelEvitados,
        tempoGanhoSegundos: data.tempoGanhoSegundos,
        percentualReducao: 15,
        pedagiosPorMes,
      };

      localStorage.setItem(
        "taggySustainResultado",
        JSON.stringify(resultadoCompleto),
      );
      router.push("/resultado");
    } catch (err) {
      console.error(err);
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setErrorMessage(
          "O backend Java não está rodando na porta 8081 ou está bloqueando a conexão (CORS).",
        );
      } else {
        setErrorMessage(err.message || "Falha de conexão com a API.");
      }
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMarcas = async () => {
      setLoadingFipe(true);
      try {
        const tipoFipe = "carros";
        const res = await fetch(
          `https://parallelum.com.br/fipe/api/v1/${tipoFipe}/marcas`,
        );
        const data = await res.json();

        const popularBrands = [
          "Fiat",
          "Chevrolet",
          "Volkswagen",
          "Toyota",
          "Hyundai",
          "Honda",
          "Renault",
          "Ford",
          "Nissan",
          "Jeep",
        ];

        let mappedData = (Array.isArray(data) ? data : []).map((item) => {
          let nomeLimpo = item.nome;
          if (nomeLimpo.toUpperCase() === "GM - CHEVROLET")
            nomeLimpo = "Chevrolet";
          if (nomeLimpo.toUpperCase() === "VW - VOLKSWAGEN")
            nomeLimpo = "Volkswagen";
          return {
            nome: nomeLimpo,
            valor: item.codigo || item.valor,
          };
        });

        mappedData.sort((a, b) => {
          const aIndex = popularBrands.indexOf(a.nome);
          const bIndex = popularBrands.indexOf(b.nome);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.nome.localeCompare(b.nome);
        });

        setMarcas(mappedData);
        setMarcaSelecionada("");
        setModeloSelecionado("");
        setAnoSelecionado("");
        setModelos([]);
        setAnos([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFipe(false);
      }
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchModelos = async () => {
      if (!marcaSelecionada) {
        setModelos([]);
        setModeloSelecionado("");
        setAnoSelecionado("");
        setAnos([]);
        return;
      }
      setLoadingFipe(true);
      try {
        const marcaObj = marcas.find((m) => m.valor === marcaSelecionada);
        const nomeDaMarca = marcaObj ? marcaObj.nome : "";

        const whitelistMap = {
          Volkswagen: [
            "Gol",
            "Polo",
            "Fox",
            "Up!",
            "Nivus",
            "T-Cross",
            "Taos",
            "Tiguan",
            "Amarok",
            "Jetta",
            "Virtus",
            "Voyage",
            "Saveiro",
          ],
          Chevrolet: [
            "Onix",
            "Prisma",
            "Cruze",
            "Tracker",
            "S10",
            "Spin",
            "Cobalt",
            "Montana",
            "Celta",
            "Corsa",
            "Vectra",
            "Astra",
            "Meriva",
            "Zafira",
            "Equinox",
          ],
          Fiat: [
            "Argo",
            "Mobi",
            "Cronos",
            "Pulse",
            "Fastback",
            "Toro",
            "Strada",
            "Fiorino",
            "Palio",
            "Uno",
            "Siena",
            "Grand Siena",
            "Punto",
            "Idea",
            "Bravo",
          ],
          Ford: [
            "Ka",
            "Fiesta",
            "Focus",
            "EcoSport",
            "Ranger",
            "Fusion",
            "Mustang",
            "Territory",
            "Bronco",
          ],
          Toyota: [
            "Corolla",
            "Hilux",
            "Yaris",
            "Etios",
            "RAV4",
            "SW4",
            "Corolla Cross",
          ],
          Honda: [
            "Civic",
            "Fit",
            "HR-V",
            "City",
            "CR-V",
            "WR-V",
            "Accord",
            "ZR-V",
          ],
          Hyundai: [
            "HB20",
            "HB20S",
            "Creta",
            "Tucson",
            "Santa Fe",
            "Azera",
            "Elantra",
            "i30",
            "IX35",
          ],
          Renault: [
            "Kwid",
            "Sandero",
            "Logan",
            "Duster",
            "Captur",
            "Oroch",
            "Fluence",
            "Clio",
          ],
          Jeep: ["Renegade", "Compass", "Commander", "Wrangler", "Cherokee"],
          Nissan: ["Kicks", "Versa", "Sentra", "Frontier", "March"],
        };

        let uniqueModelNames = [];

        if (whitelistMap[nomeDaMarca]) {
          uniqueModelNames = whitelistMap[nomeDaMarca];
        } else {
          const tipoFipe = "carros";
          const res = await fetch(
            `https://parallelum.com.br/fipe/api/v1/${tipoFipe}/marcas/${marcaSelecionada}/modelos`,
          );
          const data = await res.json();
          const modelosRaw = Array.isArray(data) ? data : data.modelos || [];

          const getBaseModel = (name) => {
            const parts = name
              .replace(/\(novo\)/gi, "")
              .replace(/\(modelo antigo\)/gi, "")
              .trim()
              .split(" ");
            let base = parts[0];
            const twoWordBases = [
              "Grand",
              "Santa",
              "Land",
              "Range",
              "Aston",
              "Alfa",
              "C3",
              "C4",
              "Palio",
              "Space",
              "Cross",
              "Eco",
              "T-Cross",
            ];
            if (parts.length > 1 && twoWordBases.includes(base)) {
              base += " " + parts[1];
            }
            return base;
          };

          uniqueModelNames = Array.from(
            new Set(modelosRaw.map((m) => getBaseModel(m.nome))),
          );
        }

        const mappedModelos = uniqueModelNames
          .map((name) => ({
            nome: name,
            valor: name,
          }))
          .sort((a, b) => a.nome.localeCompare(b.nome));

        setModelos(mappedModelos);
        setModeloSelecionado("");
        setAnoSelecionado("");
        setAnos([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFipe(false);
      }
    };
    fetchModelos();
  }, [marcaSelecionada]);

  // Buscar anos ao selecionar modelo
  useEffect(() => {
    if (!modeloSelecionado) {
      setAnos([]);
      setAnoSelecionado("");
      return;
    }
    // Como agrupamos os modelos de forma simplificada, não usamos mais FIPE para o ano.
    // Em vez disso, geramos uma lista clara e direta de anos.
    setLoadingFipe(true);
    const currentYear = new Date().getFullYear();
    const staticYears = [{ nome: "Zero km", valor: "zero" }];
    for (let y = currentYear; y >= 1990; y--) {
      staticYears.push({ nome: y.toString(), valor: y.toString() });
    }
    setAnos(staticYears);
    setAnoSelecionado("");
    setLoadingFipe(false);
  }, [modeloSelecionado, marcaSelecionada]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".calc-anim-left",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        },
      );
      gsap.fromTo(
        ".calc-anim-right",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 },
      );
    },
    { scope: containerRef, dependencies: [] },
  );

  return (
    <div
      ref={containerRef}
      className="bg-white/95 backdrop-blur-md rounded-[2rem] p-8 md:p-14 w-full max-w-6xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">
        {/* Esquerda: Textos */}
        <div className="flex-1 lg:max-w-md w-full">
          <div className="calc-anim-left inline-block px-3 py-1 rounded-md border border-emerald-100 bg-emerald-50 text-xs font-semibold text-emerald-800 mb-8 uppercase tracking-wider">
            Simulador Taggy
          </div>

          <h2 className="calc-anim-left text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight leading-[1.15] mb-6">
            Descubra o seu potencial de economia.
          </h2>

          <p className="calc-anim-left text-gray-500 text-sm md:text-base leading-relaxed mb-10">
            A Taggy ajuda organizações e motoristas a gerenciarem gastos e
            emissões. Preencha seus dados para ver o impacto exato na sua
            rotina.
          </p>

          <div className="calc-anim-left hidden lg:block w-full h-56 rounded-2xl overflow-hidden mt-auto border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop"
              alt="Green Infrastructure"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>

        {/* Direita: Formulário Clean */}
        <div className="calc-anim-right flex-1 w-full bg-[#F9FBF9] rounded-2xl p-8 border border-emerald-50">
          <div className="space-y-6">
            {/* Bloco 1: Veículo */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-[#2C4A28] flex items-center justify-center">
                  <Leaf className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
                  Veículo
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <SearchableSelect
                  label="Marca"
                  placeholder="Selecione a marca..."
                  items={marcas}
                  value={marcaSelecionada}
                  onChange={(val, nome) => {
                    setMarcaSelecionada(val);
                    setMarcaNome(nome);
                  }}
                  disabled={loadingFipe || marcas.length === 0}
                />
                <SearchableSelect
                  label="Modelo"
                  placeholder="Selecione o modelo..."
                  items={modelos}
                  value={modeloSelecionado}
                  onChange={(val, nome) => {
                    setModeloSelecionado(val);
                    setModeloNome(nome);
                  }}
                  disabled={
                    loadingFipe || modelos.length === 0 || !marcaSelecionada
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <SearchableSelect
                  label="Ano"
                  placeholder="Selecione o ano..."
                  items={anos}
                  value={anoSelecionado}
                  onChange={(val, nome) => {
                    setAnoSelecionado(val);
                    setAnoNome(nome);
                  }}
                  disabled={
                    loadingFipe || anos.length === 0 || !modeloSelecionado
                  }
                />
                <div className="w-full">
                  <label
                    htmlFor="fuelType"
                    className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Tipo de Combustível
                  </label>
                  <select
                    id="fuelType"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <option value="GASOLINA">Gasolina</option>
                    <option value="DIESEL">Diesel</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200/60 my-6"></div>

            {/* Bloco 2: Usuário */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
                Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200/60 my-6"></div>

            {/* Bloco 3: Uso */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
                Uso Mensal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pedagiosPorMes"
                    className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Passagens de Pedágio
                  </label>
                  <input
                    id="pedagiosPorMes"
                    type="number"
                    min="0"
                    value={pedagiosPorMes}
                    onChange={(e) => setPedagiosPorMes(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="estacionamentosPorMes"
                    className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Passagens de Estacionamento
                  </label>
                  <input
                    id="estacionamentosPorMes"
                    type="number"
                    min="0"
                    value={estacionamentosPorMes}
                    onChange={(e) => setEstacionamentosPorMes(e.target.value)}
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Ação */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-gray-400 font-medium">
                Os dados são protegidos e confidenciais.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCalcular}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border border-emerald-200 text-[#0A3B24] font-bold rounded-xl hover:bg-emerald-50 transition-colors text-sm"
                >
                  {loading ? "Processando..." : "Gerar Relatório"}
                </button>
                <button
                  onClick={handleCalcular}
                  disabled={loading}
                  className="w-12 h-12 bg-[#0A3B24] text-white flex items-center justify-center rounded-xl hover:bg-[#062617] transition-colors shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Atenção</DialogTitle>
            <DialogDescription className="text-gray-500">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
