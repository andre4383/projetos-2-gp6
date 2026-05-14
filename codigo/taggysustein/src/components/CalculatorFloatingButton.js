export default function CalculatorFloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-[#00a651] text-white p-4 rounded-full shadow-lg hover:bg-[#008f47] transition-all hover:scale-110 z-40 flex items-center gap-2 group"
      title="Calculadora de CO₂"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
        Calculadora de CO₂
      </span>
    </button>
  );
}
