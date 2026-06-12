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
import Simulador from "../calculadora/Simulador";

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
  const [selectedMonth, setSelectedMonth] = useState("2026-06");

  const displayUserName = userName.toLowerCase().startsWith("usuario")
    ? userName.substring(7).charAt(0).toUpperCase() +
    userName.substring(7).slice(1)
    : userName;

  const fetchUserName = async (userId) => {
    try {
      let data = null;
      // Tenta a rota de usuário primeiro
      let res = await fetch(`/api/v1/usuario/${userId}`);
      if (res.ok) {
        data = await res.json();
      } else {
        // Se falhar, tenta a rota de pessoa
        res = await fetch(`/api/v1/pessoa/${userId}`);
        if (res.ok) data = await res.json();
      }

      if (data) {
        const rawName = data.nome || data.name || data.nomeCompleto;
        if (rawName) {
          const firstName = rawName.split(/[.\-_ ]/)[0];
          const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          setUserName(formattedName);
          localStorage.setItem("userName", formattedName);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar nome na tabela pessoa/usuario", err);
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");

    if (savedName && !savedName.includes("@")) {
      setUserName(savedName);
    } else {
      setUserName("Usuário"); // Fallback inicial
    }

    // Busca o nome real no backend caso exista o ID
    if (userId) {
      fetchUserName(userId);
    }
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
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setBackendData([]);
        setLoadingBackend(false);
        return;
      }

      const response = await fetch(
        `/api/calculos/b2b/usuario/${userId}?mes=${month}`,
      );

      if (!response.ok) {
        setBackendData([]);
        setIsB2B(false);
        return;
      }

      const result = await response.json();
      const veiculos = Array.isArray(result) ? result : [];

      setBackendData(veiculos);
      setIsB2B(veiculos.length > 1);
    } catch (err) {
      console.error("API indisponível no dashboard.", err);
      setBackendData([]);
      setIsB2B(false);
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
        hasChart: true,
        tooltip: "Total de emissões de CO₂ evitadas pelas suas ações.",
      },
      {
        title: "ECONOMIA DE PAPEL",
        value: papelStr,
        trend: isB2B ? "+66 g" : "+15 g",
        hasChart: false,
        tooltip: "Papel economizado ao evitar impressões físicas.",
      },
    ],
    trees: {
      title: "ÁRVORES PRESERVADAS",
      value: arvoresStr,
      trend: isB2B ? "+0,2 un." : "+0,1 un.",
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
    history: backendData.map((calc) => {
      const info = (calc.veiculoInfo || "").trim();
      const parts = info.split(" ");
      const lastPart = parts[parts.length - 1];
      const hasYear = /^\d{4}$/.test(lastPart);
      return {
        marca: parts[0] || "—",
        modelo: hasYear ? parts.slice(1, -1).join(" ") || parts[0] || "—" : parts.slice(1).join(" ") || info || "—",
        ano: hasYear ? lastPart : "—",
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
              </div>
            </div>

          </div>

          <div className="mt-auto pt-4 pb-2 border-t border-gray-100">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 overflow-hidden border border-emerald-100 shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayUserName)}&background=065f46&color=fff`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm font-bold text-gray-900 truncate max-w-[100px]">
                  {displayUserName}
                </div>
              </div>
              <button
                onClick={() => (window.location.href = "/")}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 shrink-0"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
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
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
            {activeTab === "vehicles" ? (
              <Veiculos userName={userName} />
            ) : activeTab === "reports" ? (
              <RelatorioImpacto userName={userName} />
            ) : (
              <div className="max-w-[1200px] mx-auto space-y-6">
                <div className="dash-welcome flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">
                    Bem-vindo de volta, {displayUserName}.
                  </h1>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                    <div className="flex-1 min-w-[120px] w-full sm:w-auto">
                      <SeletorMes
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                      />
                    </div>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-1.5 bg-[#065f46] hover:bg-[#044e3a] text-white rounded-md text-xs md:text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" /> <span className="inline">Exportar PDF</span>
                    </button>
                  </div>
                </div>

                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mt-6">
                    <div className="dash-chart-card bg-white border border-gray-200 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2 mb-5">
                        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          IMPACTO DO MÊS SELECIONADO
                        </h3>
                      </div>

                      {/* Header: Emissões Totais evitadas */}
                      <div className="mb-6 flex items-baseline gap-3">
                        <span className="text-sm text-gray-500 font-medium">CO₂ Evitado:</span>
                        <span className="text-2xl font-bold text-[#065f46] tracking-tight">{dashboardData.emissionsTotal}</span>
                      </div>

                      {/* Comparação visual: Sem Taggy vs Com Taggy */}
                      <div className="space-y-4">
                        {/* CO2 */}
                        {(() => {
                          const semCo2 = backendData.reduce((a, c) => a + (c.cenarioSemTaggy?.gramasCo2Emitidos || 0), 0) / 1000;
                          const comCo2 = backendData.reduce((a, c) => a + (c.cenarioComTaggy?.gramasCo2Emitidos || 0), 0) / 1000;
                          const maxCo2 = semCo2 || 1;
                          const semW = 100;
                          const comW = semCo2 > 0 ? Math.round((comCo2 / semCo2) * 100) : 0;
                          return (
                            <div>
                              <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  CO₂ Emitido
                                </span>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 w-[60px] shrink-0 text-right">Sem Taggy</span>
                                  <div className="flex-1 bg-red-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-red-400 h-full rounded-full" style={{ width: `${semW}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-gray-600 w-[50px] shrink-0">{semCo2.toFixed(1)} kg</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 w-[60px] shrink-0 text-right">Com Taggy</span>
                                  <div className="flex-1 bg-emerald-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-[#065f46] h-full rounded-full" style={{ width: `${comW}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-[#065f46] w-[50px] shrink-0">{comCo2.toFixed(1)} kg</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Combustível */}
                        {(() => {
                          const semComb = backendData.reduce((a, c) => a + (c.cenarioSemTaggy?.litrosCombustivelConsumidos || 0), 0);
                          const comComb = backendData.reduce((a, c) => a + (c.cenarioComTaggy?.litrosCombustivelConsumidos || 0), 0);
                          const semW = 100;
                          const comW = semComb > 0 ? Math.round((comComb / semComb) * 100) : 0;
                          return (
                            <div>
                              <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                                  Combustível
                                </span>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 w-[60px] shrink-0 text-right">Sem Taggy</span>
                                  <div className="flex-1 bg-red-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-red-400 h-full rounded-full" style={{ width: `${semW}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-gray-600 w-[50px] shrink-0">{semComb.toFixed(1)} L</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 w-[60px] shrink-0 text-right">Com Taggy</span>
                                  <div className="flex-1 bg-emerald-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-[#065f46] h-full rounded-full" style={{ width: `${comW}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-[#065f46] w-[50px] shrink-0">{comComb.toFixed(1)} L</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Papel */}
                        {(() => {
                          const semPapel = backendData.reduce((a, c) => a + (c.cenarioSemTaggy?.gramasPapelUtilizados || 0), 0);
                          return (
                            <div>
                              <div className="flex items-center justify-between text-xs font-medium text-gray-600 mb-2">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                                  Papel Gasto
                                </span>
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 w-[60px] shrink-0 text-right">Sem Taggy</span>
                                  <div className="flex-1 bg-red-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-red-400 h-full rounded-full" style={{ width: "100%" }}></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-gray-600 w-[50px] shrink-0">{semPapel} g</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400 w-[60px] shrink-0 text-right">Com Taggy</span>
                                  <div className="flex-1 bg-emerald-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-[#065f46] h-full rounded-full" style={{ width: "0%" }}></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-[#065f46] w-[50px] shrink-0">0 g</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
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
                          CARROS CADASTRADOS
                        </h3>
                        <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] relative group cursor-help">
                          ?
                          <div className="absolute bottom-full left-0 mb-2 w-max max-w-[200px] bg-gray-800 text-white text-[10px] p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-20 font-normal normal-case tracking-normal text-left">
                            Lista de carros cadastrados.
                            <div className="absolute top-full left-1.5 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            <th className="pb-3 px-2 font-medium">MARCA</th>
                            <th className="pb-3 px-2 font-medium">MODELO</th>
                            <th className="pb-3 px-2 font-medium">ANO</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.history.map((row, idx) => (
                            <tr
                              key={idx}
                              className="table-row-anim border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-sm text-gray-600"
                            >
                              <td className="py-3 px-2 text-gray-900 font-medium">
                                {row.marca}
                              </td>
                              <td className="py-3 px-2 text-gray-700">
                                {row.modelo}
                              </td>
                              <td className="py-3 px-2 text-gray-500">
                                {row.ano}
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
        backendData={backendData}
        userName={displayUserName}
      />
    </div>
  );
}
