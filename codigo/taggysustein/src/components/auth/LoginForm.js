"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginForm() {
  const router = useRouter();
  const containerRef = useRef(null);
  const routeRef = useRef(null);
  const statsRef = useRef(null);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);

  const routes = [
    { origin: "São Paulo", dest: "Rio de Janeiro", co2: "-4.8 kg", time: "25 min", cashback: "R$ 6,50" },
    { origin: "Curitiba", dest: "Florianópolis", co2: "-3.2 kg", time: "18 min", cashback: "R$ 4,20" },
    { origin: "Campinas", dest: "São Paulo", co2: "-1.9 kg", time: "12 min", cashback: "R$ 2,80" },
    { origin: "Recife", dest: "João Pessoa", co2: "-1.2 kg", time: "10 min", cashback: "R$ 1,50" },
  ];

  useGSAP(
    () => {
      // Entrada sutil do Card de Login
      gsap.from(".login-card", {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.1,
      });

      // Entrada dos itens do formulário (staggered fade-in + slide up)
      gsap.from(".login-animate-item", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.25,
      });

      // Entrada da imagem de fundo com fade-in e zoom out inicial
      gsap.from(".login-animate-image", {
        scale: 1.15,
        opacity: 0,
        duration: 1.6,
        ease: "power3.out",
      });

      // Entrada do Card de pesquisa simulada
      gsap.from(".login-search-card", {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.6,
      });
    },
    { scope: containerRef }
  );

  // Intervalo rotativo das simulações de rotas com transição GSAP
  useEffect(() => {
    const timer = setInterval(() => {
      const targets = [routeRef.current, statsRef.current].filter(Boolean);
      
      // Animação de saída (fade-out + slide up)
      gsap.to(targets, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          // Atualiza o estado da rota
          setRouteIndex((prev) => (prev + 1) % routes.length);
          
          // Animação de entrada (fade-in + slide up a partir de baixo)
          gsap.fromTo(targets,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }
          );
        }
      });
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha email e senha");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/usuario/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        },
      );

      if (response.ok) {
        router.push("/calculadora");
      } else {
        setErro("E-mail ou senha inválidos.");
      }
    } catch (err) {
      setErro("Erro de conexão com o servidor. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#f8f9fa] overflow-hidden">
      {/* Painel Esquerdo: Formulário de Login dentro do Card */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12 min-h-screen">
        {/* Logo */}
        <div className="login-animate-item flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            TaggySustain
          </span>
        </div>

        {/* Card do Formulário */}
        <div className="login-card w-full max-w-md mx-auto my-auto bg-white rounded-2xl border border-gray-200/60 shadow-xl shadow-gray-200/30 p-8 sm:p-10 flex flex-col justify-center">
          <div className="login-animate-item mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-gray-500 text-sm">
              Seu trabalho, sua equipe, seu fluxo — tudo em um só lugar.
            </p>
          </div>

          {/* Botões Sociais */}
          <div className="login-animate-item grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.05 7.14 8.78 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.25c0-.82-.07-1.6-.2-2.38H12v4.5h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.6 2.8c2.1-1.94 3.3-4.8 3.3-8.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.1 14.9c-.25-.75-.4-1.55-.4-2.4s.15-1.65.4-2.4L1.5 7.3C.55 9.2 0 11.3 0 13.5s.55 4.3 1.5 6.2l3.6-2.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.22 0-5.95-2.1-6.92-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.02 2.96 1.1.09 2.2-.56 2.95-1.39z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Divisor */}
          <div className="login-animate-item relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-normal">Ou</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
            <div className="login-animate-item">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                required
              />
            </div>

            <div className="login-animate-item">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Senha
                </label>
                <a
                  href="#"
                  className="text-xs text-gray-400 hover:text-black transition-colors"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                required
              />
            </div>

            {erro && (
              <p className="login-animate-item text-red-500 text-xs mt-1 font-medium">{erro}</p>
            )}

            <div className="login-animate-item flex items-center justify-between text-sm mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-black rounded border-gray-300"
                />
                <span className="text-gray-600 text-xs">Lembrar de mim</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-animate-item w-full bg-black hover:bg-gray-900 text-white py-3 rounded-full font-medium transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-sm font-semibold tracking-wide cursor-pointer"
            >
              {loading ? "Entrando..." : "Entrar com email"}
            </button>
          </form>

          <div className="login-animate-item mt-8 text-center text-xs text-gray-500">
            Não tem uma conta?{" "}
            <a href="#" className="text-black font-semibold hover:underline">
              Cadastre-se
            </a>
          </div>
        </div>

        {/* Rodapé */}
        <div className="login-animate-item flex justify-center gap-4 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">Ajuda</a>
          <span>/</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Termos</a>
          <span>/</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacidade</a>
        </div>
      </div>

      {/* Painel Direito: Imagem estática com Card de Pesquisa Flutuante Centralizado */}
      <div className="hidden md:flex flex-col items-center justify-center relative bg-black overflow-hidden select-none">
        <img
          src="/login.jpg"
          alt="Sustainability Road"
          className="absolute inset-0 w-full h-full object-cover origin-center login-animate-image grayscale contrast-115 brightness-95"
        />

        {/* Degradê escuro para melhorar legibilidade do Card flutuante */}
        <div className="absolute inset-0 bg-black/35 z-0"></div>

        {/* Card de Pesquisa Flutuante Centralizado */}
        <div className="login-search-card relative z-10 w-[90%] max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Simulações de Rota (Ao Vivo)
            </span>
          </div>

          {/* Barra de Pesquisa Simulada */}
          <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-3.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div ref={routeRef} className="text-xs font-bold text-gray-700">
              {routes[routeIndex].origin} ➔ {routes[routeIndex].dest}
            </div>
          </div>

          {/* Estatísticas da Rota */}
          <div ref={statsRef} className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50/50 rounded-xl p-2 border border-emerald-100/50">
              <div className="text-[9px] text-gray-500 font-medium mb-0.5">CO₂ Evitado</div>
              <div className="text-xs font-bold text-emerald-700">{routes[routeIndex].co2}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-2 border border-gray-200/40">
              <div className="text-[9px] text-gray-500 font-medium mb-0.5">Tempo Salvo</div>
              <div className="text-xs font-bold text-gray-700">{routes[routeIndex].time}</div>
            </div>

            <div className="bg-emerald-50/50 rounded-xl p-2 border border-emerald-100/50">
              <div className="text-[9px] text-gray-500 font-medium mb-0.5">Cashback</div>
              <div className="text-xs font-bold text-emerald-700">{routes[routeIndex].cashback}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
