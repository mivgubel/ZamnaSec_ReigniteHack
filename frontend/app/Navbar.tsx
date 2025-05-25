"use client";
import Link from 'next/link'
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { argent, braavos } from "@starknet-react/core";
import { useState } from "react";

function WalletIcon({ className = "w-5 h-5 text-blue-900" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
      <path fill="currentColor" d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L80 128c-8.8 0-16-7.2-16-16s7.2-16 16-16l368 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 32zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
    </svg>
  );
}

export default function Navbar() {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const handleConnectClick = () => setShowWalletOptions((v) => !v);

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur border-b border-blue-100 shadow transition-colors">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="#" className="font-sans text-2xl font-bold" style={{ color: '#1d293b' }}>
              Zamna<span className="text-yellow-600">Sec</span>
          </Link>
          <div className="flex items-center space-x-8">
            {address && (
              <>
                <span className="flex items-center mr-2">
                  <WalletIcon className="w-5 h-5 text-blue-900 mr-1" />
                  <span className="font-sans text-lg font-bold" style={{ color: '#1e293b' }}>Wallet:</span>
                </span>
                <span className="px-3 py-1 bg-blue-50 font-sans text-base rounded shadow-inner border border-blue-200 truncate max-w-[180px]" style={{ color: '#1e293b' }} title={address}>
                  {address.slice(0, 7)}...{address.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="ml-4 px-3 py-1 bg-orange-100 border border-blue-900 font-sans text-xs rounded hover:bg-orange-200 transition-colors shadow"
                  style={{ color: '#1e293b'}}
                >
            Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 