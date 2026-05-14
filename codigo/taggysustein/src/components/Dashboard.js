import CalculatorFloatingButton from './CalculatorFloatingButton';
import { Leaf } from 'lucide-react';

export default function Dashboard({ onOpenExportModal, onOpenCalculator }) {
  return (
    <>
      <div className="flex h-[580px] border-[0.5px] border-[--color-border-tertiary] rounded-lg overflow-hidden bg-[--color-background-tertiary] font-sans text-[13px] text-[--color-text-primary]">
      {/* Sidebar */}
      <nav className="w-48 min-w-48 bg-[--color-background-primary] border-r-[0.5px] border-[--color-border-tertiary] flex flex-col py-4">
        {/* Logo */}
        <div className="px-4 pb-3.5 border-b-[0.5px] border-[--color-border-tertiary] mb-3.5 flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-[#00a651] flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[14px] font-medium">TaggySustain</span>
        </div>

        {/* Navigation */}
        <div className="px-2 mb-1">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[--color-text-secondary] text-[12px]">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Início
          </div>
        </div>

        {/* Análises Section */}
        <div className="px-2 mb-1">
          <div className="text-[10px] text-[--color-text-tertiary] uppercase tracking-wider px-2 mb-0.5">Análises</div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[--color-text-secondary] text-[12px]">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Performance
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-[#e8f5ee] text-[#00a651] text-[12px] font-medium">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Relatório mensal
            <span className="bg-[#00a651] text-white text-[9px] font-medium px-1.5 py-0.5 rounded-sm ml-auto">NEW</span>
          </div>
        </div>

        {/* Taggy Section */}
        <div className="px-2 mb-1">
          <div className="text-[10px] text-[--color-text-tertiary] uppercase tracking-wider px-2 mb-0.5">Taggy</div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[--color-text-secondary] text-[12px]">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            Meu cartão
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[--color-text-secondary] text-[12px]">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            Histórico
          </div>
        </div>

        {/* User Section */}
        <div className="mt-auto pt-2.5 px-2 border-t-[0.5px] border-[--color-border-tertiary]">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-[26px] h-[26px] rounded-full bg-[#e8f5ee] text-[#00a651] flex items-center justify-center text-[10px] font-medium flex-shrink-0">
              AF
            </div>
            <div>
              <div className="text-[12px] font-medium">Afonso H.</div>
              <div className="text-[10px] text-[--color-text-tertiary]">Plano Essencial</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-[--color-background-primary] border-b-[0.5px] border-[--color-border-tertiary] px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-[13px] font-medium">Olá, Afonso — março 2026</div>
            <div className="text-[11px] text-[--color-text-tertiary] mt-0.5">Seu impacto ambiental com a Taggy</div>
          </div>
          <button
            onClick={onOpenExportModal}
            className="bg-[#00a651] text-white border-none px-3.5 py-1.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 cursor-pointer hover:bg-[#008f47] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 18 15 15"/>
            </svg>
            Exportar PDF
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3.5">
          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-[--color-background-primary] border-[0.5px] border-[--color-border-tertiary] rounded-md p-3.5">
              <div className="text-[10px] text-[--color-text-tertiary] mb-1.5">Emissões evitadas</div>
              <div className="text-[20px] font-medium leading-none text-[#00a651]">31</div>
              <div className="text-[11px] text-[--color-text-secondary] mt-1">kg CO₂ este mês</div>
              <div className="text-[10px] mt-1.5 text-[#00a651]">↓ 12% vs fevereiro</div>
            </div>
            <div className="bg-[--color-background-primary] border-[0.5px] border-[--color-border-tertiary] rounded-md p-3.5">
              <div className="text-[10px] text-[--color-text-tertiary] mb-1.5">Tempo economizado</div>
              <div className="text-[20px] font-medium leading-none">24</div>
              <div className="text-[11px] text-[--color-text-secondary] mt-1">minutos no mês</div>
              <div className="text-[10px] mt-1.5 text-[#00a651]">↑ 6 min vs fevereiro</div>
            </div>
            <div className="bg-[--color-background-primary] border-[0.5px] border-[--color-border-tertiary] rounded-md p-3.5">
              <div className="text-[10px] text-[--color-text-tertiary] mb-1.5">Pedágios pagos</div>
              <div className="text-[20px] font-medium leading-none">12</div>
              <div className="text-[11px] text-[--color-text-secondary] mt-1">passagens no mês</div>
              <div className="text-[10px] mt-1.5 text-[#00a651]">↑ 3% vs fevereiro</div>
            </div>
            <div className="bg-[--color-background-primary] border-[0.5px] border-[--color-border-tertiary] rounded-md p-3.5">
              <div className="text-[10px] text-[--color-text-tertiary] mb-1.5">Economia total</div>
              <div className="text-[20px] font-medium leading-none">R$48</div>
              <div className="text-[11px] text-[--color-text-secondary] mt-1">em descontos Taggy</div>
              <div className="text-[10px] mt-1.5 text-[#00a651]">↑ R$6 vs fevereiro</div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-[3fr_2fr] gap-3">
            {/* Toll History Table */}
            <div className="bg-[--color-background-primary] border-[0.5px] border-[--color-border-tertiary] rounded-md p-4">
              <div className="text-[12px] font-medium mb-0.5">Passagens por pedágio</div>
              <div className="text-[10px] text-[--color-text-tertiary] mb-3">Março 2026 · 8 praças diferentes</div>
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b-[0.5px] border-[--color-border-tertiary]">
                    <th className="text-left text-[10px] text-[--color-text-tertiary] uppercase tracking-wide px-1.5 pb-2 font-medium w-[38%]">Praça de pedágio</th>
                    <th className="text-left text-[10px] text-[--color-text-tertiary] uppercase tracking-wide px-1.5 pb-2 font-medium w-[15%]">Passagens</th>
                    <th className="text-left text-[10px] text-[--color-text-tertiary] uppercase tracking-wide px-1.5 pb-2 font-medium w-[20%]">Tempo economizado</th>
                    <th className="text-left text-[10px] text-[--color-text-tertiary] uppercase tracking-wide px-1.5 pb-2 font-medium w-[27%]">Papel economizado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b-[0.5px] border-[--color-border-tertiary]">
                    <td className="px-1.5 py-2">Boa Viagem — PE</td>
                    <td className="px-1.5 py-2 font-medium">3x</td>
                    <td className="px-1.5 py-2 text-[#00a651] font-medium">6 min</td>
                    <td className="px-1.5 py-2">
                      <span className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#e8f5ee] text-[#27500a]">3 recibos</span>
                    </td>
                  </tr>
                  <tr className="border-b-[0.5px] border-[--color-border-tertiary]">
                    <td className="px-1.5 py-2">Igarassu — PE</td>
                    <td className="px-1.5 py-2 font-medium">2x</td>
                    <td className="px-1.5 py-2 text-[#00a651] font-medium">4 min</td>
                    <td className="px-1.5 py-2">
                      <span className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#e8f5ee] text-[#27500a]">2 recibos</span>
                    </td>
                  </tr>
                  <tr className="border-b-[0.5px] border-[--color-border-tertiary]">
                    <td className="px-1.5 py-2">Cabo de Santo Agostinho — PE</td>
                    <td className="px-1.5 py-2 font-medium">2x</td>
                    <td className="px-1.5 py-2 text-[#00a651] font-medium">4 min</td>
                    <td className="px-1.5 py-2">
                      <span className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#e8f5ee] text-[#27500a]">2 recibos</span>
                    </td>
                  </tr>
                  <tr className="border-b-[0.5px] border-[--color-border-tertiary]">
                    <td className="px-1.5 py-2">Paulista — PE</td>
                    <td className="px-1.5 py-2 font-medium">1x</td>
                    <td className="px-1.5 py-2 text-[#00a651] font-medium">2 min</td>
                    <td className="px-1.5 py-2">
                      <span className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#e8f5ee] text-[#27500a]">1 recibo</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-1.5 py-2">Jaboatão dos Guararapes — PE</td>
                    <td className="px-1.5 py-2 font-medium">4x</td>
                    <td className="px-1.5 py-2 text-[#00a651] font-medium">8 min</td>
                    <td className="px-1.5 py-2">
                      <span className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#e8f5ee] text-[#27500a]">4 recibos</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bar Chart */}
            <div className="bg-[--color-background-primary] border-[0.5px] border-[--color-border-tertiary] rounded-md p-4">
              <div className="text-[12px] font-medium mb-0.5">Emissões evitadas por mês</div>
              <div className="text-[10px] text-[--color-text-tertiary] mb-3">kg CO₂ · últimos 6 meses</div>
              <div className="flex flex-col gap-2.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[--color-text-tertiary]">Out</span>
                    <span className="font-medium">24 kg</span>
                  </div>
                  <div className="h-[5px] bg-[--color-background-secondary] rounded overflow-hidden">
                    <div className="h-full bg-[#00a651] rounded" style={{width: '62%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[--color-text-tertiary]">Nov</span>
                    <span className="font-medium">28 kg</span>
                  </div>
                  <div className="h-[5px] bg-[--color-background-secondary] rounded overflow-hidden">
                    <div className="h-full bg-[#00a651] rounded" style={{width: '72%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[--color-text-tertiary]">Dez</span>
                    <span className="font-medium">22 kg</span>
                  </div>
                  <div className="h-[5px] bg-[--color-background-secondary] rounded overflow-hidden">
                    <div className="h-full bg-[#00a651] rounded" style={{width: '56%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[--color-text-tertiary]">Jan</span>
                    <span className="font-medium">27 kg</span>
                  </div>
                  <div className="h-[5px] bg-[--color-background-secondary] rounded overflow-hidden">
                    <div className="h-full bg-[#00a651] rounded" style={{width: '69%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[--color-text-tertiary]">Fev</span>
                    <span className="font-medium">35 kg</span>
                  </div>
                  <div className="h-[5px] bg-[--color-background-secondary] rounded overflow-hidden">
                    <div className="h-full bg-[#00a651] rounded" style={{width: '90%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#00a651] font-medium">Mar</span>
                    <span className="font-medium text-[#00a651]">31 kg</span>
                  </div>
                  <div className="h-[5px] bg-[--color-background-secondary] rounded overflow-hidden">
                    <div className="h-full bg-[#00a651] rounded" style={{width: '79%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Floating Calculator Button */}
      <CalculatorFloatingButton onClick={onOpenCalculator} />
    </>
  );
}
