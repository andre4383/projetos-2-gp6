export default function ResultadoCalculadora({ resultado }) {
  if (!resultado) return null;

  return (
    <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="inline-block p-6 w-full bg-white border border-zinc-100 shadow-sm rounded-2xl">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
          CO₂ Evitado
        </p>

        <div className="flex items-baseline justify-center gap-1.5 mb-5">
          <span className="text-5xl font-bold tracking-tighter text-zinc-900">
            {(resultado.gramasCo2Evitados / 1000).toFixed(2)}
          </span>
          <span className="text-lg font-medium text-zinc-500">kg</span>
        </div>

        <div className="flex justify-around border-t border-zinc-100 pt-5">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
              Árvores Salvas
            </p>
            <p className="text-lg font-semibold text-emerald-600">
              {resultado.arvoresEquivalentes}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
              Redução
            </p>
            <p className="text-lg font-semibold text-emerald-600">
              {resultado.percentualReducao}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
