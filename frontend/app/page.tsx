"use client"
import { useState } from "react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function WalletIcon({ className = "w-8 h-8 text-blue-600" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L80 128c-8.8 0-16-7.2-16-16s7.2-16 16-16l368 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 32zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
    </svg>
  );
}

export default function Home() {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.replace("/dashboard");
    }
  }, [address, router]);

  if (address) return null;

  const handleConnect = async (connector: any) => {
    setError(null);
    setLoading(true);
    try {
      await connect({ connector });
    } catch (e: any) {
      setError("Error al conectar la wallet.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-300 font-sans text-slate-800 text-sm">
      <div className="w-full max-w-sm">
        <div className="border border-blue-200 rounded-2xl p-7 shadow-xl bg-white/95 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <span className="bg-blue-100 rounded-full p-3 mb-2 shadow flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-blue-600" />
            </span>
            <h1 className="text-lg font-bold text-blue-900 mb-1">Connect your Wallet</h1>
          </div>
          {connectors
            .filter((c) => c.id === "argentX" || c.id === "braavos")
            .map((connector) => (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={loading}
                className="w-full py-2 px-4 text-sm bg-gradient-to-r from-yellow-400 to-orange-300 hover:from-yellow-500 hover:to-orange-400 text-slate-900 font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow mb-2"
              >
                <WalletIcon className="w-5 h-5 text-yellow-500 mr-2" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
                    Connecting...
                  </span>
                ) : (
                  `Connect with ${connector.name}`
                )}
              </button>
            ))}
          {error && (
            <div className="mt-4 w-full flex items-center justify-center">
              <span className="text-red-600 text-xs flex items-center gap-2">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#f87171" strokeWidth="2" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"/><circle cx="12" cy="16" r="1" fill="#f87171"/></svg>
                {error}
              </span>
            </div>
          )}
          <p className="mt-5 text-xs text-slate-500 text-center">Asegúrate de tener Argent X o Braavos instalada.<br/>¿Problemas? <a href="#" className="underline text-blue-600 hover:text-blue-500">Soporte</a></p>
        </div>
      </div>
    </div>
  );
}
