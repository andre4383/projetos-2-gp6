"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import LandingCalculator from "@/components/LandingCalculator";
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

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        pin: true,
        pinSpacing: false,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden"
    >
      {/* HEADER */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 max-w-7xl mx-auto relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00a651] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">TaggySustain</span>
        </div>
        <Link
          href="/login"
          className="bg-emerald-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-900 transition-colors"
        >
          Entrar
        </Link>
      </header>

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="w-full relative px-6 py-16 md:py-24 text-white overflow-hidden min-h-[85vh] flex items-center"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/photo-1706743744126-0437f32bfdbd.jpeg')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-[#1e9b65]/75" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="space-y-8">
            <span className="hero-animate inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              Solução completa para pedágios
            </span>

            <h1 className="hero-animate text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Passe direto,
              <br />
              economize sempre
            </h1>

            <p className="hero-animate text-lg text-emerald-50 max-w-lg leading-relaxed">
              Com o Taggy você passa por qualquer pedágio sem parar, economiza
              5% em cada passagem e ainda acompanha tudo pelo app.
            </p>

            <div className="hero-animate grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-3xl font-bold mb-1">5%</div>
                <div className="text-xs text-emerald-100 font-medium">
                  Desconto garantido
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-3xl font-bold mb-1">0s</div>
                <div className="text-xs text-emerald-100 font-medium">
                  Tempo de espera
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-xs text-emerald-100 font-medium">
                  Digital
                </div>
              </div>
            </div>
          </div>

          <div className="hero-card-animate bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold mb-8">Como funciona</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#1e9b65] flex items-center justify-center font-bold text-lg shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Receba seu Taggy
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    Adesivo inteligente instalado no para-brisa
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#1e9b65] flex items-center justify-center font-bold text-lg shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Passe direto</h3>
                  <p className="text-emerald-100 text-sm">
                    Sensor identifica automaticamente seu veículo
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white text-[#1e9b65] flex items-center justify-center font-bold text-lg shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Economize sempre
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    5% de desconto aplicado em cada passagem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      {/* relative z-20 e rounded-t-[3rem] criam o efeito de cartão subindo por cima do Hero */}
      <section className="w-full bg-gray-50 px-6 py-20 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] rounded-t-[3rem] -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calcule sua economia
            </h2>
            <p className="text-gray-600 text-lg">
              Preencha os dados do seu veículo e veja quanto você pode
              economizar
            </p>
          </div>

          <LandingCalculator />
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
