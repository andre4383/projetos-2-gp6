import { Calculator } from "lucide-react";

export default function Cabecalho() {
  return (
    <div className="mb-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
        <Calculator className="w-6 h-6 text-emerald-600" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Calculadora de Emissões
      </h1>
      <p className="text-sm text-zinc-500 mt-1">
        Impacto evitado pelo uso de tag
      </p>
    </div>
  );
}
