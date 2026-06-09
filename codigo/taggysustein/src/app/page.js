"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import Simulador from "@/components/calculadora/Simulador";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"] });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroImageContainerRef = useRef(null);

  // Refs for GSAP quickTo
  const xToRefBg = useRef(null);
  const yToRefBg = useRef(null);
  const xToRefTag1 = useRef(null);
  const yToRefTag1 = useRef(null);
  const xToRefTag2 = useRef(null);
  const yToRefTag2 = useRef(null);
  const xToRefCard = useRef(null);
  const yToRefCard = useRef(null);

  useGSAP(
    () => {
      gsap.from(".hero-animate", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1,
      });

      gsap.from(".hero-card-animate", {
        x: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5,
      });

      // Setups para o parallax no mousemove
      xToRefBg.current = gsap.quickTo(".parallax-bg", "x", { duration: 0.6, ease: "power3.out" });
      yToRefBg.current = gsap.quickTo(".parallax-bg", "y", { duration: 0.6, ease: "power3.out" });
      
      xToRefTag1.current = gsap.quickTo(".parallax-tag-1", "x", { duration: 0.8, ease: "power3.out" });
      yToRefTag1.current = gsap.quickTo(".parallax-tag-1", "y", { duration: 0.8, ease: "power3.out" });
      
      xToRefTag2.current = gsap.quickTo(".parallax-tag-2", "x", { duration: 0.9, ease: "power3.out" });
      yToRefTag2.current = gsap.quickTo(".parallax-tag-2", "y", { duration: 0.9, ease: "power3.out" });
      
      xToRefCard.current = gsap.quickTo(".parallax-card", "x", { duration: 1.0, ease: "power3.out" });
      yToRefCard.current = gsap.quickTo(".parallax-card", "y", { duration: 1.0, ease: "power3.out" });
    },
    { scope: containerRef },
  );

  const handleMouseMove = (e) => {
    if (!heroImageContainerRef.current || !xToRefBg.current) return;
    const { left, top, width, height } = heroImageContainerRef.current.getBoundingClientRect();
    // Normaliza a posição do mouse a partir do centro (de -1 a 1 aproximadamente)
    const x = (e.clientX - left - width / 2) / 25; 
    const y = (e.clientY - top - height / 2) / 25;

    // Fundo move levemente na direção oposta
    xToRefBg.current(x * -1);
    yToRefBg.current(y * -1);
    
    // Tags e cards movem mais rápido na mesma direção (efeito 3D/profundidade)
    xToRefTag1.current(x * 1.5);
    yToRefTag1.current(y * 1.5);
    
    xToRefTag2.current(x * 2.5);
    yToRefTag2.current(y * 2.5);
    
    xToRefCard.current(x * 0.8);
    yToRefCard.current(y * 0.8);
  };

  const handleMouseLeave = () => {
    if (!xToRefBg.current) return;
    xToRefBg.current(0);
    yToRefBg.current(0);
    xToRefTag1.current(0);
    yToRefTag1.current(0);
    xToRefTag2.current(0);
    yToRefTag2.current(0);
    xToRefCard.current(0);
    yToRefCard.current(0);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white font-sans text-gray-900"
    >
      {/* HEADER MODERNO */}
      <header className="absolute top-0 left-0 right-0 z-50 w-full px-6 md:px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-gray-900">TaggySustain</span>
        </div>
        <div className="flex items-center gap-4">

          <Link
            href="/login"
            className="bg-[#0A3B24] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-[#062617] hover:-translate-y-0.5 transition-all shadow-md"
          >
            Acessar Plataforma
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="w-full sticky top-0 z-0 px-4 md:px-8 pt-32 lg:pt-36 pb-6 md:pb-12 min-h-[95vh] flex items-center justify-center overflow-hidden"
      >
        {/* Imagem de Fundo Desfocada */}
        <div className="absolute inset-0 z-0">
          <img src="/photo-1706743744126-0437f32bfdbd.jpeg" className="w-full h-full object-cover scale-105 opacity-60" alt="" />
          <div className="absolute inset-0 bg-[#F4F6F4]/80 backdrop-blur-[8px]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto w-full bg-white/95 backdrop-blur-md rounded-[3rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10 shadow-2xl border border-white/60">
          
          {/* Esquerda: Conteúdo */}
          <div className="flex-1 lg:max-w-xl xl:max-w-2xl pt-4 lg:pt-0">
            <span className="hero-animate inline-block bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              Mobilidade Sustentável
            </span>

            <h1 className="hero-animate text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-medium text-gray-900 tracking-tight leading-[1.05] mb-8">
              Passe direto, <br/> economize sempre.
            </h1>

            <p className="hero-animate text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mb-12">
              Com o Taggy você cruza qualquer pedágio sem parar, ganha 5% de cashback na hora e ajuda a reduzir a emissão de CO₂ do planeta.
            </p>

            <div className="hero-animate flex items-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
                className="px-8 py-4 bg-[#0A3B24] text-white rounded-xl text-base font-medium hover:bg-[#062617] transition-colors flex items-center justify-center shadow-lg shadow-[#0A3B24]/20"
              >
                Simular Economia
              </button>
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="w-14 h-14 border border-emerald-200 text-[#0A3B24] rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Direita: Imagem grande estilo cartão */}
          <div className="hero-card-animate flex-1 w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] relative mt-10 lg:mt-0">
            <div 
              ref={heroImageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full h-full rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden relative shadow-2xl"
            >
              <img 
                src="/photo-1706743744126-0437f32bfdbd.jpeg" 
                alt="Estrada Sustentável" 
                className="parallax-bg w-full h-full object-cover scale-110 origin-center"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Tags flutuantes (estilo da referência) */}
              <div className="parallax-tag-1 absolute top-1/4 left-[10%] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-gray-900 flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Zero Filas
              </div>

              <div className="parallax-tag-2 absolute bottom-1/3 right-[10%] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-gray-900 flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Eco-Friendly
              </div>

              {/* Mini Card dentro da imagem */}
              <div className="parallax-card absolute bottom-8 left-8 sm:bottom-12 sm:left-12 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-[260px]">
                <div className="flex gap-4 items-center">
                  <div className="text-4xl font-bold text-[#0A3B24]">5%</div>
                  <div className="text-xs font-medium text-gray-600 leading-snug">
                    Desconto garantido em todas as suas passagens.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CALCULATOR SECTION */}
      {/* O container da calculadora desliza por cima da hero section fixada */}
      <section className="w-full bg-[#EBF0EB] px-4 md:px-8 py-24 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] rounded-t-[3rem] lg:rounded-t-[4rem] -mt-10 lg:-mt-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="hidden lg:block text-center mb-0">
             {/* Removido o cabeçalho gigante antigo pois a própria calculadora já tem seu título agora */}
          </div>
          <Simulador />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white relative z-20 py-8 flex justify-center border-t border-gray-100">
        <div className={`text-center text-gray-500 text-lg font-medium ${lora.className}`}>
          &copy; 2026 Taggy Sustain.
        </div>
      </footer>
    </div>
  );
}
