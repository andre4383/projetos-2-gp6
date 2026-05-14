# TaggySustain - Frontend

Repositório frontend do projeto TaggySustain, plataforma de gestão de pagamento de pedágios com foco em sustentabilidade.

## Atualizações Recentes

### 1. Landing Page

- Nova estrutura visual (`src/app/page.js`) com esquema de cores atualizado (baseado em `#1e9b65`).
- Integração da biblioteca GSAP para efeitos de scroll (pin no Hero section) e animações de entrada em cascata nos componentes de texto.

### 2. Calculadora

- Refatoração do componente `LandingCalculator.js`.
- Remoção dos campos de horários de entrada e saída.
- Adição de nota explicativa sobre os parâmetros de cálculo padrão (3m de distância e 3,5s de operação).
- Atualização da paleta de cores dos botões de ação para a cor verde escura (`bg-emerald-800`).

### 3. Rodapé

- Substituição do rodapé antigo por uma versão em texto simples.
- Implementação da fonte Lora carregada via `next/font/google`.

### 4. Autenticação

- Ajuste de branding na tela de login (`/login`), com a nova logo (ícone Leaf do lucide-react) e título atualizado para TaggySustain.
- Padronização das cores dos botões de submit para corresponder ao tema escuro da aplicação (`bg-emerald-800`).

## Tecnologias Utilizadas

- Next.js
- Tailwind CSS
- GSAP / @gsap/react
- Lucide React
