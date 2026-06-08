import React from "react";

export default function BotaoAutenticacao({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-full text-white font-semibold mt-2 bg-green-600 hover:bg-green-800 transition"
    >
      {children}
    </button>
  );
}
