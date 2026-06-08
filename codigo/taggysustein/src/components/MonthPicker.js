import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function MonthPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(
    value ? parseInt(value.split("-")[0]) : new Date().getFullYear()
  );
  
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  
  const handleSelect = (monthIndex) => {
    const month = (monthIndex + 1).toString().padStart(2, "0");
    onChange(`${currentYear}-${month}`);
    setOpen(false);
  };

  const selectedYear = value ? parseInt(value.split("-")[0]) : null;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : null;

  const getDisplayValue = () => {
    if (!value) return "Selecione o mês...";
    return `${months[selectedMonth]} ${selectedYear}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg py-1.5 px-3.5 text-sm font-medium text-gray-700 hover:border-[#065f46] hover:text-[#065f46] transition-all shadow-sm outline-none focus:ring-1 focus:ring-[#065f46]">
          <Calendar className="w-4 h-4 text-gray-400 group-hover:text-[#065f46] transition-colors" />
          <span className="min-w-[4rem] text-left">{getDisplayValue()}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align="end">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentYear(currentYear - 1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="font-semibold text-sm text-gray-900">{currentYear}</div>
          <button 
            onClick={() => setCurrentYear(currentYear + 1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, i) => {
            const isSelected = selectedYear === currentYear && selectedMonth === i;
            return (
              <button
                key={m}
                onClick={() => handleSelect(i)}
                className={`py-2 rounded-md text-xs font-medium transition-colors ${
                  isSelected 
                    ? "bg-[#065f46] text-white shadow-sm" 
                    : "text-gray-700 hover:bg-emerald-50 hover:text-[#065f46]"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
