"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function ResultadoPage() {
  const router = useRouter();
  const [resultado, setResultado] = useState(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem("taggySustainResultado");
    if (data) {
      try {
        setResultado(JSON.parse(data));
      } catch (err) {
        // ignore
      }
    }
  }, []);

  useGSAP(() => {
    if (mounted && resultado) {
      const tl = gsap.timeline();
      
      tl.fromTo(".anim-fade-up", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.1 }
      )
      .fromTo(".anim-card",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      );
    }
  }, { dependencies: [mounted, resultado], scope: containerRef });

  if (!mounted) return null;

  if (!resultado) {
    return (
      <div className="min-h-screen bg-[#F0F2F0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Nenhum cálculo recente</h2>
          <p className="text-gray-500 text-sm mb-6">Volte à página inicial para preencher o formulário e descobrir seu impacto.</p>
          <button 
            onClick={() => router.push("/")} 
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Voltar para a calculadora
          </button>
        </div>
      </div>
    );
  }

  const co2EvitadoNum = resultado.co2Evitado || (resultado.gramasCo2Evitados ? resultado.gramasCo2Evitados / 1000 : 0);
  const co2Evitado = co2EvitadoNum.toFixed(2);
  const arvores = resultado.arvoresEquivalentes || 0;
  
  const pedagios = resultado.pedagiosPorMes || 0;
  const valor = resultado.valorMedio || 0;
  const economiaTotal = ((pedagios * valor * 0.05) + (co2EvitadoNum * 2.5)).toFixed(2).replace(".", ",");
  const minutosEconomizados = Math.round(pedagios * 2.5);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans bg-cover bg-center"
      style={{
        backgroundColor: "#E8EBE8",
        backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')"
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden">
        
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Esquerda: Textos e CTA */}
          <div className="flex-1 p-10 lg:p-16 flex flex-col justify-between">
            <div>
              <div className="anim-fade-up inline-block px-3 py-1 rounded-md border border-[#D1E0D7] bg-[#F0F5F2] text-xs font-bold text-[#0A3B24] mb-8 uppercase tracking-wider">
                TaggySustain Results
              </div>
              
              <h1 className="anim-fade-up text-4xl lg:text-6xl font-medium text-gray-900 tracking-tight leading-[1.1] mb-6">
                Construído para<br/>Infraestrutura Verde
              </h1>
              
              <p className="anim-fade-up text-gray-500 text-sm md:text-base max-w-md leading-relaxed">
                A Taggy ajuda motoristas e empresas a planejar, gerenciar e escalar sua eficiência, trazendo clareza e estrutura para a economia de pedágios e redução de carbono.
              </p>
            </div>

            <div className="anim-fade-up mt-12 flex items-center gap-6">
              {/* Botões no estilo da imagem 2 (quadrados com ícones) ou imagem 3 (Learn More + Arrow) */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push("/login")}
                  className="px-5 py-2.5 bg-white border border-[#0A3B24]/20 rounded-xl text-sm font-bold text-[#0A3B24] hover:bg-[#F0F5F2] transition-colors"
                >
                  Fazer Login
                </button>
                <button 
                  onClick={() => router.push("/login")}
                  className="w-10 h-10 bg-[#0A3B24] text-white rounded-xl flex items-center justify-center hover:bg-[#062617] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={() => router.push("/")}
                className="w-10 h-10 bg-white border border-[#0A3B24]/20 text-[#0A3B24] rounded-xl flex items-center justify-center hover:bg-[#F0F5F2] transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Direita: Cards de Resultado */}
          <div className="flex-1 bg-[#F9FBF9] p-6 lg:p-10 flex flex-col justify-center gap-4 border-l border-emerald-50">
            
            {/* Card 1: CO2 */}
            <div className="anim-card bg-white rounded-2xl p-6 border border-emerald-50 flex items-center justify-between shadow-sm">
              <div className="pr-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Impacto Ambiental</h3>
                <p className="text-sm text-gray-500 mb-4">Gases não emitidos na atmosfera pelo sistema automático.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-medium text-gray-900 tracking-tight">{co2Evitado}</span>
                  <span className="text-sm text-gray-500 font-medium">kg CO₂</span>
                </div>
              </div>
              <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden shrink-0 hidden sm:block">
                <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=400&auto=format&fit=crop" alt="Nature" className="w-full h-full object-cover opacity-90"/>
              </div>
            </div>

            {/* Card 2: Economia (Dark Green) */}
            <div className="anim-card bg-[#0A3B24] rounded-2xl p-6 border border-[#062617] flex items-center justify-between shadow-md">
              <div className="pr-4">
                <h3 className="text-lg font-medium text-white mb-1">Economia em Escala</h3>
                <p className="text-sm text-[#D1E0D7] mb-4">Suporta seu crescimento reduzindo custos de pedágio e combustível.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg text-[#9BB596]">R$</span>
                  <span className="text-4xl font-medium text-white tracking-tight">{economiaTotal}</span>
                </div>
              </div>
              <div className="w-32 h-32 rounded-xl bg-[#1E331B] overflow-hidden shrink-0 hidden sm:block">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop" alt="Mountains" className="w-full h-full object-cover opacity-80 mix-blend-luminosity"/>
              </div>
            </div>

            {/* Card 3: Tempo e Árvores */}
            <div className="anim-card bg-white rounded-2xl p-6 border border-emerald-50 flex items-center justify-between shadow-sm">
              <div className="pr-4 w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Foco no Longo Prazo</h3>
                <p className="text-sm text-gray-500 mb-4">Construído para suportar infraestrutura durável e resiliente ao longo do tempo.</p>
                
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Árvores Salvas</p>
                    <p className="text-2xl font-medium text-gray-900">{arvores}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Tempo Ganho</p>
                    <p className="text-2xl font-medium text-gray-900">{minutosEconomizados} <span className="text-sm text-gray-500">min</span></p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
