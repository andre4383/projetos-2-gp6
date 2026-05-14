"use client";
import { useState } from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function LandingCalculator() {
  const containerRef = useRef(null);
  const [tipoVeiculo, setTipoVeiculo] = useState("Leve");
  const [pedagiosPorMes, setPedagiosPorMes] = useState("40");
  const [ano, setAno] = useState("2024");
  const [modelo, setModelo] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [valorMedio, setValorMedio] = useState("8,50");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCalcular = async () => {
    if (!nome || !email || !ano || !modelo || !valorMedio || !pedagiosPorMes) {
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

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/calculo/impacto",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipoVeiculo: tipoVeiculo.toLowerCase() === "leve" ? "leve" : "pesado",
            tipoCombustivel: "gasolina",
            totalPassagens: Number(pedagiosPorMes),
            ano: Number(ano),
            modelo: modelo,
            nome: nome,
            email: email,
            valorMedio: Number(valorMedio.replace(",", ".")),
          }),
        }
      );

      if (!response.ok) throw new Error("Erro na resposta do servidor.");

      const data = await response.json();
      const resultadoCompleto = {
        ...data,
        pedagiosPorMes,
        valorMedio: Number(valorMedio.replace(',', '.'))
      };
      localStorage.setItem("taggySustainResultado", JSON.stringify(resultadoCompleto));
      router.push("/resultado");
    } catch (err) {
      setErrorMessage("Falha de conexão com a API. Tente novamente mais tarde.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(".calc-anim-left",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
    );
    gsap.fromTo(".calc-anim-right",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white/95 backdrop-blur-md rounded-[2rem] p-8 md:p-14 w-full max-w-6xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100">
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
            A Taggy ajuda organizações e motoristas a gerenciarem gastos e emissões. Preencha seus dados para ver o impacto exato na sua rotina.
          </p>

          <div className="calc-anim-left hidden lg:block w-full h-56 rounded-2xl overflow-hidden mt-auto border border-gray-100">
             <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop" alt="Green Infrastructure" className="w-full h-full object-cover opacity-90" />
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
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Veículo</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tipo</label>
                  <select
                    value={tipoVeiculo}
                    onChange={(e) => setTipoVeiculo(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow cursor-pointer"
                  >
                    <option value="Leve">Leve (Carro/Moto)</option>
                    <option value="Pesado">Pesado (Caminhão/Ônibus)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ano</label>
                  <input
                    type="text"
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Modelo Específico</label>
                <input
                  type="text"
                  placeholder="Ex: Honda Civic, Toyota Corolla"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
                />
              </div>
            </div>

            <div className="h-px w-full bg-gray-200/60 my-6"></div>

            {/* Bloco 2: Usuário */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200/60 my-6"></div>

            {/* Bloco 3: Uso */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">Uso Mensal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Média por Pedágio (R$)</label>
                  <input
                    type="text"
                    value={valorMedio}
                    onChange={(e) => setValorMedio(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qtd. de Passagens</label>
                  <input
                    type="number"
                    value={pedagiosPorMes}
                    onChange={(e) => setPedagiosPorMes(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-shadow"
                  />
                </div>
              </div>
            </div>

            {/* Ação */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-gray-400 font-medium">Os dados são protegidos e confidenciais.</span>
              
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
            <DialogDescription className="text-gray-500">{errorMessage}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
