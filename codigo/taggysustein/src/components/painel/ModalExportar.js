"use client";

import React, { useRef } from "react";
import { X, FileText, Download, Calendar, CheckCircle2 } from "lucide-react";

export default function ModalExportar({ isOpen, onClose, data, backendData = [], userName }) {
  if (!isOpen) return null;

  const handleExport = () => {
    const source = document.getElementById("printable-report");
    if (!source) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const styleSheets = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          if (sheet.href) {
            return `<link rel="stylesheet" href="${sheet.href}">`;
          }
          return `<style>${Array.from(sheet.cssRules).map((r) => r.cssText).join("\n")}</style>`;
        } catch (_) {
          return "";
        }
      })
      .join("\n");

    doc.open();
    doc.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Relatório TaggySustain</title>
${styleSheets}
<style>
  @page { size: A4; margin: 15mm; }
  html, body { margin: 0; padding: 0; background: white; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .vehicle-card { page-break-inside: avoid !important; break-inside: avoid !important; }
  table { page-break-inside: auto; }
  tr, h2, thead { page-break-inside: avoid; }
</style>
</head>
<body>${source.outerHTML}</body>
</html>`);
    doc.close();

    const triggerPrint = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };

    if (doc.readyState === "complete") {
      setTimeout(triggerPrint, 300);
    } else {
      iframe.onload = () => setTimeout(triggerPrint, 300);
    }
  };

  const currentDate = new Date().toLocaleDateString("pt-BR");

  const formatNumber = (num) =>
    new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(num);

  const formatPercent = (sem, com) => {
    if (!sem || sem === 0) return "—";
    const pct = ((sem - com) / sem) * 100;
    return `${pct.toFixed(0)}%`;
  };

  const totalCo2EvitadoKg =
    backendData.reduce((acc, c) => acc + (c.ganhos?.gramasCo2Evitados || 0), 0) /
    1000;
  const totalCombustivelEvitado = backendData.reduce(
    (acc, c) => acc + (c.ganhos?.litrosCombustivelEvitados || 0),
    0,
  );
  const totalPapelEvitadoG = backendData.reduce(
    (acc, c) => acc + (c.cenarioSemTaggy?.gramasPapelUtilizados || 0),
    0,
  );
  const arvoresEquivalentes = totalCo2EvitadoKg / 22;
  const economiaCombustivelReais = totalCombustivelEvitado * 5.8;

  // Cada ticket pesa 2g — total de passagens derivado do papel utilizado
  const passagensPorVeiculo = (item) =>
    Math.round((item.cenarioSemTaggy?.gramasPapelUtilizados || 0) / 2);
  const totalPassagens = backendData.reduce(
    (acc, c) => acc + passagensPorVeiculo(c),
    0,
  );

  const mesesReferencia = Array.from(
    new Set(backendData.map((c) => c.mesReferencia).filter(Boolean)),
  );
  const periodoAnalise =
    mesesReferencia.length === 1
      ? mesesReferencia[0]
      : mesesReferencia.length > 1
      ? `${mesesReferencia[0]} a ${mesesReferencia[mesesReferencia.length - 1]}`
      : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm print-ancestor">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[85vh] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200 print-ancestor">

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
        <div className="flex-1 bg-[#F5F6F8] overflow-y-auto no-print-bg print-ancestor">
          <div className="min-h-full flex flex-col items-center p-8 lg:p-12 print-ancestor">
            {/* Printable A4 Paper representation */}
            <div
              id="printable-report"
              className="bg-white shadow-lg w-[210mm] min-h-[297mm] p-[15mm] sm:p-[20mm] shrink-0 print:shadow-none print:w-full relative"
            >
              {/* Cabecalho */}
              <div className="border-b-2 border-[#065f46] pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-[#065f46]">Relatório de Impacto e Economia</h1>
                  <p className="text-sm text-gray-500 mt-1">Plataforma TaggySustain</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">Cliente: {userName}</p>
                  <p className="text-xs text-gray-500">Período de análise: <span className="font-semibold text-gray-700">{periodoAnalise}</span></p>
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

              {/* Resumo do Período */}
              {backendData.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Resumo do Período Analisado</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Período</p>
                      <p className="text-lg font-bold text-gray-900">{periodoAnalise}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Mês de referência dos dados</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Veículos analisados</p>
                      <p className="text-lg font-bold text-gray-900">{backendData.length}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Frota com dados no período</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Total de passagens</p>
                      <p className="text-lg font-bold text-gray-900">{formatNumber(totalPassagens)}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Pedágios + estacionamentos</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Equivalências */}
              {backendData.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Equivalências de Impacto</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-emerald-100 bg-emerald-50/50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Árvores preservadas/ano</p>
                      <p className="text-2xl font-bold text-[#065f46]">{formatNumber(arvoresEquivalentes)} un.</p>
                      <p className="text-[10px] text-gray-400 mt-1">Base: 22 kg CO₂ absorvidos por árvore adulta/ano (IPCC)</p>
                    </div>
                    <div className="p-4 rounded-lg border border-emerald-100 bg-emerald-50/50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Economia em combustível</p>
                      <p className="text-2xl font-bold text-[#065f46]">R$ {formatNumber(economiaCombustivelReais)}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Base: R$ 5,80/L (média gasolina comum)</p>
                    </div>
                    <div className="p-4 rounded-lg border border-emerald-100 bg-emerald-50/50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">CO₂ total evitado</p>
                      <p className="text-2xl font-bold text-[#065f46]">{formatNumber(totalCo2EvitadoKg)} kg</p>
                      <p className="text-[10px] text-gray-400 mt-1">Soma do ganho de todos os veículos no período</p>
                    </div>
                    <div className="p-4 rounded-lg border border-emerald-100 bg-emerald-50/50">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Papel não impresso</p>
                      <p className="text-2xl font-bold text-[#065f46]">{formatNumber(totalPapelEvitadoG)} g</p>
                      <p className="text-[10px] text-gray-400 mt-1">100% dos tickets de pedágio/estacionamento</p>
                    </div>
                  </div>
                </div>
              )}

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
                      <div key={idx} className="vehicle-card mb-6 border border-gray-200 rounded-lg overflow-hidden">
                        {/* Vehicle Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <span className="text-sm font-bold text-gray-900">{modelo}</span>
                            <span className="text-xs text-gray-500 ml-2">{marca} · {ano}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">
                              <span className="font-semibold">{passagensPorVeiculo(item)}</span> passagens
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">Ref: {item.mesReferencia}</span>
                          </div>
                        </div>

                        {/* Comparison Table */}
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              <th className="py-2 px-4 text-left font-medium">Métrica</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#dc2626'}}>Sem Taggy</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#065f46'}}>Com Taggy</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#065f46'}}>Ganho</th>
                              <th className="py-2 px-4 text-center font-medium" style={{color: '#065f46'}}>Redução</th>
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
                              <td className="py-2.5 px-4 text-center font-bold" style={{color: '#065f46'}}>
                                {formatPercent(item.cenarioSemTaggy?.gramasCo2Emitidos, item.cenarioComTaggy?.gramasCo2Emitidos)}
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
                              <td className="py-2.5 px-4 text-center font-bold" style={{color: '#065f46'}}>
                                {formatPercent(item.cenarioSemTaggy?.litrosCombustivelConsumidos, item.cenarioComTaggy?.litrosCombustivelConsumidos)}
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
                                -{formatNumber(item.cenarioSemTaggy?.gramasPapelUtilizados)} g
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold" style={{color: '#065f46'}}>
                                100%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Metodologia */}
              <div className="mt-8 mb-4 vehicle-card">
                <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider border-b border-gray-100 pb-2">Metodologia e Parâmetros</h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed space-y-3">
                  <p>
                    <span className="font-semibold">Escopo do cálculo:</span> os valores apresentados referem-se exclusivamente ao impacto ambiental gerado durante o <span className="font-semibold">tempo parado em filas</span> de pedágios e estacionamentos. Não representam o consumo total do veículo no período.
                  </p>
                  <div>
                    <p className="font-semibold mb-2">Parâmetros adotados:</p>
                    <table className="w-full text-[11px]">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Tempo médio em fila de pedágio (sem Taggy)</td>
                          <td className="py-1.5 font-medium text-gray-800">10 min/passagem</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Tempo médio em fila de pedágio (com Taggy)</td>
                          <td className="py-1.5 font-medium text-gray-800">2 min/passagem</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Tempo médio em fila de estacionamento (sem Taggy)</td>
                          <td className="py-1.5 font-medium text-gray-800">8 min/passagem</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Tempo médio em fila de estacionamento (com Taggy)</td>
                          <td className="py-1.5 font-medium text-gray-800">1 min/passagem</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Consumo médio em marcha lenta</td>
                          <td className="py-1.5 font-medium text-gray-800">0,8 L/h</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Consumo adicional por evento de aceleração</td>
                          <td className="py-1.5 font-medium text-gray-800">0,015 L/passagem</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Peso médio do ticket impresso</td>
                          <td className="py-1.5 font-medium text-gray-800">2 g</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-1.5 pr-3 text-gray-600">Fator de emissão do papel</td>
                          <td className="py-1.5 font-medium text-gray-800">1,2 kg CO₂/kg</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 pr-3 text-gray-600">Capacidade de absorção por árvore adulta</td>
                          <td className="py-1.5 font-medium text-gray-800">22 kg CO₂/ano</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>
                    <span className="font-semibold">Fontes:</span> fatores de emissão por tipo de combustível baseados em referências do IPCC (Intergovernmental Panel on Climate Change) e CETESB. Equivalência de absorção arbórea conforme estimativas do IPCC para árvores adultas em clima tropical. Preço médio de combustível (R$ 5,80/L) com base em pesquisa ANP.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 italic text-center">* Fim do relatório *</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
