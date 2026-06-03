"use client";

import React, { useState, useRef, useEffect } from "react";
import CalculatorFloatingButton from "./CalculatorFloatingButton";
import {
  Leaf,
  Home,
  TrendingUp,
  FileText,
  CreditCard,
  History,
  Download,
  Settings,
  MoreHorizontal,
  Search,
  Bell,
  Inbox,
  ChevronDown,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Inter } from "next/font/google";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Vehicles from "./Vehicles";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard({ onOpenExportModal, onOpenCalculator }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const displayUserName = userName.toLowerCase().startsWith("usuario")
    ? userName.substring(7).charAt(0).toUpperCase() +
      userName.substring(7).slice(1)
    : userName;

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);
    else setUserName("Camila"); // Fallback inicial
  }, []);

  const handleSelectUser = (newName) => {
    setUserName(newName);
    localStorage.setItem("userName", newName);
    setIsUserMenuOpen(false);
  };

  useGSAP(
    () => {
      gsap.from(".dash-sidebar", {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
      });

      gsap.from(".dash-header", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".dash-welcome", {
        y: 15,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".dash-metric-card", {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "back.out(1.2)",
        delay: 0.4,
      });

      gsap.from(".dash-chart-card", {
        scale: 0.97,
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(".chart-bar-anim", {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 1,
        stagger: 0.03,
        ease: "power4.out",
        delay: 1.0,
      });

      gsap.from(".table-row-anim", {
        x: -15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        delay: 1.1,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={`flex h-screen w-full bg-[#F5F6F8] p-4 overflow-hidden ${inter.className}`}
    >
      <div className="flex w-full h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <nav className="dash-sidebar w-64 min-w-[16rem] bg-[#FAFBFC] border-r border-gray-200 flex flex-col pt-6 pb-4 px-4 z-10">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#065f46] flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-medium">
                Plataforma
              </div>
              <div className="text-sm font-bold text-gray-900 tracking-tight">
                TaggySustain
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            <div>
              <div className="px-2 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Menu Principal
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === "overview"
                      ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                      : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] transition-all font-medium"
                >
                  <CreditCard className="w-4 h-4" />
                  Meu Cartão
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] transition-all font-medium"
                >
                  <History className="w-4 h-4" />
                  Transações
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] transition-all font-medium"
                >
                  <TrendingUp className="w-4 h-4" />
                  Análises
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] transition-all font-medium"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    Relatórios
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="px-2 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Gerenciamento
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveTab("vehicles")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === "vehicles"
                      ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                      : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Veículos
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] transition-all font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Assinatura
                </button>
              </div>
            </div>

            <div>
              <div className="px-2 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Configurações
              </div>
              <div className="space-y-0.5">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] transition-all font-medium">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
              </div>
            </div>
          </div>

          <div className="relative mt-auto">
            <div 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm cursor-pointer hover:border-[#065f46]/30 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 overflow-hidden border border-emerald-100">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserName)}&background=065f46&color=fff`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {displayUserName}
                </div>
                <div className="text-[11px] text-[#065f46] font-medium truncate">
                  Plano Essencial
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </div>

            {isUserMenuOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pb-2 mb-2 border-b border-gray-100">
                  Trocar Conta
                </div>
                <button
                  onClick={() => handleSelectUser("Camila")}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${userName.toLowerCase() === 'camila' ? 'bg-emerald-50 text-[#065f46]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Camila (B2C)
                  {userName.toLowerCase() === 'camila' && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleSelectUser("Helena")}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors mt-1 ${userName.toLowerCase() === 'helena' ? 'bg-emerald-50 text-[#065f46]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Helena (B2B)
                  {userName.toLowerCase() === 'helena' && <CheckCircle2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          <header className="dash-header h-16 px-8 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div className="flex items-center text-sm font-medium text-gray-400">
              <span className="hover:text-gray-600 cursor-pointer transition-colors">
                Painel
              </span>
              <span className="mx-2">{">"}</span>
              <span className="text-[#065f46] font-semibold">Visão Geral</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full bg-[#F9FAFB] border border-gray-200 rounded-md py-1.5 pl-9 pr-8 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded px-1">
                    ⌘
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded px-1">
                    K
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-[#065f46] transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="hover:text-[#065f46] transition-colors">
                  <Inbox className="w-5 h-5" />
                </button>
                <div className="w-6 h-6 rounded-full overflow-hidden cursor-pointer ml-1 border border-emerald-200">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserName)}&background=065f46&color=fff`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            {activeTab === "vehicles" ? (
              <Vehicles userName={userName} />
            ) : (
              <div className="max-w-[1200px] mx-auto space-y-6">
                <div className="dash-welcome flex justify-between items-end mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Bem-vindo de volta, {displayUserName}.
                </h1>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:border-[#065f46] hover:text-[#065f46] transition-colors">
                    Diário <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:border-[#065f46] hover:text-[#065f46] transition-colors">
                    <Calendar className="w-4 h-4" /> Março 2026{" "}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenExportModal}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#065f46] hover:bg-[#044e3a] text-white rounded-md text-sm font-medium transition-colors shadow-sm ml-2"
                  >
                    <Download className="w-4 h-4" /> Exportar PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    title: "EMISSÕES EVITADAS",
                    value: "31 kg",
                    trend: "+1.2 kg",
                    trendDesc: "mês passado",
                    hasChart: true,
                  },
                  {
                    title: "TEMPO ECONOMIZADO",
                    value: "24 min",
                    trend: "+4 min",
                    trendDesc: "mês passado",
                    hasChart: true,
                  },
                  {
                    title: "NOVAS PASSAGENS",
                    value: "12",
                    trend: "+2",
                    trendDesc: "mês passado",
                    hasChart: false,
                  },
                  {
                    title: "ECONOMIA TAGGY",
                    value: "R$ 48,50",
                    trend: "+R$ 6,00",
                    trendDesc: "mês passado",
                    hasChart: true,
                  },
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className="dash-metric-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#065f46]/40 transition-colors"
                  >
                    <div>
                      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        {metric.title}
                      </h3>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                          {metric.value}
                        </span>
                        {metric.hasChart && (
                          <div className="flex items-end gap-[3px] h-6">
                            {[4, 7, 3, 5, 8, 4, 6, 9].map((h, i) => (
                              <div
                                key={i}
                                className="w-1 bg-[#065f46]/20 rounded-t-[1px]"
                                style={{ height: `${h * 10}%` }}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#065f46] text-[9px] font-bold">
                        ?
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-[#065f46]">
                          {metric.trend}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {metric.trendDesc}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[2fr_1fr] gap-4">
                <div className="dash-chart-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        TENDÊNCIA DE IMPACTO AMBIENTAL
                      </h3>
                      <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">
                        ?
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#065f46] transition-colors" />
                  </div>

                  <div className="flex justify-between items-end mb-8">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm text-gray-500 font-medium">
                        Emissões Totais:
                      </span>
                      <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        31 kg CO₂
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase">
                          MÉDIA MENSAL
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#065f46]"></div>
                        <span className="text-[10px] font-semibold text-[#065f46] uppercase">
                          MÊS ATUAL
                        </span>
                      </div>
                    </div>
                    <div className="flex bg-gray-100 p-0.5 rounded-md">
                      <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-sm">
                        Semanal
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-[#065f46] bg-white shadow-sm rounded-sm">
                        Mensal
                      </button>
                      <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 rounded-sm">
                        Anual
                      </button>
                    </div>
                  </div>

                  <div className="h-56 w-full relative flex items-end justify-between border-b border-gray-100 pb-2">
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-medium pb-2">
                      <span>40k</span>
                      <span>30k</span>
                      <span>20k</span>
                      <span>10k</span>
                      <span>0k</span>
                    </div>

                    <div className="absolute left-6 right-0 top-0 h-full flex flex-col justify-between pb-2 z-0">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-full border-t border-dashed border-gray-100"
                        ></div>
                      ))}
                    </div>

                    <div className="ml-8 w-full h-full flex items-end justify-between px-2 z-10">
                      {[30, 45, 25, 60, 85, 40, 75, 30, 90, 50, 40, 65].map(
                        (val, i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-[2px] w-4 items-center justify-end chart-bar-anim"
                            style={{ height: `${val}%` }}
                          >
                            <div
                              className="w-full bg-emerald-100 rounded-[1px]"
                              style={{ flex: 0.4 }}
                            ></div>
                            <div
                              className="w-full bg-[#065f46] rounded-[1px]"
                              style={{ flex: 0.6 }}
                            ></div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="ml-8 mt-3 flex justify-between px-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    <span>JAN</span>
                    <span>FEV</span>
                    <span>MAR</span>
                    <span>ABR</span>
                    <span>MAI</span>
                    <span>JUN</span>
                    <span>JUL</span>
                    <span>AGO</span>
                    <span>SET</span>
                    <span>OUT</span>
                    <span>NOV</span>
                    <span>DEZ</span>
                  </div>
                </div>

                <div className="dash-chart-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        DESCONTOS POR PRAÇA
                      </h3>
                      <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">
                        ?
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer hover:text-[#065f46] transition-colors" />
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] text-gray-500 font-medium mb-1">
                        Economia Total
                      </div>
                      <div className="text-xl font-bold text-gray-900 tracking-tight">
                        R$ 48,50
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-2 py-1 border border-gray-200 rounded text-[10px] font-medium text-gray-600 hover:bg-emerald-50 hover:text-[#065f46] hover:border-[#065f46]/30 transition-colors">
                      <Calendar className="w-3 h-3" /> 1 Jan - 30 Mar{" "}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex-1 w-full flex items-end justify-between border-b border-gray-100 pb-2 relative mt-4">
                    <div className="absolute w-full top-1/2 border-t border-dashed border-gray-200 z-0"></div>
                    {[60, 40, 70, 50, 80, 40, 65, 90, 55, 75, 45].map(
                      (val, i) => (
                        <div
                          key={i}
                          className="relative w-1 h-full flex items-end justify-center z-10 group chart-bar-anim"
                        >
                          <div className="w-px bg-gray-200 h-full absolute"></div>
                          <div
                            className="w-1.5 bg-[#065f46] rounded-full transition-all group-hover:scale-y-110"
                            style={{ height: `${val}%` }}
                          ></div>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex justify-between mt-3 text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                    <span>1 JAN</span>
                    <span>30 MAR 2026</span>
                  </div>
                </div>
              </div>

              <div className="dash-chart-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      HISTÓRICO RECENTE
                    </h3>
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">
                      ?
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar transações..."
                        className="w-48 bg-[#F9FAFB] border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-colors"
                      />
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#065f46] hover:border-[#065f46]/30 transition-colors">
                      + Nova Transação
                    </button>
                    <button className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                        <th className="pb-3 px-2 font-medium w-8">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#065f46] focus:ring-[#065f46]"
                          />
                        </th>
                        <th className="pb-3 px-2 font-medium">ID:</th>
                        <th className="pb-3 px-2 font-medium">PRAÇA:</th>
                        <th className="pb-3 px-2 font-medium">ESTADO:</th>
                        <th className="pb-3 px-2 font-medium">STATUS:</th>
                        <th className="pb-3 px-2 font-medium text-right">
                          ECONOMIA:
                        </th>
                        <th className="pb-3 px-2 font-medium text-right">
                          AÇÕES
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "#04910",
                          praca: "Boa Viagem",
                          estado: "Pernambuco",
                          status: "Success",
                          ec: "R$ 4,50",
                        },
                        {
                          id: "#04911",
                          praca: "Igarassu",
                          estado: "Pernambuco",
                          status: "Success",
                          ec: "R$ 3,80",
                        },
                        {
                          id: "#04912",
                          praca: "Paulista",
                          estado: "Pernambuco",
                          status: "Pending",
                          ec: "R$ 2,50",
                        },
                        {
                          id: "#04913",
                          praca: "Cabo de Sto. Agostinho",
                          estado: "Pernambuco",
                          status: "Refunded",
                          ec: "R$ 5,00",
                        },
                      ].map((row, idx) => (
                        <tr
                          key={idx}
                          className="table-row-anim border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-sm text-gray-600"
                        >
                          <td className="py-3 px-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-[#065f46] focus:ring-[#065f46]"
                            />
                          </td>
                          <td className="py-3 px-2 font-medium text-gray-400">
                            {row.id}
                          </td>
                          <td className="py-3 px-2 text-gray-900 font-medium">
                            {row.praca}
                          </td>
                          <td className="py-3 px-2 text-gray-500">
                            {row.estado}
                          </td>
                          <td className="py-3 px-2">
                            {row.status === "Success" && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#065f46] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#065f46]"></span>{" "}
                                Sucesso
                              </span>
                            )}
                            {row.status === "Pending" && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{" "}
                                Pendente
                              </span>
                            )}
                            {row.status === "Refunded" && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>{" "}
                                Reembolsado
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right font-medium text-gray-900">
                            {row.ec}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-[#065f46] hover:border-[#065f46]/30 hover:bg-emerald-50 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CalculatorFloatingButton onClick={onOpenCalculator} />
    </div>
  );
}
