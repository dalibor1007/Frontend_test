// src/context/WalletContext.js
import React, { createContext, useContext, useState } from "react";

// Create a context
const WalletContext = createContext();

// Create a provider component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the WalletContext in any component
export const useWallet = () => useContext(WalletContext);
