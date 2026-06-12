"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Leaf,
  Car,
  Clock,
  Droplet,
  FileText,
  TrendingDown,
  Trees,
  Calendar,
  AlertCircle,
  Search,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SeletorMes from "./SeletorMes";
import { KG_CO2_POR_ARVORE_ANO } from "@/lib/calculoConstantes";

export default function RelatorioImpacto({ userName }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const containerRef = useRef(null);
  const jaAnimou = useRef(false);

  const fetchData = async (month) => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setData([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/calculos/b2b/usuario/${userId}?mes=${month}`,
      );

      if (!response.ok) {
        setData([]);
        return;
      }

      const result = await response.json();
      const veiculos = Array.isArray(result) ? result : [];
      setData(veiculos);
    } catch (err) {
      console.error("API indisponível.", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth, userName]);

  useGSAP(
    () => {
      if (!loading && data.length > 0 && !jaAnimou.current) {
        gsap.from(".impact-card", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all",
        });
        jaAnimou.current = true;
      }
    },
    { scope: containerRef, dependencies: [loading, data] },
  );

  const formatNumber = (num) => {
    return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(
      num,
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6" ref={containerRef}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Leaf className="w-6 h-6 text-[#065f46]" />
            Relatório de Impacto
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe a redução de emissões e os ganhos de eficiência da sua
            frota.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SeletorMes value={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 border-4 border-[#065f46]/20 border-t-[#065f46] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">
            Processando cálculos de sustentabilidade...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-dashed border-gray-300">
          <AlertCircle className="w-8 h-8 text-gray-400" />
          <h3 className="text-gray-900 font-semibold">
            Nenhum dado encontrado
          </h3>
          <p className="text-sm text-gray-500">
            Não há registros de cálculos para {selectedMonth}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {data.map((item, idx) => {
            const info = (item.veiculoInfo || "").trim();
            const parts = info.split(" ");
            const lastPart = parts[parts.length - 1];
            const hasYear = /^\d{4}$/.test(lastPart);
            const marca = item.marca || parts[0] || "—";
            const modelo = item.modelo
              || (hasYear ? parts.slice(1, -1).join(" ") || parts[0] || "—" : parts.slice(1).join(" ") || info || "—");
            const ano = item.ano || (hasYear ? lastPart : "—");

            return (
            <div
              key={idx}
              className="impact-card bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-[#FAFBFC] border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#065f46]">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900 break-words">
                      {modelo}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Marca </span>
                        {marca}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Ano </span>
                        {ano}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm shrink-0">
                  Ref: {item.mesReferencia}
                </div>
              </div>

              {/* Card Body - 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Column 1: Sem Taggy */}
                <div className="p-6 bg-gray-50/30">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Cenário Sem Taggy
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5" /> CO₂ Emitido
                        </span>
                        <span>
                          {formatNumber(
                            item.cenarioSemTaggy.gramasCo2Emitidos / 1000,
                          )}{" "}
                          kg
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-300 h-1.5 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5" /> Combustível
                        </span>
                        <span>
                          {formatNumber(
                            item.cenarioSemTaggy.litrosCombustivelConsumidos,
                          )}{" "}
                          L
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-300 h-1.5 rounded-full w-[70%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Papel Gasto
                        </span>
                        <span>
                          {formatNumber(
                            item.cenarioSemTaggy.gramasPapelUtilizados,
                          )}{" "}
                          g
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-300 h-1.5 rounded-full w-[60%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Com Taggy */}
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#065f46]"></div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Cenário Com Taggy
                    </h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-gray-400" /> CO₂
                          Emitido
                        </span>
                        <span>
                          {formatNumber(
                            item.cenarioComTaggy.gramasCo2Emitidos / 1000,
                          )}{" "}
                          kg
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#065f46]/40 h-1.5 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-gray-400" />{" "}
                          Combustível
                        </span>
                        <span>
                          {formatNumber(
                            item.cenarioComTaggy.litrosCombustivelConsumidos,
                          )}{" "}
                          L
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#065f46]/40 h-1.5 rounded-full w-[55%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />{" "}
                          Papel Gasto
                        </span>
                        <span>0 g</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#065f46]/40 h-1.5 rounded-full w-[0%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Ganhos (Destaque) */}
                <div className="p-6 bg-[#065f46] text-white relative overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] rounded-full translate-x-8 -translate-y-8"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-400 opacity-[0.1] rounded-full translate-x-4 translate-y-4"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingDown className="w-5 h-5 text-emerald-300" />
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                        Seus Ganhos
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      <div className="gain-metric bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                        <div className="text-[10px] text-emerald-100 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Leaf className="w-3 h-3" /> CO₂ Evitado
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatNumber(item.ganhos.gramasCo2Evitados / 1000)}{" "}
                          <span className="text-xs font-normal text-emerald-200">
                            kg
                          </span>
                        </div>
                      </div>

                      <div className="gain-metric bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                        <div className="text-[10px] text-emerald-100 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Droplet className="w-3 h-3" /> Combustível
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatNumber(item.ganhos.litrosCombustivelEvitados)}{" "}
                          <span className="text-xs font-normal text-emerald-200">
                            L
                          </span>
                        </div>
                      </div>

                      <div className="gain-metric bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                        <div className="text-[10px] text-emerald-100 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Papel
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatNumber(item.cenarioSemTaggy.gramasPapelUtilizados)}{" "}
                          <span className="text-xs font-normal text-emerald-200">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="gain-metric bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                        <div className="text-[10px] text-emerald-100 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Trees className="w-3 h-3" /> Árvores
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatNumber((item.ganhos.gramasCo2Evitados / 1000) / KG_CO2_POR_ARVORE_ANO)}{" "}
                          <span className="text-xs font-normal text-emerald-200">
                            un.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
