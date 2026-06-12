"use client";

import React, { useRef } from "react";
import { X, FileText, Download, Calendar, CheckCircle2 } from "lucide-react";

export default function ModalExportar({ isOpen, onClose, data, backendData = [], userName }) {
  if (!isOpen) return null;

  const handleExport = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("pt-BR");

  const formatNumber = (num) =>
    new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(num);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: auto !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .no-print {
            display: none !important;
          }
          tr, h2 {
            page-break-inside: avoid;
          }
        }
      `}} />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Left Sidebar - Settings (no-print) */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col no-print shrink-0">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#065f46]" />
              Exportar Relatório
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Destino</label>
              <div className="flex items-center justify-between p-3 border border-[#065f46] bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-[#065f46]">
                  <Download className="w-4 h-4" />
                  Salvar como PDF
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#065f46]" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Período</label>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Junho 2026
                </div>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Páginas</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] transition-all">
                <option>Tudo</option>
                <option>Apenas Resumo</option>
                <option>Apenas Histórico</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Orientação</label>
              <select className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] transition-all">
                <option>Retrato</option>
                <option>Paisagem</option>
              </select>
            </div>
          </div>

          <div className="p-5 border-t border-gray-200 bg-white space-y-3">
            <button
              onClick={handleExport}
              className="w-full py-2.5 bg-[#065f46] hover:bg-[#044e3a] text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Confirmar Exportação
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Right Area - Preview */}
        <div className="flex-1 bg-[#F5F6F8] overflow-y-auto no-print-bg">
          <div className="min-h-full flex flex-col items-center p-8 lg:p-12">
            {/* Printable A4 Paper representation */}
            <div
              id="printable-report"
              className="bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] sm:p-[20mm] shrink-0 print:shadow-none print:w-full print:h-full print:p-0 relative"
            >
              {/* Cabecalho */}
              <div className="border-b-2 border-[#065f46] pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-[#065f46]">Relatório de Impacto e Economia</h1>
                  <p className="text-sm text-gray-500 mt-1">Plataforma TaggySustain</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">Cliente: {userName}</p>
                  <p className="text-xs text-gray-500">Gerado em: {currentDate}</p>
                </div>
              </div>

              {/* Resumo */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Resumo de Performance</h2>
                <div className="grid grid-cols-2 gap-6">
                  {data.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold text-[#065f46]">{metric.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{metric.trend} em relação ao {metric.trendDesc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Detalhes de Sustentabilidade</h2>
                <div className="bg-emerald-50/50 p-5 rounded-lg border border-emerald-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    No período analisado, o usuário <span className="font-semibold">{userName}</span> evitou a emissão de <span className="font-semibold text-[#065f46]">{data.emissionsTotal}</span> utilizando o sistema Taggy, contribuindo ativamente para a redução da pegada de carbono e promovendo uma mobilidade mais sustentável.
                  </p>
                </div>
              </div>

              {/* Carros Cadastrados */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Carros Cadastrados</h2>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                      <th className="pb-2 font-medium">Marca</th>
                      <th className="pb-2 font-medium">Modelo</th>
                      <th className="pb-2 font-medium">Ano</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 text-gray-700">
                        <td className="py-2.5">{row.marca}</td>
                        <td className="py-2.5">{row.modelo}</td>
                        <td className="py-2.5">{row.ano}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Análise por Veículo */}
              {backendData.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Análise de Impacto por Veículo</h2>

                  {backendData.map((item, idx) => {
                    const info = (item.veiculoInfo || "").trim();
                    const parts = info.split(" ");
                    const lastPart = parts[parts.length - 1];
                    const hasYear = /^\d{4}$/.test(lastPart);
                    const marca = parts[0] || "—";
                    const modelo = hasYear ? parts.slice(1, -1).join(" ") || parts[0] || "—" : parts.slice(1).join(" ") || info || "—";
                    const ano = hasYear ? lastPart : "—";

                    return (
                      <div key={idx} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                        {/* Vehicle Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <span className="text-sm font-bold text-gray-900">{modelo}</span>
                            <span className="text-xs text-gray-500 ml-2">{marca} · {ano}</span>
                          </div>
                          <span className="text-xs text-gray-400">Ref: {item.mesReferencia}</span>
                        </div>

                        {/* Comparison Table */}
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              <th className="py-2 px-4 text-left font-medium">Métrica</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#dc2626'}}>Sem Taggy</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#065f46'}}>Com Taggy</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#065f46'}}>Ganho</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-50">
                              <td className="py-2.5 px-4 text-gray-700 font-medium">CO₂ Emitido</td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                {formatNumber(item.cenarioSemTaggy?.gramasCo2Emitidos / 1000)} kg
                              </td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                {formatNumber(item.cenarioComTaggy?.gramasCo2Emitidos / 1000)} kg
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold" style={{color: '#065f46'}}>
                                -{formatNumber(item.ganhos?.gramasCo2Evitados / 1000)} kg
                              </td>
                            </tr>
                            <tr className="border-b border-gray-50">
                              <td className="py-2.5 px-4 text-gray-700 font-medium">Combustível</td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                {formatNumber(item.cenarioSemTaggy?.litrosCombustivelConsumidos)} L
                              </td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                {formatNumber(item.cenarioComTaggy?.litrosCombustivelConsumidos)} L
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold" style={{color: '#065f46'}}>
                                -{formatNumber(item.ganhos?.litrosCombustivelEvitados)} L
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2.5 px-4 text-gray-700 font-medium">Papel Gasto</td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                {formatNumber(item.cenarioSemTaggy?.gramasPapelUtilizados)} g
                              </td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                0 g
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold" style={{color: '#065f46'}}>
                                -{formatNumber(item.ganhos?.gramasPapelEvitados)} g
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4 italic text-center">* Fim do relatório *</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
