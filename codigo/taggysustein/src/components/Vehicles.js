"use client";

import React, { useState, useEffect } from "react";
import { Car, Plus, Settings, AlertCircle, CheckCircle2, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Vehicles({ userName }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ role: "", vehicles: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock API call to fetch vehicles
  const fetchVehicles = async (user) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user.toLowerCase().includes("helena")) {
          resolve({
            role: "B2B",
            vehicles: [
              { id: 1, plate: "ABC-1234", model: "Toyota Corolla", year: 2023, status: "Ativo", type: "Sedan" },
              { id: 2, plate: "XYZ-9876", model: "Honda Civic", year: 2022, status: "Manutenção", type: "Sedan" },
              { id: 3, plate: "DEF-5678", model: "Ford Ranger", year: 2024, status: "Ativo", type: "Picape" },
              { id: 4, plate: "GHI-9012", model: "Chevrolet Onix", year: 2021, status: "Inativo", type: "Hatch" },
            ],
          });
        } else {
          resolve({
            role: "B2C",
            vehicles: [
              { id: 1, plate: "MNO-4321", model: "Hyundai HB20", year: 2021, status: "Ativo", type: "Hatch" },
            ],
          });
        }
      }, 1000); // 1 second delay to simulate network request
    });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchVehicles(userName).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userName]);

  useGSAP(
    () => {
      if (!loading) {
        gsap.from(".vehicle-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    },
    [loading]
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ativo":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "Manutenção":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ativo":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Manutenção":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#065f46]/20 border-t-[#065f46] rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Buscando informações do servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meus Veículos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie a sua frota e acompanhe o status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#044e3a] text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Cadastrar Veículo
        </button>
      </div>

      {data.role === "B2C" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.vehicles.map((v) => (
            <div key={v.id} className="vehicle-item bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#065f46]/40 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#065f46] group-hover:bg-[#065f46] group-hover:text-white transition-colors">
                  <Car className="w-6 h-6" />
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 ${getStatusStyle(v.status)}`}>
                  {getStatusIcon(v.status)}
                  {v.status}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{v.model}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Placa: <strong className="text-gray-900">{v.plate}</strong></span>
                  <span>Ano: <strong className="text-gray-900">{v.year}</strong></span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" /> Gerenciar
                </button>
              </div>
            </div>
          ))}
          
          <div className="vehicle-item bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors min-h-[250px]" onClick={() => setIsModalOpen(true)}>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 border border-gray-200 text-gray-400">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Adicionar novo veículo</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Cadastre um novo carro para começar a acompanhar seu impacto.</p>
          </div>
        </div>
      ) : (
        <div className="vehicle-item bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-[#065f46]" /> Frota Atual ({data.vehicles.length})
            </h3>
            <div className="text-xs text-gray-500 font-medium">Conta Corporativa (B2B)</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-widest bg-white">
                  <th className="py-4 px-6 font-medium">Veículo</th>
                  <th className="py-4 px-6 font-medium">Placa</th>
                  <th className="py-4 px-6 font-medium">Ano / Tipo</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <Car className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{v.model}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-mono font-medium text-gray-700 uppercase">
                        {v.plate}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {v.year} <span className="mx-1">•</span> {v.type}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(v.status)}`}>
                        {getStatusIcon(v.status)}
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:text-[#065f46] hover:border-[#065f46]/30 hover:bg-emerald-50 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Cadastro Simulado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Cadastrar Veículo</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Placa do Veículo</label>
                <input type="text" placeholder="ABC-1234" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-all uppercase" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Modelo</label>
                <input type="text" placeholder="Ex: Honda Civic" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Ano</label>
                  <input type="number" placeholder="2024" className="w-full bg-[#F9FAFB] border border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select className="w-full bg-[#F9FAFB] border border-gray-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-[#065f46] focus:ring-1 focus:ring-[#065f46] focus:bg-white transition-all">
                    <option>Hatch</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Picape</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  // Lógica de salvar via API iria aqui
                }}
                className="px-4 py-2 bg-[#065f46] hover:bg-[#044e3a] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Salvar Veículo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
