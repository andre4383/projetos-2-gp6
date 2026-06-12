// Espelha as constantes de CalculoSimplificadoService.java no backend.
// Se alguma mudar lá, atualize aqui para manter o relatório consistente.

export const TEMPO_FILA_PEDAGIO_SEM_TAGGY_MIN = 10;
export const TEMPO_FILA_PEDAGIO_COM_TAGGY_MIN = 2;
export const TEMPO_FILA_ESTACIONAMENTO_SEM_TAGGY_MIN = 8;
export const TEMPO_FILA_ESTACIONAMENTO_COM_TAGGY_MIN = 1;

export const CONSUMO_MARCHA_LENTA_L_POR_HORA = 0.8;
export const CONSUMO_ADICIONAL_ACELERACAO_L = 0.015;

export const PESO_TICKET_G = 2;
export const FATOR_EMISSAO_PAPEL_KG_CO2_POR_KG = 1.2;

export const KG_CO2_POR_ARVORE_ANO = 22;

export const PARAMETROS_METODOLOGIA = [
  {
    label: "Tempo médio em fila de pedágio (sem Taggy)",
    valor: `${TEMPO_FILA_PEDAGIO_SEM_TAGGY_MIN} min/passagem`,
  },
  {
    label: "Tempo médio em fila de pedágio (com Taggy)",
    valor: `${TEMPO_FILA_PEDAGIO_COM_TAGGY_MIN} min/passagem`,
  },
  {
    label: "Tempo médio em fila de estacionamento (sem Taggy)",
    valor: `${TEMPO_FILA_ESTACIONAMENTO_SEM_TAGGY_MIN} min/passagem`,
  },
  {
    label: "Tempo médio em fila de estacionamento (com Taggy)",
    valor: `${TEMPO_FILA_ESTACIONAMENTO_COM_TAGGY_MIN} min/passagem`,
  },
  {
    label: "Consumo médio em marcha lenta",
    valor: `${CONSUMO_MARCHA_LENTA_L_POR_HORA.toString().replace(".", ",")} L/h`,
  },
  {
    label: "Consumo adicional por evento de aceleração",
    valor: `${CONSUMO_ADICIONAL_ACELERACAO_L.toString().replace(".", ",")} L/passagem`,
  },
  {
    label: "Peso médio do ticket impresso",
    valor: `${PESO_TICKET_G} g`,
  },
  {
    label: "Fator de emissão do papel",
    valor: `${FATOR_EMISSAO_PAPEL_KG_CO2_POR_KG.toString().replace(".", ",")} kg CO₂/kg`,
  },
  {
    label: "Capacidade de absorção por árvore adulta",
    valor: `${KG_CO2_POR_ARVORE_ANO} kg CO₂/ano`,
  },
];
