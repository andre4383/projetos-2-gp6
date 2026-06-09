"use client";

import React, { useState, useRef, useEffect } from "react";
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
  LogOut,
  Trees,
  Menu,
} from "lucide-react";
import { Inter } from "next/font/google";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Veiculos from "./Veiculos";
import ModalExportar from "./ModalExportar";
import RelatorioImpacto from "./RelatorioImpacto";
import SeletorMes from "./SeletorMes";

const inter = Inter({ subsets: ["latin"] });

export default function LayoutPainel({ onOpenExportModal, onOpenCalculator }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const [backendData, setBackendData] = useState([]);
  const [loadingBackend, setLoadingBackend] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("2026-03");

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

  const [isB2B, setIsB2B] = useState(false);

  const fetchBackendData = async (month) => {
    if (!userName) return;
    setLoadingBackend(true);
    try {
      const storedId = localStorage.getItem("userId");
      const userId = storedId ? storedId : 1;

      let isB2BUser = false;
      try {
        const vehicleResponse = await fetch(`/api/v1/veiculo/usuario/${userId}`);
        if (vehicleResponse.ok) {
          const vehicles = await vehicleResponse.json();
          isB2BUser = Array.isArray(vehicles) && vehicles.length > 1;
          setIsB2B(isB2BUser);
        }
      } catch (err) {
        console.error("Erro ao verificar veículos para B2B", err);
      }

      const response = await fetch(
        `/api/calculos/b2b/usuario/${userId}?mes=${month}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do servidor.");
      }

      const result = await response.json();
      setBackendData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("API indisponível no dashboard.", err);
      setBackendData([]);
    } finally {
      setLoadingBackend(false);
    }
  };

  useEffect(() => {
    fetchBackendData(selectedMonth);
  }, [selectedMonth, userName]);

  useGSAP(
    () => {
      gsap.from(".dash-sidebar", {
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        clearProps: "transform",
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

  // Calcular totais dos ganhos vindos do backend
  const totalCo2Evitados =
    backendData.reduce(
      (acc, curr) => acc + (curr.ganhos?.gramasCo2Evitados || 0),
      0,
    ) / 1000; // em kg
  const totalTempoGanhoSegundos = backendData.reduce(
    (acc, curr) => acc + (curr.ganhos?.tempoGanhoSegundos || 0),
    0,
  );
  const totalPapelEvitados = backendData.reduce(
    (acc, curr) => acc + (curr.ganhos?.gramasPapelEvitados || 0),
    0,
  );
  const totalCombustivelEvitados = backendData.reduce(
    (acc, curr) => acc + (curr.ganhos?.litrosCombustivelEvitados || 0),
    0,
  );

  // Formatar tempo
  const formatTimeHours = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? minutes + "m" : ""}`;
    }
    return `${minutes} min`;
  };

  const totalEconomiaFinanceira =
    totalCombustivelEvitados * 5.8 + (totalTempoGanhoSegundos / 3600) * 20;

  const co2Str = `${totalCo2Evitados.toFixed(1).replace(".", ",")} kg`;
  const tempoStr = formatTimeHours(totalTempoGanhoSegundos);
  const papelStr =
    totalPapelEvitados >= 1000
      ? `${(totalPapelEvitados / 1000).toFixed(1).replace(".", ",")} kg`
      : `${totalPapelEvitados} g`;
  const economiaStr = `R$ ${totalEconomiaFinanceira.toFixed(2).replace(".", ",")}`;

  const arvoresSalvas = (totalCo2Evitados / 20).toFixed(1).replace(".", ",");
  const arvoresStr = `${arvoresSalvas} un.`;

  const dashboardData = {
    metrics: [
      {
        title: "EMISSÕES EVITADAS",
        value: co2Str,
        trend: isB2B ? "+4,5 kg" : "+1,2 kg",
        trendDesc: "mês passado",
        hasChart: true,
        tooltip: "Total de emissões de CO₂ evitadas pelas suas ações.",
      },
      {
        title: "TEMPO ECONOMIZADO",
        value: tempoStr,
        trend: isB2B ? "+12 min" : "+4 min",
        trendDesc: "mês passado",
        hasChart: true,
        tooltip: "Tempo economizado em processos digitais.",
      },
      {
        title: "ECONOMIA DE PAPEL",
        value: papelStr,
        trend: isB2B ? "+66 g" : "+15 g",
        trendDesc: "mês passado",
        hasChart: false,
        tooltip: "Papel economizado ao evitar impressões físicas.",
      },
    ],
    trees: {
      title: "ÁRVORES PRESERVADAS",
      value: arvoresStr,
      trend: isB2B ? "+0,2 un." : "+0,1 un.",
      trendDesc: "mês passado",
    },
    emissionsTotal: `${co2Str} CO₂`,
    impactChart: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      Math.min(100, Math.max(0, totalCo2Evitados * 8))
    ],
    economyTotal: economiaStr,
    discountChart: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      Math.min(100, Math.max(0, totalEconomiaFinanceira / 5))
    ],
    history: backendData.map((calc, idx) => {
      const totalEconomia = (calc.ganhos?.litrosCombustivelEvitados || 0) * 5.8 + ((calc.ganhos?.tempoGanhoSegundos || 0) / 3600) * 20;
      return {
        id: `#${(idx + 1).toString().padStart(5, '0')}`,
        praca: calc.veiculoInfo || "Veículo Registrado",
        estado: "Pernambuco",
        status: "Success",
        ec: `R$ ${totalEconomia.toFixed(2).replace(".", ",")}`,
      };
    })
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-[100dvh] w-full bg-[#F5F6F8] md:p-4 overflow-hidden ${inter.className}`}
    >
      <div className="flex w-full h-full bg-white md:rounded-2xl shadow-sm md:border border-gray-200 overflow-hidden relative">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <nav className={`dash-sidebar absolute md:relative z-50 md:z-10 h-full w-64 min-w-[16rem] bg-[#FAFBFC] border-r border-gray-200 flex flex-col pt-6 pb-4 px-4 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-3 mb-8 px-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "overview"
                    ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                    }`}
                >
                  <Home className="w-4 h-4" />
                  Painel
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "products"
                    ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Meu Cartão
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "transactions"
                    ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                    }`}
                >
                  <History className="w-4 h-4" />
                  Transações
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "reports"
                    ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                    }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Análises
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "messages"
                    ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                    }`}
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "vehicles"
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
                <button
                  onClick={() => setActiveTab("subscription")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "subscription"
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
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === "settings"
                    ? "bg-white shadow-sm border border-gray-200/60 text-[#065f46] font-semibold"
                    : "text-gray-500 hover:bg-emerald-50 hover:text-[#065f46] font-medium"
                    }`}
                >
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
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isUserMenuOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pb-2 mb-2 border-b border-gray-100">
                  Trocar Conta
                </div>
                <button
                  onClick={() => handleSelectUser("Camila")}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${userName.toLowerCase() === "camila" ? "bg-emerald-50 text-[#065f46]" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Camila (B2C)
                  {userName.toLowerCase() === "camila" && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleSelectUser("Helena")}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors mt-1 ${userName.toLowerCase() === "helena" ? "bg-emerald-50 text-[#065f46]" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Helena (B2B)
                  {userName.toLowerCase() === "helena" && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>
                <div className="my-1 border-t border-gray-100"></div>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative z-0">
          <header className="dash-header h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-1.5 text-gray-500 hover:text-[#065f46]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center text-sm font-medium text-gray-400">
                <span className="hover:text-gray-600 cursor-pointer transition-colors">
                  Painel
                </span>
                <span className="mx-2">{">"}</span>
                <span className="text-[#065f46] font-semibold">Visão Geral</span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="relative w-40 md:w-64 hidden sm:block">
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

          <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
            {activeTab === "vehicles" ? (
              <Veiculos userName={userName} />
            ) : activeTab === "reports" ? (
              <RelatorioImpacto userName={userName} />
            ) : (
              <div className="max-w-[1200px] mx-auto space-y-6">
                <div className="dash-welcome flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    Bem-vindo de volta, {displayUserName}.
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-xs md:text-sm font-medium text-gray-700 hover:border-[#065f46] hover:text-[#065f46] transition-colors">
                      Diário <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="flex-1 min-w-[120px]">
                      <SeletorMes
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                      />
                    </div>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 bg-[#065f46] hover:bg-[#044e3a] text-white rounded-md text-xs md:text-sm font-medium transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" /> <span className="hidden sm:inline">Exportar PDF</span>
                    </button>
                  </div>
                </div>

                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dashboardData.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className={`dash-metric-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#065f46]/40 transition-colors ${metric.className || ""}`}
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
                          <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center text-[#065f46] text-[9px] font-bold relative group cursor-help">
                            ?
                            <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-20 font-normal normal-case tracking-normal text-left">
                              {metric.tooltip}
                              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-gray-800"></div>
                            </div>
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

                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mt-6">
                    <div className="dash-chart-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            TENDÊNCIA DE IMPACTO AMBIENTAL
                          </h3>
                          <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] relative group cursor-help">
                            ?
                            <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-20 font-normal normal-case tracking-normal text-left">
                              Histórico mensal de impacto e emissões.
                              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-gray-800"></div>
                            </div>
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
                            {dashboardData.emissionsTotal}
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
                            {dashboardData.impactChart.map((val, i) => (
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
                            ))}
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

                      <div className="dash-metric-card bg-[#065f46] border border-[#044e3a] rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:bg-[#054d38] transition-colors h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <Trees
                              className="w-6 h-6 text-white"
                              strokeWidth={2}
                            />
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-300">
                              {dashboardData.trees.trend}
                            </div>
                            <div className="text-xs text-emerald-200">
                              {dashboardData.trees.trendDesc}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-[10px] font-semibold text-emerald-100 uppercase tracking-widest">
                              {dashboardData.trees.title}
                            </h3>
                            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-emerald-100 text-[10px] relative group cursor-help">
                              ?
                              <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-gray-900 text-white text-[10px] p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-20 font-normal normal-case tracking-normal text-left">
                                {dashboardData.trees.tooltip}
                                <div className="absolute top-full left-1.5 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-5xl font-bold text-white tracking-tight mb-2">
                            {dashboardData.trees.value}
                          </div>
                          <div className="w-full bg-[#044e3a] h-1.5 rounded-full overflow-hidden mt-4">
                            <div className="bg-emerald-400 h-full w-[75%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dash-chart-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mt-6">
                      <div className="flex justify-between items-start md:items-center mb-5 flex-col md:flex-row gap-4 md:gap-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            HISTÓRICO RECENTE
                          </h3>
                          <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] relative group cursor-help">
                            ?
                            <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-20 font-normal normal-case tracking-normal text-left">
                              Últimas transações registradas.
                              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                          <div className="relative flex-1 md:flex-none">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Buscar transações..."
                              className="w-full md:w-48 bg-[#F9FAFB] border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-xs outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-colors"
                            />
                          </div>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#065f46] hover:border-[#065f46]/30 transition-colors whitespace-nowrap">
                            + Nova
                          </button>
                          <button className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 shrink-0">
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
                                AÇÕES
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.history.map((row, idx) => (
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
                  </>
                </div>
            )}
              </div>
        </div>
        </div>

        <ModalExportar
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={dashboardData}
          userName={displayUserName}
        />
      </div>
      );
}
