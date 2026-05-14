"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col w-full">
      <div className="w-full p-4 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00a651] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            TaggySustain
          </span>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-gray-600">Entre na sua conta Taggy</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 transition-all"
                  required
                />
              </div>

              {erro && (
                <p className="text-red-500 text-sm mt-1 font-medium">{erro}</p>
              )}

              <div className="flex items-center justify-between text-sm mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#00a651]" />
                  <span className="text-gray-600">Lembrar de mim</span>
                </label>
                <a
                  href="#"
                  className="text-[#00a651] hover:text-[#008f47] font-medium"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 text-white py-3 rounded-lg font-medium hover:bg-emerald-900 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <a
                href="#"
                className="text-[#00a651] hover:text-[#008f47] font-medium"
              >
                Criar conta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
